"use strict";

//http://exploringjs.com/es6/ch_classes.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class BarChart{
    constructor(canvas) {
        this.canvas = canvas;
    }
    draw(values){
        var context = this.canvas.getContext('2d');
    
        var h = this.canvas.height;
        var w = this.canvas.width / values.length;
    
        context.fillStyle = "#DEDEDE";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        context.fillStyle = "red";
        context.strokeStyle = "black";
        context.lineWidth = 2;
        
        var f = this.canvas.height * 0.9 / Math.max.apply(Math, values);
    
        for (var i = 0; i < values.length; i++) {
    
            var rectX = (i + 0.1) * w;
            var rectY = h - values[i] * f;
            var rectWidth = 0.8 * w;
            var rectHeight = values[i] * f;
    
            context.fillRect(rectX, rectY, rectWidth, rectHeight);
            context.strokeRect(rectX, rectY, rectWidth, rectHeight);
    
            /* Equivalent to:
            context.beginPath();
            context.rect(rectX, rectY, rectWidth, rectHeight);
            context.fill();
            context.stroke();*/
        }
    }
}

