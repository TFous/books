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
async function getBooks(url) {
    return new Promise( (resolve, reject) =>{
        request
            .get(url)
            // .charset('gbk')
            .end((err, res) => {
                if (err) {
                    return next(err);
                }
                let items = []
                var $ = cheerio.load(res.text);
                let tips = $('#alist h3').text().split('List')[1].split('小说最新列表')[0]
                let lists = $('#alistbox')
                lists.each(function (idx, element) {
                    var link = $(element).find('.title h2 a');
                    var author = $(element).find('.title span').text().split('作者：')[1];
                    var intro = $(element).find('.intro').text();
                    let imgSrc = $(element).find('img').attr('src');
                        //抓取图片
                        http.get(imgSrc,function (res) {
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
                    items.push({
                        intro: intro,
                        tips: tips,
                        href: 'http://www.56shuku.org' + link.attr('href'),
                        name: link.text(),
                        author: author,
                    })
                })
                resolve(items);
                // return items
            })
    })
}
let url = 'http://www.56shuku.org/leibie9_1.shtml'
getBooks(url).then(function (item) {
    console.log(item)
})
