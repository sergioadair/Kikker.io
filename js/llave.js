function Llave(x,y,img){
	/* Constructor de la clase que
	estamos heredando */
	Kinetic.Image.call(this);
	//Propiedades de la llave
	this.setWidth(30);
	this.setHeight(40);
	this.setX(x);
	this.setY(y);
	this.setImage(img);
}
//Heredar
Llave.prototype = Object.create(Kinetic.Image.prototype);