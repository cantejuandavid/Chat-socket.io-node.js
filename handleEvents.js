var usuarios = []
var usernames = {}

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

var mensajes_Schema = require('./models/mensajes')
var collectionMessage = db.model('mensajes', mensajes_Schema)

exports.signOut = function(data, callback) {
	delete usuarios[data.name]	
	delete usernames[data.name]
	var users = {}
	for(var i in usuarios) {
		var content = {
			nombre: usuarios[i].nombre,
			id: usuarios[i].id
		}
		users[usuarios[i].nombre] = content
	}
	callback(users)
}
exports.req_sesion = function(data, callback) {
	var usuario = data.nombre
	var password = data.password

	usernames[data.nombre] = {
		name: data.nombre,
		id: data.id
	}

	if(usuarios[usuario]){	
		if(usuarios[usuario].password === password)
			callback({log:'bien', user: data})
		else
			callback({log:'passIncorrect'})		
	}
	else {		
		usuarios[usuario] = data
		callback({log:'bien', user: data})	
	}
}
exports.message = function(data, callback) {
	callback(data)

	var mensaje = new collectionMessage({
		usuario: data.usuario,
		contenido: data.message,
		hora: data.hora,
		fecha: data.fecha
	})

	mensaje.save(onSaved)

	function onSaved(err) {
		if(err) {
			console.log('NO SE PUDO CREAR ESTE PRODUCTO')
		    console.log(err)
		}
		console.log('Mensaje guardado con éxito')
	}
}
exports.reloadMessages = function(callback) {

	collectionMessage.find(onFind)

	function onFind(err, mensajes) {
		if(!err) {
			callback(mensajes)
		} else {
			console.log('No se pudo recargar los mensajes')
			console.log(mensajes)
			callback(mensajes)
		}
	}
}
exports.reloadUsers = function(callback){
	var users = {}
	for(var i in usuarios) {
		var content = {
			nombre: usuarios[i].nombre,
			id: usuarios[i].id
		}
		users[usuarios[i].nombre] = content
	}	
	callback(users)	
}
exports.sendPrivates = function(data, callback) {
	for(var i in usernames) {
		if(usernames[i].name == data.to) {		
			var toId = usernames[data.to].id	
			var res =  {
				data: data,
				target: toId
			}	
			callback(res)
		}
	}

}