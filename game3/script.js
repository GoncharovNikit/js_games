function hello(){alert('hello')}

let pjs = new PointJS(innerWidth, innerHeight, {backgroundColor:'#8F7F5F'});
let game = pjs.game;
let key = pjs.keyControl;
key.initControl();
let speed = 15;

let speed_ball = 11;
let is_Start = true;
let ball_dx = ball_dy = 0;

let gameEnd = false;

let rects = [];

let brush = pjs.brush.drawText;

let width_B = 18, height_B = 4;

let isChit = false;

function fill_Arr_Rects(width_B, height_B) {
    rects = [];
    for (let x = 0; x < height_B; x++) {
        for (let y = 0; y < width_B; y++) {
            rects.push(game.newRectObject({
                x: 80 * y * 1.1 + 122,
                y: 60 * x * 1.1 + 120,
                w: 80,
                h: 60,
                fillColor: 'red',
                strokeColor: 'black',
                strokeWidth: 3
            }));
        }
    }
}
fill_Arr_Rects(width_B, height_B);

function show_Score() {
    brush({
        text: 'SCORE: ' + 10*(width_B*height_B - rects.length),
        x: 100,
        y: 30,
        color: 'black',
        size: 30,
        font: 'Arial'
    });
}

//платформа
let player = game.newRectObject({
    x: 800,
    y: innerHeight - 200,
    w: 120,
    h: 30,
    strokeColor: 'black',
    fillColor: '#32CDDD',
    strokeWidth: 2
});


//стены
let left_Wall = game.newRectObject({
    x: 106,
    y: 100,
    w: 7,
    h: innerHeight - 200,
    fillColor: 'red'
});

let right_Wall = game.newRectObject({
    x: innerWidth - 107,
    y: 100,
    w: 7,
    h: innerHeight - 200,
    fillColor: 'red'
});

let top_Wall = game.newRectObject({
    x: 100,
    y: 100,
    w: innerWidth - 200,
    h: 7,
    fillColor: 'red'
});

//отрисовка прямоуголников
function draw_Rects(){
	for(let i in rects){
		rects[i].draw();
	}
}

//фон
let fon = game.newRectObject({
    x: 100,
    y: 100,
    w: innerWidth - 200,
    h: innerHeight - 200,
    fillColor: '#B1C5C6',
    strokeColor: '#8D90A9',
    strokeWidth: 7
});


//шарик
let ball = game.newCircleObject({
    x: 870,
    y: 600,
    radius: 20,
    fillColor: '#317F0B',
    strokeColor: 'black',
    strokeWidth: 2
});

//движение платформы
let dx = 0;
let MOVE = function () {
    dx = 0;

    if (key.isDown('LEFT') || key.isDown('A')) {
        dx = -speed;
    }
    else if (key.isDown('RIGHT') || key.isDown('D')) {
        dx = speed;
    }

    //запуск шарика в начале
    if (key.isDown('SPACE') && is_Start && !gameEnd) {
        ball_dx = -2;
        ball_dy = -speed_ball;
        is_Start = false;
    }

    if (key.isDown('SPACE') && gameEnd) {
        fill_Arr_Rects(width_B, height_B);

        ball.x = 870; ball.y = 600;

        ball_dx = -2;
        ball_dy = -speed_ball;

        gameEnd = false;
    }

    if (key.isDown('CTRL') && key.isPress('V')) {
        if (player.w == 300) {
            player.w = 120;
        } else player.w = 300;
    }
    if (key.isDown('CTRL') && key.isPress('B')) {
        isChit = !isChit;
    }
}

