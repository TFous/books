const Service = require('egg').Service;

class FilterClassService extends Service {
    async filter(classify) {
        console.log(classify)
        const bookList =await this.ctx.model.book.find({classify:classify});
        return bookList
    }
}

module.exports = FilterClassService;