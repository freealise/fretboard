	window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
	if (navigator.platform.indexOf("iPad")>-1 || navigator.platform.indexOf("iPod")>-1 || navigator.platform.indexOf("iPhone")>-1) {
	  var context = new AudioContext();
	} else {
	  var context = new AudioContext({latencyHint:"interactive",sampleRate: 8000});
	}
	var calculateBaseFreq = function (note) {
    return Math.pow(2, (note - 69) / 12)*440;
  };
  var changeBaseFreq = function (p) {
    baseFreq = calculateBaseFreq(baseMidiKey+p);
  };
  var changeBaseVol = function (v) {
    baseGain.gain.setTargetAtTime(1.0-v, context.currentTime, 0.001);
  };
	var sampleRate = context.sampleRate,
	  baseGain = null,
    gainNode = [],
    //filter = [],
    mousedown = false,
    keydown = [],
    key_down = false,
    shift_down = false,
    on = false,
    rec = false,
    csv = "",
    record = [],
    play = false,
    pbTimeout = [],
    timer = false,
    timerInterval = 0,
    oscillator = [],
    oscillator_ = [],
    oscGain = [],
    oscGain_ = [],
    //startTime = [],
    baseMidiKey = 36,
    baseFreq = calculateBaseFreq(baseMidiKey),
    baseOctave = 0,
    keyWidth = 55,
    keyHeight = 800,
    hHeight = 128,
    stringLength = keyHeight*2,
    detuneKey = "mouseYPosition*2",
    detuneString = "-Math.log2((stringLength-mouseYPosition)/stringLength)*stringLength",
    detuneVoice = "",
    detuneMode = detuneKey,
    freqKey = "Math.pow(2,mouseYPosition/keyHeight/12*13)",
    freqString = "stringLength/13*12/(stringLength/13*12-mouseYPosition)",
    //freqVoice = "parseInt(mouseXPosition/keyWidth)+1",
    freqMode = freqKey,
    pi = Math.PI;
    var mouseX, mouseY, mouseKey,
        hSelected = 0;
    
    var real = new Float32Array(32);
    var imag = new Float32Array(32);
    var wave = [],
        points = [],
        voice = [];
        points[0] = [];
        voice[0] = [];
        voice[0][0] = [];
    var noteNum = 0,
        selectedVoice = 0,
        interval = [],
        timeout = null,
        timeout_ = null,
        time = 0;
    var myArrayBuffer = null;
    var n = 0;
    var aftertouch = [],
        noteOn = [],
        notesOn = [],
        velocity = [];
    notesOn[0] = []; //key
    notesOn[1] = []; //freq
    
    var showIntervals = false;
    var intervals = document.getElementById("intervals");
    
    var h_i = [];
    var h_i_txt = [];
    h_i[0] = 1.0;
    h_i_txt[0] = "1/1";
    for (var i=1; i<33; i++) {
      for (var j=32; j>i; j--) {
        var int = Math.round(j/i*144);
        int = int/144;
        int = int.toString(12);
        if (h_i.indexOf(int)==-1) {
          h_i.splice(h_i.length, 0, int);
          h_i_txt.splice(h_i_txt.length, 0, ""+j+"/"+i);
        }
      }
    }
    
    var y = [];
    //var avg = [];
    //var avg_ = [];
    var step = 32;
    var t = 0;
    //var row = [];
    var rowLength = 1;
    
    var help_id = 0;
    
    /*
    function mvaverage() {
      for (var i=0; i<row.length-1; i++) {
        for (var x=t; x<t+step; x++) {
            y[x] = (row[i+1]-row[i])/(step)*(x-t)+row[i];
        }
        t += step;
      }
      
      for (var x=0; x<y.length; x++) {
          avg_[x] = 0.0;
          for (var j=-step/2; j<step/2; j++) {
          	if (y[x+j]) {
          		avg_[x] += y[x+j];
              }
          }
          avg_[x] = avg_[x]/(step);
          
          avg[x] = 0.0;
          for (var j=-step; j<step; j++) {
          	if (y[x+j]) {
          		avg[x] += y[x+j];
              }
          }
          avg[x] = avg[x]/(step*2);
          avg[x] = avg[x] + (avg_[x]-avg[x])*2;
      }
      
      return avg;
    }
    
    function line(j) {
      for (var i=0; i<points[j].length-1; i++) {
        for (var x=t; x<t+step; x++) {
            y[x] = (points[j][i+1]-points[j][i])/(step)*(x-t)+points[j][i];
        }
        t += step;
      }
      return y;
    }
*/
    
    for (var x=0; x<keyWidth*25; x++) {
      aftertouch[x] = -Math.cos(x/keyWidth*pi*2)+1;
    }
    
    //var myOscilloscope = new oscilloscope(context, 'oscilloscope');
    //myOscilloscope.connect(context.destination);
    if (typeof MediaRecorder === "function") {
      var mediaStream = context.createMediaStreamDestination();
      var mediaRecorder = new MediaRecorder(mediaStream.stream);
      var chunks = [];
      mediaRecorder.ondataavailable = function(ev) {
        // push each chunk (blobs) in an array
        chunks.push(ev.data);
      };
      mediaRecorder.onstop = function(evt) {
        // Make blob out of our blobs, and open it.
        var blob = new Blob(chunks, { 'type' : 'audio/wav; codecs=pcm' });
        var src = URL.createObjectURL(blob);
        document.querySelector("audio").src = src;
        downloadWav(src);
      };
    } else {
      document.getElementById("recButton").style.display='none';
      document.getElementById("rec_audio").style.display='none';
    }
    
    var timeslider = document.getElementById("timeSlider");
    
    var keyboard = document.getElementById("keyboard");
    keyboard.style.width = keyWidth * 25 + "px";
    for (var i=0; i<25; i++) {
      var key = document.getElementById(i);
      
      key.style.left = keyWidth*i + "px";
      key.style.width = keyWidth-2 + "px";
      key.style.height = keyHeight-2 + "px";
      key.style.opacity = 0.5;
      /*if (Math.floor(i/2) == i/2) {
        if (i%12 > 4) {
          key.style.backgroundColor = "#000044";
        } else {
          key.style.backgroundColor = "#eeaaaa";
        }
      } else {
        if (i%12 > 4) {
          key.style.backgroundColor = "#eeaaaa";
        } else {
          key.style.backgroundColor = "#000044";
        }
      }*/
      key.style.backgroundImage = "url(px.png)";
      key.style.backgroundSize = "3px";
      key.style.backgroundPosition = "50% 0";
      key.style.backgroundRepeat = "repeat-y";
    }
    for (var i=0; i<13; i++) {
      keyboard.innerHTML += "<hr class='fret' style='top:"+(i+1)*keyHeight/13+"px;width:"+keyWidth*25+"px;' />";
    }
    
    for (var i=0; i<13; i++) {
      keyboard.innerHTML += "<div id='s"+i+"' style='opacity:0.5;position:absolute;top:"+i*keyHeight/13+"px;width:"+keyWidth*25+"px;height:"+keyHeight/13+"px;'></div>";
      var s = document.getElementById("s"+i);
      /*if (Math.floor(i/2) == i/2) {
        if (i%12 > 4) {
          s.style.backgroundColor = "#000044";
        } else {
          s.style.backgroundColor = "#eebb99";
        }
      } else {
        if (i%12 > 4) {
          s.style.backgroundColor = "#eebb99";
        } else {
          s.style.backgroundColor = "#000044";
        }
      }*/
      s.style.backgroundImage = "url(px.png), url(Untitled.gif)";
      s.style.backgroundSize = "1px 1px, " + keyWidth*12 + "px "+keyHeight/13+"px";
      s.style.backgroundPosition = "0% 50%, " + (0-i*keyWidth) + "px 0px";
      s.style.backgroundRepeat = "repeat-x, repeat";
    }
    
    var spectrum = document.getElementById("spectrum");
    spectrum.style.width = keyWidth * 25 + "px";
    for (var i=0; i<25; i++) {
      var h = document.getElementById("h" + i);
      
      h.style.left = keyWidth*i + "px";
      h.style.width = keyWidth + "px";
      h.style.height = hHeight + "px";
      h.style.opacity = 1;
      h.style.backgroundColor = "transparent";
      spectrum.innerHTML += "<div class='level' id='l"+i+"' style='left:"+keyWidth*i+"px;top:"+hHeight+"px;background-color:hsl("+(i*15)+",100%,50%);'></div>";
      
      var numbers = document.getElementById("numbers");
      
      numbers.innerHTML += "<pre style='left:"+(keyWidth*i+keyWidth/1.5)+"px;'>"+(i+1)+" </pre>";
      
      var g = document.getElementById("g" + i);
      
      g.style.left = keyWidth*(i+1) + "px";
      g.style.width = keyWidth + "px";
      g.style.height = hHeight + "px";
      g.style.opacity = 1;
      g.style.backgroundColor = "transparent";
    }
    