//столкновение
let COLLISION = function () {
    //платформа и стенки
    if (left_Wall.isStaticIntersect(player.getStaticBoxA(-speed, 0, speed)) && dx == -speed) {
        player.x = left_Wall.x;
        dx = 0;
    }
    else if (right_Wall.isStaticIntersect(player.getStaticBoxD(0, 0, speed)) && dx == speed) {
        player.x = right_Wall.x - player.w;
        dx = 0;
    }

    //шарик и стенки
    if (left_Wall.isStaticIntersect(ball.getStaticBoxA(-speed_ball, 0, speed_ball)) && ball_dx < 0) {
        ball.x = left_Wall.x;
        ball_dx *= -1;
    }
    else if (right_Wall.isStaticIntersect(ball.getStaticBoxD(0, 0, speed_ball)) && ball_dx > 0) {
        ball.x = right_Wall.x - ball.w;
        ball_dx *= -1;
    }
    else if (top_Wall.isStaticIntersect(ball.getStaticBoxW(0, -speed_ball, 0,speed_ball)) && ball_dy < 0) {
        ball.y = top_Wall.y + top_Wall.h;
        ball_dy *= -1;
    }


    //шарик и платформа

    if (player.isStaticIntersect(ball.getStaticBoxS(0, 0, speed_ball)) && ball_dy == speed_ball) {
        ball.y = player.y - ball.radius*2;
        ball_dy *= -1;

        let cX = player.x + player.w / 2;
        let cx_B = ball.x + ball.w / 2;
        let delta = cx_B - cX;
        ball_dx += delta/10;
        
    }
    else if (player.isStaticIntersect(ball.getStaticBoxD(0, 0, speed_ball)) && ball_dx == speed_ball) {
        ball.x = player.x - ball.w;
        ball_dx *= -1;
        
    }
    else if (player.isStaticIntersect(ball.getStaticBoxA(-speed_ball, 0, speed_ball)) && ball_dx == -speed_ball) {
        ball.x = player.x + player.w;
        ball_dx *= -1;
        
    }

    //уничтожение 
    for (let i in rects) {
        if (rects[i].isStaticIntersect(ball.getStaticBoxA(-speed_ball + 7, 0, speed_ball)) && ball_dx == -speed_ball) {
            if (!isChit) {
                ball_dy *= -1; ball.x = rects[i].x;
            }
            rects.splice(i, 1); continue;
        }
        if (rects[i].isStaticIntersect(ball.getStaticBoxD(0, 0, speed_ball)) && ball_dx == speed_ball) { 
            if (!isChit) { ball_dy *= -1; ball.x = rects[i].x - ball.w; }
            rects.splice(i, 1); continue;
        }
        if (rects[i].isStaticIntersect(ball.getStaticBoxW(0, -speed_ball, 0, speed_ball)) && ball_dy == -speed_ball) {
            if (!isChit) { ball_dy *= -1; ball.y = rects[i].y + rects[i].h; }
            rects.splice(i, 1); continue;
        }
        if (rects[i].isStaticIntersect(ball.getStaticBoxS(0, 0, 0, speed_ball)) && ball_dy == speed_ball) {
            if (!isChit) { ball_dy *= -1; ball.y = rects[i].y + ball.h; }
            rects.splice(i, 1); continue;
        }
    }

}

function CHECK_END() {
    if (ball.y > player.y + player.h + 10) {
        ball_dx = ball_dy = 0;
        brush({
            text: 'You LOSE!',
            x: 720,
            y: 600,
            color: 'black',
            size: 50,
            font: 'Arial'
        });
        brush({
            text: 'Press SPACE to restart!',
            x: 680,
            y: 700,
            color: 'blue',
            size: 30,
            font: 'Arial'
        });
        gameEnd = true;
    }

    if (rects.length == 0) {
        brush({
            text: 'You win fight but not the war!',
            x: 680,
            y: 700,
            color: 'blue',
            size: 30,
            font: 'Arial',
            strokeWidth: 10
        });
        ball_dx = ball_dy = 0;
    }
}

game.newLoop('arcanoid', function(){
    fon.draw();

    CHECK_END();


    if (key.isDown('SHIFT')) { speed = 30; }
    else speed = 15;
    
    MOVE();
    COLLISION();

    player.move(pjs.vector.point(dx, 0));
    ball.move(pjs.vector.point(ball_dx, ball_dy));
    
    //left_Wall.draw();
    //right_Wall.draw();
    //top_Wall.draw();
   
    draw_Rects();

    player.draw();
    ball.draw();

    show_Score();

    if (is_Start) {
        brush({
            text: 'Press SPACE to start',
            x: 600,
            y: 600,
            color: 'black',
            size: 50,
            font:'Arial'
        });
    }

});	

game.setLoop('arcanoid');
game.start();
