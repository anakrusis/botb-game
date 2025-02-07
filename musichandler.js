CHANNELS_AMT = 1;

loadedSong = {
	time:0,
	ch: [],
	nextNote: [],
	nextPitch:[],
	notesHit:[],
	length: 0,
	tpqn: 0 // TICKS PER QUARTER NOTE (calculated automatically)
}
soundInitted = false;

sfx_MET = new Audio(); sfx_MET.src = "sfx/met.ogg";
sfx_OOF1 = new Audio(); sfx_OOF1.src = "sfx/oof1.ogg"; sfx_OOF1.volume = 0.3;
sfx_OOF2 = new Audio(); sfx_OOF2.src = "sfx/oof2.ogg"; sfx_OOF2.volume = 0.3;
sfx_OOF3 = new Audio(); sfx_OOF3.src = "sfx/oof3.ogg"; sfx_OOF3.volume = 0.3;

sfx_OPM1 = new Audio(); sfx_OPM1.src = "sfx/opm1.ogg";
sfx_OPM2 = new Audio(); sfx_OPM2.src = "sfx/opm2.ogg";
sfx_OPM3 = new Audio(); sfx_OPM3.src = "sfx/opm3.ogg";
sfx_OPM4 = new Audio(); sfx_OPM4.src = "sfx/opm4.ogg";

sfx_KLEEDER1 = new Audio(); sfx_KLEEDER1.src = "sfx/kleeder1.ogg";
sfx_KLEEDER2 = new Audio(); sfx_KLEEDER2.src = "sfx/kleeder2.ogg";
sfx_KLEEDER3 = new Audio(); sfx_KLEEDER3.src = "sfx/kleeder3.ogg";
sfx_KLEEDER4 = new Audio(); sfx_KLEEDER4.src = "sfx/kleeder4.ogg";

sfx_MIAU1 = new Audio(); sfx_MIAU1.src = "sfx/miau1.ogg";
sfx_MIAU2 = new Audio(); sfx_MIAU2.src = "sfx/miau2.ogg";
sfx_MIAU3 = new Audio(); sfx_MIAU3.src = "sfx/miau3.ogg";

sfx_JAKERSON = new Audio(); sfx_JAKERSON.src = "sfx/jakerson2.ogg";
sfx_JAKERSON2 = new Audio(); sfx_JAKERSON2.src = "sfx/jakerson2.ogg";
sfx_JAKERSON3 = new Audio(); sfx_JAKERSON3.src = "sfx/jakerson2.ogg";

sfx_GOLD = new Audio(); sfx_GOLD.src = "sfx/goldfanfare.ogg";
sfx_SILVER = new Audio(); sfx_SILVER.src = "sfx/silverfanfare.ogg";
sfx_BRONZE = new Audio(); sfx_BRONZE.src = "sfx/bronzefanfare.ogg";
sfx_TINCAN = new Audio(); sfx_TINCAN.src = "sfx/tincanfanfare.ogg";
sfx_FANFAIL = new Audio(); sfx_FANFAIL.src = "sfx/fanfail.ogg";

sfx_NARRATORSILENT = new Audio(); sfx_NARRATORSILENT.src = "sfx/jakerson2.ogg";
sfx_NARRATOR1 = new Audio(); sfx_NARRATOR1.src = "sfx/narrator1.ogg";
sfx_NARRATOR2 = new Audio(); sfx_NARRATOR2.src = "sfx/narrator2.ogg";

var soundPlayerInit = function () {

	if (!soundInitted){
		soundInitted = true;
		
		audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		
		songPlaying = new Audio();
		dialogPlaying = new Audio();
		sfxPlaying = new Audio();
		//sng_TEST = new Audio(); sng_TEST.src = "songs/tutorial.ogg"; // todo dynamically do this on loadSong,
		// save string source in song data
	}
}

var loadSong = function (song) {

	loadBeatmap(song);
	playSong(song);

}

function playDialog ( dialog ) {
	dialogPlaying = dialog;
	dialogPlaying.currentTime = 0;
	dialogPlaying.play();
	
	if (dialogPlaying == rooms[currentRoom].dialogStart){
		captionTxt = rooms[currentRoom].captionStart;
	}else if ( dialogPlaying == rooms[currentRoom].dialogGood){
		captionTxt = rooms[currentRoom].captionGood;
	}else if ( dialogPlaying == rooms[currentRoom].dialogBad){
		captionTxt = rooms[currentRoom].captionBad;
	}
	
	captionsOn = true;
	
	dialogPlaying.onended = function(){
		captionsOn = false;
	}
}

// sfx playing with up to 3 different possible ones
function playSFX ( sfx1, sfx2, sfx3 ) {
	rand = Math.random();
	if (sfx3 && rand > 0.66){
		sfxPlaying = sfx3;
		
	}else if (sfx2 && rand > 0.33){
		sfxPlaying = sfx2;
		
	}else{
		sfxPlaying = sfx1;
	}
	sfxPlaying.currentTime = 0;
	sfxPlaying.play();
}

function playSong(song) {
	if (soundInitted){
		songPlaying = new Audio(); songPlaying.src = song.src;
		songPlaying.pause();
		songPlaying.currentTime = 0;
		songPlaying.play();     

		songPlaying.onended = function(){
			onResluts();
		}
	}			
}