function downloadRec() {
    var text = csv.slice(0,-1);
    var filename = document.getElementById("filename").value + "_rec.csv";
  
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    csv = "";
}

// Convert an AudioBuffer to a Blob using WAVE representation
function bufferToWave(abuffer, len) {
  var numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [], i, sample,
      offset = 0,
      pos = 0;

  // write WAVE header
  setUint32(0x46464952);                         // "RIFF"
  setUint32(length - 8);                         // file length - 8
  setUint32(0x45564157);                         // "WAVE"

  setUint32(0x20746d66);                         // "fmt " chunk
  setUint32(16);                                 // length = 16
  setUint16(1);                                  // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2);                      // block-align
  setUint16(16);                                 // 16-bit (hardcoded in this demo)

  setUint32(0x61746164);                         // "data" - chunk
  setUint32(length - pos - 4);                   // chunk length

  // write interleaved data
  for(i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while(pos < length) {
    for(i = 0; i < numOfChan; i++) {             // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true);          // write 16-bit sample
      pos += 2;
    }
    offset++                                     // next source sample
  }

  // create Blob
  return new Blob([buffer], {type: "audio/wav; codecs=pcm"});

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

function downloadWav(src) {
    var filename = document.getElementById("filename").value + ".wav";
  
    var element = document.createElement('a');
    element.setAttribute('href', src);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
    
function download() {
    var text = "";
    for (var i=0; i<points.length; i++) {
      for (var j=0; j<points[i].length; j++) {
        text += points[i][j];
        if (j<points[i].length-1) {
          text += ",";
        } else if (i<points.length-1) {
          text += "\n";
        }
      }
    }
    var filename = document.getElementById("filename").value + ".csv";
  
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function uploadVoice() {
  var file    = document.getElementById("upload_voice").files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    var a = reader.result.split("\n");
    time = 0;
    for (var i=0; i<a.length; i++) {
      var l = a[i].split(",");
      points[i] = [];
      for (var j=0; j<l.length; j++) {
        points[i][j] = l[j];
      }
      drawLevel(i, i*keyWidth+keyWidth/2, points[i][0]);
    }
  }, false);

  if (file && file.name.slice(-4) == ".csv") {
    reader.readAsText(file);
  }
}

function uploadRec() {
  var file    = document.getElementById("upload_rec").files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    csv = reader.result;
    var a = reader.result.split("\n");
    time = 0;
    for (var i=0; i<a.length; i++) {
      var l = a[i].split(",");
      record[i] = [];
      for (var j=0; j<l.length; j++) {
        record[i][j] = l[j];
      }
      playback();
    }
  }, false);

  if (file && file.name.slice(-4) == ".csv") {
    reader.readAsText(file);
  }
}

