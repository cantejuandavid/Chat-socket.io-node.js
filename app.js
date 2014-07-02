var express = require('express')
var app = express()
var http = require('http')
var path = require('path')
var handleEvents = require('./handleEvents')
var port = process.env.PORT || 5000

app.configure(function() {	
	app.use(express.static(path.join(__dirname,'static')))
	app.get('*', function(req, res) {
		res.send('URL INVÁlIDA',404)
	})
})

var server = http.createServer(app).listen(port, function() {
	console.log("Listening on " + port)
})

var io = require('socket.io').listen(server, {log: false})
<<<<<<< HEAD

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
=======

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
>>>>>>> ca90132f1d22d19100c5fe118428683ff252718f

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
<<<<<<< HEAD
=======

>>>>>>> ca90132f1d22d19100c5fe118428683ff252718f
	function sendPrivates(data) {
		handleEvents.sendPrivates(data, function(callback) {
			io.sockets.socket(callback.target).emit('messageRealTime', callback.data)
		})
	}
<<<<<<< HEAD
	
=======
>>>>>>> ca90132f1d22d19100c5fe118428683ff252718f
	socket.on('disconnect', function(){			
		var data = {
			name: socket.username
		}
		handleEvents.signOut(data, function(callback) {
			io.sockets.emit('reloadUsers', callback)
		})
	})
})
