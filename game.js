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
	COL_AMT = 2 + distance( startX, startY, endX, endY ) / WIDTH
	
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
		}
	}
	if (68 in keysDown) { // right
		if (cam_unlock){
			cam_dir += Math.PI / 32;
			redrawFlag = true;
		}
	}
	
	if (87 in keysDown) { // up
		
		if (screen == "menu"){
			roomSelect--;
			delete keysDown[87];
		
		}else if (screen == "main"){
		
			if (cam_unlock){
				cam_y += 4 * Math.sin(cam_dir);
				cam_x += 4 * Math.cos(cam_dir);
				redrawFlag = true;
			}
		}
	}
	if (83 in keysDown) { // down
	
		if (screen == "menu"){
			roomSelect++;
			delete keysDown[83];
		
		}else if (cam_unlock){
			cam_y -= 4 * Math.sin(cam_dir);
			cam_x -= 4 * Math.cos(cam_dir);
			redrawFlag = true;
		}
	}
	if (32 in keysDown) {
		if (!space_pressed && space_released) {
			space_pressed = true; space_released = false;
			
			if (screen == "menu"){
				screen = "main";
				currentRoom = roomSelect;
				initMapDrawing();
				redrawFlag = true;
				
				soundPlayerInit();
				loadSong(rooms[currentRoom].song);
			}
			
			space_pressed = false;
		}
	}
	if (keybind_TOP in keysDown){
		if (!c_pressed && c_released) {
			c_pressed = true; c_released = false;
			noteHit(2);
		}
		c_pressed = false;
	}
	
	if (!space_pressed && 32 in keysDown == false){
		space_released = true;
	}
	if (!c_pressed && keybind_TOP in keysDown == false){
		c_released = true;
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
	
	space_pressed = false; space_released = true;
	z_pressed = false;     z_released = true;
	x_pressed = false;     x_released = true;
	c_pressed = false;     c_released = true;

	screen = "menu";
	cam_unlock = true;
	currentRoom = 0;
	roomSelect = 0;
	
	rooms = []
	for (i = 0; i < 5; i++){
		
		rooms[i] = {name:"Room"+i};
		rooms[i].entities = [];
		rooms[i].tileset = tileset;
		rooms[i].floor = TileMaps.floor;
		rooms[i].song = song_TEST;
		
	}
	rooms[1].tileset = img_TILESET2.canvas;
	rooms[1].floor = TileMaps.forest;
	
	e = new Entity();
	e.x = 240; e.y = 240;
	rooms[0].entities.push( e ) // added a toadette to school
	
	generateWall(0, 128, 128, 372, 128, 48, 1, 192) // school walls
	generateWall(0, 128, 128, 0,   256, 48, 2, 192)
	generateWall(0, 372, 128, 500, 256, 48, 2, 192)
	
	generateWall(3, 128, 128, 372, 128, 48, 3, 192) // factory walls
	generateWall(3, 128, 128, 0,   256, 48, 3, 192)
	generateWall(3, 372, 128, 500, 256, 48, 3, 192)

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
		initSprites();
		init();
		redrawFlag = false;
	}
});