function display_upload() {
  var u = document.getElementById("upload_popup");
  if (u.style.display != "block") {
    u.style.display = "block";
  } else {
    u.style.display = "none";
  }
}

function display_upload_rec() {
  var u = document.getElementById("upload_rec");
  if (u.style.display != "block") {
    u.style.display = "block";
  } else {
    u.style.display = "none";
  }
}

function display_param() {
  var p = document.getElementById("param_popup");
  if (p.style.display != "block") {
    p.style.display = "block";
  } else {
    p.style.display = "none";
  }
}

function showHelp(id) {
  var p = document.getElementById("help_popup");
  var t = document.getElementById("help_text");
  if (p.style.display != "none" && help[id]) {
    t.innerHTML = help[id][1];
  }
}

function display_help() {
  var p = document.getElementById("help_popup");
  if (p.style.display == "none") {
    p.style.display = "block";
  } else {
    p.style.display = "none";
  }
}

function show_intervals() {
  var i = document.getElementById("show_intervals");
  if (i.checked === true) {
    showIntervals = true;
  } else {
    showIntervals = false;
  }
}

function setDelay(i, t, ev, n, x, y) {
    if (ev == 1) {
      setTimeout(function(){
        pbTimeout[i] = createOscillator(null, n, x, y);
        clearTimeout(pbTimeout[i]);
      }, Math.round(t*1000));
    } else if (ev == -1) {
      setTimeout(function(){
        pbTimeout[i] = stopOscillator(null, n);
        clearTimeout(pbTimeout[i]);
      }, Math.round(t*1000));
    } else if (ev == 0) {
      setTimeout(function(){
        pbTimeout[i] = changeFrequency(null, n, x, y);
        clearTimeout(pbTimeout[i]);
      }, Math.round(t*1000));
    }
}

function playback() {
  for (i=0; i<record.length; i++) {
    var t = parseFloat(record[i][0]);
    var ev = parseInt(record[i][1]);
    var n = parseInt(record[i][2]);
    var x = parseFloat(record[i][3]);
    var y = parseFloat(record[i][4]);
    setDelay(i, t, ev, n, x, y);
  }
}

var calculateFrequency = function (note) {
    return baseFreq * Math.pow(2,parseInt(note)/12);
};

var calculatePlaybackRate = function (mouseXPosition, mouseYPosition) {
    return eval(freqMode);
};

var calculateDetune = function (mouseYPosition) {
    return eval(detuneMode);
};

var calculateGain = function (mouseXPosition, mouseYPosition) {
    return aftertouch[parseInt(mouseXPosition)]/20; //0 - 1
};

var drawLevel = function (i, x, y) {
    var l = document.getElementById("l"+i);
    if (x < keyWidth*(parseInt(i)+2) && x >= keyWidth*i+1) {
      l.style.width = 3 + 'px';
      l.style.left = keyWidth*i + keyWidth/2-2 + "px";
    }
    if (y < hHeight && y >= 0) {
      l.style.top = (hHeight-y)/2 + 'px';
      l.style.height = y + 'px';
    }
        for (var n=0; n<points.length; n++) {
        	var g = document.getElementById('g'+n);
        	var h = "";
        	if (!points[n]) {points[n] = [];}
        	for (var t=0; t<points[n].length; t++) {
        	  if (!points[n][t]) {points[n][t] = 0;}
        		h += "<hr width='"+points[n][t]/48*keyWidth/2+"%' size='2' align='center' style='border-color:hsl("+(n*15)+",100%,50%);'/>";
        	}
          g.innerHTML = h;
        }
};

function mouseDown(e) {
    mousedown = true;
    mouseKey = e.target.id;
    createOscillator(e);
}

function mouseUp(e) {
    if (mousedown) {
      
      noteOn[mouseKey] = false;
        
      clearInterval(interval[mouseKey]);
      gainNode[mouseKey].gain.setTargetAtTime(0, context.currentTime, 0.001);
      oscGain[mouseKey].gain.setTargetAtTime(0, context.currentTime, 0.001);
      oscGain_[mouseKey].gain.setTargetAtTime(0, context.currentTime, 0.001);
      
      //oscillator[mouseKey].loopStart = 0.9999;
      //oscillator[mouseKey].loopEnd = 1.0;
      
      //oscillator[mouseKey].stop(context.currentTime);
      //oscillator[mouseKey].disconnect();

      mousedown = false;
    }
}

function mouseMove(e) {
    if (mousedown) {
      n = e.target.id;
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (noteOn[n] === true) {
        var pbRate = calculateFrequency(n)*calculatePlaybackRate(mouseX, mouseY);
  	    oscillator[n].frequency.setTargetAtTime(pbRate, context.currentTime, 0.001);
  	    oscillator_[n].frequency.setTargetAtTime(pbRate, context.currentTime, 0.001);
        //oscillator[e.target.id].detune.setTargetAtTime(calculateDetune(mouseY), context.currentTime, 0.001);
        gainNode[n].gain.setTargetAtTime(calculateGain(mouseX, mouseY), context.currentTime, 0.001);
        if (n < parseInt(mouseX/keyWidth) || n >= parseInt(mouseX/keyWidth+1)) {
          gainNode[n].gain.setTargetAtTime(0, context.currentTime, 0.001);
        }
      }
    }
}

var drawIntervals = function() {
  var k=1;
  intervals.innerHTML = '';
  for (var i=0; i<notesOn[0].length; i++) {
    for (var j=notesOn[0].length-1; j>i; j--) {
      if (notesOn[1][i]>notesOn[1][j]) {
        var int = notesOn[1][i]/notesOn[1][j];
      } else {
        var int = notesOn[1][j]/notesOn[1][i];
      }
      int = Math.round(int*144);
      int = int/144;
      int = int.toString(12);
      var c = "white";
      var txt = "";
      for (var l=0; l<h_i.length; l++) {
        if (int == h_i[l]) {
          c = "red";
          txt = h_i_txt[l];
        }
      }
      var x_ = (notesOn[0][i]*keyWidth+keyWidth/2);
      var x = (notesOn[0][j]*keyWidth+keyWidth/2);
      if (x>x_) {var mid = (x-x_)/2+x_;}
      else {var mid = (x_-x)/2+x;}
      intervals.innerHTML += '<text x="'+mid+'" y="'+(k*20-5)+'" fill="white">'+txt+'</text>';
      intervals.innerHTML += '<path d="M '+x_+' '+(k*20)+' L '+x+' '+(k*20)+'" stroke="'+c+'" stroke-width="1" fill="none" />';
      k++;
    }
  }
}

