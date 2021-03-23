function hello(str) {
    console.log(str);
}

let pjs = new PointJS(innerWidth, innerHeight, { backgroundColor: 'grey' });
let game = pjs.game;

pjs.system.initFullPage();

let key = pjs.keyControl;
key.initControl();
let prs = pjs.presets;

let p = pjs.vector.point;

let rect = game.newRectObject({
    x: 100,
    y: 100,
    w: 300,
    h: 300,
    fillColor: 'blue',
    strokeColor: 'white',
    strokeWidth: 2
});

let sonik = game.newAnimationObject({
    animation: pjs.tiles.newImage("son.png").getAnimation(121, 0, 24, 31.5, 6),
    x: 200,
    y: 200,
    w: 27 * 8,
    h: 27 * 8,
    delay: 2
});

let sonikStay = game.newAnimationObject({
    animation: pjs.tiles.newImage("son.png").getAnimation(193, 169, 24, 31.5, 3),
    x: sonik.x,
    y: sonik.y,
    w: 27 * 8,
    h: 27 * 8,
    delay: 9
});


let speed = 28;
let isleft = false;
let isstate = true;
//sonik.setFlip(1, 0);    //отзеркаливает картинку (по x, по у);
let camera = pjs.camera;

let bg = game.newImageObject({
    file: 'bg.png',
    x: 0,
    y: 0,
    h:innerHeight
});



game.newLoop('game', function () {
    
    prs.bgCycle(bg, 0, 0, 0, 0)
    bg.draw();

    if (key.isDown('D') && !key.isDown('A')) {
        if (isleft) {
            sonik.setFlip(0, 0); isleft = false;
        }
        isstate = false;
    }
    else if (key.isDown('A') && !key.isDown('D')) {
        if (!isleft) {
            sonik.setFlip(1, 0); isleft = true;
        }
        isstate = false;
    }
    else if (key.isDown('S') || key.isDown('W')) { isstate = false;}
    else {
        isstate = true;
    }

    prs.keyMoveInit(sonik, speed);
    //prs.keyMoveInit(sonikStay, speed);
    prs.keyMove();

    sonikStay.x = sonik.x;
    sonikStay.y = sonik.y;

    if (isstate) sonikStay.draw();
    else sonik.draw();   

    camera.setPositionC(p(sonik.x, innerHeight / 2));
});

game.setLoop('game');

game.start();



/*
 1) let tiles = pjs.tiles;
 Для создания игрока из спрайта надо создать объект : game.newAnimationObject({
    animation: tiles.newImage("path").getAnimation()  -ниже
    x,    -х создания
    y,   -y создания
    w,    -ширина перса
    h,   -высота будущего перса
    delay    -замедление анимации в фпс

});


animation: pjs.tiles.newImage("path").getAnimation(x кадра, y кадра, ширина, высота, количество кадров по горизонтали);


Чтобы создать фон бесшовный:
1. Создать изображение game.newImageObject({
    file: 'path',
    x,
    y,
    w,
    h,
    scale: 0.5  //масштабирует картинку, если не заданы ширина и высота

});

 */