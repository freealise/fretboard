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
sell do-it-yourself (DIY) kits or provide online instructions with parts  
make it the size of ukulele  
  
16 harmonics: 8 fingers, volume by y, odd/even by x, detune by touch radius  
  
reverb (drawn waveform / recorded impulse response; from 3D model / pano with convolver / delays or AI ? https://www.google.com/search?q=3d+mesh+to+impulse+response)  
pull tabs and chords from Ultimate Guitar or elsewhere and average versions with AI ?  
links to ebooks (https://developers.google.com/books/docs/viewer/examples) and folk song archives with lyrics and notation  
clothes pegs on pin tuners for indication  
bamboo wood sources  
polyphonic apache fiddle ?  
polyphonic talking drum with diagonal net  
folding resonator ?  
microtonal frets from chinese mat    
pickup / sustainer (https://www.instructables.com/Infinite-Guitar-Sustainer/, or order thin pickups from the US ?)  
wind all strings with thread or thin wire and bow with pick along the string  
wind a curved hairpin with thread or string and use as guitar bow  
violin bow hair or wound string along surface of curved stripe of tinfoil or bamboo attached with hairpins and stretched to loop in the shape of bow -> universal bow for guitar and violin  
waveforms embossed on postcards played back with nail  
  
### Variant:
ends of strings go through a tube at the bottom like cello end pin, with pitch pedals for each string (aligned to both sides of feet and knees)  
or attach each string on a spring with lever (~floyd rose); string volume (distance from pickup) - bends do not change pitch on uneven fretboard  

### 🪗🎻🪘🪕🎍 Alternatives:
#### wind
set of silicon tubes (drinking straw for prototype) of same length (with a hole on one side) in a row, pressed by fingers and blown into by pedals through hoses from both sides (?)  
volume control with same or other hand and size of output hole (or electrically) ?  
  
#### reed
hard tinfoil surface cut diagonally and into narrow reeds, held against an elastic damper stripe attached with wire to a row of angle keys like hairpins  
  
#### ocarina
four-chambered and tuned to major thirds (two or three holes or one long hole per chamber, one hole per finger or several fingers closing one hole | holes partially | gradually)  
silicone resonator to allow formants, can be a concertina  
  
#### midi
attach long flat pieces of plastic or bamboo to neighboring keys diagonally and detune by ratio of aftertouch pressures  

## Emulator
Synthesizer optimized for multitouch screen, lets you play the virtual fretboard like tapping the strings of a guitar.
Written in Javascript using Web Audio API, works in modern browsers.

### TODO:
replace numbers in tab retuner with vowels (regular / capital / superscript / subscript) or dot patterns with left column for position and right for fret (5x5 from 0)  
MIDI in/out to and from DAWs (16 channels for microtonality; read/write file ?) - midi_out.html  
touch radius x/y -> filter quality or amplitude modulation  
  
audio to midi / tab / notes transcription: poly pitch detect by comb filtering (in webaudio add the same signal delayed by varying time starting from longest and find greatest output volumes excluding harmonics of already existing unless louder than base pitch)  
or in spectrum analyser find lowest pitch above threshold then exclude its harmonics unless louder than itself then continue up the scale  
(https://gist.github.com/natowi/d26c7e97443ec97e8032fb7e7596f0b0)  
display piano roll with smooth pitch transitions on google function chart (https://developers.google.com/chart/interactive/docs/gallery/intervals#area-intervals)  
  
Android / iOS app, promote with Wizdom Music ? (https://www.wizdommusic.com/)  
https://en.wikipedia.org/wiki/Czech_bluegrass  
  