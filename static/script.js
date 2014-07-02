var socket  = io.connect('/'),
	remember = false,
	per = false,
	globalUser,
	userTarget

cargaChat()

function cargaChat(){
	if(localStorage['user']) {
		var local = JSON.parse(localStorage['user'])
		var data = {
			nombre: local.nombre,
			password: local.password
		}
		socket.emit('req-sesion', data)		
	}

	socket.emit('reloadUsers')
	socket.emit('reloadMessages')
}

$(document).ready(function() {
	$('#form_messageIn')[0].reset()
	$('#form-login').submit(function(event) { formSubmit(event) })
	$('#inputMessage').click(function(){showLogin()})
	$('#inputMessage').keyup(function(e){countChar(e)})
	$('#signOut').click(function(){ signOut()})
	$('#form_messageIn, #form_priv').submit(function(e) {sendMessage(e)})
	$('#optionMessages, #optionUsers, #optionPrivates').click(function(event){showDis(event)})
})

function sendPrivates(to) {
	var box_priv = $('<div id="box_priv"></div>')
	var form_priv = $('<form id="form_priv"></form>')
	box_priv.addClass('box_priv')

	var title = $('<label>Mensaje Privado</label>')
	var label_target = $('<span>'+to+'</span>')
	var input_message = $('<textarea class="inputMessage" rows="5" cols="5" maxlength="200" placeholder="Mensaje..."></textarea>')
	var enviar = $('<input type="submit" value="Enviar" />')
	var cancelar = $('<input type="button" id="removeBoxPriv" value="Cancelar" />')

	cancelar.click(function(e) {
		$('#box_priv').remove()
		userTarget = undefined
	})
	
	form_priv.submit(function(e) { sendMessage(e)})

	form_priv.append(label_target)
	form_priv.append(input_message)
	form_priv.append(enviar)
	form_priv.append(cancelar)
	box_priv.append(title)
	box_priv.append(form_priv)
	$(box_priv).fadeIn(200,'swing').appendTo('.chat')	
}
function showDis(e) {
	var i = $(e.target)	

	switch (i.attr('data-item')) {
		case 'chat':
			$('#content_users').hide()
			$('#content_privates').hide()
			$('#content_messages').show()
			$('#optionMessages').removeClass('waitShow')
			break
		case 'users':
			$('#content_users').show()
			$('#content_messages').hide()
			$('#content_privates').hide()
			break
		case 'privates':
			$('#content_users').hide()
			$('#content_messages').hide()
			$('#content_privates').show()
			$('#optionPrivates').removeClass('waitShow')
			break
	}
}
function countChar(e){
	var limit = 200
	var variant = $('#inputMessage').val().length	
	if((variant-1) < limit)
		$('#countChar').text(limit-variant)
}
function formSubmit(e) {
	var i = jQuery(e.target)
	e.preventDefault()
	var valUsuario = $('#usuario').val()
	var valPassword = $('#password').val()	
	if(valUsuario.indexOf(' ') < 0 && valPassword.indexOf(' ') < 0) {
		if(valUsuario.trim() !== '' && valPassword.trim() !== ''){
			var data = {
				nombre: valUsuario,
				password: valPassword
			}
			socket.emit('req-sesion', data)
			if($('#rememberMe').is(':checked')){
				if(validLocalStorage() === true) {
					remember = true
				} else {
					alert('¡Su navegador no soporta almacenar datos en el equipo, porfavor actualicelo!')
				}			
			}
			i[0].reset()
		}
		else{
			newError('Llene todos los campos.','#form-login button')
		}
	}
	else{
		newError('El usuario ni la contraseña pueden tener espacios.','#form-login button')
	}
}
function newError(text, ruta) {
	$('.alert').remove()			
	$(ruta).after('<div class="alert alert-danger">'+text+'</div>')
}
function showLogin() {	
	if(!per) {
		var form = $('#form-login')
		form.animate({
			marginTop: "20px"
		}, 400)		
	}
}

socket.on('res_usuario', function(data) {res_usuario(data)})
socket.on('messageRealTime', function(data) {messageRealTime(data)})
socket.on('reloadMessagesNow', function(data) {reloadMessagesNow(data)})
socket.on('reloadUsers', function(data) {reloadUsers(data)})


function reloadUsers(data) {	
	console.log(Object.keys(data).length)

	$('#listaUsers').html('')	
	var ul = $('#listaUsers')
	if(localStorage['user']) {
		if(Object.keys(data).length > 0) {
			for(var i in data) {
				
				$('<li>'+data[i].nombre+'</li>').click(function(e){
					if(globalUser !== undefined) {				
						var ou = $(e.target)				
						if(globalUser != ou.text()) {
							sendPrivates(ou.text())
							userTarget = ou.text()
						}
					}
				}).appendTo(ul)	
			}	
		}
		else
			ul.html('<div class="info">Para poder ver los usuarios conectados debes estar logueado</div>')
	}
	else
		ul.html('<div class="info">Para poder ver los usuarios conectados debes estar logueado</div>')
}

