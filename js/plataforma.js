function Plataforma(x,y,imagen){
		/* Constructor de la clase que
	estamos heredando */
	Kinetic.Rect.call(this);
	//Propiedades de la plataforma
	this.setWidth(200);
	this.setHeight(40);
	this.setX(x);
	this.setY(y);	
	this.setFillPatternImage(imagen);
}
//Heredar
Plataforma.prototype = Object.create(Kinetic.Rect.prototype);