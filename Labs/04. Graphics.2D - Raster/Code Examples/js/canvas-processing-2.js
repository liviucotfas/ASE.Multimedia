"use strict";

/* Assignment
1. Implement the "convertToGreyScale" function
Hint:   
function (x, y, r, g, b, a) {var average = (r + g + b) / 3; return [average, average, average];}
2. Add a new div with the id "originalImage". Display the initial image ("img" variable bellow) in this div.
Hint: use the empty() and append() jQuery methods
*/

function loadFile(file) {
    //1. create the reader
    var reader = new FileReader();
    //2. attach events
    reader.onload = function(event){
        //1. create the image element
        var img = new Image();
        //2. attach events
        img.onload = function(){
            var canvasImage = document.getElementById("result");
            displayImageOnCanvas(canvasImage, img);
            var canvasHistogram = document.getElementById("histogram");
            computeAndDrawHistogram(canvasImage, canvasHistogram);
            convertToGreyScale(canvasImage);
        };
        img.onerror = function (msg, source, lineNo) {
            alert("Mesaj eroare: {0}".format(msg));
        };
        //3. start loading the image
        img.src = event.target.result;
    }
    //3. start loading the file
    reader.readAsDataURL(file);  

      //jQuery Equivalent: 
    // $(document.createElement('img')).get(0)
    // $("<img>").get(0)
    // //https://learn.jquery.com/using-jquery-core/faq/how-do-i-pull-a-native-dom-element-from-a-jquery-object/

}

function displayImageOnCanvas(canvas, img)
{
    canvas.height = img.height;
    canvas.width = img.width;

    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);

    context.font = "bold 10pt sans-serif";
    context.fillStyle = "#EFEFEF";

    context.fillText(img.src, 8, 25);
}

function computeAndDrawHistogram(canvasImage, canvasHistogram)
{ 
    var vR = new Array(); //equivalent to var vR = []; Futher reading: http://www.w3schools.com/js/js_arrays.asp
    var vG = [];
    var vB = [];
    for (var i = 0; i < 256; i++){ 
        vR[i] = 0; vG[i] = 0; vB[i] = 0; 
    }

    drawingLibrary.processImage(canvasImage,
        function (x, y, r, g, b, a) {
            vR[r]++; vG[g]++; vB[b]++;
        });

    drawingLibrary.drawHistogram(canvasHistogram, vR, vG, vB);
}

function convertToGreyScale(canvasImage)
{
    //TODO
}

 var drawingLibrary={
    processImage : function(canvas, action) {
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
    },
    drawHistogram : function (canvas, vR, vG, vB) {
        var h = canvas.height;
        var w = canvas.width / vR.length;
    
        var context = canvas.getContext("2d");
        context.fillStyle = "#DEDEDE";
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        var f = canvas.height * 0.9 / Math.max.apply(Math, [].concat(vR, vG, vB));
    
        for (var i = 0; i < vR.length; i++) {
    
            context.fillStyle = "rgba(10%,10%,10%,0.2)";
            //rgba(red, green, blue, alpha) 
            //The alpha parameter is a number between 0.0 (fully transparent) and 1.0 (fully opaque).
            context.fillRect(i * w, h - (vR[i] + vG[i] + vB[i]) * f, w, (vR[i] + vG[i] + vB[i]) * f);
    
            context.fillStyle = "rgba(100%,0%,0%,0.3)";
            context.fillRect(i * w, h - vR[i] * f, w, vR[i] * f);
    
            context.fillStyle = "rgba(0%,100%,0%,0.3)";
            context.fillRect(i * w, h - vG[i] * f, w, vG[i] * f);
    
            context.fillStyle = "rgba(0%,0%,100%,0.3)";
            context.fillRect(i * w, h - vB[i] * f, w, vB[i] * f);
        }
    }
}



//extends the string prototype object
//Inheritance and the prototype chain: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain 
// "{0} {1}".format(10, 9)
String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace('{' + i + '}', arguments[i]);
    }
    return s;
};