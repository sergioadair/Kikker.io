
var fondo, grupoAssets, imagenFondo, capaKinetic;
var keyboard = {};
var intv;
var personaje, puntaje;
var posX, posY;
var posYP;
var posXM, posYM;
var grav = 3;//2.2-la usada por mucho tiempo //3
var val_reb = -0.12;//-0.09
// Variable para el bug de los dobles
var b = false;
// Variable para el bug del gemelo malvado
var e = false;

var windowWidth = $(window).width();
var windowHeight = $(window).height();
var centroPantalla = windowWidth/2;
var centroPantallaH = windowHeight/2;
//console.log(centroPantalla-50);

// Fixed stage size
var SCENE_BASE_WIDTH = windowWidth;//2000
var SCENE_BASE_HEIGHT = windowHeight;//500//2000

// Max upscale
var SCENE_MAX_WIDTH = SCENE_BASE_WIDTH+600;//2600
var SCENE_MAX_HEIGHT = SCENE_BASE_HEIGHT+600;//650//2600

var juego = new Game();
var divJuego = document.getElementById("game");
var textPuntaje = document.getElementById("score");

var myNickname;
$('#nicknameYSquash').submit(function(event){
  //Evita el comportamiento predeterminado del navegador
  event.preventDefault();
  //Lo que ejecuta cuando das enter o presionas jugar
  myNickname = document.getElementById('nickname').value;
  if(myNickname == ""){
  	myNickname = "unnamed";
  }
  iniciarJuego();
});

//var imgLla = new Image();
//imgLla.src = 'imgs/llave.png';
var imgPlata = new Image();
imgPlata.src = 'imgs/congruent_pentagon.png';
//var imgMon = new Image();
//imgMon.src = 'imgs/moneda.png';
//var imgPuer = new Image();
//imgPuer.src = 'imgs/puerta.png';
/*var imgFon = new Image();
imgFon.src = 'imgs/violetAzure.png';*/

//Canvas
grupoAssets = new Kinetic.Group({
	x: 0,
	y: 0
});

var stage = new Kinetic.Stage({
container: 'game',
width: 2000,//960//2000
height: 2000//500//2000
});

/*
imagenFondo = new Kinetic.Image({
	x: 0,
	y: 0,
	image: imgFon,
	width: 2048*2,
	height: 2732*2
});*/


//--------------------SERVIDOR---------------------//

var socket;

var players = [];
var moving = false;
var contadorP = 0;
var puedeMoverF = true;

function enableSockets() {

	//Primera aparición
	socket.on('sight', function (sight) {
		if (sight.x === null && sight.y === null) {
			if(players[sight.id] != null){
				players[sight.id].remove();//Da un error al refrescar la pagina
				//console.log(sight.id+" ESTA MUERTO");
			}
		}else if(!players[sight.id]){
			if(sight.x != null && sight.y != null){
				//Se crea, mueve y se pone su escala al enemigo
				players[sight.id] = new Enemigo(sight.nm,sight.x,sight.y);
				players[sight.id].setScale({x: sight.sx, y: sight.sy});
				players[sight.id].setWidth(sight.w);
				players[sight.id].setHeight(sight.h);
				grupoAssets.add(players[sight.id]);
			}
		//Este else es importante para la aparicion de enemigos cuando te conectas
		} else{
			if(players[sight.id] != null){
				//Se mueve el enemigo, se pone su escala y se le asigna su nickname
				players[sight.id].nickname = sight.nm;
				players[sight.id].setX(piso.getX()+sight.x);
				players[sight.id].setY(piso.getY()-sight.y);
				players[sight.id].setScale({x: sight.sx, y: sight.sy});
				players[sight.id].setWidth(sight.w);
				players[sight.id].setHeight(sight.h);
			}
		}
	});

	/* Muerte  ~ Bug al volver a jugar 
		- Si se hace reconexión aparece tu gemelo malvado, pero funciona perfecto en los otros clientes
		- Si no se hace reconexión funciona perfecto en tu juego, pero no apareces en los otros clientes (y aun asi puedes matarlos)*/
	socket.on('estasMuerto', function (sight) {
		puedeMoverF = false;
		//console.log("YO "+sight.id+" ACABO DE MORIR");
		socket.emit('imDead', {id: sight.id});

		personaje.remove();

		document.querySelector('#inicio').style.display = 'block';
		document.querySelector('#parrafoScore').style.display = 'none';

		// Evita que se redefinan TODOS los assets
		b = true;
		// Evita hacer una reconexión al servidor y redefine al personaje
		e = true;

	});

}

