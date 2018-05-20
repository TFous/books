const fs = require('fs')
let dir = 'F:/workSpace/crawlerNovel/downLoad/'
async function dd() {
    let aa = null
    await fs.readFileSync(`${dir}7952/0.json`,'utf8', async function (err, data) {
        if(err) console.log(err);
        aa = data
    });
    console.log(aa)
    return aa
}
fs.readFileSync(`${dir}7952/0.json`,'utf8');
console.log(data)
// let aaaaa = dd()
// aaaaa.then(function (item) {
//     console.log(item)
// })