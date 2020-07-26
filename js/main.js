'use strict';

const cnv = document.createElement('canvas');
cnv.height = 728;
cnv.width = 1024;
const ctx = cnv.getContext('2d');
let screens = [];


(()=>{
    const config = new Config(document.querySelector('table#config'));
    config.subscribe(s => {
        screens = Object.values(s);
        drawScreens();
    });

    document.querySelector('#screenWidth').addEventListener('change', e => {
        cnv.width = e.target.value;
        drawScreens();
    });
    document.querySelector('#screenHeight').addEventListener('change', e => {
        cnv.height = e.target.value;
        drawScreens();
    });

})();

function drawScreens() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    const screensDir = document.querySelector('#screens');
    screensDir.innerHTML = '';

    for(const screen of screens) {
        const scr = new LEDScreen(screen);
        scr.drawOnCanvas(ctx);

        const img = document.createElement('img');
        img.src = scr.canvas.toDataURL('image/png');
        screensDir.appendChild(img);
    }

    document.querySelector('#outputMap').src = cnv.toDataURL('image/png');
}