var createOscillator = function (e, n, v) {
    var t = context.currentTime;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (mousedown) {
        var n = e.target.id;
        var xPos = e.clientX;
        var yPos = e.clientY;
        
      } else if (e.changedTouches) {
        var n = e.changedTouches[0].target.id;
        var xPos = e.changedTouches[0].clientX;
        var yPos = e.changedTouches[0].clientY;
      }
    } else if (n>-1 && v>-1) {
      var yPos = 0;
      if (n>24) {
        n-=24;
        var yPos = keyHeight;
      }
      var xPos = n*keyWidth+v*keyWidth/2;
      velocity[n] = v;
    }
    
    noteOn[n] = true;
    if (noteNum < wave.length-1) {
      noteNum++;
    } else {
      noteNum = 0;
    }
    
    //oscillator[e.target.id] = context.createOscillator();
    //oscillator_[e.target.id] = context.createOscillator();
    
    var pbRate = calculateFrequency(n)*calculatePlaybackRate(xPos, yPos);
    
    notesOn[0].splice(notesOn[0].length, 0, n);
    notesOn[1].splice(notesOn[1].length, 0, pbRate);
    if (showIntervals === true) {drawIntervals();}
    
	  oscillator[n].frequency.setTargetAtTime(pbRate, t, 0.001);
	  oscillator_[n].frequency.setTargetAtTime(pbRate, t, 0.001);
    //oscillator_[e.target.id].detune.setTargetAtTime(calculateDetune(yPos), context.currentTime, 0.001);
    //oscillator[e.target.id].frequency.setTargetAtTime(calculateFrequency(e.target.id), context.currentTime, 0.001);
    //oscillator[e.target.id].detune.setTargetAtTime(calculateDetune(yPos), context.currentTime, 0.001);
    
    /*oscillator[e.target.id].loopStart = 0.0;
	  oscillator[e.target.id].loopEnd = 8.0;
	  timeout[e.target.id] = setTimeout(function(){
        oscillator[e.target.id].loopStart = 8.0;
	      oscillator[e.target.id].loopEnd = 8.001;
      }, 1000/pbRate);*/
    
    oscillator[n].setPeriodicWave(wave[noteNum][0]);
    oscGain[n].gain.value = 1.0;
    oscGain[n].gain.linearRampToValueAtTime(0.0, t + 0.10);
    
    oscGain_[n].gain.value = 0.0;
    oscillator_[n].setPeriodicWave(wave[noteNum][1]);
    oscGain_[n].gain.linearRampToValueAtTime(1.0, t + 0.10);
    
    gainNode[n].gain.setTargetAtTime(calculateGain(xPos, yPos), t, 0.001);
    
    var j=1;
    interval[n] = setInterval(function(){ //setTimeouts are more precise? save context.currentTime to var.
      if (j<wave[noteNum].length) {
        
        if (parseInt(j/2) == j/2) {
          
          oscGain_[n].gain.value = 0.0;
          //oscGain_[e.target.id].gain.setTargetAtTime(0, context.currentTime, 0);
          oscillator_[n].setPeriodicWave(wave[noteNum][j]);
            
          //oscGain[e.target.id].gain.setTargetAtTime(0.0, context.currentTime, 0.10);
          //oscGain_[e.target.id].gain.setTargetAtTime(1.0, context.currentTime, 0.10);
            
          oscGain[n].gain.linearRampToValueAtTime(0.0, context.currentTime + 0.10);
          oscGain_[n].gain.linearRampToValueAtTime(1.0, context.currentTime + 0.10);
        } else {
          
          oscGain[n].gain.value = 0.0;
          //oscGain_[e.target.id].gain.setTargetAtTime(0, context.currentTime, 0);
          oscillator[n].setPeriodicWave(wave[noteNum][j]);
            
          //oscGain[e.target.id].gain.setTargetAtTime(0.0, context.currentTime, 0.10);
          //oscGain_[e.target.id].gain.setTargetAtTime(1.0, context.currentTime, 0.10);
            
          oscGain_[n].gain.linearRampToValueAtTime(0.0, context.currentTime + 0.10);
          oscGain[n].gain.linearRampToValueAtTime(1.0, context.currentTime + 0.10);
        }
        
        j++;
      } else {
        
        noteOn[n] = false;
        
        oscGain[n].gain.setTargetAtTime(0, context.currentTime, 0.001);
        oscGain_[n].gain.setTargetAtTime(0, context.currentTime, 0.001);
        
        gainNode[n].gain.setTargetAtTime(0, context.currentTime, 0.001);
        
        clearInterval(interval[n]);
      }
    }, 100);

    //filter[e.target.id].frequency.setTargetAtTime(calculateFrequency(e.target.id)*(j+1), context.currentTime, 0.001);

    /*oscillator[e.target.id].connect(oscGain[e.target.id]);
    oscillator[e.target.id].start(context.currentTime);
    oscillator_[e.target.id].connect(oscGain_[e.target.id]);
    oscillator_[e.target.id].start(context.currentTime);*/

    //startTime[e.target.id] = context.currentTime;
    
    if (rec === true) {
      csv += t+",1,"+n+","+xPos+","+yPos+"\n";
    }
};

