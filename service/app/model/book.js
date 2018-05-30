module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const bookSchema = new Schema({
        href: { type: String  },
        name: { type: String  },
    });
    return mongoose.model('Book', bookSchema,'novel_books_List');
}
