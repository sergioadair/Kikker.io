function Fondo(x,y,imagen){
		/* Constructor de la clase que
	estamos heredando */
	Kinetic.Rect.call(this);
	//Propiedades de la plataforma
	this.setWidth(4000);
	this.setHeight(4000);
	this.setX(x);
	this.setY(y);	
	this.setFillPatternImage(imagen);
}
//Heredar
Fondo.prototype = Object.create(Kinetic.Rect.prototype);