var stopOscillator = function (e, n) {
    if (oscillator) {
      var t = context.currentTime;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.changedTouches) {
          var n = e.changedTouches[0].target.id;
        } else if (mousedown) {
          var n = e.target.id;
        }
      } else if (n>-1) {
        if (n>24) {
          n-=24;
        }
      }
          
      noteOn[n] = false;
      
      notesOn[1].splice(notesOn[0].indexOf(n), 1);
      notesOn[0].splice(notesOn[0].indexOf(n), 1);
      if (showIntervals === true) {drawIntervals();}
          
      clearInterval(interval[n]);
      gainNode[n].gain.setTargetAtTime(0, t, 0.001);
      oscGain[n].gain.setTargetAtTime(0, t, 0.001);
      oscGain_[n].gain.setTargetAtTime(0, t, 0.001);
          
          /*oscillator[n].stop(context.currentTime+0.001);
          oscillator[n].disconnect();
    
          oscillator_[n].stop(context.currentTime+0.001);
          oscillator_[n].disconnect();*/
          
          /*timeout[n] = setTimeout(function(){
            oscillator[n].loopStart = 8.0;
	          oscillator[n].loopEnd = 8.001;
          }, 2);*/
      
      if (rec === true) {
        csv += context.currentTime+",-1,"+n+",0,0\n";
      }
    }
};

var changeFrequency = function (e, n, v) {
    if (oscillator) {
      var t = context.currentTime;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        if (mousedown) {
          var length = 1;
        } else if (e.changedTouches) {
          var length = e.changedTouches.length;
        }
      } else if (n && v) {
        var length = 1;
      }
      for (var i=0; i<length; i++) {
        if (e) {
          if (e.changedTouches) {
            var n = e.changedTouches[i].target.id;
            var xPos = e.changedTouches[i].clientX;
            var yPos = e.changedTouches[i].clientY;
          } else if (mousedown) {
            var n = e.target.id;
            var xPos = e.clientX;
            var yPos = e.clientY;
          }
        } else if (n>-1 && v>-1) {
          var yPos = 0;
          if (n>24) {
            n-=24;
            var yPos = keyHeight;
          }
          var xPos = n*keyWidth+(velocity[n]+v)*keyWidth/2;
        }
        if (noteOn[n] === true) {
          var pbRate = calculateFrequency(n)*calculatePlaybackRate(xPos, yPos);
          
          notesOn[1][notesOn[0].indexOf(n)] = pbRate;
          if (showIntervals === true) {drawIntervals();}
          
        	oscillator[n].frequency.setTargetAtTime(pbRate, t, 0.001);
        	oscillator_[n].frequency.setTargetAtTime(pbRate, t, 0.001);
          	          
          //oscillator[n].detune.setTargetAtTime(calculateDetune(yPos), context.currentTime, 0.001); //fallback for iOS
          //oscillator_[n].detune.setTargetAtTime(calculateDetune(yPos), context.currentTime, 0.001);
            
    	    //filter[n].frequency.setTargetAtTime(calculateFrequency(e.target.id)*(j+1), context.currentTime, 0.001);
          
          gainNode[n].gain.setTargetAtTime(calculateGain(xPos, yPos), t, 0.001);
          //oscillator[n].detune.value = calculateDetune(yPos);
          //gainNode[n].gain.value = calculateGain(xPos, yPos);
          if (n < parseInt(xPos/keyWidth) || n >= parseInt(xPos/keyWidth+1)) {
            gainNode[n].gain.setTargetAtTime(0, t, 0.001);
          }
        }
      }
          
      if (rec === true) {
        csv += context.currentTime+",0,"+n+","+xPos+","+yPos+"\n";
      }
    }
};

var rnd = function (e) {
  return Math.random();
}

