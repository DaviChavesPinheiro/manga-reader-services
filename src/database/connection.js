const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

// module.exports = (app) => {
//     app.teste = 10
//     app.use('/teste', (req, res) => {
//         console.log(req.query)
//         res.status(200).send('OK')
//     }) 

//     console.log("OK")
//     const {Manga} = require('./models/manga')
//     Manga.register(app, '/mangas')
// }

// const manga = new Manga({ title: 'Naruto', episodes: 500});
// manga.save()
