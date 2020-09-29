const cron = require('node-cron');
const axios = require('axios')
const data = require('./mangas.json');
const manga = require('../api/manga');
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
        // const mangas = data.map((manga) => {
        //     return {
        //         _id: parseInt(manga.id),
        //         title: manga.title,
        //         description: manga.description,
        //         image_url: manga.image_url,
        //         chapters: manga.chapters,
        //         chapters_amount: parseInt(manga.chapters.length),
        //         status: manga.status,
        //         published: manga.published,
        //         genres: manga.genres,
        //         authors: manga.authors,
        //         members: parseInt(manga.members.replace(',', '')),
        //         volumes: parseInt(manga.volumes.replace(',', '').replace(/\D/g,'') || 0),
        //         score: parseFloat(manga.score.replace(',', ''))
        //     }
        // })

        // mangas.forEach(async manga => {
        //     const mangaDB = await Manga.findOne({_id: manga._id}).exec()
        //     if(mangaDB){
        //         Manga.findOne({_id: manga._id}).updateOne(manga).exec().then(res => {
        //             console.log(`Updated ${manga.title}`)
        //         })
        //     } else {
        //         Manga.create(manga).then(res => {
        //             console.log(`Added ${manga.title}`)
        //         })
        //     }
        // })

        // const mangasAmount = await Manga.find({}).countDocuments()

        // const mangas = await Manga.find({}).select("-chapters").limit(100)

        // const intervalID = setInterval(() => {
        //     const manga = mangas.shift()
        //     if (manga === undefined) return clearInterval(intervalID)
        //     // console.log(manga.title)
        //     axios.get(`https://api.jikan.moe/v3/manga/${manga._id}`).then(res => {
        //         let malManga = res.data

        //         setTimeout(() => {
        //             // console.log(mangas.length)
        //             axios.get(`https://api.jikan.moe/v3/manga/${manga._id}/recommendations`).then(res2 => {
        //                 malManga.recommendations = res2.data.recommendations
        //                 malManga = mapJikanManga(malManga)
        //                 // console.log(malManga)
        //                 const mangaToUpdate = compareMangas(manga, malManga)
        //                 console.log(malManga.title, mangaToUpdate)
        //                 if (Object.keys(mangaToUpdate).length) {
        //                     Manga.findOne({ _id: manga._id }).updateOne(mangaToUpdate).exec().then(res => {
        //                         console.log(`Updated ${malManga.title}`)
        //                     }).catch(error => {
        //                         console.log("Atlas Update ERROR")
        //                         console.log(error)
        //                     })
        //                 } else {
        //                     console.log(`${manga.title} is updated!`)
        //                 }
        //             }).catch(error => {
        //                 console.log("Jikan Recomendations ERROR")
        //                 console.log(error)
        //             })
        //         }, 1000)




        //     }).catch(error => {
        //         console.log("Jikan ERROR")
        //         console.log(error)
        //     })
        // }, 2000)

        // mangas.forEach(manga => {
        //     axios.get(`https://api.jikan.moe/v3/manga/${manga._id}`).then(res => {
        //         const malManga = mapJikanManga(res.data)

        //         const mangaToUpdate = compareMangas(manga, malManga)
        //         console.log(malManga.title, mangaToUpdate)
        //         if (Object.keys(mangaToUpdate).length) {
        //             Manga.findOne({ _id: manga._id }).updateOne(mangaToUpdate).exec().then(res => {
        //                 console.log(`Updated ${malManga.title}`)
        //             }).catch(error => {
        //                 console.log("Atlas Update ERROR")
        //                 console.log(error)
        //             })
        //         } else {
        //             console.log(`${manga.title} is updated!`)
        //         }

        //     }).catch(error => {
        //         console.log("Jikan ERROR")
        //         console.log(error)
        //     })
        // });




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

function mapJikanManga(manga) {
    return {
        _id: manga.mal_id,
        title: manga.title,
        description: manga.synopsis,
        image_url: manga.image_url,
        status: manga.status,
        published: manga.published.string,
        genres: manga.genres,
        authors: manga.authors,
        members: manga.members || 0,
        volumes: manga.volumes || 0,
        score: manga.score || 0,
        publishing: manga.publishing,
        recommendations: manga.recommendations.slice(0, 5)
    }
}

function compareMangas(manga, malManga) {
    const mangaToUpdate = {}
    Object.keys(malManga).forEach(key => {
        if (manga[key] === undefined) {
            mangaToUpdate[key] = malManga[key]
        } else {
            if (Array.isArray(malManga[key]) && Array.isArray(manga[key])) {
                if (manga[key].length !== malManga[key].length) {
                    mangaToUpdate[key] = malManga[key]
                }
            } else if (typeof malManga[key] === "object") {
                if (!deepEqual(manga[key], malManga[key])) {
                    mangaToUpdate[key] = malManga[key]
                }
            } else if (manga[key] != malManga[key]) {
                mangaToUpdate[key] = malManga[key]
            }
        }
    })
    return mangaToUpdate
}

function deepEqual(object1, object2) {
    if (object1 === undefined || object1 === null || object2 === undefined || object2 === null) return false
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }

    return true;
}

function isObject(object) {
    return object != null && typeof object === 'object';
}

