CHANNELS_AMT = 3;

loadedSong = {
	time:0,
	ch: [],
	nextNote: [],
	nextPitch:[],
	notesHit:[],
	length: 0
}
soundInitted = false;

var soundPlayerInit = function () {

	if (!soundInitted){
		soundInitted = true;
		
		audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		
		sfx_MET = new Audio(); sfx_MET.src = "sfx/met.ogg";
		sfx_OOF = new Audio(); sfx_OOF.src = "sfx/oof.ogg";
		songPlaying = new Audio();
		//sng_TEST = new Audio(); sng_TEST.src = "songs/tutorial.ogg"; // todo dynamically do this on loadSong,
		// save string source in song data
	}
}

var loadSong = function (song) {

	loadBeatmap(song);
	playSong(song);

}

function playSong(song) {
	if (soundInitted){
		songPlaying = new Audio(); songPlaying.src = song.src;
		songPlaying.pause();
		songPlaying.currentTime = 0;
		songPlaying.play();                       
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
						if (parseInt(fullSub, 10) != NaN && !hasRhythm){
							
							rhythm = parseInt(fullSub, 10) * song.speed;
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
			loadedSong.notesHit[i][j] = false;
		}

		if (time > loadedSong.length){
			loadedSong.length = time;
		}
	}
}

var noteHit = function (noteVal) {
	for (i = 0; i < CHANNELS_AMT; i++){
		index = loadedSong.nextNote[i]
		
		// If the pitch of the upcoming note matches, and you are within THRESHOLD ticks of it in either direction...
		
		THRESHOLD = 15;
		
		if (noteVal == loadedSong.nextPitch[i] && 
		Math.abs(ls.times[index] - loadedSong.time) < THRESHOLD){
			break;
			
		// Otherwise, oof.
			
		}else{
			sfx_OOF.pause(); sfx_OOF.currentTime = 0; sfx_OOF.play();
		}
	}
}

var songTick = function () {

	if (soundInitted && document.hasFocus()){
		for (i = 0; i < CHANNELS_AMT; i++){
			
			ls = loadedSong.ch[i];
	
			index = loadedSong.nextNote[i]
			if (ls.times[index] <= loadedSong.time){
			
				if (ls.pitches[index] == -1){ //rest
					
				}else{
					sfx_MET.pause();
					sfx_MET.currentTime = 0;
					sfx_MET.play();
				}
			
				loadedSong.nextNote[i]++;
				if (ls.pitches[ loadedSong.nextNote[i] % ls.pitches.length ] != -1){ // ignoring rests for the nextpitch handler
					loadedSong.nextPitch[i] = ls.pitches[ loadedSong.nextNote[i] % ls.pitches.length];
				}
			}
			
		}
		
		
		OFFSET = 0;

		loadedSong.time = Math.round(songPlaying.currentTime * 60) + OFFSET
		if (loadedSong.time - (OFFSET / 3) >= loadedSong.length - 3 && loadedSong.loop){
			loadedSong.time = 0;
			for (i = 0; i < CHANNELS_AMT; i++){
				loadedSong.nextNote[i] = 0;
			}
			songPlaying.currentTime = 0;
		}
	}
}