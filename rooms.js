class Room {
	constructor( name, tileset, floor, song){
		this.name = name;
		this.tileset = tileset;
		this.floor = floor;
		this.song = song;
		
		this.entities = [];
		this.events = [];
		
		this.bestScore = undefined;
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
	
	rooms[0] = new Room ( "OHBing 101", img_TILESET2.canvas, TileMaps.school, song_TEST );
	rooms[1] = new Room ( "NES Sound Forest", img_TILESET2.canvas, TileMaps.forest, song_LEVEL1 );
	rooms[2] = new Room ( "Vibrant Relaxing Coast", img_TILESET2.canvas, TileMaps.forest, song_LEVEL1 );
	rooms[3] = new Room ( "Pigeon Palace" , img_TILESET2.canvas, TileMaps.forest, song_LEVEL1 );
	rooms[4] = new Room ( "Strobe's Factory" , img_TILESET2.canvas, TileMaps.forest, song_LEVEL1 );
	rooms[5] = new Room ( "All About the Gig" , img_TILESET2.canvas, TileMaps.forest, song_LEVEL1 );
	
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
	
	generateWall(4, 128, 128, 372, 128, 48, 3, 192) // factory walls
	generateWall(4, 128, 128, 0,   256, 48, 3, 192)
	generateWall(4, 372, 128, 500, 256, 48, 3, 192)

}