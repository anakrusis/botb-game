CHANNELS_AMT = 3;

loadedSong = {
	time:0,
	ch: [],
	nextNote: [],
	length: 0
}
soundInitted = false;

var soundPlayerInit = function () {

	if (!soundInitted){
		soundInitted = true;
		
		audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		
		sfx_MET = new Audio(); sfx_MET.src = "sfx/met.ogg";
		sfx_OOF = new Audio(); sfx_OOF.src = "sfx/oof.ogg";
		
		sng_TEST = new Audio(); sng_TEST.src = "songs/tutorial.ogg";
	}
}

var loadSong = function (song) {

	loadBeatmap(song);
	playSong();

}

function playSong() {
	if (soundInitted){
		sng_TEST.pause();
		sng_TEST.currentTime = 0;
		sng_TEST.play();                       
	}			
}

var loadBeatmap = function (song) {

	for (i = 0; i < CHANNELS_AMT; i++){ // init blank channels
		loadedSong.ch[i] = { pitches:[], times:[] };
		loadedSong.nextNote[i] = 0;
		
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

		if (time > loadedSong.length){
			loadedSong.length = time;
		}
	}
}

var songTick = function () {

	if (soundInitted && document.hasFocus()){
		for (i = 0; i < CHANNELS_AMT; i++){
			
			ls = loadedSong.ch[i];
	
/* 			for (j=0; j < ls.pitches.length; j++){
				if (ls.times[j] == loadedSong.time) {
				
					if (ls.pitches[j] == -1){ //rest
					
					}else{
						sfx_MET.pause();
						sfx_MET.currentTime = 0;
						sfx_MET.play();
						console.log(ls.times[j]);
					}
				}
			} */
			index = loadedSong.nextNote[i]
			if (ls.times[index] <= loadedSong.time){
			
				if (ls.pitches[index] == -1){ //rest
					
				}else{
					sfx_MET.pause();
					sfx_MET.currentTime = 0;
					sfx_MET.play();
					console.log(ls.times[index]);
				}
			
				loadedSong.nextNote[i]++;
			}
		}
		
		OFFSET = 6;

		loadedSong.time = Math.round(sng_TEST.currentTime * 60) + OFFSET
		if (loadedSong.time - (OFFSET / 3) >= loadedSong.length && loadedSong.loop){
			loadedSong.time = 0;
			for (i = 0; i < CHANNELS_AMT; i++){
				loadedSong.nextNote[i] = 0;
			}
			playSong()
		}
	}
}