var loadBeatmap = function (song) {

	for (i = 0; i < CHANNELS_AMT; i++){ // init blank channels
		loadedSong.ch[i] = { pitches:[], times:[] };
		loadedSong.nextNote[i] = 0;
		loadedSong.notesHit[i] = []; // list of whether or not you've hit all the notes
		
		loadedSong.time = 0;
		loadedSong.length = 0;
		loadedSong.loop = song.loop;
		
		loadedSong.liek = 0;
		loadedSong.haeit = 0; // how much you got wrong or right
		
		loadedSong.tpqn = 60 / ( song.bpm / 60 );
	}

	for (i = 0; i < CHANNELS_AMT; i++){
		time = 0;
		octave = 4;
		rhythm = 0;
		note = -1;
		
		chData = song.ch[i];
		hasRhythm = false;
		
		if (chData){
			for (j = 1; j < chData.length; j++){
			
				hasNote = false;
				currentChar = chData.substring(j, j+1);
				
				switch (currentChar){
				
					case "-":
						octave--;
						octave = Math.max(0, octave);
						break;
					case "+":
						octave++;
						octave = Math.min(8, octave);
						break;
					case "c":
						note = 2;hasNote = true;
						break;
					case "d":
						break;
					case "e":
						break;
					case "f":
						break;
					case "g":
						break;
					case "a":
						note = 0;hasNote = true;
						break;
					case "b":
						note = 1;hasNote = true;
						break;
					case "r":
						note = -1;hasNote = true;
						break;
					case "#":
						break;
						
					default:
						fullSub = chData.substring(j);
						if (parseFloat(fullSub) != NaN && !hasRhythm){
							
							rhythm = parseFloat(fullSub) * song.speed;
							hasRhythm = true;
						}
				}
				if (hasNote){
					hasRhythm = false;
				
					if (note == -1){
						loadedSong.ch[i].pitches.push(-1);
					}else{
					
						nextChar = chData.substring(j+1, j+2);
						if (nextChar == "#"){
							note = (note + 1) % 12;
						}
					
						//octaveMult = Math.pow(2, octave);
						//freq = FREQ_TBL[note] * octaveMult;
						loadedSong.ch[i].pitches.push(note);
					}
					loadedSong.ch[i].times.push(time);
					time += rhythm;
					
					hasNote = false;
				}
			}
		}
		
		for (j = 0; j < loadedSong.ch[i].pitches.length; j++){
			if (loadedSong.ch[i].pitches[j] == -1){
				loadedSong.notesHit[i][j] = -1;
			}else{
				loadedSong.notesHit[i][j] = undefined;
			}
		}

		if (time > loadedSong.length){
			loadedSong.length = time;
		}
	}
}

var noteHit = function (noteVal) {
	for (i = 0; i < 1; i++){
		index = loadedSong.nextNote[i]
		
		// If the pitch of the upcoming note matches, and you are within THRESHOLD ticks of it in either direction...
		
		THRESHOLD = 15;
		diff = Math.abs(ls.times[index] - loadedSong.time);
		//console.log(diff);
		
		if (noteVal == loadedSong.nextPitch[i] && 
		diff < THRESHOLD){
			if (loadedSong.notesHit[i][index] === undefined){
				loadedSong.notesHit[i][index] = true;
				loadedSong.liek++;
			}
			break;
			
			
		// Otherwise, oof.
			
		}else{
			playSFX(sfx_OOF1, sfx_OOF2, sfx_OOF3);
			
			if (loadedSong.notesHit[i][index] === undefined){
				loadedSong.notesHit[i][index] = false;
				loadedSong.haeit++;
			}
		}
	}
}

var songTick = function () {

	if (soundInitted && document.hasFocus()){
		for (i = 0; i < CHANNELS_AMT; i++){
			
			ls = loadedSong.ch[i];
	
			index = loadedSong.nextNote[i]
			if (ls.times[index] <= loadedSong.time){
			
				if (ls.pitches[index] == -1){ //rests are ignored
					
				}else{
/* 					sfx_MET.pause();
					sfx_MET.currentTime = 0;
					sfx_MET.play(); */
			
					if (loadedSong.notesHit[i][index] === undefined){
						loadedSong.notesHit[i][index] = false;
						loadedSong.haeit++;
						playSFX(sfx_OOF1, sfx_OOF2, sfx_OOF3);
					}
					
				}
			
				loadedSong.nextNote[i]++;
				if (ls.pitches[ loadedSong.nextNote[i] % ls.pitches.length ] != -1){ // ignoring rests for the nextpitch handler
					loadedSong.nextPitch[i] = ls.pitches[ loadedSong.nextNote[i] % ls.pitches.length];
				}
			}
			
		}
		
		OFFSET = -5;
		//OFFSET = -5;

		loadedSong.time = Math.round(songPlaying.currentTime * 60) + OFFSET
		if (loadedSong.time >= loadedSong.length - 3){
			if (loadedSong.loop){
			
				loadedSong.time = 0;
				for (i = 0; i < CHANNELS_AMT; i++){
					loadedSong.nextNote[i] = 0;
				}
				songPlaying.currentTime = 0;
				
			} else {
				//onResluts();
			}
		}
	}
}
