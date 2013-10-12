var Schema = require('mongoose').Schema

var mensajes_schema = new Schema({
	usuario: String,
	contenido: String,
	hora: String,
	fecha: { type: Date, default: Date.now }
})

var mensajes = module.exports = mensajes_schema