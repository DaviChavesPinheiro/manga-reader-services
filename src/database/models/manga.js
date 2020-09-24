const restful = require('node-restful')
const mongoose = restful.mongoose

const mangaSchema = new mongoose.Schema({
    _id: Number,
    title: String,
    description: String,
    image_url: String,
    chapters_amount: Number,
    chapters: [],
    members: Number,
    volumes: Number,
    status: String,
    published: String,
    genres: String,
    authors: String,
    score: Number
});

const Manga = restful.model('Manga', mangaSchema);

// Manga.methods(['get', 'post', 'put', 'delete']);

// Manga.route('top.get', (req, res, next) => {
//     Manga.find({}).sort({score: -1}).select("-chapters -description").exec().then((data) => {
//         res.status(200).json(data)
//     })
// })

// Manga.route('worst', (req, res, next) => {
//     const query = Manga.find({})
//     query.sort({rank: -1})
//     query.exec().then((data) => {
//         res.status(200).json(data)
//     })
// })


module.exports = app => {
    app.Manga = Manga
    // Manga.register(app, '/mangas')
}