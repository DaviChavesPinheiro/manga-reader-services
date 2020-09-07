const cron = require('node-cron');
const axios = require('axios')
const data = require('./mangas.json')


module.exports = app => {
    const {Manga} = app
    
    if (data && typeof data === "object") {
        const mangas = data.map((manga) => {
            return {
                title: manga.title,
                description: manga.description,
                image_url: manga.img,
                chapters: manga.chapters,
                chapters_amount: parseInt(manga.chapters.length),
                members: parseInt(manga.members.replace(',', '')),
                score: parseFloat(manga.score.replace(',', ''))
            }
        })
        // Manga.insertMany(mangas)
    }


    // const getMangaList = async () => {
    //     const res = await axios.get("https://api.jikan.moe/v3/top/anime/1")
    //     const data = res.data.top.map((manga) => {
    //         return {
    //             title: manga.title,
    //             rank: manga.rank,
    //             image_url: manga.image_url,
    //             episodes: manga.episodes,
    //             members: manga.members,
    //             score: manga.score
    //         }
    //     })
    //     // Manga.insertMany(data)


    //     console.log(data.length)
    // }
}


