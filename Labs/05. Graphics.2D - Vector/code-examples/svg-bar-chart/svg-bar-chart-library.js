"use strict";

//http://exploringjs.com/es6/ch_classes.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class BarChart{
    constructor(domElement) {
        this.domElement = domElement;
        this.svgns = "http://www.w3.org/2000/svg"; 
    }
    draw(data){
        this.data = data;
        this.width = this.domElement.clientWidth;
        this.height = this.domElement.clientHeight;

        this.createSVG();
        this.drawBackground();
        this.drawBars();

        this.domElement.appendChild(this.svg);
    }
    createSVG(){
        this.svg = document.createElementNS(this.svgns, "svg");
        this.svg.setAttribute('style', 'border: 1px solid black');
        this.svg.setAttribute('width', this.width);
        this.svg.setAttribute('height', this.height);
        this.svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    }
    drawBackground(){
        let rect = document.createElementNS(this.svgns, 'rect');
        rect.setAttribute('x', 0);
        rect.setAttribute('y', 0);
        rect.setAttribute('height', this.height);
        rect.setAttribute('width', this.width);
        rect.setAttribute('fill', 'WhiteSmoke');
        this.svg.appendChild(rect);
    }
    drawBars(){
        let barWidth = this.width / this.data.length;

        let f = this.height * 0.9 / Math.max.apply(Math, this.data.map(x=>x[1]));

        for(let i=0; i<this.data.length; i++){

            let label = this.data[i][0];
            let value = this.data[i][1];

            let barHeight = value * f;
            let barY = this.height - barHeight;
            let barX = i * barWidth + barWidth/4;

            let bar = document.createElementNS(this.svgns, 'rect');
            bar.setAttribute('class','bar');
            bar.setAttribute('x', barX);
            bar.setAttribute('y', barY);
            bar.setAttribute('height', barHeight);
            bar.setAttribute('width', barWidth/2);
            bar.setAttribute('fill', '#db4437');
            bar.setAttribute('stroke-width', 2);
            bar.setAttribute('stroke', 'black');
            this.svg.appendChild(bar);

            let text = document.createElementNS(this.svgns, 'text');
            text.appendChild(document.createTextNode(label));
            text.setAttribute('x', barX);
            text.setAttribute('y', barY - 10);
            this.svg.appendChild(text);
        }
    }
}