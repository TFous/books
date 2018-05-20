const Service = require('egg').Service;

class ChapterListService extends Service {
    async get(code) {
        const chapterList =await this.ctx.model.ChapterList.find({code:code});
        return chapterList
    }
}

module.exports = ChapterListService;