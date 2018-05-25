const request = require('superagent');
const cheerio = require('cheerio');
var http = require("http");
const fs = require('fs'); // 引入fs模块
require('superagent-charset')(request)
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

const mongoClient = new MongoClient(new Server('localhost', 27017, {
    auth: {
        user:'root',
        password:'123456'
    }
}));
// var data = fs.readFileSync('./limit.json','utf-8');
let limit = 10
let skip = JSON.parse(fs.readFileSync('./limit.json','utf-8')).skip || 0

mongoClient.connect(function (err, client) {
    if (err) throw err;
    var dbo = client.db("db_novel");
    let collection  = dbo.collection("novel_books_List")
    loopDown(skip)
    function loopDown(skip) {
        collection.count(async function (a, count) {
            collection.find().limit(limit).skip(skip).toArray(async function(err, items) {
                // let i=0;
                // let length = items.length
                // for(;i<length;i++){
                //     let item = items[i]
                //     await getBookList(item.href).then(async function (lists) {
                //         dbo.collection('node_books_chapters').insertOne({code:item.code,list:lists}, function (err, res) {
                //             if (err) throw err;
                //             // console.log("小说章节插入数据库成功！");
                //         });
                //         downList(lists,item.code)
                //     })
                // }
                await Promise.all(items.map(async (item) => {
                    await getBookList(item.href).then(async function (lists) {
                        dbo.collection('node_books_chapters').insertOne({code:item.code,list:lists}, function (err, res) {
                            if (err) throw err;
                            // console.log("小说章节插入数据库成功！");
                        });
                       await downList(lists,item.code)
                    })
                }));

                let newSkpi = JSON.parse(fs.readFileSync('./limit.json','utf-8')).skip+ limit
                let data = {
                    skip: newSkpi
                }
                await fs.writeFile(`./limit.json`, JSON.stringify(data), function (err) {
                    if (err) {
                        console.log("文件写入失败")
                    } else {
                        console.log('========更新skip成功=============')
                    }
                })
                if(newSkpi<count){
                    loopDown(newSkpi)
                }
            });
        })
    }
});

async function downList(lists,code) {
    let dirPath = `./downLoad/${code}/`
    await new Promise(function(){
        fs.exists(dirPath,async function(exists,fd){
            if(exists){
                fs.readdir(dirPath,async function(err, files){
                    if (err) {
                        return console.error(err);
                    }
                    let index = files.length -1
                    let j = index;
                    let jlen = lists.length;
                    for (;j<jlen;j++){
                        let url = lists[j].href
                        await downChapter(url,code,j)
                    }
                });
            }else {
                let j = 0;
                let jlen = lists.length;
                for (;j<jlen;j++){
                    let url = lists[j].href
                    await downChapter(url,code,j)
                }
            }
        })
    })
}
async function downChapter(url,code,index){
    return new Promise((resolve, reject) =>{
        request
            .get(url)
            // .charset('gbk')
            .end(async(err, res) => {
                if (err) {
                    return next(err);
                }
                var $ = cheerio.load(res.text);
                let data = {
                    index: index,
                    name: $('.border_l_r').find('h2').text(),
                    content:  $('#content').text()
                }
                let dirpath = `./downLoad/${code}`
                if (!fs.existsSync(dirpath)) {
                    await fs.mkdirSync(dirpath)
                }
                await fs.writeFile(`./downLoad/${code}/${index}.json`, JSON.stringify(data), function (err) {
                    if (err) {
                        console.log("文件写入失败")
                    } else {
                        // console.log(id + "===========>" + i + "========文件追加成功");
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


async function getBookList(url){
    return new Promise((resolve, reject) =>{
        request
            .get(url)
            // .charset('gbk')
            .end(async(err, res) => {
                if (err) {
                    return next(err);
                }
                var $ = cheerio.load(res.text);
                let list = $('#defaulthtml4 table td .dccss a')
                let items = []
                list.each(async function (idx, element) {
                    var link = $(element);
                    let item = {
                        href: url+link.attr('href'),
                        name: link.text()
                    }
                    items.push(item)
                })
                resolve(items);
            })
    })
}

