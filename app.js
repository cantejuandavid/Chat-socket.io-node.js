var express = require('express')
var app = express()
var path = require('path')
var stylus = require('stylus')
var morgan = require('morgan')
var nib = require('nib')
var handleEvents = require('./handleEvents')
var port = process.env.PORT || 5000

var server = require('http').Server(app)
var io = require('socket.io')(server)

server.listen(port, function() {
	console.log("Listening on " + port)
})

app.use(stylus.middleware({
	src: __dirname + '/static',
	compile: compile
}));
//app.use(morgan('combined'))
app.use(require('stylus').middleware(__dirname + '/static'));

app.use(express.static(path.join(__dirname, 'static')));

app.get('*', function(req, res) {
	res.send('URL INVÁlIDA',404)
})


io.sockets.on('connection', function(socket) {

	socket.on('req-sesion', req_sesion)
	socket.on('newMessage', newMessage)
	socket.on('reloadMessages', reloadMessages)
	socket.on('reloadUsers', reloadUsers)
	socket.on('signOut', signOut)
	socket.on('private', sendPrivates)

	function req_sesion(data) {		
		socket.username = data.nombre	
		data['id'] = socket.id

		handleEvents.req_sesion(data, function(callback){
			socket.emit('res_usuario', callback)
			handleEvents.reloadUsers(function(callback){
				io.sockets.emit('reloadUsers', callback)				
			})
		})
	}
	function newMessage(data) {
		handleEvents.message(data, function(callback){
			io.sockets.emit('messageRealTime', callback)
		})
	}
	function reloadMessages() {
		handleEvents.reloadMessages(function(callback){
			socket.emit('reloadMessagesNow', callback)
		})
	}
	function reloadUsers() {
		handleEvents.reloadUsers(function(callback){
			socket.emit('reloadUsers', callback)
		})
	}
	function signOut(data) {
		handleEvents.signOut(data, function(callback) {
			io.sockets.emit('reloadUsers', callback)
		})
	}

	function sendPrivates(data) {
		handleEvents.sendPrivates(data, function(callback) {
			io.to(callback.target).emit('messageRealTime', callback.data)
		})
	}
	socket.on('disconnect', function(){			
		var data = {
			name: socket.username
		}
		handleEvents.signOut(data, function(callback) {
			io.sockets.emit('reloadUsers', callback)
		})
	})
})

function compile(str, path) {
	return stylus(str)
		.set('filename', path)
		.set('compress', true)
		.use(nib())
}