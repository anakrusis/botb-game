class Button {
	constructor ( x, y, text ){
		this.x = x;
		this.y = y;
		this.width = 512;
		this.height = 64;
		this.text = text;
		
		this.onClick = function(){};
	}
}

class Resluts {
	constructor( score ){
		this.playerNames = [];
		this.songNames = [];
		
		for (i = 1; i < 7; i++){
			this.playerNames[i] = BOTBR_NAME_PARODIES[Math.floor(Math.random() * BOTBR_NAME_PARODIES.length)]
			this.songNames[i] = SONG_NAME_PARODIES[Math.floor(Math.random() * SONG_NAME_PARODIES.length)]
			
			if (Math.random() > 0.99){
				this.songNames[i] += ".ftm" // 1 percent chance of a botbr submitting an ftm to an nsf ohb
			}else{
				this.songNames[i] += ".nsf"
			}
		}
		this.playerNames[3] = "hanna"; // Cameo appearance
		
		var playerIndex = -1;
		
		// determines if you get gold, silver, bronze, tincan or nothing
		if (score >= 33){
			playerIndex = 1;
		} else if (score >= 30){
			playerIndex = 2;
		} else if (score >= 25){
			playerIndex = 3;
		} else if (score >= 20){
			playerIndex = 4;
		} else if (score >= 15){
			playerIndex = 5;
		} else{
			playerIndex = 6;
		}
		
		this.playerNames[playerIndex] = "YOU" // replace with real player name
		//this.songNames[playerIndex] = rooms[currentRoom].name;
	}
}

var distance = function( x1, y1, x2, y2 ) {
	return Math.hypot(x2 - x1, y2 - y1);
}

var update = function (delta) {
	t = 4
	
	if (66 in keysDown){
		if (screen == screen_MAIN){
			onResluts();
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
		
		}else if (cam_unlock){
			cam_y += 4 * Math.sin(cam_dir);
			cam_x += 4 * Math.cos(cam_dir);
			redrawFlag = true;
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
	
	if (screen == screen_MAIN){
	
		CAMSPEED = 1000;
		RADIUS = rooms[currentRoom].radius;
		cam_x = rooms[currentRoom].centerX + Math.cos( globalTime / CAMSPEED ) * RADIUS
		cam_y = rooms[currentRoom].centerY + Math.sin( globalTime / CAMSPEED ) * RADIUS
		cam_dir = Math.atan2(rooms[currentRoom].centerY - cam_y, rooms[currentRoom].centerX - cam_x);
		redrawFlag = true;
		
		songTick();
		globalTime++;
	}else{
		if (songPlaying){ songPlaying.pause();}
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
	
	canvas.addEventListener('click', function (event) {
		// Thanks to patriques for this solution to something that shouldnt need to happen in javascript
		const rect = canvas.getBoundingClientRect()
		const mouseX = event.clientX - rect.left
		const mouseY = event.clientY - rect.top
		
		for (i = 0; i < screen.elements.length; i++){
			
			btn = screen.elements[i];
			if ( btn.x <= mouseX && mouseX <= btn.x + btn.width && 
				 btn.y <= mouseY && mouseY <= btn.y + btn.height ){

				btn.onClick();
			}				
		}
	});
	
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

	cam_unlock = true;
	currentRoom = 0;
	roomSelect = 0;
	globalTime = 0;
	
	unlocked = [true, true, true, true, true, true];
	
	resluts = [];
	
	initRooms();
	soundPlayerInit();
	
	screen_MENU = {
	
		elements: []
	
	}
	screen_MAIN = {
	
		elements: []
		
	}
	
	screen_RESLUTS = {
		
		elements: []
		
	}
	
	screen_CUSTOM = {
		elements: []
	}	
	
	for (i = 0; i < rooms.length; i++){
		bt = new Button ( 192, 172 + i*72, rooms[i].name )
		bt.width = 640;
		
		bt.onClick = function () {
			if (unlocked[i]){
				loadRoom(i);
			}
		}
		
		screen_MENU.elements.push ( bt );
	}
	b = new Button(400, 532, "Custom Songs..."); b.width = 256
	screen_MENU.elements.push ( b );
	
	screen = screen_MENU;

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

var loadRoom = function( roomID ) {
	screen = screen_MAIN;
	currentRoom = roomID;
	initMapDrawing();
	redrawFlag = true;
	globalTime = 0;
		
	loadSong(rooms[currentRoom].song);
	playDialog(rooms[currentRoom].dialogStart);
}

var onResluts = function() {
	//screen = screen_RESLUTS;
	songPlaying.pause();
	
	score = loadedSong.liek / (loadedSong.liek + loadedSong.haeit) * 35;
	if (loadedSong.liek + loadedSong.haeit == 0){ score = 0; }; // case with 0 denominator
	
	resluts[currentRoom] = new Resluts(score);
	
	screen_RESLUTS.elements = [];
	
	for ( i = 1; i < 7; i++ ){
		bt = new Button ( 192, 100 + i*72, resluts[currentRoom].playerNames[i] + " - " + resluts[currentRoom].songNames[i] );
		bt.width = 640;
		screen_RESLUTS.elements.push ( bt );
	}
	
	nextButton = new Button ( 16, 560, "Next battle"); nextButton.width = 144;
	menuButton = new Button ( 840, 560, "Menu"); menuButton.width = 128;
	menuButton.onClick = function(){ screen = screen_MENU; }
	
	if (score < 20){
		nextButton.text = "Try again";
		nextButton.onClick = function(){ loadRoom(currentRoom) };
		
		dialo = rooms[currentRoom].dialogBad;
		
	} else {
		nextButton.onClick = function(){ loadRoom(currentRoom + 1) };
		unlocked[currentRoom + 1] = true;
		
		dialo = rooms[currentRoom].dialogGood;
	}
	if (dialo){
		playDialog(dialo);
		dialo.onended = function(){
			screen = screen_RESLUTS;
		}
	}else{
		screen = screen_RESLUTS;
	}
	
	if (score > rooms[currentRoom].bestScore || rooms[currentRoom].bestScore === undefined){
		rooms[currentRoom].bestScore = score;
	}
	
	
	if (currentRoom + 1 < rooms.length){
	screen_RESLUTS.elements.push(nextButton);
	};	
	screen_RESLUTS.elements.push(menuButton);
}

document.addEventListener('DOMContentLoaded', function(e) {

	tileset.onload = function(){
		initSprites();
		init();
		redrawFlag = false;
	}
});
