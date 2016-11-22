/* Assignment
1. Change the code bellow to make the dimensions of the two canvases equal to the dimensions of the video element
Hint:
When video.clientWidth / video.clientHeight < video.videoWidth / video.videoHeight we should have canvas.height = video.clientWidth * video.videoHeight / video.videoWidth;
if(video.clientWidth / video.clientHeight < video.videoWidth / video.videoHeight)
{
    canvas.width = video.clientWidth; 
    canvas.height = video.clientWidth * video.videoHeight / video.videoWidth;
 } 

2. Implement black&white
Hint: r'=g'=b'=(r+g+b)/3;
3. Implement threshold
Hint: v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0; r’= g’ = b’ = v
4. Implement sephia
Hint: 
r' = (r * .393) + (g *.769) + (b * .189)
g' = (r * .349) + (g *.686) + (b * .168)
b' = (r * .272) + (g *.534) + (b * .131)
5. Implement invert (negative)
Hint: r' = 255 – r; g' = 255 – g; b' = 255 – b;
6. Implement pixelate
Hint: check https://gist.github.com/anonymous/1888841
7. Implement 2Channels
Hint: check https://gist.github.com/anonymous/1888841
8. Implement red
9. Implement green
10. Implement blue
*/

"use strict";

//Note: global variables should be avoided. Learn more at: https://www.w3.org/wiki/JavaScript_best_practices#Avoid_globals
var mode = "normal";

$(document).ready(function () {

    $('.effectType').click(function () {
        context.restore();
        context.save();
        
        //more about the data attribute: https://developer.mozilla.org/en/docs/Web/Guide/HTML/Using_data_attributes
        window.mode = $(this).data("state"); //equivalent to $(this)[0].dataset.state
    });

    var video = document.getElementById('video');
    var canvas = document.getElementById('canvasProcessed');
    var context = canvas.getContext('2d');

    video.addEventListener('play', function () {
        draw(video, context);
        //TODO add the code for resizing the canvas here     
    }, false);

});

function draw(video, context) {
    if (video.paused || video.ended) {
        return false;
    }

    switch (mode) {
        case "normal":

             var canvas = document.getElementById('canvasProcessed');
            context.drawImage(video, 0, 0, canvas.clientWidth, canvas.clientHeight);
            //var imageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            //context.putImageData(imageData, 0, 0);
            break;
        case "rotation":
            var unghi = 3 * Math.PI / 180;
            var ct = Math.cos(unghi), st = Math.sin(unghi);
            var x = video.clientWidth / 2, y = video.clientHeight / 2;
            context.transform(ct, -st, st, ct, -x * ct - y * st + x, x * st - y * ct + y);
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            context.fillText("Rotation Effect", 10, 10);
            break;
        case "emboss":
            //further reading http://html5doctor.com/video-canvas-magic/
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            var imageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            var pixels = imageData.data;
            var imgDataWidth = imageData.width;

            for (var i = 0; i < pixels.length; i++) {
                if (i % 4 != 3) {
                    pixels[i] = 127 + 2 * pixels[i] - pixels[i + 4] - pixels[i + imgDataWidth * 4];
                }
            }
            context.putImageData(imageData, 0, 0);
            context.fillText("Emboss Effect", 10, 10);
            break;
    }

    //The setTimeout() method calls a function or evaluates an expression after a specified number of milliseconds.
    //Tip: 1000 ms = 1 second.
    //66ms ~= 15fps
    setTimeout(draw, 66, video, context);
}