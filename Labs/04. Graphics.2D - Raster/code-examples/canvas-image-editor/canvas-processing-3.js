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
4. Implement red
Hint: r'=r; g'=0; b'=0;
5. Implement green
Hint: r'=0; g'=255; b'=0;
6. Implement blue
Hint: r'=0; g'=0; b'=b;
7. Implement 2Channels
Hint: check https://gist.github.com/anonymous/1888841
8. (optional) Implement pixelate
Hint: check https://gist.github.com/anonymous/1888841
9. Check web workers as a way to perfrom heavy processing without blocking the UI thread
Hint: https://stackoverflow.com/questions/8170431/using-web-workers-for-drawing-using-native-canvas-functions
*/

(function () {
    'use strict';

    var app = {
        originialImage: null,
        processedImage: null,
        processedCanvas: null,
        donwloadLink: null,
        loader: null,
        currentEffect: null
    }

    //Drawing methods
    app.changeEffect = function(effect){
        if(effect !== app.currentEffect)
        {
            app.currentEffect = effect;
            app.drawImage();
        }
    }

    app.drawImage = function() {
       
        //show spinner
        app.loader.removeAttribute('hidden');

        //t0
        //https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
        var t0 = performance.now();

        var canvasProcessing = document.createElement('canvas');
        canvasProcessing.width = app.originialImage.naturalWidth;
        canvasProcessing.height = app.originialImage.naturalHeight;
        var context = canvasProcessing.getContext("2d");
        context.drawImage(app.originialImage, 0, 0, canvasProcessing.width, canvasProcessing.height);

        
        var t1 = performance.now();
        console.log(t1-t0);

        switch (app.currentEffect) {
            case "normal":
                app.normal(context);
                break;
            case "grayscale":
                app.grayscale(context);
                break;
        }

        var t2 = performance.now();
        console.log("t2: "+(t2-t1));
        var context2 = app.processedCanvas.getContext("2d");
        
        var processedCanvasWidth = app.processedCanvas.clientWidth;           
        var processedCanvasHeight = processedCanvasWidth * canvasProcessing.height / canvasProcessing.width;
        app.processedCanvas.height = processedCanvasHeight;

        context2.drawImage(canvasProcessing,0,0, canvasProcessing.width, canvasProcessing.height,
        0,0, processedCanvasWidth, processedCanvasHeight);

        var t3 = performance.now();
        console.log("t3: "+(t3-t2));
        
        canvasProcessing.toBlob(function(blob){
            var blobUrl = URL.createObjectURL(blob);
            //app.processedImage.src = blobUrl;
            app.donwloadLink.href = blobUrl;
        },"image/png");

        var t4 = performance.now();
        console.log("t4: "+(t4-t3));

        app.loader.setAttribute('hidden', '');
        console.log("finished");
    }

    app.normal = function(context){
        
    }

    app.grayscale = function(context){
        var imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        var pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4)
            pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.round((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
        context.putImageData(imageData, 0, 0); 
    }

    app.updateCanvasSize = function(){
        app.processedCanvas.width = app.processedCanvas.clientWidth;

        if(app.originialImage.src !== ""){
            app.drawImage();
        }
    }

    //Events
    $(function () {
        app.originialImage = document.createElement("img");
        app.donwloadLink = document.getElementById("donwloadLink");
        app.processedImage = document.getElementById("processedImage");
        app.processedCanvas = document.getElementById("processedCanvas");
        app.loader = document.querySelector('.loader');
        app.updateCanvasSize();
        
        app.originialImage.addEventListener("load",function(){
            app.currentEffect = null;
            app.changeEffect("normal");
        });

        app.originialImage.onerror = function (msg, source, lineNo) {
            alert("Mesaj eroare: {0}".format(msg));
        };

        $('.effectType').click(function () {
            //more about the data attribute: https://developer.mozilla.org/en/docs/Web/Guide/HTML/Using_data_attributes
            app.changeEffect($(this).data("effect")); //equivalent to $(this)[0].dataset.effect
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

        window.addEventListener("resize", function(){app.updateCanvasSize()});
    });
})();