//-----------------------------------------//
//Calcula PosX y PosY además envia la escala, ancho, alto y posicion al servidor
function emitMoving(){
	posX = personaje.getX() - (piso.getX());
	posY = piso.getY() - (personaje.getY());
	socket.emit('moving', {nm: myNickname, x: posX, y: posY, sx: personaje.getScale().x, sy: personaje.getScale().y, w: personaje.getWidth(), h: personaje.getHeight()});
}

//-----------------------------------//
var scale;
function resizeStage() {
	// Get kinetic stage container div
	var container = stage.getContainer();

	// Get container size
	var containerSize = {
	    width: container.clientWidth,
	    height: container.clientHeight
	};

	// Odd size can cause blurry picture due to subpixel rendering
	if(containerSize.width % 2 !== 0) containerSize.width--;

	if(containerSize.height % 2 !== 0) containerSize.height--;

	// Resize stage
	stage.getSize(containerSize);

	// Scale stage
	var scaleX = Math.min(containerSize.width, SCENE_MAX_WIDTH) / SCENE_BASE_WIDTH;

	var scaleY = Math.min(containerSize.height, SCENE_MAX_HEIGHT) / SCENE_BASE_HEIGHT;

	var minRatio = Math.min(scaleX, scaleY);
	scale = { x: minRatio, y: minRatio };

	stage.setScale(scale);

	// Center stage
	var stagePos = {
	    x: (containerSize.width - SCENE_BASE_WIDTH * minRatio) * 0.5,
	    y: (containerSize.height - SCENE_BASE_HEIGHT * minRatio) * 0.5
	};

	stage.setPosition(stagePos);

	// Redraw stage
	stage.draw();
}

// Initially resize stage
resizeStage();

// Add event listeners to resize stage
window.addEventListener('resize', resizeStage);
window.addEventListener('orientationchange', resizeStage);
//-----------------------------------//


//--------------MOVIMIENTO SCROLL DE LAS TECLAS--------------------------//
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1};
//38: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1 <--Para uso del scroll de la rana

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
	if (window.addEventListener) // older FF
      	window.addEventListener('DOMMouseScroll', preventDefault, false);
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	window.ontouchmove  = preventDefault; // mobile
	document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

disableScroll();

//--------------------------------------------------------------------------//

function crearPersonaje(){
	//Posicion de personaje
	/* Se hace -10 en la Y para dejar (arriba de la rana) un rango de vision que es:
	centroPantallaH-(personaje.getHeight()/2)+10 */
	personaje = new Heroe(centroPantalla-20, centroPantallaH-10);
	capaKinetic.add(personaje);
}


//imagenFondo = new Fondo(-2000,-2000,imgPlata);
var piso = new Plataforma(0,centroPantallaH+30, imgPlata);

function nivelUno(){
	//Se mueve al 0,0 porque Chrome por defecto se mueve algunos pixeles en X
	//Lo pongo al inicio para que se cree el personaje en la posicion correcta
	window.scrollTo(0, 0);

	if(!e){
		// CONEXION AL SERVIDOR
		socket = io.connect('http://localhost:1337');
		enableSockets();
	} else{
		crearPersonaje();
	}


	juego.puntaje = 10;

	//Envia el nickname al server para que lo guarde en un array
	socket.emit('userNickname', {nm: myNickname});

	puedeMoverF = true;

	if(!b){

		capaKinetic = new Kinetic.Layer();
		/* Enemigos */
		//grupoAssets.add(new Enemigo(200,stage.getHeight()-75, imgEn));

		//Posicion de piso
		//piso.setY(centroPantallaH+20);
		piso.setWidth(stage.getWidth()*2);

		/* Plataformas */
		//La Y del piso menos el Height de las plataformas
		var difPlatY = piso.getY()-40;
		grupoAssets.add(piso);
		grupoAssets.add(new Plataforma(piso.getX()+20,difPlatY-200, imgPlata));
		grupoAssets.add(new Plataforma(piso.getX()+500,difPlatY-100, imgPlata));

		/* Monedas */
		//grupoAssets.add(new Moneda(350,200));

		crearPersonaje();

		//Limite de la pantalla
		personaje.limiteDer = stage.getWidth()-personaje.getWidth();
		personaje.limiteTope = centroPantallaH+15;

		//Se construye el nivel
		//capaKinetic.add(imagenFondo);
		capaKinetic.add(grupoAssets);
		stage.add(capaKinetic);

		//Funcion que se ejecuta cada frame
		intv = setInterval(frameLoop, 1000/24);
	}

	//Calcula PosX y PosY además envia la escala, ancho, alto y posicion x al servidor
	emitMoving();
}

