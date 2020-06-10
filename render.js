var flat_factor = 12;
var horizon_scanline = 96;
var scanline_size = 2;
var renderAngle;

var mapOrX = 500; // map canvas origin x/y
var mapOrY = 520;
var mapCanvW = 1000;
var mapCanvH = 640;

var canvOrX = 500; // main canvas origin/x/y
var canvOrY = 220;
var canvW = 1000;
var canvH = 640;

var redrawFlag = true; // this is a flag that gets set off whenever there is a change in perspective requiring a map redraw

var rotatedX = function(x, y){
	tx = tra_x_o( x, mapOrX ) - mapOrX;
	ty = tra_y_o( y, mapOrY ) - mapOrY;
	return rot_x(renderAngle, tx, ty) + mapOrX; 
	
}

var rotatedY = function(x, y){
	tx = tra_x_o( x, mapOrX ) - mapOrX;
	ty = tra_y_o( y, mapOrY ) - mapOrY;
	return rot_y(renderAngle, tx, ty) + mapOrY;
}

var scaledX = function (x, y){

	rx = rotatedX(x, y); ry = rotatedY(x, y);

	line = (canvH * ry) / (-ry + canvH) // This is the algebraic inverse of the map drawing code
	scale = 1 + (line / canvH)
	return ((rx - mapOrX ) * scale * (canvW / mapCanvW) + canvOrX)
	//return (rx - mapOrX) * scale + canvOrX
}

var scaledY = function (x, y){
	
	rx = rotatedX(x, y); ry = rotatedY(x, y);

	line = (canvH * ry) / (-ry + canvH)
	scale = 1 + (line / canvH)
	return horizon_scanline + line / flat_factor
}

var compareHeightVal = function (entity1, entity2){

	sy1 = scaledY(entity1.x, entity1.y);
	sy2 = scaledY(entity2.x, entity2.y);
	
	return sy1 - sy2;
}

var initSprites = function () {
	console.log("Initializing sprite canvas.");
	for (q = 0; q < spriteCanvases.length; q++){
		spriteCanvases[q].init();
	}
}

var initMapDrawing = function () {

	map = rooms[currentRoom].floor;

	texCanvas.width = map.width * 16;
	texCanvas.height = map.height * 16;
	data = map.layers[0].data;
	
	for (var i = 0; i < data.length; i++){
		tileVal = data[i] - 1

		sourcex = (tileVal % 16) * 16;
		sourcey = Math.floor(tileVal / 16) * 16;
		
		destx = (i % map.width) * 16;
		desty = Math.floor(i / map.width) * 16;
		
		texCtx.drawImage(rooms[currentRoom].tileset,sourcex,sourcey,16,16,destx,desty,16,16)
	}
}

var renderEntity = function (entity, x_offset, y_offset) {
	
	rx = rotatedX(entity.x, entity.y);// rotated x/y
	ry = rotatedY(entity.x, entity.y);
	sx = scaledX(entity.x, entity.y); // scaled x/y
	sy = scaledY(entity.x, entity.y);
	sx -= (entity.width / 2) * cam_zoom * scale;
	sy -= entity.height * cam_zoom * scale; // To draw at the bottom left corner
	
	if (sy > horizon_scanline - ( entity.height * cam_zoom * scale) && 
		sx >= 0 && sx <= canvW){ // Culling past the horizon
		
		if (entity.shadow){
			//ctx.drawImage(texture_SHADOW, sx, sy + entity.height * cam_zoom * scale * 0.95, entity.width * cam_zoom * scale, 1 * cam_zoom * scale)	
		}
		
		if (entity.altitude){
			sy -= (entity.altitude * cam_zoom * scale);
		}
		// the real drawing
		entityCanv = spriteCanvases[entity.texture].canvas;
		if (entityCanv){
		
			if (entity.sourceX && entity.sourceWidth){
				ctx.drawImage(entityCanv, 
				
				entity.sourceX, 0, entity.sourceWidth, entityCanv.height,
				
				sx, sy, entity.width * cam_zoom * scale, entity.height * cam_zoom * scale)
			}else{
				ctx.drawImage(entityCanv, sx, sy, entity.width * cam_zoom * scale, entity.height * cam_zoom * scale)
			}
		}
		//ctx.drawImage(tileset, sx, sy, entity.width * cam_zoom * scale, entity.height * cam_zoom * scale)
	}
}

var render = function () {
	ctx.fillStyle = "#000000";
	//ctx.fillStyle = "#FF00FF"; // deastl mode
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	renderAngle = 2 * Math.PI - cam_dir - Math.PI / 2
	
	entityRenderList = [];
	
	map = rooms[currentRoom].floor;
	
	ctx.fillStyle = "#ffffff"
	ctx.font = "24px Verdana";
	
	if (screen == "menu"){

		scrn = TileMaps.menu;
		data = scrn.layers[0].data;
	
		for (var i = 0; i < data.length; i++){
			tileVal = data[i] - 1

			sourcex = (tileVal % 16) * 16;
			sourcey = Math.floor(tileVal / 16) * 16;
			
			destx = (i % scrn.width) * 16;
			desty = Math.floor(i / scrn.width) * 16;
			
			ctx.drawImage(tileset,sourcex,sourcey,16,16,destx*2,desty*2,32,32)
		}
		
		for (i = 0; i < rooms.length; i ++){
			txt = ""
			if (roomSelect == i){
				txt = ">"
			}
			txt += rooms[i].name;
			ctx.fillText(txt, 256, 64*i + 256);
		}
	
	} else if (screen == "main"){
	
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

		for (i = 0; i < 420 * flat_factor; i+=flat_factor * scanline_size){ // here is the mode7 style transform from mapcanvas -> canvas
		
			scale = 1 + (i/640)
			sourceY = Math.round(i/scale);
			ctx.drawImage(mapCanvas, 0, sourceY, // source x y
			
			mapCanvW, 1, // source width height 
			
			canvOrX - (mapOrX * scale), horizon_scanline + i / flat_factor, // destination x y

			mapCanvW * scale, scanline_size); // destination width height
		}
		
		for (i in rooms[currentRoom].entities){
			entityRenderList.push(rooms[currentRoom].entities[i]);
		}
		entityRenderList.sort(compareHeightVal);
		for (var i = 0; i < entityRenderList.length; i++){
			renderEntity( entityRenderList[i], 0, 0);
		}

		ls = loadedSong.ch[0];
		if (ls){
			nowLine = 800;
			
			// The now line is just the midi format icon but really squashed
			ctx.drawImage(tileset, 224, 32, 16, 16, nowLine+8, 512, 16, 128)
				
			for (i = 0; i < ls.pitches.length; i++){
				
				sx = -1; sy = -1;
				dy = 1000;
				if (ls.pitches[i] == 0){
					sx = 128; sy = 256;
					dy = 600;
				}else if (ls.pitches[i] == 1){
					sx = 160; sy = 256;
					dy = 560;
				}else if (ls.pitches[i] == 2){
					sx = 144; sy = 256;
					dy = 520;
				}
				ctx.drawImage(tileset,sx,sy,16,16,nowLine - ( ls.times[i] - loadedSong.time ) * 4,dy,32,32)
			}
		}
		
		ctx.fillText( loadedSong.nextPitch[0], 32, 32)
	}
}