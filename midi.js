var kbrd = {
  '`': [0, 0],
  '1': [1, 0],
  '2': [2, 0],
  '3': [3, 0],
  '4': [4, 0],
  '5': [5, 0],
  '6': [6, 0],
  '7': [7, 0],
  '8': [8, 0],
  '9': [9, 0],
  '0': [10,0],
  '-': [11,0],
  '=': [12,0],
  'Backspace': [13,0],
  'Tab': [0, 1],
  'q': [1, 1],
  'w': [2, 1],
  'e': [3, 1],
  'r': [4, 1],
  't': [5, 1],
  'y': [6, 1],
  'u': [7, 1],
  'i': [8, 1],
  'o': [9, 1],
  'p': [10,1],
  '[': [11,1],
  ']': [12,1],
  '\\': [13,1],
  'CapsLock': [0, 2],
  'a': [1, 2],
  's': [2, 2],
  'd': [3, 2],
  'f': [4, 2],
  'g': [5, 2],
  'h': [6, 2],
  'j': [7, 2],
  'k': [8, 2],
  'l': [9, 2],
  ';': [10,2],
  '\'': [11,2],
  'Enter': [12,2],
  'Shift': [0, 3],
  'z': [1, 3],
  'x': [2, 3],
  'c': [3, 3],
  'v': [4, 3],
  'b': [5, 3],
  'n': [6, 3],
  'm': [7, 3],
  ',': [8, 3],
  '.': [9, 3],
  '/': [10,3],
}

var baseKey = 36;
var pitchBend = 0;
var pitchRange = 1;

function noteOn(n, v) {
  console.log( "Note on: " + n + " " + v);
  var kn = n-baseKey;
  var o = 0;
	while (kn>=24) {
	  kn -= 24;
	  o+=2;
	}
	playNote(kn, o*12*64, v/4);
}

function noteOff(n) {
  console.log( "Note off: " + n);
  var kn = n-baseKey;
	while (kn>=24) {
	  kn -= 24;
	}
  stopNote(kn);
}

function controller(n, v) {
  console.log( "Controller: " + n + " " + v);
  for (var i=0; i<25; i++) {
    volume(i, v/4);
  }
}

function pitchWheel(p) {
  console.log( "Pitch bend: " + p);
  for (var i=0; i<25; i++) {
    biquadFilter[i].detune.linearRampToValueAtTime(tuning[i]+p*100*pitchRange, audioContext.currentTime + 0.001);
  }
}

function polyPressure(n, v) {
  console.log( "Poly aftertouch: " + n + " " + v);
  var kn = n-baseKey;
	while (kn>=24) {
	  kn -= 24;
	}
  volume(kn, v/4);
}

function midiMessageReceived( ev ) {
  var cmd = ev.data[0] >> 4;
  var channel = ev.data[0] & 0xf;
  var noteNumber = ev.data[1];
  var velocity = ev.data[2];

  if (channel == 9)
    return
  if ( cmd==8 || ((cmd==9)&&(velocity===0)) ) { // with MIDI, note on with velocity zero is the same as note off
    // note off
    noteOff( noteNumber );
  } else if (cmd == 9) {
    // note on
    noteOn( noteNumber, velocity);
  } else if (cmd == 11) {
    controller( noteNumber, velocity);
  } else if (cmd == 14) {
    // pitch wheel
    pitchWheel( ((velocity * 128.0 + noteNumber)-8192)/8192.0 );
  } else if ( cmd == 10 ) {  // poly aftertouch
    polyPressure(noteNumber,velocity)
  } else
  console.log( "" + ev.data[0] + " " + ev.data[1] + " " + ev.data[2])
}

var selectMIDI = null;
var midiAccess = null;
var midiIn = null;

function selectMIDIIn( ev ) {
  if (midiIn)
    midiIn.onmidimessage = null;
  var id = ev.target[ev.target.selectedIndex].value;
  if ((typeof(midiAccess.inputs) == "function"))   //Old Skool MIDI inputs() code
    midiIn = midiAccess.inputs()[ev.target.selectedIndex];
  else
    midiIn = midiAccess.inputs.get(id);
  if (midiIn)
    midiIn.onmidimessage = midiMessageReceived;
}

function populateMIDIInSelect() {
  // clear the MIDI input select
  selectMIDI.options.length = 0;
  if (midiIn && midiIn.state=="disconnected")
    midiIn=null;
  var firstInput = null;

  var inputs=midiAccess.inputs.values();
  for ( var input = inputs.next(); input && !input.done; input = inputs.next()){
    input = input.value;
    if (!firstInput)
      firstInput=input;
    var str=input.name.toString();
    var preferred = !midiIn && ((str.indexOf("Key") != -1)||(str.indexOf("key") != -1)||(str.indexOf("KEY") != -1));

    // if we're rebuilding the list, but we already had this port open, reselect it.
    if (midiIn && midiIn==input)
      preferred = true;

    selectMIDI.appendChild(new Option(input.name,input.id,preferred,preferred));
    if (preferred) {
      midiIn = input;
      midiIn.onmidimessage = midiMessageReceived;
    }
  }
  if (!midiIn) {
      midiIn = firstInput;
      if (midiIn)
        midiIn.onmidimessage = midiMessageReceived;
  }
}

function midiConnectionStateChange( e ) {
  console.log("connection: " + e.port.name + " " + e.port.connection + " " + e.port.state );
  populateMIDIInSelect();
}

function onMIDIStarted( midi ) {
  var preferredIndex = 0;

  midiAccess = midi;

  selectMIDI=document.getElementById("midiIn");
  midi.onstatechange = midiConnectionStateChange;
  populateMIDIInSelect();
  //selectMIDI.onchange = selectMIDIIn;
}

function onMIDISystemError( err ) {
  console.log( "MIDI not initialized - error encountered:" + err.code );
}

//init: start up MIDI
window.addEventListener('load', function() {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then( onMIDIStarted, onMIDISystemError );
  }
});
