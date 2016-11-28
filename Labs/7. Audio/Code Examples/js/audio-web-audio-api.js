"use strict";

// fork getUserMedia for multiple browser versions, for those that need prefixes

navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);

// set up forked web audio context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var stream;

//set up the different audio nodes we will use for the app
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

 var drawVisual;

$(document).ready(function () {

  var visualSelect = document.getElementById("visual");
 

  //main block for doing the audio recording
  if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.mediaDevices.getUserMedia(
      {
        // constraints - only audio needed for this app
        audio: true
      })
      .then(function (stream) {
        // Success callback
        source = audioCtx.createMediaStreamSource(stream);
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

  // event listeners to change visualize and voice settings

  visualSelect.onchange = function () {
    window.cancelAnimationFrame(drawVisual);
    visualize();
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
    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Float32Array(bufferLength);

    context.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      analyser.getFloatFrequencyData(dataArray);

      context.fillStyle = 'rgb(0, 0, 0)';
      context.fillRect(0, 0, WIDTH, HEIGHT);

      var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;

      for (var i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] + 140) * 2;

        context.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ',50,50)';
        context.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    };

    draw();

  } else if (visualSetting == "off") {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = "red";
    context.fillRect(0, 0, WIDTH, HEIGHT);
  }

}