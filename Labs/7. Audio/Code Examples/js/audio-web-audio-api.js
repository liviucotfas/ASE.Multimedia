"use strict";

//Details regarding building Visualizations using Web Audio API
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API


// set up forked web audio context
//The AudioContext interface represents an audio-processing graph built from audio modules linked together, each represented by an AudioNode. An audio context controls both the creation of the nodes it contains and the execution of the audio processing, or decoding. You need to create an AudioContext before you do anything else, as everything happens inside a context.
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//Creates an AnalyserNode, which can be used to expose audio time and frequency data and for example to create data visualisations.
//More details: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createAnalyser
var analyser = audioCtx.createAnalyser();
//The minDecibels property of the AnalyserNode interface Is a double value representing the minimum power value in the scaling range for the FFT analysis data, for conversion to unsigned byte/float values — basically, this specifies the minimum value for the range of results when using getFloatFrequencyData() or getByteFrequencyData().
//analyser.minDecibels = -90;
console.log(analyser.minDecibels);
//analyser.maxDecibels = -10;
console.log(analyser.maxDecibels);
analyser.smoothingTimeConstant = 0.85;

var drawVisual;

$(document).ready(function () {

  var visualSelect = document.getElementById("visual");
  // event listeners to change visualize settings
  visualSelect.onchange = function () {
    window.cancelAnimationFrame(drawVisual);
    visualize();
  }

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
        var source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        //analyser.connect(audioCtx.destination);

        visualize();
      })
      .catch(function (err) {
        // Error callback
        console.log('The following gUM error occured: ' + err);
      }
      );
  } else {
    console.log('getUserMedia not supported on your browser!');
  }
});

function visualize() {
  var visualSelect = document.getElementById("visual");

  // set up canvas context for visualizer
  var canvas = document.getElementById('visualizer');
  var context = canvas.getContext("2d");

  var intendedWidth = document.querySelector('.container').clientWidth;
  canvas.setAttribute('width', intendedWidth);

  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;

  var visualSetting = visualSelect.value;
  console.log(visualSetting);

  if (visualSetting == "sinewave") {
    analyser.fftSize = 1024;
    var bufferLength = analyser.fftSize;
    console.log(bufferLength);
    var dataArray = new Float32Array(bufferLength);

    context.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {

      drawVisual = requestAnimationFrame(draw);

      analyser.getFloatTimeDomainData(dataArray);

      context.fillStyle = 'rgb(200, 200, 200)';
      context.fillRect(0, 0, WIDTH, HEIGHT);

      context.lineWidth = 2;
      context.strokeStyle = 'rgb(0, 0, 0)';

      context.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for (var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] * 200.0;
        var y = HEIGHT / 2 + v;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }

        x += sliceWidth;
      }

      context.lineTo(canvas.width, canvas.height / 2);
      context.stroke();
    };

    draw();

  } else if (visualSetting == "frequencybars") {
    //Is an unsigned long value representing the size of the FFT (Fast Fourier Transform) to be used to determine the frequency domain.
    //More info: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
    analyser.fftSize = 256;
    
    //Is an unsigned long value half that of the FFT size. This generally equates to the number of data values you will have to play with for the visualization.
    var bufferLength = analyser.frequencyBinCount;
     console.log(bufferLength);
    
    var dataArray = new Uint8Array(bufferLength);

    context.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
      //The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes as an argument a callback to be invoked before the repaint.
      //More info: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
      drawVisual = requestAnimationFrame(draw);

      context.fillStyle = 'rgb(0, 0, 0)';
      context.fillRect(0, 0, WIDTH, HEIGHT);

       //Copies the current frequency data into a Uint8Array array passed into it.
      analyser.getByteFrequencyData(dataArray); //Value btween 0 and 255
      //http://stackoverflow.com/questions/14789283/what-does-the-fft-data-in-the-web-audio-api-correspond-to/14789992#14789992
      
      var barWidth = WIDTH / bufferLength;
      var barHeight;

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] + 10;
         //console.log(dataArray[i]);

        context.fillStyle = 'rgb(' + Math.min(barHeight*2,255) + ',50,50)';
        context.fillRect(barWidth * i, HEIGHT - barHeight, barWidth, barHeight);
      }
    };

    draw();

  }
}