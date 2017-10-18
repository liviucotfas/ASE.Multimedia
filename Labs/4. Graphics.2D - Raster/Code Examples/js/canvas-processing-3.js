/* Assignment
1. Implement threshold
Hint: v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0; r’= g’ = b’ = v
2. Implement sephia
Hint: 
r' = (r * .393) + (g *.769) + (b * .189)
g' = (r * .349) + (g *.686) + (b * .168)
b' = (r * .272) + (g *.534) + (b * .131)
3. Implement invert (negative)
Hint: r' = 255 – r; g' = 255 – g; b' = 255 – b;
4. Implement pixelate
Hint: check https://gist.github.com/anonymous/1888841
5. Implement 2Channels
Hint: check https://gist.github.com/anonymous/1888841
6. Implement red
7. Implement green
8. Implement blue
*/

"use strict";

$(function () {

    $('.effectType').click(function () {
        //more about the data attribute: https://developer.mozilla.org/en/docs/Web/Guide/HTML/Using_data_attributes
        desenare($(this).data("effect")); //equivalent to $(this)[0].dataset.effect
    });

    $(document)
        .on('dragover', function (e) {
            e.preventDefault();
        })
        .on('drop', function (e) {
            e.preventDefault();

            //Access the `dataTransfer` property from the `drop` event which
            //holds the files dropped into the browser window.
            //https://api.jquery.com/category/events/event-object/
            var files = e.originalEvent.dataTransfer.files;

            if (files.length > 0) {
                //The FileReader object lets web applications asynchronously read the contents of files (or raw data buffers) stored on the user's computer, using File or Blob objects to specify the file or data to read
                //https://developer.mozilla.org/en/docs/Web/API/FileReader
                var reader = new FileReader();

                //FileReader.onload: a handler for the load event. This event is triggered each time the reading operation is successfully completed.
                //https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onload
                reader.onload = function (e) {
                    $("#image")
                        .load(function () {
                            desenare("normal");
                        })
                        .attr("src", e.target.result);
                };

                //FileReader.readAsDataURL: starts reading the contents of the specified Blob, once finished, the result attribute contains a data: URL representing the file's data.
                reader.readAsDataURL(files[0]);
            }
        });

    //?After an event triggers on the deepest possible element, it then triggers on parents in nesting order
    //https://javascript.info/tutorial/bubbling-and-capturing
    $("#canvasProcessedImagine").click(function () {
        $("a").attr("href", this.toDataURL("image/png"));
    });
});

function desenare(effect) {

    var canvas = document.getElementById("canvasProcessedImagine"); //Equivalent to $("#canvasProcessedImagine"); using jQuery
    var context = canvas.getContext("2d");
    var image = document.getElementById("image");

    canvas.width = image.width;
    canvas.height = image.height;

    switch (effect) {
        case "normal":
            context.drawImage(image, 0, 0, canvas.clientWidth, canvas.clientHeight);
            break;
        case "blackWhite":
            context.drawImage(image, 0, 0, canvas.clientWidth, canvas.clientHeight);
            var imageData = context.getImageData(0, 0, canvas.clientWidth, canvas.clientHeight);
            var pixels = imageData.data;
            for (var i = 0; i < pixels.length; i += 4)
                pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.round((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
            context.putImageData(imageData, 0, 0);
            break;
    }

     //Add the name of the effect on the image
    context.font = "bold 10pt sans-serif";
    context.fillStyle = "#EFEFEF";
    context.fillText(effect, 8, 25);
}