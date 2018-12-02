/*global console, require */
(function () {
	'use strict';
	var serverPort = 1337,
		server = null,
		io = null,
		nSight = 0,

		fs = require('fs');

		var contentTypes = {
			".html": "text/html",
			".css": "text/css",
			".js": "application/javascript",
			".png": "image/png",
			".jpg": "image/jpeg",
			".ico": "image/x-icon",
			".m4a": "audio/mp4",
			".oga": "audio/ogg"
		};

		var player1 = {
			x: -30,
			y: -30
		}


	function MyServer(request, response) {
		var filePath = '.' + request.url,
			extname = '',
			contentType = '';

		if(filePath === './'){
			filePath = './index.html';
		}
		var extname = filePath.substr(filePath.lastIndexOf('.'));
		contentType = contentTypes[extname];

		if(!contentType){
			contentType = 'application/octet-stream';
		}
		//console.log((new Date()) + ' Serving ' + filePath + ' as ' + contentType);

		fs.exists(filePath, function (exists) {
			if(exists){
				fs.readFile(filePath, function (error, content) {
					if(error){
						response.writeHead(500, { 'Content-Type': 'text/html' });
						response.end('500 Internal Server Error');
					} else{
						response.writeHead(200, { 'Content-Type': contentType });
						response.end(content, 'utf-8');
					} 
				});

			} else{
				response.writeHead(404, { 'Content-Type': 'text/html' });
				response.end('404 Not Found');
			}
		});
	}


	server = require('http').createServer(MyServer);
	server.listen(serverPort, function () {
		console.log('Server is listening on port ' + serverPort);
		console.log('');
	});


	var users = [];
	var nicknames = [];

	io = require('socket.io').listen(server);
	io.sockets.on('connection', function(socket){
		socket.player = nSight;
		nSight += 1;
		users[socket.player] = socket.id;

		//totalUsers++;
		//console.log("Usuarios totales: "+totalUsers);

		//Guardar Nickname
		socket.on('userNickname', function (data) {
			nicknames[socket.player] = data.nm;
			console.log("Player "+socket.player+" conectado como: "+nicknames[socket.player]);
		});

		//Spawn
		socket.broadcast.emit('sight', {id: socket.player, x: player1.x, y: player1.y});

		//Movimiento
		socket.on('moving', function (sight) {
			socket.broadcast.emit('sight', {id: socket.player, nm: sight.nm, x: sight.x, y: sight.y, sx: sight.sx, sy: sight.sy, w: sight.w, h: sight.h});
		});

		//Muerte
		socket.on('mateA', function (sight) {
			io.sockets.in(users[sight.id]).emit('estasMuerto', {id: sight.id});
		});
		socket.on('imDead', function (sight) {
			socket.broadcast.emit('sight', {id: sight.id, x: null, y: null});
		});

		/*DESCOMENTAR PARA ACTIVAR EL SPAWN DE MONEDAS
		//Spawn Monedas
		socket.on('sMoneda', function (moneda) {
			socket.broadcast.emit('spawnMoneda', {x: moneda.x, y: moneda.y});
		});*/
		//Desaparicion Moneda
		/*socket.on('dMoneda', function (moneda) {
			socket.broadcast.emit('deleteMoneda', {x: moneda.x, y: moneda.y});
		});*/

		//Desconexion
		socket.on('disconnect', function(){
			socket.broadcast.emit('sight', {id: socket.player, x: null, y: null});

			console.log('Player ' + socket.player + '('+nicknames[socket.player]+')' + ' desconectado.');
			//totalUsers--;
		});

	});

	

}());