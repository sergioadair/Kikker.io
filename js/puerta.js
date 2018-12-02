function Puerta(x,y,imagen){
	/* Constructor de la clase que
	estamos heredando */
	Kinetic.Image.call(this);
	//Propiedades de la puerta
	this.setWidth(30);
	this.setHeight(70);
	this.setX(x);
	this.setY(y);
	this.setImage(imagen);
}
//Heredar
Puerta.prototype = Object.create(Kinetic.Image.prototype);