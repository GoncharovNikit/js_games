function c(str) {
    console.log(str);
}
c("START GAME:  AGARIO");

let pjs = new PointJS(innerWidth, innerHeight, { backgroundColor: '#D5DFDE' });
let game = pjs.game;
let mouse = pjs.mouseControl;


mouse.initControl();
pjs.system.initFullPage();

let back = [];
for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        back.push(game.newRectObject({
            x: i * 50,
            y: j * 50,
            w: 49,
            h: 49,
            fillColor: 'grey'
        }));
    }
}

let player = game.newCircleObject({
    x: innerWidth / 2,
    y: innerHeight / 2,
    radius: 20,
    fillColor: 'yellow',
    strokeColor: 'black',
    strokeWidth: 2
});

let wall = [game.newRectObject({
    x:0,y:0,w:3, h:5000, fillColor:'green'
}),
game.newRectObject({
    x: 0, y: 0, w: 5000, h: 3, fillColor: 'green'
}),
game.newRectObject({
    x: 0, y: 5000, w: 5000, h: 3, fillColor: 'green'
}),
game.newRectObject({
    x: 5000, y: 0, w: 3, h: 5000, fillColor: 'green'
})];

let food = [];


game.newLoop('agario', function () {
    for (let i in back) {
        if(back[i].isInCamera())back[i].draw();
    }

    player.moveTimeC(mouse.getPosition(1), player.radius * 2);
   

    player.draw();

    pjs.camera.setPositionC(player.getPosition(1));

});

game.setLoop('agario');
game.start();








