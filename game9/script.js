function c(str) {console.log(str);}
c("START GAME:  ЪуЪ");

let pjs = new PointJS(innerWidth, innerHeight, { backgroundColor: '#1A504A' });
let game = pjs.game;
let mouse = pjs.mouseControl;
let key = pjs.keyControl;
let presets = pjs.presets;


key.initControl();
pjs.system.initFullPage();

let player = game.newImageObject({
    file: "img/ball.png",
    x: 100,
    y: 550,
    w: 50,
    h: 50
});

let map = {
    width: 50,
    height: 50,
    level: [
        '',
        '',
        '',
        '',
        '',
        ' 1                              1',
        ' 1                              1',
        ' 1             11111            1',
        ' 1                              1',
        ' 1   11111             111      1',
        ' 1                              1',
        ' 1                              1',
        ' 11111111111111111111111111111111'
    ]
}

let rMap = [];

pjs.OOP.forArr(map.level, function (string, y) {
    pjs.OOP.forArr(string, function (el, x) {
        if (el == 1) {
            rMap.push(game.newImageObject({
                file: "img/block.jpg",
                x: x * map.width,
                y: y * map.height,
                w: 50,
                h: 50
            }));
            c("adding block");
        }


    })
})

game.newLoop('game', function () {
    //физика:
    presets.physicsMoveInit(player, 6, 9.8, 0.02, 19, 0, 0.3, 3, 1, -1, ["D", "RIGHT"], ["A", "LEFT"], ["W"], ["LEFT"]); ;

    for (let i in rMap) {
        presets.physicsMoveCollision(rMap[i]);
    }
    presets.physicsMove();
        
    pjs.OOP.drawArr(rMap);
    player.draw();
});

game.setLoop('game');
game.start();








