const fs = require('fs'); // 引入fs模块
fs.readFile('./test.json', 'utf-8', function(err, data) {
    if (err) {
        throw err;
    }
    let odata = JSON.parse(data)
    console.log(odata.jIndex);
});