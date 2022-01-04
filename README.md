# Freealise synth
Spectral synthesizer optimized for touchscreen.
This app allows you to play the microtonal screen keyboard and control the sound.
Written in Javascript using Web Audio API, works in most browsers.

# Bugs
After the same key is pressed with two fingers, its sound mutes shortly after the start of note.

# TODO for beta:
linear scale switch like with piano/string
MIDI in/out to and from DAWs (16 channels for microtonality; read file ?) - emulate formants with varying number of simultaneous notes per key (midi_out.html) <br/>
Touch radius / angle -> volume / pan (https://developers.google.com/web/updates/2015/07/rotationAngle-and-touchRadius) <br/>
touch sensitivity (both coordinates + velocity + rotationAngle)<br/>
noise and detune of harmonics (spectral generator from phonetic app, keep voice capabilities - https://warmplace.ru/forum/viewtopic.php?p=20334#p20334)<br/><br/>

Android / iOS app, promote with Wizdom Music ? (https://www.wizdommusic.com/)
