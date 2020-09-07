const app = require('express')()
const cors = require('cors')
const consign = require('consign')
const bodyParser = require('body-parser')

const port = 8080
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


app.listen(port, () => console.log(`Servidor Rodando na porta ${port} ` + new Date().toLocaleTimeString()))