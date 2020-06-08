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
}

var keysDown = {};
tileset = new Image(); tileset.src = "sprites.png";

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
	map = TileMaps.floor;
	cam_unlock = true;

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

document.addEventListener('DOMContentLoaded', function(e) {
	init();
	tileset.onload = function(){
		initMapDrawing();
	}
});
