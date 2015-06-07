var mongoose = require('mongoose')
var db = mongoose.createConnection('mongodb://rooter:juandavid123@ds049568.mongolab.com:49568/chat-social')
//var db = mongoose.createConnection('mongodb://localhost/chat')


db.on('error', console.log.bind(console, 'Error de conexión:'))
db.once('connected', function callback () {
    console.log('Conectado a mongodb')
})
db.once('open', function callback () {
    console.log('Conectado con la DB Mongo')
})