const Service = require('egg').Service;

class BookService extends Service {
    async get(code) {
        const books =await this.ctx.model.Book.find();
        return books
    }
}

module.exports = BookService;