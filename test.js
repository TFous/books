const fs = require('fs')
let dir = '/usr/local/src/novel/downLoad/'
let data = fs.readFileSync(`${dir}113545/0.json`,'utf8');
console.log(data)
