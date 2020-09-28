const cron = require('node-cron');
const axios = require('axios')
const data = require('./mangas.json')
// const fs = require('fs')

module.exports = async app => {
    const { Manga } = app

    // data.forEach(manga => {
    //     // console.log(manga.title, manga.volumes)
    //     Manga.findOne({title: manga.title}).update({
    //         chapters: manga.chapters,
    //         volumes: parseInt(manga.volumes.replace(',', '').replace(/\D/g,'') || 0),
    //         status: manga.status,
    //         published: manga.published,
    //         genres: manga.genres,
    //         authors: manga.authors,
    //         chapters_amount: manga.chapters.length
    //     }).exec().then(res => {
    //         console.log(manga.title)
    //     })

    // })

    if (data && typeof data === "object") {
        const mangas = data.map((manga) => {
            return {
                _id: parseInt(manga.id),
                title: manga.title,
                description: manga.description,
                image_url: manga.image_url,
                chapters: manga.chapters,
                chapters_amount: parseInt(manga.chapters.length),
                status: manga.status,
                published: manga.published,
                genres: manga.genres,
                authors: manga.authors,
                members: parseInt(manga.members.replace(',', '')),
                volumes: parseInt(manga.volumes.replace(',', '').replace(/\D/g,'') || 0),
                score: parseFloat(manga.score.replace(',', ''))
            }
        })
        
        mangas.forEach(async manga => {
            const mangaDB = await Manga.findOne({_id: manga._id}).exec()
            if(mangaDB){
                Manga.findOne({_id: manga._id}).updateOne(manga).exec().then(res => {
                    console.log(`Updated ${manga.title}`)
                })
            } else {
                Manga.create(manga).then(res => {
                    console.log(`Added ${manga.title}`)
                })
            }
        })
        // const manga = await Manga.findOne({}).exec()
        // console.log(manga)
        // const dataMangas = await Manga.find({ chapters_amount: { $gt: 0 }}).exec()
        // console.log(dataMangas)
        // const jsonString = JSON.stringify(dataMangas)
        // fs.writeFile('./dataMangas.json', jsonString, err => {
        //     if (err) {
        //         console.log('Error writing file', err)
        //     } else {
        //         console.log('Successfully wrote file')
        //     }
        // })
        // Manga.insertMany(mangas)
    }

}


