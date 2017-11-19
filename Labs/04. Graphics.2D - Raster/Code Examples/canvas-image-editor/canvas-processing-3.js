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

(function () {
    'use strict';

    var app = {
        originialImage: null,
        processedImage: null,
        donwloadLink: null,
        currentEffect: null
    }

    //Drawing methods
    app.desenare = function(effect) {
        if(effect !== app.currentEffect)
        {
            var canvasProcessing = document.createElement('canvas');
            canvasProcessing.width = app.originialImage.naturalWidth;
            canvasProcessing.height = app.originialImage.naturalHeight;
            var context = canvasProcessing.getContext("2d");
            context.drawImage(app.originialImage, 0, 0, canvasProcessing.width, canvasProcessing.height);

            switch (effect) {
                case "normal":
                    app.normal(context);
                    break;
                case "blackWhite":
                    app.blackWhite(context);
                    break;
            }

            canvasProcessing.toBlob(function(blob){
                app.processedImage.src = URL.createObjectURL(blob);
                app.donwloadLink.href = URL.createObjectURL(blob);
            },"image/png");

            app.currentEffect = effect;
        }
    }

    app.normal = function(context){
        
    }

    app.blackWhite = function(context){
        var imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        var pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4)
            pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.round((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
        context.putImageData(imageData, 0, 0); 
    }

    //Events
    $(function () {
        app.originialImage = document.createElement("img");
        app.donwloadLink = document.getElementById("donwloadLink");
        app.processedImage = document.getElementById("processedImage");
        
        app.originialImage.addEventListener("loadstart", function(){
            app.currentEffect = null;
        });

        app.originialImage.addEventListener("load",function(){
            app.desenare("normal");
        });

        app.originialImage.onerror = function (msg, source, lineNo) {
            alert("Mesaj eroare: {0}".format(msg));
        };

        $('.effectType').click(function () {
            //more about the data attribute: https://developer.mozilla.org/en/docs/Web/Guide/HTML/Using_data_attributes
            app.desenare($(this).data("effect")); //equivalent to $(this)[0].dataset.effect
        });

        document.getElementById("fileBrowser").addEventListener("change",function(e){  
             //1. create the reader
             var reader = new FileReader();
             //2. attach events
             reader.onload = function(event){
                 app.originialImage.src = event.target.result;
             }
             //3. start loading the file
             reader.readAsDataURL(e.target.files[0]);    
        });
    });
})();
