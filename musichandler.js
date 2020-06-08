CHANNELS_AMT = 3;

loadedSong = {
	time:0,
	ch: [],
	currentIndex: [],
	length: 0
}
soundInitted = false;

var soundPlayerInit = function () {

	if (!soundInitted){
		soundInitted = true;
		
		metSound = new Audio();
		metSound.src = "met.ogg";
	}
}

var loadSong = function (song) {

	for (i = 0; i < CHANNELS_AMT; i++){ // init blank channels
		loadedSong.ch[i] = { pitches:[], times:[] };
		loadedSong.currentIndex[i] = 0;
		
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
	
			for (j=0; j < ls.pitches.length; j++){
				if (ls.times[j] == loadedSong.time) {
				
					if (ls.pitches[j] == -1){ //rest
					
					}else{
						metSound.play();
					}
				}
			}
		}

		loadedSong.time++;
		if (loadedSong.time > loadedSong.length && loadedSong.loop){
			loadedSong.time = 0;
		}
	}
}