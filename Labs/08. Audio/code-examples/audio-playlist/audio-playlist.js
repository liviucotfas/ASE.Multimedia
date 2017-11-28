"use strict";

var app={
    audio:null,
    tracks:null
};

// 3. Play/Next methods
app.play = function(url) {
    $("#playlist li[data-url='" + url + "']")
        .addClass("active")
        .siblings().removeClass("active");

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

$(function () {
    app.audio = document.getElementById('audio');
    app.tracks = []; //track list

    // 1. Display the current time in seconds
    setInterval(function () {
        if (app.audio.duration) {
            $("#controls span").text(
              Math.floor(app.audio.currentTime) + " / " +
                Math.floor(app.audio.duration));
        }
        else {
            $("#controls span").text("Loading...");
        };
    }, 30);

    // 2. Iterate over the playlist in order to associate events
    $("#playlist li").each(function () {
        var url = $(this).data("url");
        app.tracks.push(url);

        $(this).click(function () {
            app.play(url);
        });
    });

    // 4. Associate events
    $("#btnPlayPause").click(function () {
        if (app.audio.paused) {
            app.audio.play();
            $("#btnPlayPause").text("||");
        }
        else {
            app.audio.pause();
            $("#btnPlayPause").text(">");
        }
    });

    $("#btnForward").click(function () {
        app.audio.currentTime += 10;
    });

    $("#btnNext").click(app.next);

    $(app.audio).on("ended", app.next);

    app.next(); // start playing
});