from mido import *
from mido import MidiFile
from mido import tick2second, second2tick, tempo2bpm
import sys
import math

path_in = sys.argv[1]
path_out = sys.argv[2]

midi_in = MidiFile(path_in)
file_out = open(path_out + ".js", "w")

NOTES = ["c","c#","d","d#","e","f","f#","g","g#","a","a#","b"]

channels =  [ ] # the concatenated strings of mml to be outputted
octaves =   [ ]
onsetTime =  [ ] # the tick of note onset
releaseTime =[ ] # tick of note release
                # note duration is noteTime-lastTime
durations = [ ]
pitches =   [ ] # midi note values, for matching note_on and note_offs
available = [ ]

meta = "" # A string of meta messages, such as tempo changes
bpm = 0

def main():


    ticksPerBeat = midi_in.ticks_per_beat
    print("Ticks per beat: " + str(ticksPerBeat))

    track = midi_in.tracks[0]
    for msg in track:
        if (msg.type == "set_tempo"):
            bpm = round(tempo2bpm(msg.tempo))
            print("Beats per minute: " + str(bpm))

    currentChannel = -1;
    trackTime = 0
    newChannel()
    track = midi_in.tracks[1]
    for msg in track:
        trackTime += msg.time

        if (msg.type == "note_on"):

            note = (msg.note % 12)
            octave = math.floor(msg.note / 12) - 1
            
            if (msg.velocity == 0): # Note release: write the note length first, then octave changes, finally the note name.
 
                currentChannel = findChannel(msg.note)
                print("Note " + NOTES[note] + " on Channel " + str(currentChannel))
                
                releaseTime[currentChannel] = trackTime
                duration = releaseTime[currentChannel] - onsetTime[currentChannel]
                duration /= ticksPerBeat
                duration /= bpm
                duration *= 60 * 60
                duration = math.floor(duration)
                
                channels[currentChannel] += str(duration)

                if (octave > octaves[currentChannel]):
                    diff = octave-octaves[currentChannel]
                    channels[currentChannel] += ("+" * diff)
                    octaves[currentChannel] = octave

                elif (octave < octaves[currentChannel]):
                    diff = octaves[currentChannel]-octave
                    channels[currentChannel] += ("-" * diff)
                    octaves[currentChannel] = octave
                
                channels[currentChannel] += NOTES[note]

                pitches[currentChannel] = -1
                available[currentChannel] = True
                
            else:
                currentChannel = nearestChannel(octave)
                if (currentChannel == -1):
                    newChannel()
                    currentChannel = len(channels)-1
                

                onsetTime[currentChannel] = trackTime
                duration = onsetTime[currentChannel] - releaseTime[currentChannel]

                if (releaseTime[currentChannel] == 0): # Special case for the beginning of midis: 4 beats of silence in most midis is normal
                    duration -= ticksPerBeat * 4;

                duration /= ticksPerBeat
                duration /= bpm
                duration *= 60 * 60
                duration = math.floor(duration)
                
                channels[currentChannel] += str(duration)
                channels[currentChannel] += "r"
                
                pitches[currentChannel] = msg.note
                available[currentChannel] = False

    writeFile()

def writeFile():
    file_out.write(path_out + " = {\nspeed:1,\nloop:false,\nsrc:'songs/level1.wav',\nch:[")
    for i in range( len(channels) ):
        file_out.write('\n"' + channels[i] + '0r",')
    file_out.write("]}")

def newChannel():
    channels.append(" ")
    octaves.append(4)
    pitches.append(0)
    onsetTime.append(0)
    releaseTime.append(0)
    durations.append(0)
    available.append(True)

def findChannel(midiNote):
    for i in range( len(pitches) ):
        if (pitches[i] == midiNote and not available[i]):
            return i
    return -1                    

# Returns the index of the channel available with the closest octave,
# to minimize the use of octave commands and save space
def nearestChannel( currentOctave ):
    diff = 1000
    channel = -1
    for i in range( len(channels) ):
        if abs( octaves[i] - currentOctave ) < diff and available[i]:
        #if (available[i]):
            diff = abs ( octaves[i] - currentOctave )
            channel = i
    return channel        
    
main()
