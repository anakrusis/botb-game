var sounds = [];

function SFX() {
    var files = sounds.length;
    var loaded = 0;
    var _this = this;

    sounds.forEach(function(element) {
        var soundValue;
        var audio = new Audio();
        audio.addEventListener("canplaythrough", audioLoaded, false);
        audio.src = element.src;
		audio.loop = element.loop;
		audio.volume = master_vol;
        soundValue = audio;
        console.log(element);

        Object.defineProperty(_this, element.name, {
            configurable: true,
            enumerable: true,
            get: function() {
                return soundValue;
            },
            set: function(value) {
                soundValue = value;
            }
        });
    });

    function audioLoaded(e) {
        loaded++;

        if (loaded === files) {
            var readyEvent = new CustomEvent("audioready", {
                detail: { },
                bubbles: true,
                cancelable: false
            });
            window.dispatchEvent(readyEvent);
        }
    }

    this.play = function(soundName) {
        this[soundName].currentTime = 0;
        this[soundName].play();
		
    }
	this.stop = function(soundName){
		this[soundName].pause();
        this[soundName].currentTime = 0;
	}
	this.update = function(soundName){
		this[soundName].volume = master_vol;
	}
}

var sfx = new SFX();