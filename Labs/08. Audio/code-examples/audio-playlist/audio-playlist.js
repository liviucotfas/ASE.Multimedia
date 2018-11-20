"use strict";

var app={
    audio:null,
    tracks:null
};

// 3. Play/Next methods
app.play = function(url) {
    let elements = document.querySelectorAll("#playlist li.active");
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('active');
     }
    
    let selectedElement = document.querySelector("#playlist li[data-url='" + url + "']");
    selectedElement.classList.add('active');

    app.audio.src = url;
    app.audio.load();
    app.audio.play();
}

app.next = function() {
    var index = app.tracks.indexOf(app.audio.src) + 1;
    if (index >= app.tracks.length) {
        index = 0;
    }

    app.play(app.tracks[index]);
}

app.load = function(){
    app.audio = document.getElementById('audio');
    app.tracks = []; //track list

    // 1. Display the current time in seconds
    setInterval(function () {

        let element = document.querySelector("#controls span");

        if (app.audio.duration) {
            element.textContent = Math.floor(app.audio.currentTime) + " / " + Math.floor(app.audio.duration);
        }
        else {
            element.textContent = "...";
        };
    }, 30);

    // 2. Iterate over the playlist in order to associate events
    let elements = document.querySelectorAll("#playlist li");
    for(let i = 0; i<elements.length; i++){

        var url = elements[i].dataset.url;
        app.tracks.push(url);

        elements[i].addEventListener('click', function () {
            app.play(this.dataset.url);
        });
    }

    // 4. Associate events
    document.getElementById("btnPlayPause").addEventListener("click", function () {
        if (app.audio.paused) {
            app.audio.play();
            this.textContent = "||";
        }
        else {
            app.audio.pause();
            this.textContent = ">";
        }
    });

    document.getElementById("btnForward")
        .addEventListener('click', function () {
        app.audio.currentTime += 10;
    });

    document.getElementById("btnNext").addEventListener('click', app.next);

    app.audio.addEventListener("ended", app.next);
};