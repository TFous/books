const fs = require('fs'); // 引入fs模块
fs.exists("./downLoad/137106/",function(exists,fd){
    console.log(exists)
    if(exists){
        fs.readdir("./downLoad/137105/",function(err, files){
            if (err) {
                return console.error(err);
            }
            console.log(files.length)
        });
    }
})

