function Heroe(x,y){
	/* Constructor de la clase que
	estamos heredando */
	Kinetic.Shape.call(this);
	//Propiedades del personaje
	this.setX(x);
	this.setY(y);
	//this.setRadius(40);
	this.setWidth(40);
	this.setHeight(40);
	//this.setFill('green');
	/*var circle = new Kinetic.Circle({
		x: this.getX()+(this.getWidth()/2),
		y: stage.getHeight()-this.getHeight()*2,
		radius: 5,
		fill: 'white'
		//stroke: 'black'
		//strokeWidth: 5
	});*/

	this.attrs.drawFunc = function(canvas) {
	    var context = canvas.getContext("2d");
	    //CUERPO
	    context.beginPath();
	    this.setFill('green');
	    context.moveTo(5, 0);
	    context.lineTo(35, 0);
	    context.quadraticCurveTo(40, 0, 40, 5);
	    context.lineTo(40, 35);
	    context.quadraticCurveTo(40, 40, 35, 40);
	    context.lineTo(5, 40);
	    context.quadraticCurveTo(0, 40, 0, 35);
	    context.lineTo(0,5);
	    context.quadraticCurveTo(0, 0, 5, 0);
	    context.closePath();
	    canvas.fillStroke(this);
	    //context.quadraticCurveTo(300, 100, 260, 170);

	    //OJO IZQUIERDO
	    context.beginPath();
	    this.setFill('white');
	    //Pegado
	    /*context.moveTo(10, 0);
	    context.lineTo(18, 0);
	    context.lineTo(18, -8);
	    context.lineTo(10, -8);*/
	    //Separado
	    context.moveTo(5, 0);
	    context.lineTo(13, 0);
	    context.lineTo(13, -6);
	    context.quadraticCurveTo(13, -8, 11, -8);
	    context.lineTo(7, -8);
	    context.quadraticCurveTo(5, -8, 5, -6);
	    context.lineTo(5, 0);

	    context.closePath();
	    canvas.fillStroke(this);

	    //OJO DERECHO
	    context.beginPath();
	    this.setFill('white');
	    //Pegado
	    /*context.moveTo(22, 0);
	    context.lineTo(30, 0);
	    context.lineTo(30, -8);
	    context.lineTo(22, -8);*/
	    //Separado
	    context.moveTo(27, 0);
	    context.lineTo(35, 0);
	    context.lineTo(35, -6);
	    context.quadraticCurveTo(35, -8, 33, -8);
	    context.lineTo(29, -8);
	    context.quadraticCurveTo(27, -8, 27, -6);
	    context.lineTo(27, 0);

	    context.closePath();
	    canvas.fillStroke(this);

	    //PUPILA IZQUIERDA
	    context.beginPath();
	    this.setFill('black');
	    //Pegado
	    /*context.moveTo(12, -2);
	    context.lineTo(16, -2);
	    context.lineTo(16, -6);
	    context.lineTo(12, -6);*/
	    //Separado
	    context.moveTo(8, -2);
	    context.lineTo(10, -2);
	    context.quadraticCurveTo(11, -2, 11, -3);
	    context.lineTo(11, -5);
	    context.quadraticCurveTo(11, -6, 10, -6);
	    context.lineTo(8, -6);
	    context.quadraticCurveTo(7, -6, 7, -5);
	    context.lineTo(7, -3);
	    context.quadraticCurveTo(7, -2, 8, -2);

	    context.closePath();
	    canvas.fillStroke(this);

	    //PUPILA DERECHA
	    context.beginPath();
	    this.setFill('black');
	    //Pegado
	    /*context.moveTo(24, -2);
	    context.lineTo(28, -2);
	    context.lineTo(28, -6);
	    context.lineTo(24, -6);*/
	    //Separado
	    context.moveTo(30, -2);
	    context.lineTo(32, -2);
	    context.quadraticCurveTo(33, -2, 33, -3);
	    context.lineTo(33, -5);
	    context.quadraticCurveTo(33, -6, 32, -6);
	    context.lineTo(30, -6);
	    context.quadraticCurveTo(29, -6, 29, -5);
	    context.lineTo(29, -3);
	    context.quadraticCurveTo(29, -2, 30, -2);

	    context.closePath();
	    canvas.fillStroke(this);

	    //BOCA
	    context.beginPath();
	    //boca de medio circulo
	    //context.arc(20,10,10,0,1*Math.PI);
	    //boca ancha y corta de altura
	    context.moveTo(18, 3);
	    context.bezierCurveTo(15,5,25,5,22,3);
	    //boca kawaii
	    /*context.moveTo(16, 3);
	    context.quadraticCurveTo(15, 7, 20.5, 4);
		context.stroke();

		context.beginPath();
		context.moveTo(19.5, 4);
	    context.quadraticCurveTo(25, 7, 24, 3);*/
		context.stroke();
		//------------------------------------//

		//PANZA
	    context.beginPath();
	    this.setFill('yellow');
	    context.moveTo(5, 40);
	    //panza con 1 punto de control
	    //context.quadraticCurveTo(20, 20, 35, 40);
	    //panza con 2 puntos de control
	    context.bezierCurveTo(5,20,35,20,35,40);
	    context.closePath();
	    canvas.fillStroke(this);
	}
	
	this.estaSaltando = false;
	this.vx = 20; //La verdadera velocidad esta en la funcion moverFondo del Main
	this.vy = 0;
	this.limiteDer = 1305;
	this.limiteTope = 0;
	this.direccion = 1;
	this.contador = 0;
	this.fuerzaSalto = -30;//-20//-25
	//Frames del sprite
	this.attrs.frameRate = 20;

	//EL LIMITE DEL SUELO DEBE SER -2000

	this.caminar = function(){

		
	}
	this.retroceder = function(){

	}
	this.saltar = function(){
		this.estaSaltando = true;
		if(this.vy <= 2){
			//this.setAnimation('salto');
			this.vy = -this.fuerzaSalto;
			this.contador++;
			//Cuando se termina la animacion de salto, pone otra animacion.
			//mejor poner la animacion cuando toque el suelo :S
			/*this.afterFrame(1,function(){
				this.setAnimation('saltoEstatico');
			});*/
		}
	}

	this.aplicarGravedad = function(gravedad,vRebote){
		if(puedeMoverF == true){
			//Variable para calcular cuanto equivalen los px del piso en la escala del stage, aplicados al background
			/* La operacion es para ralentizar el movimiento del fondo */
			var pxEscaladosY = ((scale.y*piso.getY())/2.5)/1;
			this.vy -= gravedad;
			//Este if es para que la rana pueda matar tambien cuando solo cae de una plataforma
			if(this.vy != 0){
				this.estaSaltando = true;
			}
			//this.move(0,this.vy);
			
			/* Se mandan los valores de posicion al fondo */
			divJuego.style.backgroundPosition = backPosx+"px "+pxEscaladosY+"px";
				//aqui sacar una PosY de las plataformas
				for(i in objetos){
					var asset = objetos[i];
					//Quitar este if para que se le aplique gravedad a los enemigos
					//if(!(asset instanceof Enemigo)){
						asset.move(0,this.vy);
					//}
				}

			//Regresa al personaje si se pasa del limite(suelo)
			if(piso.getY() <= (this.getY() + this.getHeight())){
				this.contador = 0;
				//Bug de los assets movidos
				posYP = piso.getY()-(this.getY() + this.getHeight());
				piso.setY(this.getY() + this.getHeight()); 
					for(i in objetos){
						var asset = objetos[i];
						if(asset != piso){
							asset.setY(asset.getY()-posYP);
						}
					}
				this.vy = 0;
			}
		}
	}

}
//Heredar
Heroe.prototype = Object.create(Kinetic.Shape.prototype);