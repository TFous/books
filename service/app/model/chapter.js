module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const chapterSchema = new Schema({
        href: { type: String  },
        name: { type: String  },
    });

    return mongoose.model('Chapter', chapterSchema,'node_books_chapters');
}
