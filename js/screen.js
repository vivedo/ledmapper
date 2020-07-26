'use strict';

class LEDScreen {
    get height() { return this.canvas.height; }
    set height(height) { this.canvas.height = height; }

    get width() { return this.canvas.width; }
    set width(width) { this.canvas.width = width; }

    constructor(settings) {
        const def = (obj, prop, def) => { return obj && obj.hasOwnProperty(prop) ? obj[prop] : def };

        this.canvas = document.createElement('canvas');

        this.width = def(settings, 'width', 32);
        this.height = def(settings, 'height', 32);
        this.tileWidth = def(settings, 'tileWidth', 32);
        this.tileHeight = def(settings, 'tileHeight', 32);
        this.name = def(settings, 'name', 'Screen');
        this.bgHue = def(settings, 'bgHue', Math.random());
        this.enableTileIndex = def(settings, 'enableTileIndex', true);
        this.enableTextBoxes = def(settings, 'enableTextBoxes', true);
        this.enableRefLines = def(settings, 'enableRefLines', true);
        this.offsetX = def(settings, 'offsetX', 0);
        this.offsetY = def(settings, 'offsetY', 0);

        this.ctx = this.canvas.getContext('2d');
    }

    draw() {
        if(this.height > 0 && this.width > 0 && this.tileHeight > 0 && this.tileWidth > 0) {
            this.drawBackground();
            if (this.enableRefLines)
                this.drawRefLines();
            if (this.enableTextBoxes)
                this.drawTextBoxes(name);
        } else {
            // ERROR
            this.ctx.fillStyle = 'grey';
            this.ctx.fillRect(0, 0, this.width, this.height);

            this.ctx.font = `20px monospace`;
            this.ctx.fillStyle = 'red';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText("INVALID SIZES", 10, 10);
        }
    }

    drawBackground() {
        const ltt = n => { let l = ""; n++; do { n--; l = String.fromCharCode(65 + (n % 26)) + l; n = (n / 26) >> 0; } while(n > 0); return l; }

        const cols = Math.ceil(this.width / this.tileWidth);
        const rows = Math.ceil(this.height / this.tileHeight);

        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = `20px monospace`;

        for(let c = 0; c < cols; c++)
            for(let r = 0; r < rows; r++) {
                const index = c % 2 + r;

                this.ctx.fillStyle = index % 2 === 0 ? `hsl(${360 * this.bgHue},100%,40%)` : `hsl(${360 * this.bgHue},100%,30%)`;
                this.ctx.fillRect(c * this.tileWidth, r * this.tileHeight, this.tileWidth, this.tileHeight);

                if(this.enableTileIndex) {
                    this.ctx.fillStyle = 'white';
                    this.ctx.fillText(`${ltt(r)}${c}`, (c + 0.5) * this.tileWidth, (r + 0.5) * this.tileHeight);
                }
            }
    }

    drawRefLines() {
        const l = (fromX, fromY, toX, toY) => {
            this.ctx.beginPath();
            this.ctx.moveTo(fromX, fromY);
            this.ctx.lineTo(toX, toY);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        const c = (cX, cY, radius) => {
            this.ctx.beginPath();
            this.ctx.arc(cX, cY, radius, 0, 2*Math.PI);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        this.ctx.strokeStyle = 'white';
        this.ctx.setLineDash([]);
        // horizontal and vertical
        l(0, this.height / 2, this.width, this.height / 2);
        l(this.width / 2, 0, this.width / 2, this.height);

        this.ctx.setLineDash([5, 7]);
        // 45 deg
        l(0, 0, this.width, this.height);
        l(0, this.height, this.width, 0);

        // cx circle
        c(this.width / 2, this.height / 2, Math.min(this.height * .4, this.width * .4));
    }

    drawTextBoxes() {
        this.ctx.textAlign = 'center';

        let fontSize = 30;
        let txtWidth = 0;

        do {
            if(txtWidth > this.width)
                fontSize--;
            this.ctx.font = `${fontSize}px monospace`;
        } while((txtWidth = this.ctx.measureText(this.name).width + 20) > this.width);

        this.ctx.fillStyle = 'rgba(255, 255, 255, .6)'
        this.ctx.fillRect(this.width / 2 - txtWidth / 2, this.height / 2 - (fontSize * 1.2), txtWidth, fontSize * 1.2);
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(this.name, this.width / 2, this.height / 2 - (fontSize * 1.2) / 2);

        fontSize = 20;
        txtWidth = 0;
        do {
            if(txtWidth > this.width)
                fontSize--;
            this.ctx.font = `${fontSize}px monospace`;
        } while((txtWidth = this.ctx.measureText(this.name).width + 20) > this.width);

        txtWidth = this.ctx.measureText(`${this.width}x${this.height}`).width + 20;
        this.ctx.fillStyle = 'rgba(0, 0, 0, .4)'
        this.ctx.fillRect(this.width / 2 - txtWidth / 2, this.height / 2, txtWidth, 40);
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`${this.width}x${this.height}`, this.width / 2, this.height / 2 + 20);
    }

    drawOnCanvas(ctx) {
        this.draw();
        ctx.drawImage(this.canvas, this.offsetX, this.offsetY);
    }
}
