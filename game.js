class Entity {
	constructor(){
		this.name = "Entity";
		this.x = 0;
		this.y = 0;
		this.altitude = 0;
		
		this.texture = 0;
		
		this.height = 48;
		this.width = 36;
		this.shadow = true;
	}
}

var distance = function( x1, y1, x2, y2 ) {
	return Math.hypot(x2 - x1, y2 - y1);
}

var generateWall = function( room, startX, startY, endX, endY, height, texture, texWidth ) {
	WIDTH = 1;
	COL_AMT = distance( startX, startY, endX, endY ) / WIDTH
	
	for (i = 0; i < COL_AMT; i++) {
		dx = ( (startX * (COL_AMT-i)) + (endX * i) ) / COL_AMT
		dy = ( (startY * (COL_AMT-i)) + (endY * i) ) / COL_AMT
			
		e = new Entity();
		e.x = dx; e.y = dy;
		e.width = WIDTH; e.height = height;
		e.texture = texture;
		
		// replace 1 with ( texWidth / (height/WIDTH) for repeated tiling
		e.sourceX =  Math.floor( (i * WIDTH)  % texWidth )
		e.sourceWidth = 1
		
		rooms[room].entities.push( e )
	}
}

var update = function (delta) {
	t = 4
	if (65 in keysDown) { // left	
		if (cam_unlock){
			cam_dir -= Math.PI / 32;
			redrawFlag = true;
			soundPlayerInit();
			loadSong(song_TEST);
		}
	}
	if (68 in keysDown) { // right
		if (cam_unlock){
			cam_dir += Math.PI / 32;
			redrawFlag = true;
		}
	}
	
	if (87 in keysDown) { // up
		if (cam_unlock){
			cam_y += 4 * Math.sin(cam_dir);
			cam_x += 4 * Math.cos(cam_dir);
			redrawFlag = true;
		}
	}
	if (83 in keysDown) { // down
		if (cam_unlock){
			cam_y -= 4 * Math.sin(cam_dir);
			cam_x -= 4 * Math.cos(cam_dir);
			redrawFlag = true;
		}
	}
	songTick();
}

var keysDown = {};
tileset = new Image(); tileset.src = "./img/botb-spritesheet.png";

var init = function () {

	// Main canvas for rendering
	canvas = document.getElementById("Canvas");
	canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto; border:1px solid #000000;"
	ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	
	mapCanvas = document.getElementById("MapCanvas");
	mapCtx = mapCanvas.getContext("2d");
	mapCtx.imageSmoothingEnabled = false;
	
	texCanvas = document.getElementById("TexCanvas");
	texCtx = texCanvas.getContext("2d");
	texCtx.imageSmoothingEnabled = false;
	
	addEventListener("keydown", function (e) { // when a key is pressed
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) { // when a key is unpressed
		delete keysDown[e.keyCode];
	}, false);

	screen = "main";
	cam_unlock = true;
	currentRoom = 0;
	
	rooms = []
	for (i = 0; i < 5; i++){
		
		rooms[i] = {};
		rooms[i].entities = [];
		
	}
	rooms[0].floor = TileMaps.floor;
	
	e = new Entity();
	e.x = 240; e.y = 240;
	rooms[0].entities.push( e )
	
	generateWall(0, 128, 128, 372, 128, 48, 1, 192)
	generateWall(0, 128, 128, 0,   256, 48, 2, 192)
	generateWall(0, 372, 128, 500, 256, 48, 2, 192)
	
	map = rooms[currentRoom].floor;

	// main loop
	var main = function () {
		var now = Date.now();
		var delta = now - then;

		update(delta);
		render();
		
		then = now;
		requestAnimationFrame(main);
	};
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

	var then = performance.now();
	main();
}

window.onblur = function(){
	if (soundInitted){
		sng_TEST.pause();
	}
}

window.onfocus = function(){
	if (soundInitted){
		sng_TEST.play();
	}
}

document.addEventListener('DOMContentLoaded', function(e) {

	tileset.onload = function(){
		init();
		initSprites();
		initMapDrawing();
		redrawFlag = true;
	}
});
