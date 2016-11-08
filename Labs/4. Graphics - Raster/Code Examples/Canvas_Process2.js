"use strict";

/*TODO:
- show a message when image processing fails due to CORS
*/

/* Assignment
1. show a message when image processing fails due to CORS
*/

function processImage(action) {
    var canvas = document.getElementById("result");
    var context = canvas.getContext("2d");

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    // iterate over all pixels based on x and y coordinates.

    // loop through each row
    for (var y = 0; y < canvas.height; y++) {
        // loop through each column
        for (var x = 0; x < canvas.width; x++) {
            var offset = ((canvas.width * y) + x) * 4;

            var red = data[offset];
            var green = data[offset + 1];
            var blue = data[offset + 2];
            var alpha = data[offset + 3];

            var result = action(x, y, red, green, blue, alpha);

            if (typeof (result) != "undefined" && result instanceof Array) {
                for (var i = 0; i < result.length; i++) {
                    data[offset + i] = result[i];
                }
            }
        }
    }

    // draw the new image
    context.putImageData(imageData, 0, 0);
}

function drawHistogram(vR, vG, vB) {
    var canvas = document.getElementById("histogram");
    var h = canvas.height;
    var w = canvas.width / vR.length;

    var c = canvas.getContext("2d");
    c.fillStyle = "#DEDEDE";
    c.fillRect(0, 0, canvas.width, canvas.height);

    var f = canvas.height * 0.9 / Math.max.apply(Math, [].concat(vR, vG, vB));

    for (var i = 0; i < vR.length; i++) {

        c.fillStyle = "rgba(10%,10%,10%,0.2)";
        //rgba(red, green, blue, alpha) 
        //The alpha parameter is a number between 0.0 (fully transparent) and 1.0 (fully opaque).
        c.fillRect(i * w, h - (vR[i] + vG[i] + vB[i]) * f, w, (vR[i] + vG[i] + vB[i]) * f);

        c.fillStyle = "rgba(100%,0%,0%,0.3)";
        c.fillRect(i * w, h - vR[i] * f, w, vR[i] * f);

        c.fillStyle = "rgba(0%,100%,0%,0.3)";
        c.fillRect(i * w, h - vG[i] * f, w, vG[i] * f);

        c.fillStyle = "rgba(0%,0%,100%,0.3)";
        c.fillRect(i * w, h - vB[i] * f, w, vB[i] * f);
    }
}

function loadImage() {

    /* 
    CORS Enabled images:
    https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image 
    */

    var img = document.createElement("img");
    //jQuery Equivalent: 
    // $(document.createElement('img')).get(0)
    // $("<img>").get(0)
    // //https://learn.jquery.com/using-jquery-core/faq/how-do-i-pull-a-native-dom-element-from-a-jquery-object/

    img.onerror = function (msg, url, line) {
        alert("ERROR loading image using url '{0}'.".format(img.src));
    };

    img.onload = function () {
       
        $("#originalImage").empty();
        $("#originalImage").append(img);

        var canvas = document.getElementById("result");
        canvas.height = img.height;
        canvas.width = img.width;

        var c = canvas.getContext("2d");
        c.drawImage(img, 0, 0);

        c.font = "bold 10pt sans-serif";
        c.fillStyle = "#EFEFEF";

        c.fillText(img.src, 8, 25);

        // I. Compute histogram
        var vR = new Array(); //equivalent to var vR = []; Futher reading: http://www.w3schools.com/js/js_arrays.asp
        var vG = new Array();
        var vB = new Array();
        for (var i = 0; i < 256; i++){ 
            vR[i] = 0; vG[i] = 0; vB[i] = 0; 
        }

        processImage(
            function (x, y, r, g, b, a) {
                vR[r]++; vG[g]++; vB[b]++;
                return [];
            }
         );

        drawHistogram(vR, vG, vB);

        // II. Make black and white
        processImage(
            function (x, y, r, g, b, a) {
                var m = (r + g + b) / 3;
                return [m, m, m];
            }
        );
    };

    //Load the actual image
    var imageUrl = $("#txtImageUrl").val();
    img.src = imageUrl;
}

//extends the string prototype object
//Inheritance and the prototype chain: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain 
String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        // g: ? //check the JavaScript CheatSheet included in the JavaScript Lab
        // m: ? //check the JavaScript CheatSheet included in the JavaScript Lab

        //Equivalent to:
        s = s.replace('{' + i + '}', arguments[i]);
    }
    return s;
};