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

var captionsOn = false;
var captionTxt = "";

var titleCount = -160;

var titleScanline = 0;

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
		sx >= 0-(entity.width*cam_zoom*scale) && sx <= canvW){ // Culling past the horizon
		
		if (entity.shadow){
			//ctx.drawImage(texture_SHADOW, sx, sy + entity.height * cam_zoom * scale * 0.95, entity.width * cam_zoom * scale, 1 * cam_zoom * scale)	
		}
		
		if (entity.altitude){
			sy -= (entity.altitude * cam_zoom * scale);
		}
		// the real drawing
		if (entity.texture == tileset){
			entityCanv = tileset;
		}else{
			entityCanv = spriteCanvases[entity.texture].canvas;
		}
		if (entityCanv){
		
			if (entity.sourceX && entity.sourceWidth){
			
				if (entity.sourceY && entity.sourceHeight){ // entities that render based on a quad
				
					ctx.drawImage(entityCanv, 
					
					entity.sourceX, entity.sourceY, entity.sourceWidth, entity.sourceHeight,
					
					sx, sy, entity.width * cam_zoom * scale, entity.height * cam_zoom * scale)
					
					
				}else{                          // used for walls (horizontal stripes, full vertical span)
					ctx.drawImage(entityCanv, 
					
					entity.sourceX, 0, entity.sourceWidth, entityCanv.height,
					
					sx, sy, entity.width * cam_zoom * scale, entity.height * cam_zoom * scale)
				}
			}else{ // uses the whole texture ( some entities, etc)
				ctx.drawImage(entityCanv, sx, sy, entity.width * cam_zoom * scale, entity.height * cam_zoom * scale)
			}
		}
		//ctx.drawImage(tileset, sx, sy, entity.width * cam_zoom * scale, entity.height * cam_zoom * scale)
	}
}

