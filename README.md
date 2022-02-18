# Fretboard
Spectral synthesizer optimized for touchscreen.
This app allows you to play the multitouch screen fretboard like tapping a string instrument and control the sound.
Written in Javascript using Web Audio API, works in most browsers.

# Bugs
After the same key is pressed with two fingers, its sound mutes shortly after the start of note.
Remake the interface based on https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth

# TODO for beta:
MIDI in/out to and from DAWs (16 channels for microtonality; read file ?) - midi_out.html<br/>
Touch radius / angle -> volume / pan or noise (?) of notes and harmonics (https://developers.google.com/web/updates/2015/07/rotationAngle-and-touchRadius) <br/>
touch sensitivity (both coordinates + velocity + rotationAngle)<br/>
noise and detune (white noise buffer with comb filter as generator)<br/>
vocal synth with filters controlled in realtime<br/>

Android / iOS app, promote with Wizdom Music ? (https://www.wizdommusic.com/)
