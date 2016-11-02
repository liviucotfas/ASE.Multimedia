$(document).ready(function () {
    
    var video = document.getElementById('video');
    var contextNormal = document.getElementById('canvasNormal').getContext('2d');
    var contextProcesat = document.getElementById('canvasProcesat').getContext('2d');

    video.addEventListener('play', function () {
        draw(video, contextNormal, contextProcesat);
    }, false);

});

function draw(video, contextNormal, contextProcesat) {
    if (video.paused || video.ended) {
        return false;
    }


    var unghi = 3 * Math.PI / 180;
    var ct = Math.cos(unghi), st = Math.sin(unghi);
    var x = video.clientWidth / 2, y = video.clientHeight / 2;
    contextNormal.transform(ct, -st, st, ct,
                -x * ct - y * st + x, x * st - y * ct + y);
    
    contextNormal.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
    
    var idata = contextNormal.getImageData(0, 0, video.clientWidth, video.clientHeight);
    var data = idata.data;
    var w = idata.width;
	var limit = data.length;
    
    for (var i = 0; i < limit; i++) {
        if (i % 4 != 3) {
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + w * 4];
        }
    }

    contextProcesat.putImageData(idata, 0, 0);
    
    contextNormal.fillText("NE-PROCESAT", 10, 10);
    contextProcesat.fillText("PROCESAT", 10, 10);

    setTimeout(draw, 20, video, contextNormal, contextProcesat);
}