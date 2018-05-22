const request = require('superagent');
const cheerio = require('cheerio');
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
            .charset('gbk')
            .end((err, res) => {
                if (err) {
                    return next(err);
                }
                let items = []
                var $ = cheerio.load(res.text);
                let lists = $('.ranking_general .articlegeneral')
                lists.each(function (idx, element) {
                    var a = $(element).find('a');
                    var author = $(element).find('.p3').text();
                    items.push({
                        href: a.attr('href'),
                        name: a.text(),
                        author: author,
                    })
                })
                resolve(items);
                // return items
            })
    })

}
let url = 'https://m.biquge.com.tw/wapsort/1_1.html'
getBooks(url).then(function (item) {
    console.log(item)
})
