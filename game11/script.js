let ctx = document.querySelector('canvas').getContext('2d');

let teta = 0.3;
let R = 16, r = 14;
let x, y;
let d = 13; //расстояние отверстия до центра 
let in_Draw;

let speed_Drowing;
document.querySelector('#sp').addEventListener('input', function () {
    speed_Drowing = document.querySelector('#sp').value;
    pause(); 
});

function clear_() {
    ctx.clearRect(0, 0, 1200, 1200);
}

function pause() {
    clearInterval(in_Draw);
    clearInterval(tm);
}

function start() {
    in_Draw = setInterval(draw_Point, speed_Drowing);
    tm = setInterval(draw_Sin, speed_Drowing);
}

function draw_Point() {
    x = (R - r) * Math.cos(teta) + d * Math.cos(((R - r) / r * teta));
    y = (R - r) * Math.sin(teta) - d * Math.sin(((R - r) / r * teta));
    ctx.fillStyle = document.querySelector('#color').value;
    ctx.fillRect(3 * x + 800, 3 * y + 800, 4, 4);
    teta += 0.3;
    R = document.querySelector('#R').value;
    r = document.querySelector('#r').value;
    d = document.querySelector('#D').value;
    if (R == r) r = Math.abs(r - 10);
}

function regim_Linii_Draw() {
    let x = 0;
    let y = 0;
    document.querySelector('canvas').onmousedown = function (event) {
        x = event.offsetX;
        y = event.offsetY;
        ctx.lineTo(x, y);
        console.log('X, Y: ' + x + ' ' + y);
        document.querySelector('canvas').onmousedown = function (event) {
            let x = event.offsetX;
            let y = event.offsetY;
            console.log('MOVE X, Y: ' + x + ' ' + y);
            clear_();

            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();

        };
    };

}

function regim_Paint_Draw() {
    document.querySelector('canvas').onmousedown = function (event) {
        let x = event.offsetX;
        let y = event.offsetY;
        ctx.moveTo(x, y);
        console.log('X, Y: ' + x + ' ' + y);
        document.querySelector('canvas').onmousemove = function (event) {
            let x = event.offsetX;
            let y = event.offsetY;
            console.log('MOVE X, Y: ' + x + ' ' + y);
            
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();
        };

        document.querySelector('canvas').onmouseup = function (event) {
            console.log('MOUSE UP!');
            document.querySelector('canvas').onmousemove = null;
            document.querySelector('canvas').onmouseup = null;
        };
    };

}

let x_S = 0;
let y_S = 0;
let chastota = 0.2;
let y_Koef = 100;
let tm;

function draw_Sin() {
    ctx.fillStyle = document.querySelector('#color').value;

    y_S = Math.sin(0.2 * x_S);
    ctx.fillRect(4 * x_S, 25 * y_S + y_Koef, 5, 5);

    if (4 * x_S >= 1200) { x_S = 0; y_Koef += 60; }
    x_S += chastota;
    ctx.fill();
}

function sinusoidka() {
    tm = setInterval(draw_Sin, speed_Drowing);
}