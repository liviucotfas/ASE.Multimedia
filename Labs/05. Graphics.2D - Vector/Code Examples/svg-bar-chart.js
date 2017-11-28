"use strict";

var svgns = "http://www.w3.org/2000/svg";

class BarChart{
    constructor(domElement) {
        this.domElement = domElement;
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
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute('style', 'border: 1px solid black');
        this.svg.setAttribute('width', this.width);
        this.svg.setAttribute('height', this.height);
        this.svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    }
    drawBackground(){
        let rect = document.createElementNS(svgns, 'rect');
        rect.setAttributeNS(null, 'x', 0);
        rect.setAttributeNS(null, 'y', 0);
        rect.setAttributeNS(null, 'height', this.height);
        rect.setAttributeNS(null, 'width', this.width);
        rect.setAttributeNS(null, 'fill', 'WhiteSmoke');
        this.svg.appendChild(rect);
    }
    drawBars(){
        let barWidth = this.width / this.data.length;

        var f = this.height * 0.9 / Math.max.apply(Math, this.data.map(x=>x[1]));

        for(let i=0; i<this.data.length; i++){

            var label = this.data[i][0];
            var value = this.data[i][1];

            var barHeight = value * f;
            var barY = this.height - barHeight;
            var barX = i * barWidth + barWidth/4;

            let bar = document.createElementNS(svgns, 'rect');
            bar.setAttributeNS(null,'class','bar');
            bar.setAttributeNS(null, 'x', barX);
            bar.setAttributeNS(null, 'y', barY);
            bar.setAttributeNS(null, 'height', barHeight);
            bar.setAttributeNS(null, 'width', barWidth/2);
            bar.setAttributeNS(null, 'fill', '#db4437');
            this.svg.appendChild(bar);

            let text = document.createElementNS(svgns, 'text');
            text.appendChild(document.createTextNode(label));
            text.setAttributeNS(null, 'x', barX);
            text.setAttributeNS(null, 'y', barY);
            this.svg.appendChild(text);
        }
    }
}