var contadorEmitSuelo = 0;
function moverPersonaje(){

	// MOVERSE IZQUIERDA
	if(keyboard[37]){
		moving = true;
	}
	// MOVERSE DERECHA
	if(keyboard[39]){
		moving = true;
	}
	// SALTO
	if(keyboard[38] && personaje.contador < 1){
		personaje.saltar();
		contadorEmitSuelo = 0;
	}
	// ESTATICO
	if(!(keyboard[37] || keyboard[39] || keyboard[38]) && personaje.estaSaltando == false){
		moving = false;
		//Envia una sola señal cuando toca el suelo (solo el suelo no las plataformas)
		if(contadorEmitSuelo == 0){
			emitMoving();
			contadorEmitSuelo = 1;
		}
	}
	// VOMITAR MONEDAS
	if(keyboard[40]){
		if(puedeMoverF == true){
			grupoAssets.add(new Moneda(personaje.getX()+personaje.getWidth()+100,personaje.getY()+(personaje.getHeight()/2)-15));
			moving = true;
		}
	}

	//Si el vy es diferente a 0 envia su posicion al server
	if(personaje.vy != 0){
		emitMoving();
	}
	//Solo si el personaje esta en movimiento(laterales) envia su posicion al server
	if(moving && personaje.vy == 0){
		emitMoving();
	}
}

//Escuchar cuando se presione una tecla
function addKeyBoardEvents(){
	addEvent(document, "keydown", function(e){
		keyboard[e.keyCode] = true;
	});
	addEvent(document, "keyup", function(e){
		keyboard[e.keyCode] = false;
	});

	function addEvent(element, eventName, func){
		if(element.addEventListener){
			element.addEventListener(eventName, func, false);
		}else if(element.attachEvent){
			element.attachEvent(eventName, func);
		}
		
	}

}

//Colisiones
function hit(a, b){
	var hit = false;

	//Colisiones Horizontales
	if(b.getX() + b.getWidth() >= a.getX()  && b.getX() < a.getX() + a.getWidth())
	{
	   //Colisiones Verticales
	   if(b.getY() + b.getHeight() >= a.getY() && b.getY() < a.getY() + a.getHeight())
	    hit= true;
	}

	//Colisiones de a con b
	if(b.getX() <= a.getX() && b.getX() + b.getWidth() >= a.getX() + a.getWidth() )
	{
	   
	   if(b.getY() <= a.getY() &&  b.getY() +  b.getHeight() >= a.getY() + a.getHeight())
	    hit= true;
	}

	 //Colision b con a
	  if(a.getX() <= b.getX() && a.getX() + a.getWidth() >= b.getX() + b.getWidth() )
	{
	   
	   if(a.getY() <= b.getY() &&  a.getY() +  a.getHeight() >= b.getY() + b.getHeight())
	    hit= true;
	}
	return hit;
}

var objetos;
//Variable para la posicion del backround del Div #game
var backPosx = 0;
//Variable que controla si el personaje debe hacer scroll
var scrollIzq = 0;
var scrollDer = 0;

function moverFondo(){

	objetos = grupoAssets.children;

	if(puedeMoverF == true){
		//Variable para calcular cuanto exuivalen 10px del background en la escala del stage
		var pxEscaladosX = (scale.x*10)/1;
		if(keyboard[39]){
			if(!(posX >= (piso.getWidth()-personaje.getWidth()-9))){
				//Se modifica la propiedad position del background del Div
				backPosx -= pxEscaladosX;
				//divJuego.style.backgroundPosition = backPosx+"px "+personaje.vy+"px";

				for(i in objetos){
					var asset = objetos[i];
					asset.move(-20,0);
				}

				/*Da el empuje a los assets, el fondo y el personaje, además establece 
				que se podrá mover entonces 2 veces a la izquierda (para que quede del otro lado del centro)*/
				if(scrollDer < 1){
					for(i in objetos){
						var asset = objetos[i];
						asset.move(-20,0);
					}
					personaje.move(-20,0);
					scrollDer++;
					backPosx -= pxEscaladosX;
				}

				scrollIzq = -1;

			}
			
		}
		if(keyboard[37]){
			if(!(posX <= 3)){
				//Este tiene un pequeño bug (frena la primera vez)
				backPosx += pxEscaladosX;
				//divJuego.style.backgroundPosition = backPosx+"px "+personaje.vy+"px";

				for(i in objetos){
					var asset = objetos[i];
					asset.move(20,0);
				}

				/*Da el empuje a los assets, el fondo y el personaje, además establece 
				que se podrá mover entonces 2 veces a la derecha (para que quede del otro lado del centro)*/
				if(scrollIzq < 1){
					for(i in objetos){
						var asset = objetos[i];
						asset.move(20,0);
					}
					personaje.move(20,0);
					scrollIzq++;
					backPosx += pxEscaladosX;
				}

				scrollDer = -1;

			}
			
		}
	}

}

