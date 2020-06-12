class Entity {
	constructor(){
		this.name = "Entity";
		this.x = 0;
		this.y = 0;
		this.altitude = 0;
		
		this.texture = 0;
		
		this.height = 64;
		this.width = 64;
		this.shadow = true;
	}
}

class Event {
	constructor( id, time ){
		this.id = id;
		this.time = time;
		this.param1 = 0;
		this.param2 = 0;
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
	
	if (66 in keysDown){
		if (soundInitted){
			loadedSong.time = loadedSong.ch[0].times[1];
			songPlaying.currentTime = loadedSong.ch[0].times[1] / 60;
			loadedSong.nextNote[0] = 0;
		}
	}
	
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
				globalTime = 0;
				
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
	if (keybind_MIDDLE in keysDown){
		if (!x_pressed && x_released) {
			x_pressed = true; x_released = false;
			noteHit(1);
		}
		x_pressed = false;
	}
	if (keybind_BOTTOM in keysDown){
		if (!z_pressed && z_released) {
			z_pressed = true; z_released = false;
			noteHit(0);
		}
		z_pressed = false;
	}
	
	if (!space_pressed && 32 in keysDown == false){
		space_released = true;
	}
	if (!c_pressed && keybind_TOP in keysDown == false){
		c_released = true;
	}
	if (!x_pressed && keybind_MIDDLE in keysDown == false){
		x_released = true;
	}
	if (!z_pressed && keybind_BOTTOM in keysDown == false){
		z_released = true;
	}
	
	songTick();
	if (screen == "main"){
		globalTime++;
	}
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
	globalTime = 0;
	
	rooms = []
	for (i = 0; i < 5; i++){
		
		rooms[i] = {name:"Room"+i};
		rooms[i].entities = [];
		rooms[i].tileset = tileset;
		rooms[i].floor = TileMaps.floor;
		rooms[i].song = song_TEST;
		
	}
	rooms[0].tileset = img_TILESET2.canvas;
	rooms[0].floor = TileMaps.school;
	
	rooms[1].tileset = img_TILESET2.canvas;
	rooms[1].floor = TileMaps.forest;
	rooms[1].song = song_LEVEL1;
	
	e = new Entity();
	e.x = 240; e.y = 240;e.texture=7;
	rooms[0].entities.push( e ) // added a toadette to school
	
	e = new Entity();
	e.x = 240; e.y = 240;e.texture=6;
	rooms[1].entities.push( e ) // added a miau to forest
	
	for (i = 0; i < 8; i++){
		e = new Entity();
		e.x = 64 + i * 64; e.y = 128 + (Math.sin(i) * 64); e.width = 24; e.height = 64; e.texture = 5;
		rooms[1].entities.push( e ); // tree test
		
		e = new Entity();
		e.x = 64 + i * 64; e.y = 320 + (Math.sin(i) * 64); e.width = 24; e.height = 64; e.texture = 5;
		rooms[1].entities.push( e ); // tree test
		
		e = new Entity();
		e.x = Math.random() * 512; e.y = Math.random() * 512;
		e.texture = tileset; e.width = 8; e.height = 8;
		e.sourceWidth = 16; e.sourceHeight = 16;
		e.sourceX = 128; e.sourceY = 48;
		rooms[1].entities.push( e ); // mushroom test
	}
	
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
		songPlaying.pause();
	}
}

window.onfocus = function(){
	if (soundInitted){
		songPlaying.play();
	}
}

document.addEventListener('DOMContentLoaded', function(e) {

	tileset.onload = function(){
		initSprites();
		init();
		redrawFlag = false;
	}
});
