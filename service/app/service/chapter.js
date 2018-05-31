const Service = require('egg').Service;
const fs = require('fs')

class ChapterService extends Service {
    async get(code,index) {
        // const chapter =await this.ctx.model.Chapter.find({code:code});
        // return chapter
        let dir = 'F:/workSpace/crawlerNovel/downLoad/'
        let data = await fs.readFile(`${dir}${code}/${index}.json`,'utf8',async function (err, data) {
            if(err) console.log(err);
            return data
        });
        return data
    }
}

module.exports = ChapterService;