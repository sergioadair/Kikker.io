function Enemigo(nm,x,y){
	/* Constructor de la clase que
	estamos heredando */
	Kinetic.Shape.call(this);
	//Propiedades del personaje
	this.setWidth(40);
	this.setHeight(40);
	this.setX(x);
	this.setY(y);
	this.contador = 0;
	this.nickname = nm;

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
	    context.moveTo(5, 0);
	    context.lineTo(13, 0);
	    context.lineTo(13, -6.5);//13 -8
	    context.lineTo(5, -8);

	    context.closePath();
	    canvas.fillStroke(this);

	    //CEJA IZQUIERDA
	    /*context.beginPath();
	    context.moveTo(6, -10);//6 -11
	    context.lineTo(16, -6.5);//16 -6.5
	    context.stroke();*/

	    //PUPILA IZQUIERDA
	    context.beginPath();
	    this.setFill('#560000');
	    context.moveTo(7, -1.5);//7 -2
	    context.lineTo(11, -1.5);//11 -2
	    context.lineTo(11, -5.5);//11 -6
	    context.lineTo(7, -5.5);//7 -6

	    context.closePath();
	    canvas.fillStroke(this);

	    //OJO DERECHO
	    context.beginPath();
	    this.setFill('white');
	    context.moveTo(27, 0);
	    context.lineTo(35, 0);
	    context.lineTo(35, -8);
	    context.lineTo(27, -6.5);//27 -8

	    context.closePath();
	    canvas.fillStroke(this);

	    //CEJA DERECHA
	    /*context.beginPath();
	    context.moveTo(34, -10);//34 -11
	    context.lineTo(24, -6.5);//24 -6.5
	    context.stroke();*/

	    //PUPILA DERECHA
	    context.beginPath();
	    this.setFill('#560000');
	    context.moveTo(29, -1.5);//29 -2
	    context.lineTo(33, -1.5);//33 -2
	    context.lineTo(33, -5.5);//33 -6
	    context.lineTo(29, -5.5);//33 -6

	    context.closePath();
	    canvas.fillStroke(this);

	    //BOCA
	    context.beginPath();
	    context.moveTo(18, 3);
	    context.bezierCurveTo(15,5,25,5,22,3);
		context.stroke();
		//------------------------------------//

		//PANZA
	    context.beginPath();
	    this.setFill('yellow');
	    context.moveTo(5, 40);
	    context.bezierCurveTo(5,20,35,20,35,40);
	    context.closePath();
	    canvas.fillStroke(this);

	    //NICKNAME
	    context.font = "20px Verdana";
	    context.fillStyle = "rgba(255, 46, 46, 0.7)";
	    context.textAlign = "center";
	    context.fillText(this.nickname,20,-15);
	}
	
}
//Heredar
Enemigo.prototype = Object.create(Kinetic.Shape.prototype);