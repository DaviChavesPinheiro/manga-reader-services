const cron = require('node-cron');
const puppeteer = require('puppeteer');
const axios = require('axios')
const mangas = require('./mangas.json');

module.exports = async app => {
    const { Manga } = app


    if (mangas && typeof mangas === "object") {
        mangas.forEach(async manga => {
            const mangaDB = await Manga.findOne({ _id: manga.mal_id }).exec()
            if (!mangaDB) {
                const malManga = await getMalManga(manga.mal_id)
                const completeManga = {
                    ...malManga,
                    chapters: manga.chapters,
                    chapters_amount: manga.chapters.length
                }
                console.log(completeManga.title, Object.keys(completeManga))
                Manga.create(completeManga).then(res => {
                    console.log(`Added ${completeManga.title}`)
                })
            } else {
                console.log(`${mangaDB.title} aready exists`)
            }
        })
    }

    async function getMalManga(id) {
        let malManga = {}
        await axios.get(`https://api.jikan.moe/v3/manga/${id}`)
            .then(res => {
                malManga = res.data
                sleep(1000)
                return axios.get(`https://api.jikan.moe/v3/manga/${id}/recommendations`)
            })
            .then(res => {
                malManga = { ...malManga, recommendations: res.data.recommendations }
                sleep(1000)
                return axios.get(`https://api.jikan.moe/v3/manga/${id}/characters`)
            })
            .then(res => {
                malManga = { ...malManga, characters: res.data.characters }
                return malManga
            })
            .then(res => {
                malManga = mapJikanManga(res)
                return malManga
            })
        return malManga
    }

    // cron.schedule('0 0 0 * * *', () => {
    //     console.log('running a task every day');
    //     update()
    // });

    update()

    async function update() {
        const mangasAmount = await Manga.find({}).countDocuments()

        const mangas = await Manga.find({}).sort({ _id: 1 }).select("-chapters.pages").limit(1).skip(3)
        console.log("Started")
        mangaYabuScrap()
        console.log("Finished")
        // updateManga(mangas)
    }

    async function mangaYabuScrap() {
        const browser = await puppeteer.launch({
            'args': [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        // await page.emulate(iPhone);
        await page.goto('https://mangayabu.com/manga/vagabond/');

        const chapters = await page.evaluate(() => {
            const chaptersElements = document.querySelectorAll(".single-chapter a")
            const chapters = []
            chaptersElements.forEach(chapterElement => {
                chapters.push({ title: chapterElement.textContent, url: chapterElement.href })
            })
            return chapters.reverse()
        });

        console.log('chapters:', chapters);

        await browser.close();
    }

    function updateManga(mangas) {
        console.log("left: ", mangas.length)
        const manga = mangas.shift()
        let malManga = {}
        if (manga === undefined) return
        axios.get(`https://api.jikan.moe/v3/manga/${manga._id}`)
            .then(res => {
                malManga = res.data
                sleep(1000)
                return axios.get(`https://api.jikan.moe/v3/manga/${manga._id}/recommendations`)
            })
            .then(res => {
                malManga = { ...malManga, recommendations: res.data.recommendations }
                sleep(1000)
                return axios.get(`https://api.jikan.moe/v3/manga/${manga._id}/characters`)
            })
            .then(res => {
                malManga = { ...malManga, characters: res.data.characters }
                return malManga
            })
            .then(res => {
                malManga = mapJikanManga(res)
                const mangaToUpdate = compareMangas(manga, malManga)


                if (Object.keys(mangaToUpdate).length) {
                    console.log(malManga.title, Object.keys(mangaToUpdate))
                    Manga.findOne({ _id: manga._id }).updateOne(mangaToUpdate).exec().then(res => {
                        console.log(`Updated ${malManga.title}`)
                    }).catch(error => {
                        console.log("Atlas Update ERROR MANGA: ", manga.title)
                        console.log(error)
                    })
                } else {
                    console.log(`${manga.title} is updated!`)
                }

            }).catch(error => {
                console.log("Jikan ERROR")
                console.log(error)
            }).finally(() => {
                updateManga(mangas)
            })
    }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
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
        publishing: manga.publishing,
        members: manga.members || 0,
        volumes: manga.volumes || 0,
        score: manga.score || 0,
        authors: manga.authors || [],
        genres: manga.genres || [],
        recommendations: manga.recommendations.slice(0, 5),
        characters: manga.characters.slice(0, 8),
    }
}

function compareMangas(manga, malManga) {
    const mangaToUpdate = {}

    if (manga.title !== malManga.title) mangaToUpdate.title = malManga.title
    if (manga.description !== malManga.description) mangaToUpdate.description = malManga.description
    if (manga.image_url !== malManga.image_url) mangaToUpdate.image_url = malManga.image_url
    if (manga.status !== malManga.status) mangaToUpdate.status = malManga.status
    if (manga.published !== malManga.published) mangaToUpdate.published = malManga.published
    if (manga.publishing !== malManga.publishing) mangaToUpdate.publishing = malManga.publishing
    if (manga.members !== malManga.members) mangaToUpdate.members = malManga.members
    if (manga.members !== malManga.members) mangaToUpdate.members = malManga.members
    if (manga.score !== malManga.score) mangaToUpdate.score = malManga.score

    if (!equalArrayOfObjects(manga.authors, malManga.authors)) mangaToUpdate.authors = malManga.authors
    if (!equalArrayOfObjects(manga.genres, malManga.genres)) mangaToUpdate.genres = malManga.genres
    if (!equalArrayOfObjects(manga.recommendations, malManga.recommendations)) mangaToUpdate.recommendations = malManga.recommendations
    if (!equalArrayOfObjects(manga.characters, malManga.characters)) mangaToUpdate.characters = malManga.characters

    return mangaToUpdate
}

function equalArrayOfObjects(array1, array2) {
    if (array1 === undefined && array2 !== undefined) return false
    if (array1.length !== array2.length) return false
    if (array1.some((value, index) => !shallowEqual(value, array2[index]))) return false
    return true
}

function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }

    return true;
}