var render = function () {
	if (screen == screen_MAIN){
		ctx.fillStyle = rooms[currentRoom].backgroundColor;
	}else{
		ctx.fillStyle = "#000000";
	}
	//ctx.fillStyle = "#FF00FF"; // deastl mode
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	renderAngle = 2 * Math.PI - cam_dir - Math.PI / 2
	
	entityRenderList = [];
	
	map = rooms[currentRoom].floor;
	
	ctx.fillStyle = "#ffffff"
	ctx.font = "32px Verdana";
	
	if (screen == screen_MENU || screen == screen_RESLUTS || screen == screen_TITLE){
		if (screen == screen_RESLUTS){ 
		
			scrn = TileMaps.resluts; 
			
		} else if (screen == screen_MENU){ 
		
			scrn = TileMaps.menu; 
		
		} else {
			
			scrn = TileMaps.title;
		};
		
		data = scrn.layers[0].data;
	
		for (var i = 0; i < data.length; i++){
			tileVal = data[i] - 1

			sourcex = (tileVal % 16) * 16;
			sourcey = Math.floor(tileVal / 16) * 16;
			
			destx = (i % scrn.width) * 16;
			desty = Math.floor(i / scrn.width) * 16;
			
			if (desty <= titleScanline){
				ctx.drawImage(tileset,sourcex,sourcey,16,16,destx*2,desty*2,32,32)
			}
		}
		titleScanline+=3;
		titleScanline = Math.min(640, titleScanline);
	}
	
	if (screen == screen_MENU){
		if (mighty){
			ctx.fillText("Thanks for playing! c:", 10.5*32, 72);
		} else {
			ctx.fillText(" CURRENT BATTLES", 11*32, 72);
		}
		ctx.font = "20px Verdana";
		
	} else if (screen == screen_RESLUTS){
		ctx.fillText(" R  E  S  L  U  T  S", 11*32, 72);
		ctx.font = "24px Verdana";
		round_score = Math.round(score * 100) / 100;
		ctx.fillText("Score: " + round_score, 96, 64);
		
		ctx.drawImage(tileset, 243, 96, 10, 10, 800, 32, 20, 20)
		ctx.drawImage(tileset, 217, 115, 10, 10, 864, 32, 20, 20)
		
		ctx.fillText( loadedSong.liek, 800, 80)
		ctx.fillText( loadedSong.haeit, 864, 80)
		
	
	} else if (screen == screen_MAIN){
	
		if (map && redrawFlag) { // map render (top-down here, mode7 afterwards)
		
			mapCtx.clearRect(0,0,mapCanvas.width,mapCanvas.height)
			
			mapCtx.translate(mapOrX, mapOrY);
			mapCtx.rotate(renderAngle);
			
			// transfer map from texctx to mapctx here
			dx = tra_x_o(0, mapOrX) - mapOrX;
			dy = tra_y_o(0, mapOrY) - mapOrY;
			mapCtx.drawImage(texCanvas, dx, dy, map.width*16*cam_zoom, map.height*16*cam_zoom)
			
			redrawFlag = false;
			mapCtx.setTransform(1, 0, 0, 1, 0, 0);
		}

		for (i = 0; i < 384 * flat_factor; i+=flat_factor * scanline_size){ // here is the mode7 style transform from mapcanvas -> canvas
		
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
		
		ctx.drawImage(tileset, 66, 0, 1, 1, 0,480,canvas.width,canvas.height);

		// the notes
		ls = loadedSong.ch[0];
		if (ls){
			nowLine = 200;
			
			// barlines are just unlocked ascii badge lol
			for (i = 0; i < 16; i++){
				beatTime = (loadedSong.tpqn * i);
				modTime = (loadedSong.time % (loadedSong.tpqn * 8) )
				ctx.drawImage(tileset, 160, 384, 16, 16, 16 + nowLine + ( beatTime - modTime) * 4, 496, 4, 128); 
			}
			
			// The now line is just the midi format icon but really squashed
			ctx.drawImage(tileset, 224, 32, 16, 16, nowLine+16, 496, 16, 128)
				
			for (i = 0; i < ls.pitches.length; i++){
				
				sx = -1; sy = -1;
				dy = 1000;
				if (ls.pitches[i] == 0){
					sx = 128; sy = 256;
					dy = 600;
				}else if (ls.pitches[i] == 1){
					sx = 160; sy = 256;
					dy = 550;
				}else if (ls.pitches[i] == 2){
					sx = 144; sy = 256;
					dy = 500;
				}
				if (!loadedSong.notesHit[0][i]){
					ctx.drawImage(tileset,sx,sy,16,16,nowLine + ( ls.times[i] - loadedSong.time ) * 4,dy,32,32)
				}
			}
		}
		
		if (captionsOn && dialogPlaying){
			captionPos = (canvW/1.5) - dialogPlaying.currentTime * rooms[currentRoom].textSpeed;
			ctx.fillText( captionTxt, captionPos, 512 )
		}
		
		// liek-haeit counter
		ctx.drawImage(tileset, 243, 96, 10, 10, canvW - 64, 256, 40, 40)
		ctx.drawImage(tileset, 217, 115, 10, 10, canvW - 64, 320, 40, 40)
		
		ctx.fillText( loadedSong.liek, canvW - 128, 286)
		ctx.fillText( loadedSong.haeit, canvW - 128, 350)
		
		val = 255 - globalTime
		ctx.fillStyle = "rgba(255, 255, 255, " + val + ")";
		ctx.fillText( rooms[currentRoom].name, 32, 56)
		ctx.fillStyle = "#ffffff"
	}
	
	// buttons and stuff
	
	for (i = 0; i < screen.elements.length; i++){
		btn = screen.elements[i];
		if (!unlocked[i] && screen == screen_MENU){
			imag = img_BUTTON2;
			ctx.drawImage(imag.canvas, btn.x, btn.y, btn.width, btn.height);
			ctx.fillText("Locked", btn.x+8, btn.y+40);
			
		}else{
			
			imag = img_BUTTON;
			ctx.drawImage(imag.canvas, btn.x, btn.y, btn.width, btn.height);
			ctx.fillText(btn.text, btn.x+8, btn.y+40);
		}
	}
	
	if (screen == screen_RESLUTS){
		ctx.drawImage(tileset, 0, 256, 16, 16, 768, 188, 32, 32) // ohb gold
		ctx.drawImage(tileset, 16, 256, 16, 16, 768, 188 + 72, 32, 32) // ohb silver
		ctx.drawImage(tileset, 240, 240, 16, 16, 768, 188 + 72 + 72, 32, 32) // ohb bronze
		ctx.drawImage(tileset, 140, 128, 16, 16, 768, 188 + 72 + 72 + 72, 32, 32) // ohb tincan
		
		if (sfxPlaying){
			if (!sfxPlaying.ended){
				reslutImage = img_NOPROGRESS;
				if (score >= 33){
					reslutImage = img_GOLDGET;
					
				} else if (score >= 30){
					reslutImage = img_SILVERGET;
					
				} else if (score >= 25){
					reslutImage = img_BRONZEGET;
					
				} else if (score >= 20){
					reslutImage = img_TINCANGET;
				}
				
				ctx.drawImage(reslutImage.canvas, 128, 640 - sfxPlaying.currentTime * 200, 384*2, 128*2);
				
			}
		}
	}
	
	if (screen == screen_MENU){
		for (i = 0; i < rooms.length; i++ ){
			if (rooms[i].bestScore){
				round_score = Math.round(rooms[i].bestScore * 100) / 100;
				
				if (round_score >= 33){
					ctx.drawImage(tileset, 0, 256, 16, 16, 768, 188 + 72*i, 32, 32) // ohb gold
				} else if (round_score >= 30){
					ctx.drawImage(tileset, 16, 256, 16, 16, 768, 188 + 72*i, 32, 32) // ohb silver
				} else if (round_score >= 25){
					ctx.drawImage(tileset, 240, 240, 16, 16, 768, 188 + 72*i, 32, 32) // ohb bronze
				} else if (round_score >= 20){
					ctx.drawImage(tileset, 140, 128, 16, 16, 768, 188 + 72*i, 32, 32) // ohb tincan
				}
				
				ctx.fillText("Σ" + round_score, 688, 208+i*72);
			}
		}
	}
	
	if (screen == screen_TITLE){
		titleCount += 4;
		titleCount = Math.min(titleCount, 540);
		
		ctx.drawImage(img_BEAT.canvas, canvW - titleCount, 384, 576, 192);
	}
	
	if (screen != screen_MAIN && mighty){
		ctx.drawImage(tileset, 143, 96, 16, 16, 900, 32, 64, 64)
	}
}