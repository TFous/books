const Service = require('egg').Service;

class BookService extends Service {
    async get(code) {
        const books =await this.ctx.model.Book.find();
        return books
    }

    async filter(classify) {
        const bookList =await this.ctx.model.Book.find({classify:classify});
        return bookList
    }
}

module.exports = BookService;