var initOscillator = function (e) {
  
  /*
  voice[0] = "2/Math.pow(2, i+1)*Math.random()";
  voice[1] = "2/(i+1)*Math.random()";
  voice[2] = "2/Math.pow(2, (i+1)/2)*Math.random()";
  voice[3] = "2/((i+1)/2)*Math.random()";
  voice[4] = "2/Math.pow(2, (i+1)/4)*Math.random()";
  voice[5] = "2/((i+1)/4)*Math.random()";
  
  voice[0] = "1*Math.random()*2";
  voice[1] = "0.5*Math.random()*2";
  voice[2] = "0.25*Math.random()*2";
  voice[3] = "0.125*Math.random()*2";
  voice[4] = "0.0625*Math.random()*2";
  voice[5] = "0.03125*Math.random()*2";
  */
  
  if (!voice[0][0][0]) {
    for (var i=0; i<25; i++) {
      voice[0][i] = [];
      points[i] = [];
      for (var j=0; j<8; j++) {
        voice[0][i][j] = Math.random()*96/(i+1)/(j+1);
        points[i][j] = voice[0][i][j];
      }
      drawLevel(i, i*keyWidth+keyWidth/2, points[i][0]);
    }
  }
  
  noteNum = -1;
  
  var notes = parseInt(document.getElementById('notes').value);
  var random = document.getElementById('random').value;
  if (random.indexOf('.')<0) {random += '.0';}
  var rndLevel = parseFloat(random);
  
  real[0] = 0;
  imag[0] = 0;
    
  //for (var n=0; n<25; n++) {
/*
    for (var j=0; j<voice.length; j++) {
      for (var i=0; i<2; i++) {
    	  real[i+1] = 0;
    	  imag[i+1] = eval(voice[j]);
    	}
    	wave[j] = context.createPeriodicWave(real, imag, {disableNormalization: true});
    }
*/
  var options = {
    real : real,
    imag : imag,
    disableNormalization : false
  }
  
  for (var t=0; t<notes; t++) {
    wave[t] = [];
    for (var j=0; j<points[0].length; j++) {
      for (var i=0; i<points.length; i++) {
        real[i+1] = 0;
        if (points[i][j]) {
          imag[i+1] = points[i][j] / 48 * (Math.random()*rndLevel+(1-rndLevel/2));
        } else {
          imag[i+1] = 0;
        }
    	}
    	if (typeof context.createPeriodicWave === "function") {
    	  wave[t][j] = context.createPeriodicWave(real, imag, {disableNormalization: false});
      } else {
        wave[t][j] =  new PeriodicWave(context, options);
      }
    }
  }

  /*
  for (var t=0; t<voice.length; t++) {
    wave[t] = [];
    for (var j=0; j<voice[t][0].length; j++) {
      for (var i=0; i<voice[t].length; i++) {
        real[i+1] = 0;
        if (voice[t][i][j]) {
          imag[i+1] = voice[t][i][j] / 48 * (Math.random()*rndLevel+(1-rndLevel/2));
        } else {
          imag[i+1] = 0;
        }
    	}
    	if (typeof context.createPeriodicWave === "function") {
    	  wave[t][j] = context.createPeriodicWave(real, imag, {disableNormalization: false});
      } else {
        wave[t][j] =  new PeriodicWave(context, options);
      }
    }
  }
  */
  
  //}

/*
    //can depend on time, frequency, volume, rnd() with range settings (multiply harmonics)
    //edit in textarea and draw spectrum on change
    //not whole formula but variable parameters
  
  var channels = 1;
  var frameCount = sampleRate * 1.0;
  //step = parseInt(Math.round(frameCount / rowLength));
  
  //eval
  //var amp = document.getElementById("spectrumVol").value;
  //var freq = document.getElementById("spectrumFreq").value;
  var amp = [];
  
  for (var n=0; n<25; n++) {
    wave[0] = context.createBuffer(channels, frameCount, sampleRate);
  
    for (var channel = 0; channel < channels; channel++) {
      var nowBuffering = wave[0].getChannelData(channel);

      for (var i = 0; i < frameCount*8+64; i++) {
        nowBuffering[i] = 0.0;
        if (i<frameCount*8) { //bit of silence to loop when note is off
          amp[i] = [];
          for (var j=0; j<points.length; j++) {
            // Math.random() is in [0; 1.0]
            // audio needs to be in [-1.0; 1.0]
            amp[i][j] = 0.0;
            var step = frameCount/(points[j].length);
            var h = parseInt(i/step);
            var t = h*step;
            amp[i][j] = ((points[j][h+1]-points[j][h])/(step)*(i-t)+points[j][h])/24;
            //alert(amp[i][j]);
            //for (var h=0; h<points[j].length-1; h++) {
              //amp[i][j] += Math.abs(Math.sin(i*(h+1)*pi/8/frameCount/Math.pow(2,parseInt(n)/12))) * points[j][h] / points[j].length / points.length;
              //amp[i][j] = ((points[j][h+1]-points[j][h])/((step)*(i-step*h))/Math.pow(2,parseInt(n)/12)+points[j][h])/16;
            //}
            nowBuffering[i] += Math.sin(i*(j+1)*pi*2*baseFreq/sampleRate * 1) * amp[i][j] / points.length; //1/Math.pow(2, j);
          }
        }
      }
    }
  }
  */
}

function mouseDownLevel(e) {
    mousedown = true;
}

function mouseUpLevel(e) {
    if (mousedown) {
      mousedown = false;
    }
}

var changeLevel = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (mousedown || shift_down) {
          var length = 1;
        } else if (e.changedTouches) {
          var length = e.changedTouches.length;
        }
        
        for (var i=0; i<length; i++) {
          if (mousedown) {
            var n = parseInt(e.target.id.slice(1));
            var tg = e.target.id.slice(0, 1);
            var xPos = e.clientX;
            var yPos = e.clientY;
          } else if (shift_down) {
            var n = hSelected;
            var tg = "h";
            var xPos = (hSelected+1)*keyWidth+keyWidth/2;
            var yPos = hHeight - parseInt(json[e.key])*2;
          } else if (e.changedTouches) {
            var n = parseInt(e.changedTouches[i].target.id.slice(1));
            var tg = e.changedTouches[i].target.id.slice(0, 1);
            var xPos = e.changedTouches[i].clientX;
            var yPos = e.changedTouches[i].clientY;
          }
          
            if (!points[n]) {
              points[n] = [];
              for (var t=0; t<time; t++) {
                points[n][t] = 0;
              }
            }
            
            if (tg == "h") {
              points[n][time] = hHeight-yPos;
              if (hHeight-yPos < 0) {
                points[n][time] = 0;
              }
              drawLevel(n, xPos, points[n][time]);
              
              /*if (timer === true) {
                timerInterval++;
                if (timerInterval == 25) {
                  timeScroll(true);
                  timerInterval = 0;
                }
              }*/
              
              if (timer === true) {
                timerInterval  = setInterval(function(){
                  timeScroll(true);
                }, 250);
                timer = null;
              }
              
            } else if (tg == "g" && yPos >= hHeight && yPos < hHeight*2) {
              yPos += document.getElementById("gradient").scrollTop;
              
              points[n][parseInt((yPos-hHeight)/10)] = (xPos-keyWidth*(n+1))*2;
              if (n < parseInt(xPos/keyWidth-1)) {
                points[n][parseInt((yPos-hHeight)/10)] = keyWidth*2;
              } else if (n >= parseInt(xPos/keyWidth)) {
                points[n][parseInt((yPos-hHeight)/10)] = 0;
              }
              drawLevel(n, (yPos-hHeight)/hHeight*keyWidth+keyWidth*(n+1), points[n][parseInt((yPos-hHeight)/10)]);
              timeChange(parseInt((yPos-hHeight)/10));
            } else if (tg == "t") {
              timeChange(parseInt((yPos-hHeight)/10));
              document.getElementById("gradient").scrollTo(0, yPos-hHeight);
            }
        }
}

var timeScroll = function (t) {
  if (t === true) {
    timeChange(time+1);
    document.getElementById("gradient").scrollBy(0, 10);
  } else if (t === false) {
    timeChange(time-1);
    document.getElementById("gradient").scrollBy(0, -10);
  }
}

