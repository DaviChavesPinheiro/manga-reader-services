const app = require('express')()
const cors = require('cors')
const consign = require('consign')
const bodyParser = require('body-parser')
require("dotenv").config()

const port = process.env.PORT || 8080
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

consign()
    .include('./src/database/connection.js')
    .then('./src/database/models')
    .then('./src/schedule/schedule.js')
    .then('./src/api')
    .then('./src/routes')
    .into(app)

console.log(process.env)
app.listen(port, () => console.log(`Servidor Rodando na porta ${port} ` + new Date().toLocaleTimeString()))