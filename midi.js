var json = {
    "`":[0],
    "1":[1],
    "q":[2],
    "2":[3],
    "w":[4],
    "3":[5],
    "e":[6],
    "4":[7],
    "r":[8],
    "5":[9],
    "t":[10],
    "6":[11],
    "y":[12],
    "7":[13],
    "u":[14],
    "8":[15],
    "i":[16],
    "9":[17],
    "o":[18],
    "0":[19],
    "p":[20],
    "-":[21],
    "[":[22],
    "=":[23],
    "]":[24],
    "\\":[25],
    "a":[26],
    "z":[27],
    "s":[28],
    "x":[29],
    "d":[30],
    "c":[31],
    "f":[32],
    "v":[33],
    "g":[34],
    "b":[35],
    "h":[36],
    "n":[37],
    "j":[38],
    "m":[39],
    "k":[40],
    ",":[41],
    "l":[42],
    ".":[43],
    ";":[44],
    "/":[45],
    "'":[46],
    "~":[0],
    "!":[1],
    "@":[2],
    "#":[3],
    "$":[4],
    "%":[5],
    "^":[6],
    "&":[7],
    "*":[8],
    "(":[9],
    ")":[10],
    "_":[11],
    "+":[12],
    "Q":[13],
    "W":[14],
    "E":[15],
    "R":[16],
    "T":[17],
    "Y":[18],
    "U":[19],
    "I":[20],
    "O":[21],
    "P":[22],
    "{":[23],
    "}":[24],
    "|":[25],
    "A":[26],
    "S":[27],
    "D":[28],
    "F":[29],
    "G":[30],
    "H":[31],
    "J":[32],
    "K":[33],
    "L":[34],
    ":":[35],
    "\"":[36],
    "Z":[37],
    "X":[38],
    "C":[39],
    "V":[40],
    "B":[41],
    "N":[42],
    "M":[43],
    "<":[44],
    ">":[45],
    "?":[46]
}

function noteOn(n, v) {
  console.log( "Note on: " + n + " " + v);
  createOscillator(null, n, v);
}

function noteOff(n) {
  console.log( "Note off: " + n);
  stopOscillator(null, n);
}

function controller(n, v) {
  console.log( "Controller: " + n + " " + v);
  changeBaseFreq(v);
}

function pitchWheel(p) {
  console.log( "Pitch bend: " + p);
  changeBaseFreq(p*12);
}

function polyPressure(n, v) {
  console.log( "Poly aftertouch: " + n + " " + v);
  changeFrequency(null, n, v);
}

function midiMessageReceived( ev ) {
  var cmd = ev.data[0] >> 4;
  var channel = ev.data[0] & 0xf;
  var noteNumber = ev.data[1];
  var velocity = ev.data[2];

  if (channel == 9)
    return
  if ( cmd==8 || ((cmd==9)&&(velocity==0)) ) { // with MIDI, note on with velocity zero is the same as note off
    // note off
    noteOff( noteNumber );
  } else if (cmd == 9) {
    // note on
    noteOn( noteNumber, velocity/127.0);
  } else if (cmd == 11) {
    controller( noteNumber, velocity/127.0);
  } else if (cmd == 14) {
    // pitch wheel
    pitchWheel( ((velocity * 128.0 + noteNumber)-8192)/8192.0 );
  } else if ( cmd == 10 ) {  // poly aftertouch
    polyPressure(noteNumber,velocity/127.0)
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
  if (navigator.requestMIDIAccess)
    navigator.requestMIDIAccess().then( onMIDIStarted, onMIDISystemError );

});

window.addEventListener('keydown', function (e) {
    console.log( "Key down: " + e.key + " " + json[e.key]);
    if (json[e.key]) {
      if (shift_down === false) {
        var key = parseInt(json[e.key]);
        if (!keydown[key] || keydown[key] === false) {
          keydown[key] = true;
          key_down = true;
          noteOn(key, 0.5);
        }
      } else {
        changeLevel(e);
      }
    } else if (e.key == "ArrowRight") {
      moveSelect(1);
    } else if (e.key == "ArrowLeft") {
      moveSelect(-1);
    } else if (e.key == "ArrowUp") {
      timeScroll(false);
    } else if (e.key == "ArrowDown") {
      timeScroll(true);
    } else if (e.key == "Shift") {
      shift_down = true;
    }
});
 
window.addEventListener('keyup', function (e) {
    console.log( "Key up: " + e.key + " " + json[e.key]);
    if (json[e.key]) {
      var key = parseInt(json[e.key]);
      if (keydown[key] && keydown[key] === true) {
        keydown[key] = false;
        key_down = false;
        noteOff(key);
      }
    } else if (e.key == "Shift") {
      shift_down = false;
    }
});

window.addEventListener('mousemove', function (e) {
  if (key_down === true) {
    console.log( "Mouse move: " + e.clientX + " " + e.clientY);
    changeBaseFreq((e.clientX/screen.width+e.clientY/screen.height)*24);
  }
});