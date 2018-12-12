"use strict";

//Details regarding building Visualizations using Web Audio API
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

const app = {
  //UI Controls
  canvas: null,
  context: null,
  visualSelect: null
}

// set up canvas context for visualizer
app.canvas = document.getElementById('visualizer');
app.context = app.canvas.getContext("2d");
app.visualSelect = document.getElementById("visual");

// set up forked web audio context
//The AudioContext interface represents an audio-processing graph built from audio modules linked together, each represented by an AudioNode. An audio context controls both the creation of the nodes it contains and the execution of the audio processing, or decoding. You need to create an AudioContext before you do anything else, as everything happens inside a context.
let audioCtx = new AudioContext();

//Creates an AnalyserNode, which can be used to expose audio time and frequency data and for example to create data visualisations.
//More details: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createAnalyser
let analyser = audioCtx.createAnalyser();

let drawVisual;

window.addEventListener("resize", function () {
  //reset canvas width and height to match the display values
  app.canvas.width = app.canvas.clientWidth;
  app.canvas.height = app.canvas.clientHeight;
});

// event listeners to change visualize settings
app.visualSelect.addEventListener("change", function () {
  audioCtx.resume()
  window.cancelAnimationFrame(drawVisual);
  visualize();
});

//main block for doing the audio recording
if (navigator.mediaDevices.getUserMedia) {

  console.log('getUserMedia supported.');

  //The MediaDevices.getUserMedia() method prompts the user for permission to use one video and/or one audio input device such as a camera or screensharing and/or a microphone. 
  //Part of WebRTC API
  //More details: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  navigator.mediaDevices.getUserMedia(
    {
      // constraints - only audio needed for this app
      audio: true
    })
    .then(function (stream) {
      // Success callback
      let source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      //analyser.connect(audioCtx.destination);
    })
    .catch(function (err) {
      // Error callback
      console.log('The following gUM error occured: ' + err);
    });
} else {
  console.log('getUserMedia not supported on your browser!');
}

function visualize() {
  let visualSetting = app.visualSelect.value;

  if (visualSetting == "frequencybars") {
    //Is an unsigned long value representing the size of the FFT (Fast Fourier Transform) to be used to determine the frequency domain.
    //More info: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
    analyser.fftSize = 256;
    drawFrequencyBars();
  } else if (visualSetting == "sinewave") {
    analyser.fftSize = 1024;
    drawSineWave();
  }
}

function drawFrequencyBars() {
  //The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes as an argument a callback to be invoked before the repaint.
  //Return value: A long integer value, the request id, that uniquely identifies the entry in the callback list. This is a non-zero value, but you may not make any other assumptions about its value. You can pass this value to window.cancelAnimationFrame() to cancel the refresh callback request.
  //More info: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  drawVisual = requestAnimationFrame(drawFrequencyBars);

  app.context.fillStyle = 'rgb(0, 0, 0)';
  app.context.fillRect(0, 0, app.canvas.width, app.canvas.height);

  //Is an unsigned long value half that of the FFT size. 
  let bufferLength = analyser.frequencyBinCount;

  //Copies the current frequency data into a Uint8Array array passed into it.
  let dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray); //Value btween 0 and 255
  //http://stackoverflow.com/questions/14789283/what-does-the-fft-data-in-the-web-audio-api-correspond-to/14789992#14789992

  let barWidth = app.canvas.width / bufferLength;
  let barHeight;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] + 10;

    app.context.fillStyle = 'rgb(' + Math.min(barHeight * 2, 255) + ',50,50)';
    app.context.fillRect(barWidth * i, app.canvas.height - barHeight, barWidth, barHeight);
  }
}

function drawSineWave() {
  drawVisual = requestAnimationFrame(drawSineWave);

  let bufferLength = analyser.fftSize;
  let dataArray = new Float32Array(bufferLength);
  analyser.getFloatTimeDomainData(dataArray);

  app.context.fillStyle = 'rgb(200, 200, 200)';
  app.context.fillRect(0, 0, app.canvas.width, app.canvas.height);

  app.context.lineWidth = 2;
  app.context.strokeStyle = 'rgb(0, 0, 0)';

  app.context.beginPath();

  let sliceWidth = app.canvas.width * 1.0 / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {

    let v = dataArray[i] * 200.0;
    let y = app.canvas.height / 2 + v;

    if (i === 0) {
      app.context.moveTo(x, y);
    } else {
      app.context.lineTo(x, y);
    }

    x += sliceWidth;
  }

  app.context.lineTo(app.canvas.width, app.canvas.height / 2);
  app.context.stroke();
}