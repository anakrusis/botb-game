class Room {
	constructor( name, tileset, floor, song){
		this.name = name;
		this.tileset = tileset;
		this.floor = floor;
		
		// audio attributes
		
		this.song = song;
		this.dialogStart = undefined;
		this.dialogGood = undefined;
		this.dialogBad = undefined;
		
		this.entities = [];
		this.events = [];
		
		this.bestScore = undefined;
	}
	
	setDialog( diaStart, diaGood, diaBad ){
		this.dialogStart = diaStart; this.dialogGood = diaGood; this.dialogBad = diaBad;
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
	
	rooms[0] = new Room ( "OHBing 101", img_TILESET2.canvas, TileMaps.school, song_TUTORIAL );
	rooms[1] = new Room ( "NES Sound Forest", img_TILESET2.canvas, TileMaps.forest, song_LEVEL1 );
	rooms[2] = new Room ( "Vibrant Relaxing Coast", img_TILESET2.canvas, TileMaps.forest, song_LEVEL1 );
	rooms[3] = new Room ( "Pigeon Palace" , img_TILESET2.canvas, TileMaps.forest, song_LEVEL3 );
	rooms[4] = new Room ( "Strobe's Factory" , img_TILESET2.canvas, TileMaps.forest, song_LEVEL1 );
	rooms[5] = new Room ( "All About the Gig" , img_TILESET2.canvas, TileMaps.forest, song_LEVEL1 );
	
	rooms[0].setDialog(sfx_KLEEDER1, sfx_KLEEDER4, sfx_KLEEDER3);
	rooms[3].setDialog(sfx_OPM1, sfx_OPM3, sfx_OPM4);
	
	e = new Entity(240, 240);
	e.texture = 7;
	rooms[0].entities.push( e ) // added a toadette to school
	
	e = new Entity(240, 240);
	e.texture = 6;
	rooms[1].entities.push( e ) // added a miau to forest
	
	for (i = 0; i < 8; i++){
		e = new Tree(64 + i * 64, 128 + (Math.sin(i) * 64));
		rooms[1].entities.push( e ); // tree test
		
		e = new Tree(64 + i * 64, 320 + (Math.sin(i) * 64));
		rooms[1].entities.push( e ); // tree test
		
		e = new Mushroom(Math.random() * 512, Math.random() * 512);
		rooms[1].entities.push( e ); // mushroom test
	}
	
	generateWall(0, 128, 128, 372, 128, 48, 1, 192) // school walls
	generateWall(0, 128, 128, 0,   256, 48, 2, 192)
	generateWall(0, 372, 128, 500, 256, 48, 2, 192)
	
	generateWall(4, 128, 128, 372, 128, 48, 3, 192) // factory walls
	generateWall(4, 128, 128, 0,   256, 48, 3, 192)
	generateWall(4, 372, 128, 500, 256, 48, 3, 192)

}