var timeChange = function (t) {
  if (points[0] && t >= 0 && t < points[0].length) {
    time = t;
    timeslider.style.top = time*10 + "px";
    for (var n=0; n<points.length; n++) {
      drawLevel(n, n*keyWidth+keyWidth/2, points[n][time]);
    }
  }
}

var timerSwitch = function (e) {
  var t = document.getElementById("timer");
  if (timer === false) {
    timer = true;
    t.innerText = "timer_off";
  } else {
    clearInterval(timerInterval);
    timer = false;
    t.innerText = "timer";
  }
}

var moveSelect = function (i) {
  hSelected+=i;
  if (hSelected<0) {hSelected=0;}
  else if (hSelected>24) {hSelected=24;}
  var h = document.getElementById("h_select");
  h.style.left = (hSelected*keyWidth+70)+"px";
}

var controlPoint = function (a) {
  var length = points[0].length;
  if (a === true) {
    for (var n=0; n<points.length; n++) {
      for (var t=length; t>time; t--) {
        points[n][t] = points[n][t-1];
      }
      points[n][time] = 0;
      drawLevel(n, n*keyWidth+keyWidth/2, points[n][time]);
    }
  } else {
    for (var n=0; n<points.length; n++) {
      for (var t=time; t<length-1; t++) {
        points[n][t] = points[n][t+1];
      }
      points[n].splice(length-1, 1);
      if (time >= points[n].length) {
        time = points[n].length-1;
      } else if (time < 0) {
        time = 0;
      }
      timeslider.style.top = time*10 + "px";
      drawLevel(n, n*keyWidth+keyWidth/2, points[n][time]);
    }
  }
}

var switchVoice = function (t) {
  voice[selectedVoice] = [];
  for (var i=0; i<points.length; i++) {
    voice[selectedVoice][i] = [];
    for (var j=0; j<points[i].length; j++) {
      voice[selectedVoice][i][j] = points[i][j];
    }
  }
  for (var i=0; i<25; i++) {
    points[i] = [];
    points[i][0] = 0;
    drawLevel(i, i*keyWidth+keyWidth/2, points[i][0]);
  }
  if (voice[t]) {
    for (var i=0; i<voice[t].length; i++) {
      for (var j=0; j<voice[t][i].length; j++) {
        points[i][j] = voice[t][i][j];
      }
    }
  }
  time = 0;
  timeChange(time);
  selectedVoice = t;
}

var addVoice = function () {
  var voice_number = document.getElementById('voice_number');
  var option = document.createElement("option");
  option.text = "" + voice.length;
  option.value = voice.length;
  option.selected = true;
  voice_number.add(option);
  
  switchVoice(voice.length);
}

/*
var spectrumChange = function (e) {
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
    "'":[46]
  }
  var spectrumTextarea = document.getElementById("spectrumText");
  var spectrumValues = document.getElementById("spectrumValues");
  var spectrumText = spectrumTextarea.value.split("");
  //var spectrumArray = spectrumTextarea.value.split("\n").split("");
  spectrumValues.innerHTML = "";
  var j=0, h=0;
  points = [];
  points[0] = [];
  for (var i=0; i<spectrumText.length; i++) {
    if (json[spectrumText[i]]) {
      spectrumValues.innerHTML += "<span style='color:rgba(" + json[spectrumText[i]][0]*4 + ", " + json[spectrumText[i]][0]*4 + ", " + json[spectrumText[i]][0]*4 + ", 1.0);'>&#9632;</span>";
      points[j][h] = json[spectrumText[i]][0];
      h++;
    } else {
      spectrumValues.innerHTML += "\n";
      h=0;
      j++;
      points[j] = [];
    }
  }
}
*/

var onoffSwitch = function (e) {
  var onoff = document.getElementById("onoff");
  if (on === false) {
    initOscillator();
    init();
    on = true;
    onoff.innerText = "music_note";
  } else {
    stop();
    on = false;
    onoff.innerText = "music_off";
  }
}

var recSwitch = function (e) {
  var r = document.getElementById("rec");
  if (rec === false) {
    if (mediaRecorder) {
      mediaRecorder.start();
    }
    r.innerHTML = '<i class="material-icons">stop</i>';
    rec = true;
  } else {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    r.innerHTML = '<i class="material-icons">fiber_manual_record</i>';
    rec = false;
    /*if (csv != "") {
      downloadRec();
    }*/
  }
}

var modeChange = function (mode) {
  var keyboard = document.getElementById("keyboard");
  var frets = document.getElementsByClassName("fret");
  var scaleButton = document.getElementById("scale").getElementsByTagName("button");
  if (mode == "keys") {
    keyboard.style.backgroundImage = 'url(bg_keys.svg)';
    detuneMode = detuneKey;
    freqMode = freqKey;
    for (var i=0; i<13; i++) {
      frets[i].style.top = (i+1)*keyHeight/13 + "px";

      var stripe = document.getElementById("s"+i);
      stripe.style.top = i*keyHeight/13 + "px";
      stripe.style.height = keyHeight/13 + "px";
    }
    scaleButton[0].className = "selected";
    scaleButton[1].className = "";
  } else if (mode == "strings") {
    keyboard.style.backgroundImage = 'url(bg_strings.svg)';
    detuneMode = detuneString;
    freqMode = freqString;
    for (var i=1; i<=13; i++) {
      frets[i-1].style.top = keyHeight*2 - Math.pow(2, i/13)*keyHeight + "px";

      var stripe = document.getElementById("s"+(13-i));
      stripe.style.top = keyHeight*2 - Math.pow(2, i/13)*keyHeight + "px";
      stripe.style.height = (keyHeight*2 - Math.pow(2, (i-1)/13)*keyHeight) - (keyHeight*2 - Math.pow(2, i/13)*keyHeight) + "px";
    }
    scaleButton[0].className = "";
    scaleButton[1].className = "selected";
  }
}

