module.exports = app => {

    const get = (req, res) => {
        const query = app.Manga.find({})

        if(req.query.sort){
            query.sort(req.query.sort)
        }

        query.select("-chapters -description").exec().then(data => {
            res.status(200).json(data)
        })
    }
    const getById = (req, res) => {
        const id = req.params.id.split(',')
        console.log(id)
        
        const query = id.length === 1 ? app.Manga.findById(id[0]) : app.Manga.find({_id: {$in : id}})
        if(req.query.select) {
            query.select(req.query.select.replace(',', " "))
        }
        if(!req.query.select || !req.query.select.includes('chapters')){
            query.select("-chapters.url -chapters.pages")
        }

        query.exec().then(data => {
            res.status(200).json(data)
        })
    }

    const getChapter = (req, res) => {
        const {idManga, idChapter} = req.params
        console.log(idManga, idChapter)
        
        app.Manga.findById(idManga).select({chapters: {"$slice": [parseInt(idChapter), 1]}}).exec().then(data => {
            res.status(200).json(data)
        })
    }

    return {get, getById, getChapter}
}