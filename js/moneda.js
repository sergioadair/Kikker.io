function Moneda(x,y){
	/* Constructor de la clase que
	estamos heredando */
	Kinetic.Shape.call(this);
	//Propiedades de la moneda
	this.setWidth(30);//30
	this.setHeight(30);//30
	this.setX(x);
	this.setY(y);
	//this.setImage(imagen);

	this.attrs.drawFunc = function(canvas) {
		var context = canvas.getContext("2d");

		//RESPLANDOR
		/*
		context.shadowBlur = 20;
	    //context.shadowOffsetX = 0;
	    //context.shadowOffsetY = 0;
	    context.shadowColor= "green";*/

		//BOLA GRANDE
		context.beginPath();
		this.setFill('white');
		context.arc(15,15,15,0,2*Math.PI);
		context.lineWidth = 5;
		context.strokeStyle = '#BFF0FF';
		context.stroke();
		canvas.fillStroke(this);

		//BOLA INTERIOR
		/*
		context.beginPath();
		this.setFill('black');
		context.arc(15,15,7.5,0,2*Math.PI);
		canvas.fillStroke(this);*/

	}
}
//Heredar
Moneda.prototype = Object.create(Kinetic.Shape.prototype);