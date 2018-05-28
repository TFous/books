const request = require('superagent');
const cheerio = require('cheerio');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

var http = require("http");
const fs = require('fs'); // 引入fs模块
require('superagent-charset')(request)
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

const mongoClient = new MongoClient('mongodb://localhost:27017', {
    useNewUrlParser: true,
    auth: {
        user: 'root',
        password: '123456'
    }
});
// var data = fs.readFileSync('./limit.json','utf-8');
let limit = 10
let skip = JSON.parse(fs.readFileSync('./limit.json', 'utf-8')).skip || 0
MongoClient.connect("mongodb://root:123456@localhost:27017/db_novel", {useNewUrlParser: true}, function (err, client) {
// mongoClient.connect(function(err, client) {
    myEmitter.on('bookDown', () => {
        let newSkpi = JSON.parse(fs.readFileSync('./limit.json', 'utf-8')).skip + limit
        let data = {
            skip: newSkpi
        }
        console.log(1111111111111111111111)
        console.log(newSkpi,limit)
        limit = 1
        fs.writeFileSync(`./limit.json`, JSON.stringify(data), function (err) {
            if (err) {
                console.log("文件写入失败")
            } else {
                console.log('========更新skip成功=============')
            }
        })
        loopDown(newSkpi)
    });
    if (err) throw err;
    var dbo = client.db("db_novel");
    let collection = dbo.collection("novel_books_List")
    // console.log(client)
    // console.log(collection)
    loopDown(skip)

    function loopDown(skip) {
        collection.find().limit(limit).skip(skip).toArray(async function (err, items) {
                if (items.length === 0) {
                    return false
                }
                await Promise.all(items.map(async (item) => {
                    await getBookList(item.href).then(async function (lists) {
                        dbo.collection('node_books_chapters').find({"code": item.code}).toArray(async function (err, items) {
                            if (items.length > 0) {
                                dbo.collection('node_books_chapters').update({"code": item.code}, {$set: {list: lists}}, function (err, result) {
                                    if (err) throw err;
                                    // console.log("更新   小说章节数据库成功！code========" + item.code);
                                })
                            } else {
                                dbo.collection('node_books_chapters').insertOne({
                                    code: item.code,
                                    list: lists
                                }, function (err, res) {
                                    if (err) throw err;
                                    // console.log("插入   小说章节数据库成功！code========" + item.code);
                                });
                            }
                        })
                        await downList(lists, item.code)
                    })
                }));
            });
    }
});

async function downList(lists, code) {
    let dirPath = `./downLoad/${code}/`
    await new Promise(async function (resolve, reject) {
        fs.exists(dirPath, async function (exists, fd) {
            if (exists) {
                fs.readdir(dirPath, async function (err, files) {
                    if (err) {
                        return console.error(err);
                    }
                    let index = files.length - 1
                    let j = index;
                    let jlen = lists.length;
                    for (; j < jlen; j++) {
                        let url = lists[j].href
                        await downChapter(url, code, j,jlen)
                    }

                });
            } else {
                let j = 0;
                let jlen = lists.length;
                for (; j < jlen; j++) {
                    let url = lists[j].href
                    await downChapter(url, code, j,jlen)
                }
            }
        })
    })
}

async function downChapter(url, code, index,jlen) {
    return new Promise((resolve, reject) => {
        request
            .get(url)
            // .charset('gbk')
            .end(async (err, res) => {
                if (err) {
                    return next(err);
                }
                var $ = cheerio.load(res.text);
                let data = {
                    index: index,
                    name: $('.border_l_r').find('h1').text(),
                    content: $('#content').text()
                }
                let dirpath = `./downLoad/${code}`
                if (!fs.existsSync(dirpath)) {
                    await fs.mkdirSync(dirpath)
                }
                await fs.writeFile(`./downLoad/${code}/${index}.json`, JSON.stringify(data), function (err) {
                    if (err) {
                        console.log("文件写入失败")
                    } else {
                        // console.log(code + "===========>" + index + "========文件追加成功");
                        if(jlen-1 === index){
                            myEmitter.emit('bookDown');
                        }
                    }
                })
                resolve(true);
            })
    })
}

// let url = 'http://www.56shuku.org/files/article/html/87/87594/'
// getBookList(url).then(function (item) {
//     dbs.collection('node_books_chapters').insertOne({code:id,list:lists}, function (err, res) {
//         if (err) throw err;
//         console.log("小说章节插入数据库成功！");
//         getNovelData(lists, id)
//     });
// })
//


async function getBookList(url) {
    return new Promise((resolve, reject) => {
        request
            .get(url)
            // .charset('gbk')
            .end(async (err, res) => {
                if (err) {
                    return next(err);
                }
                var $ = cheerio.load(res.text);
                let list = $('#defaulthtml4 table td .dccss a')
                let items = []
                list.each(async function (idx, element) {
                    var link = $(element);
                    let item = {
                        href: url + link.attr('href'),
                        name: link.text()
                    }
                    items.push(item)
                })
                resolve(items);
            })
    })
}

