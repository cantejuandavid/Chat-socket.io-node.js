var mongoose = require('mongoose')
var db = 'mongodb://rooter:juandavid123@ds049568.mongolab.com:49568/chat-social'
var db = module.exports = mongoose.connect(db)

mongoose.connection.on('error', function(err) {
	console.log(err)
})

mongoose.connection.on('connected', function(e) {
	console.log('->DB Lista!!!')	
})
