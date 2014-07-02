var usuarios = []
var usernames = {}

var mongoose = require('mongoose')
<<<<<<< HEAD
<<<<<<< HEAD
var db = mongoose.createConnection('mongodb://rooter:juandavid123@ds049568.mongolab.com:49568/chat-social')
//var db = mongoose.createConnection('mongodb://localhost/chat')
=======
var db = mongoose.createConnection('mongodb://juanvc123:juandavid123@ds049568.mongolab.com:49568/chat-social')
>>>>>>> ca90132f1d22d19100c5fe118428683ff252718f
=======
var db = mongoose.createConnection('mongodb://root:mongodb@ds049568.mongolab.com:49568/chat-social')
>>>>>>> 18ea8d99b7123d1655c4cbcdbc744c56b0f95423

db.on('error', console.log.bind(console, 'Error de conexión:'))
db.once('connected', function callback () {
    console.log('Conectado a mongodb')
})
db.once('open', function callback () {
<<<<<<< HEAD
    console.log('Conectado con la DB Mongo')
=======
    console.log('Conectado con la DB')
>>>>>>> ca90132f1d22d19100c5fe118428683ff252718f
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
<<<<<<< HEAD

=======
>>>>>>> ca90132f1d22d19100c5fe118428683ff252718f
	var constant, passBD	
	
	usernames[data.nombre] = {
		name: data.nombre,
		id: data.id
	}

	if(usuarios[usuario]){	
<<<<<<< HEAD
		if(usuarios[usuario].password === password)
			callback({log:'bien', user: data})
		else
			callback({log:'passIncorrect'})		
=======
		if(usuarios[usuario].password === password) {
			callback({log:'bien', user: data})
		} else {
			callback({log:'passIncorrect'})
		}		
>>>>>>> ca90132f1d22d19100c5fe118428683ff252718f
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
<<<<<<< HEAD
		console.log('Mensaje guardado con éxito')
=======
		console.log('MESSAGE INSERTED MONGODB')
>>>>>>> ca90132f1d22d19100c5fe118428683ff252718f
	}
}
exports.reloadMessages = function(callback) {

	collectionMessage.find(onFind)

	function onFind(err, mensajes) {
		if(!err) {
<<<<<<< HEAD
			callback(mensajes)
		} else {
			console.log('No se pudo recargar los mensajes')
=======
			console.log(mensajes)
			callback(mensajes)
		} else {
			console.log('No se pudo reload mensajes')
>>>>>>> ca90132f1d22d19100c5fe118428683ff252718f
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
<<<<<<< HEAD
	}	
=======
	}
>>>>>>> ca90132f1d22d19100c5fe118428683ff252718f
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