function aplicarFuerzas(){
	personaje.aplicarGravedad(grav,val_reb);
}

//Numero Random
/*function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}*/

function detectarColObjetos(){
	var plataformas = grupoAssets.children;
	for(i in plataformas){
		var objeto = plataformas[i];
		//Detecta colision con cualquier Asset
		if(hit(objeto,personaje)){
			//ENEMIGO
			if(objeto instanceof Enemigo){
				//Cuando matas un enemigo
				if(personaje.vy < 0 && personaje.getY() < objeto.getY() && personaje.estaSaltando == true){
					//Escala y puntos del enemgo aplastado
					var s = objeto.getScale().x;
					var p = (s-1)*100;

					socket.emit('mateA', {id: players.indexOf(objeto)});

					//Aqui se suma al personaje los puntos del enemigo aplastado 
					if(s === 1){
						for(var i = 1; i<=10; i++){
							puntoYEscala();
						}
					}else{
						for(var i = 0; i<=p; i++){
							puntoYEscala();
						}
					}

				}

				
			}
			//PLATAFORMA
			//Si es plataforma, lo mueve justo encima de ésta
			else if(objeto instanceof Plataforma && personaje.getY() < objeto.getY() && personaje.vy <= 0){
				personaje.contador = 0;
				//personaje.vy *= val_reb;//Es para el rebote, pero buguea el emit de moving
				personaje.estaSaltando = false
				personaje.vy = 0;

				//Bug de las plataformas movidas
				posYP = objeto.getY()-(personaje.getY() + personaje.getHeight());
				objeto.setY(personaje.getY() + personaje.getHeight());
					for(i in objetos){
						var asset = objetos[i];
						if(asset != objeto){
							asset.setY(asset.getY()-posYP);
						}
					}

			}
			//MONEDA
			else if(objeto instanceof Moneda){
				//Envia el index de la moneda
				//socket.emit('dMoneda', {x: piso.getX()+objeto.getX(), y: piso.getY()-objeto.getY()});
				//console.log("ID spawn "+plataformas);
				//console.log(plataformas.indexOf(objeto));
				objeto.remove();
				puntoYEscala();
				
			}
		}
	}
}

function actualizarTexto(){
	textPuntaje.innerHTML = 'Your size: ' + juego.puntaje;
}

function puntoYEscala(){
	juego.puntaje++;
	actualizarTexto();
	//AQUI SE CAMBIA LA ESCALA DE LA RANA(y/o la pantalla) CUANDO GANA PUNTOS
	//Cada 10 puntos aumenta la escala
	if((juego.puntaje %10) == 0 && juego.puntaje > 10){
		SCENE_BASE_WIDTH += 13;
		resizeStage();
	}

	personaje.setScale({x:(juego.puntaje/100)+1,y:(juego.puntaje/100)+1});
	personaje.setWidth((personaje.getScale().x*40)/1);//0.4
	personaje.setHeight((personaje.getScale().y*40)/1);//0.4
	if(personaje.fuerzaSalto > -107){
		personaje.fuerzaSalto -= 0.07;//1
	}
	/*Revisa si el personaje esta moviendose a la derecha, izquierda o está en el centro
	para que siempre esté a una distancia de 20 px del centro (dependiendo el caso)*/
	if(scrollDer != -1 && scrollDer != 0){
		personaje.setX((SCENE_BASE_WIDTH/2)-(personaje.getWidth()/2)-20);
	}else if(scrollIzq != -1 && scrollIzq != 0){
		personaje.setX((SCENE_BASE_WIDTH/2)-(personaje.getWidth()/2)+20);
	}else{
		personaje.setX((SCENE_BASE_WIDTH/2)-(personaje.getWidth()/2));
	}
	//Se usa +10 para dejar (arriba de la rana) un rango de vision mas amplio
	personaje.setY(centroPantallaH-(personaje.getHeight()/2)+10);

	//Calcula PosX y PosY además envia la escala, ancho, alto y posicion al servidor
	emitMoving();
}


addKeyBoardEvents();

//Funcion que se ejecuta cada frame
function frameLoop(){
	aplicarFuerzas();
	detectarColObjetos();
	moverFondo();
	moverPersonaje();
	stage.draw();
}