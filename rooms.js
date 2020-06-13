class Room {
	constructor( name, tileset, floor, song){
		this.name = name;
		this.tileset = tileset;
		this.floor = floor;
		this.backgroundColor = "#000000"
		this.centerX = 240;
		this.centerY = 240;
		this.radius = 192;
		
		// audio attributes
		
		this.song = song;
		this.dialogStart = undefined;
		this.dialogGood = undefined;
		this.dialogBad = undefined;
		
		this.captionStart = undefined;
		this.captionGood = undefined;
		this.captionBad = undefined;
		
		this.entities = [];
		this.events = [];
		
		this.bestScore = undefined;
	}
	
	setDialog( diaStart, diaGood, diaBad ){
		this.dialogStart = diaStart; this.dialogGood = diaGood; this.dialogBad = diaBad;
	}
	
	setCaptions(cs, cg, cb){
		this.captionStart = cs; this.captionGood = cg; this.captionBad = cb;
	}
}

class Event {
	constructor( func, time ){
		this.func = func;
		this.time = time;
	}
}

var initRooms = function () {

	rooms = [];
	
	rooms[0] = new Room ( "OHBing 101 - Hosted by kleeder", img_TILESET2.canvas, TileMaps.school, song_TUTORIAL );
	rooms[1] = new Room ( "NES Sound Forest - Hosted by miau", img_TILESET2.canvas, TileMaps.forest, song_LEVEL1 );
	rooms[2] = new Room ( "Vibrant Relaxing Coast - Hosted by Jakerson", img_TILESET2.canvas, TileMaps.beach, song_LEVEL1 );
	rooms[3] = new Room ( "Pigeon Palace - Hosted by OminPigeonMaster" , img_TILESET2.canvas, TileMaps.roost, song_LEVEL3 );
	rooms[4] = new Room ( "All About the Gig - Hosted by YOU" , img_TILESET2.canvas, TileMaps.stage, song_LEVEL1 );
	
	rooms[0].setDialog(sfx_KLEEDER1, sfx_KLEEDER4, sfx_KLEEDER3);
	
	rooms[2].backgroundColor = "#7FC9FF";
	
	rooms[3].setDialog(sfx_OPM1, sfx_OPM3, sfx_OPM4);
	rooms[3].backgroundColor = "#7FC9FF";
	rooms[3].radius = 128;
	
	rooms[4].centerX = 496; rooms[4].centerY = 496;
	
	e = new Entity(240, 240);
	e.texture = 10;
	rooms[3].entities.push( e ) // added a opm
	
	e = new Entity(240, 240);
	e.texture = 7;
	rooms[0].entities.push( e ) // added a toadette to school
	
	e = new Entity(240, 240);
	e.texture = 6;
	rooms[1].entities.push( e ) // added a miau to forest
	
	e = new Entity(240, 240);
	e.texture = 14;
	rooms[2].entities.push( e ) // added a jakerson to beach
	
	for (i = 0; i < 8; i++){
		e = new Tree(64 + i * 64, 128 + (Math.sin(i) * 64));
		rooms[1].entities.push( e ); // tree test
		
		e = new Tree(64 + i * 64, 320 + (Math.sin(i) * 64));
		rooms[1].entities.push( e ); // tree test
		
		e = new Mushroom(Math.random() * 512, Math.random() * 512);
		rooms[1].entities.push( e ); // mushroom test
	}
	
	for (i = 0; i < 8; i++){
		angle = i * 2 * Math.PI / 8
		e = new Tree(Math.cos(angle) * 128 + 240, Math.sin(angle) * 128 + 240);
		e.texture = 11;
		rooms[3].entities.push( e );
	}
	
	for (i = 0; i < 32; i++){
		e = new Entity( Math.random() * 1024, Math.random() * 1024);
		e.width = 32; e.height = 32;
		rooms[4].entities.push( e );
	}
	
	generateWall(0, 128, 128, 372, 128, 48, 1, 192) // school walls
	generateWall(0, 128, 128, 0,   256, 48, 2, 192)
	generateWall(0, 372, 128, 500, 192, 48, 2, 192)
	
	generateWall(4, 160+256, 128+256, 356+256, 128+256, 56, 12, 192) // stage walls
	
	generateWall(4, 38*16, 25*16, (38*16)+32, (25*16), 40, 13, 32) // speakers
	generateWall(4, 24*16, 25*16, (24*16)+32, (25*16), 40, 13, 32) //
	
	//generateWall(4, 128, 128, 372, 128, 48, 3, 192) // factory walls
	//generateWall(4, 128, 128, 0,   256, 48, 3, 192)
	//generateWall(4, 372, 128, 500, 256, 48, 3, 192)

}