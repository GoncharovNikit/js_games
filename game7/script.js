function hello(str) { console.log(str); }
hello("START");

let pjs = new PointJS(innerWidth, innerHeight, { backgroundColor: 'grey' });
let game = pjs.game;
let down_Speed = 0;
let mouse = pjs.mouseControl;
let w = game.getWH().w;
let h = game.getWH().h;
let back_Speed = -10;
let game_Over = false;
let score = 0;
pjs.system.initFullPage();
mouse.initControl();
pjs.keyControl.initControl();

let bird = game.newAnimationObject({
    animation: pjs.tiles.newImage("fb/2.png").getAnimation(0, 0, 34, 24, 4),
    x: 100,
    y: 100,
    w: 34,
    h: 24,
    delay: 5,
    scale: 1.3
});

let back = game.newImageObject({
    file: "fb/1.png",
    x: 0,
    y: 0,
});

let naruto = game.newAnimationObject({
    animation: pjs.tiles.newImage("fb/naruto.png").getAnimation(0, 912.06, 100, 74.17, 10),
    x: 300,
    y: 130,
    w: 130,
    h: 110,
    scale: 3,
    delay:3
});

let wall = [];
let walls_Y = 0;

function generate_Start() {
    let d = 0;

    for (let i = 0; i < 15; i++) {

        d += pjs.math.random(300, 500);
        walls_Y = pjs.math.random(-200, 200);

        wall.push(game.newImageObject({
            file: "fb/3.png",
            x: d + w,
            y: 670 - walls_Y
        }));
        wall.push(game.newImageObject({
            file: "fb/3.png",
            x: d + w,
            y: -530 - walls_Y,
            angle: 180
        }));
    }
}


function generate_walls() {
    hello('generate');
    let distance_between_walls = 0;

    distance_between_walls += pjs.math.random(300, 500);
    walls_Y = pjs.math.random(-200, 200);

    wall.push(game.newImageObject({
        file: "fb/3.png",
        x: distance_between_walls + w,
        y: 670 - walls_Y
    }));
    wall.push(game.newImageObject({
        file: "fb/3.png",
        x: distance_between_walls + w,
        y: -530 - walls_Y,
        angle: 180
    }));

    console.log(wall);
}







game.newLoop('menu', function () {
    back.x = 0;
    back.y = 0;
    bird.y = innerHeight / 2;
    back.draw();
    bird.draw();
    naruto.draw();

    if (pjs.keyControl.isPress("SPACE")) {
        score = 0;
        wall = [];
        generate_Start();
        back_Speed = -10;
        game.setLoop('fl_B');
    }

    pjs.brush.drawText({
        x: 800,
        y: 300,
        text: 'Game menu',
        color: 'white',
        size: 80,
        strokeColor: 'red',
        strokeWidth: 2

    });

    pjs.brush.drawText({
        x: 400,
        y: 500,
        text: 'Press SPACE to start!',
        color: 'white',
        size: 80,
        strokeColor: 'grey',
        strokeWidth: 1

    });

    pjs.brush.drawText({
        x: 100,
        y: 50,
        text: 'Score: ' + score,
        color: 'black',
        size: 25,
        strokeColor: 'grey',
        strokeWidth: 1

    });

});









game.newLoop('fl_B', function () {
    down_Speed += 0.5;
    bird.y += down_Speed;
    
    if ((pjs.keyControl.isDown("UP") || pjs.keyControl.isDown("SPACE")) && !game_Over) {
        down_Speed = -10; 
    }
    bird.angle = down_Speed;

    pjs.presets.bgCycle(back, back_Speed);
    back.draw();
    for (let i in wall) {
        wall[i].draw();
        wall[i].x += back_Speed;
        if (bird.isStaticIntersect(wall[i].getStaticBox()) || bird.y > innerHeight || bird.y < 0){
            back_Speed = 0;
            down_Speed = 0;
            game.setLoop('menu');

        }
    }
    if (wall[wall.length - 1].x <= w) {
        generate_walls();
    }

    pjs.brush.drawText({
        x: 100,
        y: 50,
        text: 'Score: ' + score,
        color: 'black',
        size: 25,
        strokeColor: 'grey',
        strokeWidth: 1

    });
    

    if (wall[0].x + 100 < 0) {
        wall.splice(0, 2);
        hello('cutting');
        score++;
    }


    bird.draw();
});



game.setLoop('menu');
game.start();

