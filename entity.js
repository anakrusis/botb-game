class Entity {
	constructor(x, y){
		this.name = "Entity";
		this.x = x;
		this.y = y;
		this.altitude = 0;
		
		this.texture = 0;
		
		this.height = 64;
		this.width = 64;
		this.shadow = true;
	}
	
	update() {
	
	}
}

class Tree extends Entity {
	constructor(x, y){
		super(x, y);
		this.width = 32; this.height = 72; this.texture = 5;
	}
}

class Mushroom extends Entity {
	constructor(x, y){
		super(x, y);
		this.texture = tileset; this.width = 8; this.height = 8;
		this.sourceWidth = 16; this.sourceHeight = 16;
		this.sourceX = 128; this.sourceY = 48;
	}
}

var generateWall = function( room, startX, startY, endX, endY, height, texture, texWidth ) {
	WIDTH = 1;
	COL_AMT = 2 + distance( startX, startY, endX, endY ) / WIDTH
	
	for (i = 0; i < COL_AMT; i++) {
		dx = ( (startX * (COL_AMT-i)) + (endX * i) ) / COL_AMT
		dy = ( (startY * (COL_AMT-i)) + (endY * i) ) / COL_AMT
			
		e = new Entity(dx, dy);
		e.width = WIDTH; e.height = height;
		e.texture = texture;
		
		// replace 1 with ( texWidth / (height/WIDTH) for repeated tiling
		e.sourceX =  Math.floor( (i * WIDTH)  % texWidth )
		e.sourceWidth = 1
		
		rooms[room].entities.push( e )
	}
}