var voiceControl = function (e) {
  var voicePopup = document.getElementById("voicePopup");
  if (voicePopup.style.display != "block") {
    voicePopup.style.display = "block";
    window.scrollTo(0, 0);
  } else {
    voicePopup.style.display = "none";
  }
}

var changeSampleRate = function (r) {
  var context = new AudioContext({latencyHint:"interactive",sampleRate: r});
  onoffSwitch();
  onoffSwitch();
}

var init = function (e) {
  baseGain = context.createGain();
  baseGain.gain.value = 1.0;
  baseGain.connect( context.destination ); //myOscilloscope
  if (mediaStream) {baseGain.connect( mediaStream );}
  
  for (var i=0; i<25; i++) {
    var key = document.getElementById(i);
    
    key.addEventListener('mousedown', mouseDown);
    key.addEventListener('mouseup', mouseUp);
    key.addEventListener('mouseout', mouseUp);
    key.addEventListener('mousemove', mouseMove);
    key.addEventListener('touchstart', createOscillator);
    key.addEventListener('touchend', stopOscillator);
    key.addEventListener('touchcancel', stopOscillator);
    key.addEventListener('touchmove', changeFrequency);

    gainNode[i] = context.createGain();
    gainNode[i].gain.value = 0.0;
    gainNode[i].connect( baseGain );
    
    oscGain[i] = context.createGain();
    oscGain[i].gain.value = 1.0;
    oscGain[i].connect( gainNode[i] );
    
    oscGain_[i] = context.createGain();
    oscGain_[i].gain.value = 0.0;
    oscGain_[i].connect( gainNode[i] );
    
    /*
    filter[i] = [];
    for (var j=0; j<8; j++) {
      filter[i][j] = context.createBiquadFilter();
  	  filter[i][j].type = "peaking";
  	  filter[i][j].frequency.value = baseFreq*(j+1);
  	  filter[i][j].Q.value = 20.0;
  	  filter[i][j].gain.value = 0.01;
  	  filter[i][j].connect( gainNode[i] );
  	  oscGain[i].connect( filter[i][j] );
    }
    
    oscGain_[i] = context.createGain();
    oscGain_[i].gain.value = 0;
    oscGain_[i].connect( gainNode[i] );
    */
    
    /*
    oscillator[i] = context.createOscillator();
    oscillator[i].setPeriodicWave(wave[i][0]);
    oscillator[i].frequency.value = 0;
    
    oscillator_[i] = context.createOscillator();
    oscillator_[i].setPeriodicWave(wave[i][1]);
    oscillator_[i].frequency.value = 0;
    
    oscillator[i].connect(oscGain[i]);
    oscillator[i].start(context.currentTime);
    
    oscillator_[i].connect(oscGain_[i]);
    oscillator_[i].start(context.currentTime);
    */
    
    //oscillator[i] = context.createBufferSource();
    //oscillator[i].buffer = wave[0];
    //oscillator[i].loop = true;
    //oscillator[i].loopStart = 0.0;
    //oscillator[i].loopEnd = 1.0;
    
    oscillator[i] = context.createOscillator();
    oscillator[i].setPeriodicWave(wave[0][0]);
    oscillator[i].connect(oscGain[i]);
    oscillator[i].start(context.currentTime);
    
    oscillator_[i] = context.createOscillator();
    oscillator_[i].setPeriodicWave(wave[0][1]);
    oscillator_[i].connect(oscGain_[i]);
    oscillator_[i].start(context.currentTime);
  }
}

var stop = function (e) {
  for (var i=0; i<25; i++) {
    oscillator[i].stop(context.currentTime);
    oscillator[i].disconnect();
    
    oscillator_[i].stop(context.currentTime);
    oscillator_[i].disconnect();
    
    var key = document.getElementById(i);
    
    key.removeEventListener('mousedown', mouseDown);
    key.removeEventListener('mouseup', mouseUp);
    key.removeEventListener('mouseout', mouseUp);
    key.removeEventListener('mousemove', mouseMove);
    key.removeEventListener('touchstart', createOscillator);
    key.removeEventListener('touchend', stopOscillator);
    key.removeEventListener('touchcancel', stopOscillator);
    key.removeEventListener('touchmove', changeFrequency);
  }
}

  for (var i=0; i<25; i++) {
    var h = document.getElementById("h" + i);
    
    h.addEventListener('mousedown', mouseDownLevel);
    h.addEventListener('mouseup', mouseUpLevel);
    h.addEventListener('mouseout', mouseUpLevel);
    h.addEventListener('mousemove', changeLevel);
    h.addEventListener('touchstart', changeLevel);
    h.addEventListener('touchend', changeLevel);
    h.addEventListener('touchcancel', changeLevel);
    h.addEventListener('touchmove', changeLevel);
    
    var g = document.getElementById("g" + i);
    
    g.addEventListener('mousedown', mouseDownLevel);
    g.addEventListener('mouseup', mouseUpLevel);
    g.addEventListener('mouseout', mouseUpLevel);
    g.addEventListener('mousemove', changeLevel);
    g.addEventListener('touchstart', changeLevel);
    g.addEventListener('touchend', changeLevel);
    g.addEventListener('touchcancel', changeLevel);
    g.addEventListener('touchmove', changeLevel);
  }
  
    var t = document.getElementById("time");
    
    t.addEventListener('mousedown', mouseDownLevel);
    t.addEventListener('mouseup', mouseUpLevel);
    t.addEventListener('mouseout', mouseUpLevel);
    t.addEventListener('mousemove', changeLevel);
    t.addEventListener('touchstart', changeLevel);
    t.addEventListener('touchend', changeLevel);
    t.addEventListener('touchcancel', changeLevel);
    t.addEventListener('touchmove', changeLevel);
    
    onoffSwitch();
    showHelp(0);