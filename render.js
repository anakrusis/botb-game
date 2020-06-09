var flat_factor = 8;
var horizon_scanline = 32;
var scanline_size = 2;
var renderAngle;

var mapOrX = 500; // map canvas origin x/y
var mapOrY = 520;
var mapCanvW = 1000;
var mapCanvH = 640;

var canvOrX = 500; // main canvas origin/x/y
var canvOrY = 320;
var canvW = 1000;
var canvH = 640;

var redrawFlag = true; // this is a flag that gets set off whenever there is a change in perspective requiring a map redraw

var initSprites = function () {
	console.log("Initting sprite canvas ");
	for (q = 0; q < spriteCanvases.length; q++){
		spriteCanvases[q].init();
	}
}

var initMapDrawing = function () {

	texCanvas.width = map.width * 16;
	texCanvas.height = map.height * 16;
	data = map.layers[0].data;
	
	for (var i = 0; i < data.length; i++){
		tileVal = data[i] - 1

		sourcex = (tileVal % 16) * 16;
		sourcey = Math.floor(tileVal / 16) * 16;
		
		destx = (i % map.width) * 16;
		desty = Math.floor(i / map.width) * 16;
		
		texCtx.drawImage(tileset,sourcex,sourcey,16,16,destx,desty,16,16)
	}
}

var render = function () {
	ctx.fillStyle = "#000000";
	//ctx.fillStyle = "#FF00FF"; // deastl mode
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	renderAngle = 2 * Math.PI - cam_dir - Math.PI / 2
	
	if (map && redrawFlag) { // map render (top-down here, mode7 afterwards)
	
		mapCtx.clearRect(0,0,mapCanvas.width,mapCanvas.height)
		mapCtx.fillStyle = "#000000";
		mapCtx.fillRect(0,0,mapCanvas.width,mapCanvas.height);
		
		mapCtx.translate(mapOrX, mapOrY);
		mapCtx.rotate(renderAngle);
		
		// transfer map from texctx to mapctx here
		dx = tra_x_o(0, mapOrX) - mapOrX;
		dy = tra_y_o(0, mapOrY) - mapOrY;
		mapCtx.drawImage(texCanvas, dx, dy, map.width*16*cam_zoom, map.height*16*cam_zoom)
		
		redrawFlag = false;
		mapCtx.setTransform(1, 0, 0, 1, 0, 0);
	}

	for (i = 0; i < 640 * flat_factor; i+=flat_factor * scanline_size){ // here is the mode7 style transform from mapcanvas -> canvas
	
		scale = 1 + (i/640)
		sourceY = Math.round(i/scale);
		ctx.drawImage(mapCanvas, 0, sourceY, // source x y
		
		mapCanvW, 1, // source width height 
		
		canvOrX - (mapOrX * scale), horizon_scanline + i / flat_factor, // destination x y

		mapCanvW * scale, scanline_size); // destination width height
	}

	ls = loadedSong.ch[0];
	if (ls){
		for (i = 0; i < ls.pitches.length; i++){
			
			sx = -1; sy = -1;
			dy = 1000;
			if (ls.pitches[i] == 0){
				sx = 128; sy = 256;
				dy = 600;
			}else if (ls.pitches[i] == 1){
				sx = 160; sy = 256;
				dy = 580;
			}else if (ls.pitches[i] == 2){
				sx = 144; sy = 256;
				dy = 560;
			}
			nowLine = 800;
			
			ctx.fillRect(800, 520, 2, 200)
			ctx.drawImage(tileset,sx,sy,16,16,nowLine - ( ls.times[i] - loadedSong.time ) * 2,dy,32,32)
		}
	}
}