function res_usuario(data) {
	var form = $('#form-login')
	if(data.log == 'bien') {
		per = true
		form.find('.alert').remove()
		$('#formSignii').modal('hide')
		$('#nameUsuario').text('#'+data.user.nombre)
		globalUser = data.user.nombre

		$('#inputMessage').removeAttr('readonly')
		if(remember){
			localStorage['user'] = JSON.stringify(data.user)
		}
	}
	else if(data.log == 'passIncorrect'){
		$('.alert').remove()
		var alert = $('<div class="alert alert-danger"></div>')
		alert.text('Este nombre ya fué escogido o contraseña incorrecta')

		$('#form-login button').before(alert)
	}
}
function validLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null
  } catch (e) {
    return false
  }
}
function signOut() {
	socket.emit('signOut', {name: globalUser})
	globalUser = ""
	userTarget = undefined
	$('#box_priv').remove()
	localStorage.clear()
	$('#nameUsuario').text('Usuario:')	
	per = false
}
function formateaDate(string, criterio) {	
	var stringNew = criterio == 'fecha'? string.split('/') : string.split(':')
	var s1 = stringNew[0]
	var s2 = stringNew[1]

	var news1 = (s1 < 10)? ("0" + s1) : s1
	var news2 = (s2 < 10)? ("0" + s2) : s2

	var stringReturn = criterio == 'fecha'? news1 + "/" + news2 + "/" + stringNew[2] : news1 + ":" + news2
	return stringReturn
}
function sendMessage(e) {	
	e.preventDefault()
	var i = $(e.target)	
	var input = $(i).find('.inputMessage')
	var message = $.trim(input.val())	
	if(message.length <= 200) {
		if(message !== ''){
			var date = new Date()
			var hora = formateaDate(date.getHours() + ':' + date.getMinutes(),'hora')
			var fecha = date
			if(userTarget == undefined) {
				var data1 = {
					message: message,
					usuario: globalUser,
					fecha: new Date(),
					hora: hora
				}
				socket.emit('newMessage', data1)
				$('#form_messageIn')[0].reset()
				$('#content_messages').show()
				$('#content_users').hide()
				$('#content_privates').hide()
			}
			else {
				var data2 = {
					to: userTarget,
					message: message,
					usuario: globalUser,
					fecha: new Date(),
					hora: hora
				}							
				socket.emit('private', data2)
				$(i)[0].reset()

				//prepend message a mi content_private
				var messageWrap = $('<div class="messageWrap"></div>')
				var divUser = $('<div class="divUser"></div>')
				var divMessage = $('<div class="divMessage"></div>')
				var divTime = $('<div class="divTime"></div>')
				divUser.html('<span class="hablaA"> Tú le dices a </span>' + data2.to)
				messageWrap.append(divUser)
				messageWrap.append(divMessage)
				divMessage.text(data2.message)
				divTime.text(data2.hora)
				messageWrap.append(divTime)
				$('#content_privates').prepend(messageWrap)
				//end
			}
		}
	}
	else {
		newError('Solo son 200 caracteres.', '#form_priv #removeBoxPriv')
	}
}
function messageRealTime(data) {
	$('.info').remove()
	var contenedor
	var messageWrap = $('<div class="messageWrap"></div>')

	var divUser = $('<div class="divUser"></div>')
	var divMessage = $('<div class="divMessage"></div>')
	var divTime = $('<div class="divTime"></div>')

	if(data.usuario === globalUser) {
		messageWrap.addClass('messageWrap_Mio')			
	}

	if(data.to){
		contenedor = $('#content_privates')
		divUser.html(data.usuario + '<span class="hablaA"> te dice</span>')
		messageWrap.append(divUser)
		if($('#content_privates').is(":visible") == false) {
			$('#optionPrivates').addClass('waitShow')
		}		
	} else {
		contenedor = $('#content_messages')
		divUser.text(data.usuario)
		messageWrap.append(divUser)
		if($('#content_messages').is(":visible") == false) {
			$('#optionMessages').addClass('waitShow')
		}
	}

	divMessage.text(data.message)
	divTime.text(data.hora)
	
	messageWrap.append(divMessage)
	messageWrap.append(divTime)

	$(messageWrap).click(function(e){
		console.log(data.usuario + ' - ' + globalUser)
		if(globalUser !== undefined) {						
			if(globalUser !== data.usuario) {
				userTarget = data.usuario
				sendPrivates(data.usuario)				
			}
		}
	}).prependTo(contenedor)	
}
function reloadMessagesNow(data) {	
	for(var i in data) {
		var date = new Date()
		var fechaNow = formateaDate(date.getDate() + '/' + date.getMonth() + '/' + date.getYear(),'fecha')

		var messageWrap = $('<div class="messageWrap"></div>')
		var divUser = $('<div class="divUser"></div>')
		var divMessage = $('<div class="divMessage"></div>')
		var divTime = $('<div class="divTime"></div>')

		if(data[i].usuario === globalUser) {
			messageWrap.addClass('messageWrap_Mio')
		}
		var fechaMen = new Date(data[i].fecha)
		if(fechaNow !== data[i].fecha) {
			divTime.text(fechaMen.getFullYear()+'/'+(fechaMen.getMonth()+2)+'/'+fechaMen.getDate()+ ' ' + data[i].hora)
		}
		else {
			divTime.text(data[i].hora)
		}


		divUser.text(data[i].usuario)
		divMessage.text(data[i].contenido)
		divTime.text(data[i].hora)

		messageWrap.append(divUser)
		messageWrap.append(divMessage)
		messageWrap.append(divTime)

		$('#content_messages').prepend(messageWrap)
	}	
}