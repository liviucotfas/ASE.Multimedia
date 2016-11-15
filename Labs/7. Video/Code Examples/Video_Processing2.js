/* Assignment
1. Change the code bellow to make the dimensions of the two canvases equal to the dimensions of the video element 
*/

$(document).ready(function () {
    
    var video = document.getElementById('video');
    var contextNormal = document.getElementById('canvasNormal').getContext('2d');
    var contextProcesat = document.getElementById('canvasProcesat').getContext('2d');

    video.addEventListener('play', function () {
        draw(video, contextNormal, contextProcesat);
         //TODO add the code for resizing the canvses here
    }, false);

});

function draw(video, contextNormal, contextProcesat) {
    if (video.paused || video.ended) {
        return false;
    }

    //rotation effect
    var unghi = 3 * Math.PI / 180;
    var ct = Math.cos(unghi), st = Math.sin(unghi);
    var x = video.clientWidth / 2, y = video.clientHeight / 2;
    contextNormal.transform(ct, -st, st, ct, -x * ct - y * st + x, x * st - y * ct + y);
    contextNormal.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
    contextNormal.fillText("Rotation Effect", 10, 10);

    //emboss effect
    var imageData = contextNormal.getImageData(0, 0, video.clientWidth, video.clientHeight);
    var pixels = imageData.data;
    var imgDataWidth = imageData.width;
    
    for (var i = 0; i < pixels.length; i++) {
        if (i % 4 != 3) {
            pixels[i] = 127 + 2 * pixels[i] - pixels[i + 4] - pixels[i + imgDataWidth * 4];
        }
    }

    contextProcesat.putImageData(imageData, 0, 0);
    contextProcesat.fillText("Emboss Effect", 10, 10);

    //The setTimeout() method calls a function or evaluates an expression after a specified number of milliseconds.
    //Tip: 1000 ms = 1 second.
    //66ms ~= 15fps
    setTimeout(draw, 66, video, contextNormal, contextProcesat);
}