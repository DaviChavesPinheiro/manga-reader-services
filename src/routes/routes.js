module.exports = app => {
    app.route('/mangas')
        .get(app.src.api.manga.get)
    app.route('/mangas/:id')
        .get(app.src.api.manga.getById)
    app.route('/mangas/:idManga/chapters/:idChapter')
        .get(app.src.api.manga.getChapter)
}