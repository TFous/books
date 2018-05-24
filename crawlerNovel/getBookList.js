const request = require('superagent');
const cheerio = require('cheerio');
var http = require("http");
const fs = require('fs'); // 引入fs模块
require('superagent-charset')(request)
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

const mongoClient = new MongoClient(new Server('localhost', 27017, {
    useNewUrlParser: true
}));

// mongoClient.connect(function (err, client) {
//     if (err) throw err;
//     var dbo = client.db("db_novel");
//     dbo.collection("novel_books").insertMany(items, function (err, res) {
//         if (err) throw err;
//         console.log("小说列表插入数据库成功！");
//         client.close()
//     });
// });

// 小说分类
async function getClassify(url) {
    return new Promise((resolve, reject) =>{
        request
            .get(url)
            // .charset('gbk')
            .end(async(err, res) => {
                if (err) {
                    return next(err);
                }
                let items = []
                var $ = cheerio.load(res.text);
                let lists = $('.subnav-hot a')
                lists.each(function (idx, element) {
                    var url = $(element).attr('href')
                    let classify = $(element).text();

                    let item = {
                        url,
                        classify,
                    }
                    items.push(item)
                })
                resolve(items);
            })
    })
}

let classifyUrl = 'http://www.56shuku.org/leibie1_1.shtml'
// 小说分类列表url
let classifyListUrl = getClassify(classifyUrl).then(async function (listsUrl) {
    return listsUrl
})
// 小说分类信息
let classifyMsg = classifyListUrl.then(async function (lists) {
    let classifyMsg = []
    let i = 0;
    let length = lists.length;
    for(;i<length;i++){
        let msg = await getBooksList(lists[i].url,lists[i].classify).then(function (classifyMsg) {
            return classifyMsg
        })
        classifyMsg.push(msg)
    }
    return classifyMsg;
})

classifyMsg.then(async function (items) {
    var data = fs.readFileSync('./writeBooks.json','utf-8');
    let odata = data?JSON.parse(data):{}
    let isOver = await starGetBooks(items,odata)
    if(isOver===true){

    }
})

async function starGetBooks(items,data) {
    let i=data.iIndex || 0;
    let length = items.length
    for(;i<length;i++){
        let j = data.jIndex ? data.jIndex + 1 : 0;
        let jLength = items[i].length
        for(;j<jLength;j++){
            let url = items[i].url.split('_')
            let jUrl = `${url[0].substring(0,29)}${i+1}_${j+1}.shtml`
            await getBooks(jUrl,items[i].classify,i,j)
        }
    }
    return true
}

/**
 *
 * @param url
 * @param classify 小说分类
 * @returns {Promise<any>}
 */
async function getBooksList(url,classify) {
    return new Promise((resolve, reject) =>{
        request
            .get(url)
            // .charset('gbk')
            .end(async(err, res) => {
                if (err) {
                    return next(err);
                }
                var $ = cheerio.load(res.text);
                let bookListLength = $('#pagestats').text().split('/')[1]
                let item = {
                    classify,
                    url,
                    length:bookListLength, // 分页
                }
                resolve(item);
            })
    })
}

async function getBooks(url,classify,i,j){
    return new Promise((resolve, reject) =>{
        request
            .get(url)
            // .charset('gbk')
            .end(async(err, res) => {
                if (err) {
                    return next(err);
                }
                let items = []
                var $ = cheerio.load(res.text);
                // let tips = $('#alist h3').text().split('List')[1].split('小说最新列表')[0]
                let lists = $('#alistbox')
                // let dirpath = `./bookList/${tips}_小说列表`
                // if (!fs.existsSync(dirpath)) {
                //     await fs.mkdirSync(dirpath)
                // }
                // let bookListLength = $('#pagestats').text().split('/')[1]
                // let i = 0;
                // let length = bookListLength.length;
                // for(;i<length;i++){
                //
                // }
                lists.each(async function (idx, element) {
                    var link = $(element).find('.title h2 a');
                    var author = $(element).find('.title span').text().split('作者：')[1];
                    var intro = $(element).find('.intro').text();
                    let imgSrc = $(element).find('img').attr('src');
                    let href = link.attr('href')
                    let code = href.split('/')

                    let item = {
                        iIndex: i,
                        jIndex: j,
                        intro: intro,
                        classify: classify,
                        code: code[code.length-2],
                        href: 'http://www.56shuku.org' + href,
                        name: link.text(),
                        author: author,
                    }
                    //抓取图片
                    await downImg(imgSrc)

                    fs.appendFile(`./bookList/bookList.json`, JSON.stringify(item)+'\r\n', function (err) {
                        if (err) {
                            console.log("文件写入失败")
                        } else {
                            let data = {
                                iIndex:i,
                                jIndex:j
                            }
                            fs.writeFile('./writeBooks.json', JSON.stringify(data), function(err) {
                                if (err) {
                                    throw err;
                                }
                                console.log(data);
                            });
                            // console.log(classify)
                            // console.log('文件写入成功')
                        }
                    })
                    // items.push(item)
                })
                resolve(items);
            })
    })

}



async function downImg(imgSrc) {
  await http.get(imgSrc,function (res) {
        var imgData = "";
        res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
        res.on("data", function(chunk){
            imgData+=chunk;
        });
        res.on("end", function(){
            let imgId = imgSrc.split('/')
            fs.writeFile(`./images/${imgId[imgId.length-2]}.jpg`, imgData, "binary", function(err){
                if(err){
                    console.log("down img fail");
                }
                // console.log("down success");
            });
        });
    })
}
// let url = 'http://www.56shuku.org/leibie9_1.shtml'
// getBooks(url).then(async function (item) {
//
// })
