# Freealise synth
Spectral synthesizer optimized for touchscreen.
This app allows you to play the microtonal screen keyboard and control the sound.
Written in Javascript using Web Audio API, works in most browsers.

# Bugs
After the same key is pressed with two fingers, its sound mutes shortly after the start of note.

# TODO for beta:
MIDI out (midi_out.html) <br/>
Touch radius / angle -> volume / pan (https://developers.google.com/web/updates/2015/07/rotationAngle-and-touchRadius) <br/>
Use the Sunvox player engine (WASM) (16 finely detuned channels for microtonality, one instrument at a time) + touch sensitivity (both coordinates + velocity + rotationAngle)<br/>
change parameters in realtime<br/>
noise and detune of harmonics (SpectraVoice)<br/><br/>

Update and merge when VirtualANS noise generator is improved (clone for browser within phonetic app?)
