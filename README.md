# Fretboard
Tab tuning changer is a fork of toFret (http://www.tofret.com/) online tab player in pure JavaScript without server code.  
The SmartChord (https://smartchord.de/) app offers similar retuning capabilities for a database of chords.  
  
DIY guitar assembling instruction by C.B.Gitty Crafter Supply (https://cbgitty.com/, https://cigarboxnation.com/)  

**Ralph Oliver Patt** (5 December 1929 – 6 October 2010) was an American jazz guitarist who introduced major-thirds tuning in 1964. 
Patt's tuning simplified the learning of the fretboard and chords by beginners and improvisation by advanced guitarists.  
https://en.wikipedia.org/wiki/Major_thirds_tuning

**Emmett Chapman** (28 September 1936 – 1 November 2021) was an American jazz musician and songwriter best known as the inventor of the Chapman Stick (1969) and maker of the Stick family of instruments. He founded Stick Enterprises in 1974 and has made more than 6,000 guitars.  
https://en.wikipedia.org/wiki/Chapman_Stick

### TODO:
reverb (drawn waveform / recorded impulse response; from 3D model / pano with convolver / delays or AI ? https://www.google.com/search?q=3d+mesh+to+impulse+response)  
3d automation paths for 5.1 sound in sequencer with phi/theta by wind mouse velocity / wheel / touch / keyboard sent by midi to any compliant multitracker (https://github.com/freealise/freealise/blob/main/pannernode.htm)  
pull tabs and chords from Ultimate Guitar or elsewhere and average versions with AI ?  
links to ebooks (https://developers.google.com/books/docs/viewer/examples) and folk song archives with lyrics and notation  
clothes pegs on pin tuners for indication  
bamboo wood sources  
polyphonic apache fiddle ?  

### Variant:
ends of strings go through a tube at the bottom like cello end pin, with pitch pedals for each string (aligned to both sides of feet and knees)  
or attach each string on a spring with lever (~floyd rose); string volume (distance from pickup) - bends do not change pitch on uneven fretboard  

### Alternatives:
#### wind
set of silicon tubes (drinking straw for prototype) of same length (with a hole on one side) in a row, pressed by fingers and blown into by pedals through hoses from both sides (?)  
volume control with same or other hand and size of output hole (or electrically) ?  
  
#### reed
hard tinfoil surface cut diagonally and into narrow reeds, held against an elastic damper stripe attached with wire to a row of angle keys like hairpins  
  
## Emulator
Synthesizer optimized for multitouch screen, lets you play the virtual fretboard like tapping the strings of a guitar.
Written in Javascript using Web Audio API, works in modern browsers.

### TODO:
MIDI in/out to and from DAWs (16 channels for microtonality; read/write file ?) - midi_out.html  
touch radius x/y -> filter quality or amplitude modulation  

Android / iOS app, promote with Wizdom Music ? (https://www.wizdommusic.com/)
