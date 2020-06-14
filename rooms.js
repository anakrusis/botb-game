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
		this.textSpeed = 350;
		
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
	rooms[2] = new Room ( "Vibrant Relaxing Coast - Hosted by Jakerson", img_TILESET2.canvas, TileMaps.beach, song_LEVEL2 );
	rooms[3] = new Room ( "Sky Tower Zone - Hosted by OminPigeonMaster" , img_TILESET2.canvas, TileMaps.roost, song_LEVEL3 );
	rooms[4] = new Room ( "All About the Gig - Hosted by YOU" , img_TILESET2.canvas, TileMaps.stage, song_LEVEL4 );
	
	rooms[0].setDialog(sfx_KLEEDER1, sfx_KLEEDER4, sfx_KLEEDER3);
	rooms[0].setCaptions("Hello class, this is Teacher Kleeder. If you want to win Battle of the Bits, you must first learn how to OHB. Okay class, get out your chiptars and play the notes as they pass by on your screen.",
	
	"Good job. You are ready to go on a little journey. Remember these words my students: Try your worst, or do your best.",
	
	"Ach! You can do better than that! Try it again!")
	
	rooms[1].textSpeed = 200;
	rooms[1].setDialog(sfx_MIAU1, sfx_MIAU2, sfx_MIAU3);
	rooms[1].setCaptions("Hello. It's miau. I'm a demon cat and this is my SP00KY forest. Let's see how good you can SP00KY chiptune.",
	
	"Nice job. You are becoming more adept at the Nintendo music. How about some expansion chips now?",
	
	"That wasn't very meowsical! Try it again from the top!")
	
	rooms[2].setDialog(sfx_JAKERSON, sfx_JAKERSON2, sfx_JAKERSON3);
	rooms[2].setCaptions("[ a large sentient hand appears to be cheering you on! ]",
	
	"[ good job! the thumb shaped man seems to have approved of your performance. ]",
	
	"[ the giant thumbs up with legs seems to be telling you not to be discouraged, and to try again. ]")
	
	rooms[3].textSpeed = 270;
	rooms[3].setCaptions("If you want to win Battle of the Bits, you're going to have to master the art of FM synthesis.", 
	
	"Wow. You really modulated those frequencies nicely, n00b. I think you're ready to beghast an OHB of your own now. Go ahead and try it!",
	
	"Your frequencies were not modulated enough, n00b. Try it again.");
	
	rooms[0].radius = 96;
	
	rooms[2].backgroundColor = "#7FC9FF";
	rooms[2].radius = 128;
	
	rooms[3].setDialog(sfx_OPM1, sfx_OPM3, sfx_OPM4);
	rooms[3].backgroundColor = "#7FC9FF";
	rooms[3].radius = 128;
	
	rooms[4].centerX = 496; rooms[4].centerY = 496;
	
	e = new Entity(240, 240);
	e.texture = 10;
	rooms[3].entities.push( e ) // added a opm
	
	e = new Entity(280, 280); e.texture = 28; e.width = 24; e.height = 24; rooms[3].entities.push( e );
	e = new Entity(120, 305); e.texture = 28; e.width = 24; e.height = 24; rooms[3].entities.push( e );
	e = new Entity(420, 240); e.texture = 28; e.width = 24; e.height = 24; rooms[3].entities.push( e );
	
	e = new Entity(240, 240);
	e.texture = 7;
	rooms[0].entities.push( e ) // added a toadette to school, students below
	
	e = new Entity(21 * 16, 13 * 16); e.texture = 24; rooms[0].entities.push(e); e.height = 32; e.width = 32;
	
	e = new Entity(12 * 16, 20 * 16); e.texture = 22; rooms[0].entities.push(e); e.height = 32; e.width = 32;
	
	e = new Entity(18 * 16, 22 * 16); e.texture = 21; rooms[0].entities.push(e); e.height = 32; e.width = 32;
	
	e = new Entity(9 * 16, 16 * 16); e.texture = 23; rooms[0].entities.push(e); e.height = 32; e.width = 32;
	
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
		
		e = new Tree(64 + i * 64, 128 + (Math.cos(i) * 64)); e.texture=15;
		rooms[2].entities.push( e );
		
		e = new Tree(64 + i * 64, 320 + (Math.sin(i) * 64)); e.texture=15;
		rooms[2].entities.push( e ); 
		
		e = new Mushroom(Math.random() * 512, Math.random() * 512);
		rooms[2].entities.push( e ); 
	}
	
	for (i = 0; i < 8; i++){
		angle = i * 2 * Math.PI / 8
		e = new Tree(Math.cos(angle) * 128 + 240, Math.sin(angle) * 128 + 240);
		e.texture = 11;
		rooms[3].entities.push( e );
		
		e = new Cloud(Math.cos(angle) * 256 + 240, Math.sin(angle) * 256 + 240);
		rooms[3].entities.push( e );
	}
	
	for (i = 0; i < 32; i++){
		e = new Entity(64 + i * 128, 640 + (Math.sin(i) * 8));
		e.width = 32; e.height = 32;
		rooms[4].entities.push( e );
		
		e = new Entity(64 + i * 128, 720 + (Math.sin(i) * 8));
		e.width = 32; e.height = 32;
		rooms[4].entities.push( e );
	}
	
	generateWall(0, 128, 128, 372, 128, 48, 1, 192) // school walls
	generateWall(0, 0, 128+135, 128, 128, 48, 25, 192)
	generateWall(0, 372, 128, 500, 192, 48, 2, 192)
	generateWall(0, 0, 128+135, 180, 455, 48, 2, 192)
	
	generateWall(4, 160+256, 128+256, 356+256, 128+256, 56, 12, 192) // stage walls
	
	generateWall(4, 38*16, 25*16, (38*16)+32, (25*16), 40, 13, 32) // speakers
	generateWall(4, 24*16, 25*16, (24*16)+32, (25*16), 40, 13, 32) //
	
	//generateWall(4, 128, 128, 372, 128, 48, 3, 192) // factory walls
	//generateWall(4, 128, 128, 0,   256, 48, 3, 192)
	//generateWall(4, 372, 128, 500, 256, 48, 3, 192)

}