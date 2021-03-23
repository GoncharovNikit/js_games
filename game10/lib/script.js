$(function () {
    $('#before-load').find('i').fadeOut().end().delay(400).fadeOut('slow');
});
function c(str) {console.log(str);}

let boosts = {
    s: 1,
    j: 1,
    d: 1,
    m: 1,
    coins: 0,
    kills: 0
}

c("START GAME:  ÚóÚ");

if (window.localStorage) {
    if (localStorage.getItem('coin') != null) boosts.coins = parseInt(localStorage.getItem('coin'));
    else boosts.coins = 0;
    if (localStorage.getItem('kills') != null) boosts.kills = parseInt(localStorage.getItem('kills'));
    else boosts.kills = 0;
    if (localStorage.getItem("boost_S") != null) {
        boosts.s = parseInt(localStorage.getItem("boost_S"));
    }
    else boosts.s = 1;
    if (localStorage.getItem("boost_J") != null) {
        boosts.j = parseInt(localStorage.getItem("boost_J"));
    }
    else boosts.j = 1;
    if (localStorage.getItem("boost_D") != null) {
        boosts.d = parseInt(localStorage.getItem("boost_D"));
    }
    else boosts.d = 1;
    if (localStorage.getItem("boost_M") != null) {
        boosts.m = parseInt(localStorage.getItem("boost_M"));
    }
    else boosts.m = 1;
}

let pjs = new PointJS(innerWidth, innerHeight, { backgroundColor: 'black' });
let game = pjs.game;
let mouse = pjs.mouseControl;
let key = pjs.keyControl;
let presets = pjs.presets;
let window_WH = game.getWH();



let is_B = false;
let b_C = 0;
let is_left_go = false;
let tmpY = 0;
let is_end = false;

let walls_Zom = [];
let coins = [];
let torches = [];

let zombie_w = 109.2;
let zombie_h = 117.6;

let rMap = [];
let stairs = [];
let hills = [];

key.initControl();
mouse.initControl();
pjs.system.initFullPage();

class Player {
    constructor(name, max_hp, x, y, speed, run_speed) {
        this.name = name || "unnamed";
        this.max_hp = max_hp || 100 + 10 * (boosts.m - 1);
        this.x = x || 4750;    //4750
        this.y = y || 150;     //150
        this.speed = speed || 4 + 0.5 * (boosts.s - 1);
        this.run_speed = run_speed || this.speed + 10;
        this.speed_down = 13;
        this.current_speed = this.speed;
        this.on_stairs = false;
        this.is_beat = false;
        this.speed_on_stairs = 9;
        this.current_HP = this.max_hp;
        this.coin_count = boosts.coins;
        this.kills_count = boosts.kills;
        this.damage = 0.3 + 0.1*(boosts.d - 1);
        this.fly_time = 300 + 40 * (boosts.j - 1);

        this.dx = 0;
        this.dy = this.speed_down;
        this.in_sky = false;

        this.walk = game.newAnimationObject({
            animation: pjs.tiles.newImage("img/joe.png").getAnimation(30, 166, 40.65, 42, 6),
            x: this.x,
            y: this.y,
            w: 39,
            h: 42,
            delay: 6,
            scale: 2.3,
            alpha: 1
        });

        this.stay = game.newAnimationObject({
            animation: pjs.tiles.newImage("img/joe.png").getAnimation(30, 472, 39.5, 42, 2),
            x: this.x,
            y: this.y,
            w: 39,
            h: 42,
            delay: 6,
            scale: 2.3,
            alpha: 1
        });

        this.run = game.newAnimationObject({
            animation: pjs.tiles.newImage("img/joe.png").getAnimation(30, 268, 43.4, 42, 3),
            x: this.x,
            y: this.y,
            w: 39,
            h: 42,
            delay: 7,
            scale: 2.3,
            alpha: 1
        })

        this.hit = game.newAnimationObject({
            animation: pjs.tiles.newImage("img/joe.png").getAnimation(30, 659, 57, 51, 4),
            x: this.x,
            y: this.y,
            w: 57,
            h: 51,
            delay: 6,
            scale: 2.3,
            alpha: 1
        })

        this.jump = game.newAnimationObject({
            animation: pjs.tiles.newImage("img/joe.png").getAnimation(107, 521, 50, 43, 2),
            x: this.x,
            y: this.y,
            w: 52,
            h: 51,
            delay: 6,
            scale: 2,
            alpha: 1
        })

        this.roll = game.newAnimationObject({
            animation: pjs.tiles.newImage("img/joe.png").getAnimation(28, 572, 40.5, 37, 8),
            x: this.x - 80,
            y: this.y,
            w: 34,
            h: 35,
            delay: 4,
            scale: 2
        })

        this.up = game.newAnimationObject({
            animation: pjs.tiles.newImage("img/joe.png").getAnimation(162, 371, 34, 43, 1),
            x: this.x,
            y: this.y,
            w: 34,
            h: 43,
            delay: 4,
            scale: 2
        })

        this.fail = game.newImageObject({
            file: "img/joe_3.png",
            x: this.x,
            y: this.y,
            w: 42,
            h: 43,
            scale: 3
        });

        this.current_Sprite = this.stay;
        this.h = this.stay.h;
        this.w = this.stay.w;
    }
    go_Right() {
        this.current_speed = this.speed;
        this.dx = this.speed;
        this.current_Sprite = this.walk;

        this.h = this.walk.h;
        this.w = this.walk.w;

        this.walk.setFlip(0, 0);
        COLLISION();
        this.x += this.dx;
        this.walk.x = this.x;
        this.walk.y = this.y;
        if (!player.in_sky && !player.on_stairs) this.walk.draw();
    }
    go_Left() {
        this.current_speed = this.speed;
        this.dx = -this.speed;
        this.current_Sprite = this.walk;

        this.h = this.walk.h;
        this.w = this.walk.w;

        this.walk.setFlip(1, 0);
        COLLISION();
        this.x += this.dx;
        this.walk.x = this.x;
        this.walk.y = this.y;
        if (!player.in_sky && !player.on_stairs) this.walk.draw();
    }

    run_Right() {
        this.current_speed = this.run_speed;
        this.dx = this.run_speed;
        this.current_Sprite = this.run;

        this.h = this.run.h;
        this.w = this.run.w;

        this.run.setFlip(0, 0);
        COLLISION();
        this.x += this.dx;
        this.run.x = this.x;
        this.run.y = this.y;
        if (!player.in_sky && !player.on_stairs) this.run.draw();
    }
    run_Left() {
        this.current_speed = this.run_speed;
        this.dx = -this.run_speed;
        this.current_Sprite = this.run;

        this.h = this.run.h;
        this.w = this.run.w;

        this.run.setFlip(1, 0);
        COLLISION();
        this.x += this.dx;
        this.run.x = this.x;
        this.run.y = this.y;
        if (!player.in_sky && !player.on_stairs) this.run.draw();
    }

    stay_() {
        this.dx = 0;
        this.current_Sprite = this.stay;

        this.h = this.stay.h;
        this.w = this.stay.w;

        this.stay.x = this.x;
        this.stay.y = this.y;
        if (!player.in_sky && !player.on_stairs) this.stay.draw();
    }

    beat() {
        this.dx = 0;
        this.current_Sprite = this.hit;

        this.h = this.hit.h;
        this.w = this.hit.w;

        this.hit.x = this.x;
        this.hit.y = this.y;
        this.hit.draw();
    }

    jump_() {
        this.current_Sprite = this.jump;

        this.h = this.jump.h;
        this.w = this.jump.w;

        this.jump.x = this.x;
        this.jump.y = this.y;

        this.jump.draw();
    }

    roll_() {
        this.current_Sprite = this.roll;

        this.h = this.roll.h;
        this.w = this.roll.w;

        this.roll.x = this.x;
        this.roll.y = this.y;
        this.roll.draw();
    }
}
class Zombie {
    constructor(x, y, dx, hp) {
        this.dx = dx || 2;
        this.x = x || 400;
        this.y = y || 800;
        this.w = 109.2;
        this.h = 117.6;
        this.is_bite = false;
        this.hp = hp || 40;
        this.current_HP = this.hp;
        this.is_get_hit = false;

        this.stay = game.newAnimationObject({
            animation: pjs.tiles.newImage("img/zombie.png").getAnimation(9, 15, 60, 60, 7),
            w: 39,
            h: 42,
            scale: 2.8,
            delay: 5
        });

        this.walk = game.newAnimationObject({
            animation: pjs.tiles.newImage("img/zombie.png").getAnimation(12, 89, 66, 62, 10),
            w: 39,
            h: 42,
            scale: 2.8,
            delay: 3
        });

        this.attack = game.newAnimationObject({
            animation: pjs.tiles.newImage("img/zombie.png").getAnimation(11, 165, 66, 58, 6),
            w: 39,
            h: 42,
            scale: 2.8,
            delay: 6
        });

        this.get_Hit = game.newAnimationObject({
            animation: pjs.tiles.newImage("img/zombie.png").getAnimation(13, 239, 78, 65, 4),
            w: 39,
            h: 42,
            scale: 2.86,
            delay: 6
        });

        this.current_Sprite = this.stay;

    }

    sprite_Flip() {
        this.attack.setFlip(1, 0);
        this.get_Hit.setFlip(1, 0);
        this.stay.setFlip(1, 0);
        this.walk.setFlip(1, 0);
    }

    def_Flip() {
        this.attack.setFlip(0, 0);
        this.get_Hit.setFlip(0, 0);
        this.stay.setFlip(0, 0);
        this.walk.setFlip(0, 0);
    }

    sprite_Setter() {
        if (this.is_get_hit && player.is_beat) {
            this.current_Sprite = this.get_Hit;
        }
        else if (player.x < this.x - 40) {
            this.current_Sprite = this.walk;
            this.sprite_Flip();
            this.dx = -2;
            this.is_bite = false;
        }
        else if (player.x > this.x + 40) {
            this.current_Sprite = this.walk;
            this.def_Flip();
            this.dx = 2;
            this.is_bite = false;
        }
        else {
            this.dx = 0;
            this.current_Sprite = this.stay;

            if (this.current_Sprite.isIntersect(player.current_Sprite)) {
                this.is_bite = true;
                this.current_Sprite = this.attack;
            }
            else {
                this.is_bite = false;
            }
        }

    }


}

let player = new Player();
let zombies = [];


let SAVE = function () {
    if (window.localStorage) {
        localStorage.setItem('coin', player.coin_count);
        localStorage.setItem('kills', player.kills_count);
    }
}


let background = game.newImageObject({
    file: "img/space.png",
    x: -1000,
    y: -1200,
    w: 11264,
    h: 4448
});
let foreGround = game.newRectObject({
    w: window_WH.w,
    h: window_WH.h,
    alpha: 0,
    fillColor: 'gold'
});
let moon = game.newImageObject({
    file: "img/moon.png",
    w: 200,
    h: 200,
    x: 400,
    y: 200
});
let back_Dark = game.newImageObject({
    file: "img/room.jpg",
    x: 4700,
    y: 100,
    w: 600,
    h: 250,
    fillColor: '#81B2E6'
})
let divan = game.newImageObject({
    file: "img/divan.png",
    x: 5250,
    y: 200,
    w: 300,
    h: 130

})
let back_HP = game.newRectObject({
    x: -1000,
    y: -1000,
    w: 646,
    h: 120,
    fillColor: "grey",
    strokeColor: "black",
    strokeWidth: 3,
    alpha: 0.6
})
let heart = game.newImageObject({
    file: "img/heart.png",
    x: window_WH.w - 400,
    y: window_WH.h - 200,
    scale: 0.15,

});
let coin = game.newImageObject({
    file: "img/coin.png",
    x: window_WH.w - 700,
    y: window_WH.h - 200,
    scale: 0.13,
});
let h_p = game.newTextObject({
    text: parseInt(player.current_HP),
    x: window_WH.w - 570,
    y: window_WH - heart.h - 530,
    color: 'red',
    strokeColorText: 'black',
    size: 70,
    strokeWidthText: 2,
    font: "Arial",
    align: "center"
});
let coin_t = game.newTextObject({
    text: player.coin_count,
    x: window_WH.w - 570,
    y: window_WH - coin.h - 530,
    color: 'gold',
    strokeColorText: 'black',
    size: 70,
    strokeWidthText: 2,
    font: "Arial",
    align: "center"
});
let menu_exit = game.newTextObject({
    size: 30,
    text: "Exit to menu",
    strokeColor: '#121C64',
    strokeWidth: 4,
    fillColor: "white",
    color: '#121C64',
    strokeColorText: '#949FF0',
    strokeWidthText: 2,
    padding: 10,
    shadowColor: "white"
});
let js = game.newImageObject({
    file: "img/js.jpg",
    x: 5350,
    y: 100
});

let DRAW = function () {
    if (player.x > 4600 && player.x < 5350 && player.y > 100 && player.y < 400) background.alpha = 0.4;
    else background.alpha = 1;
    if (player.current_HP < 0) player.current_HP = 0;

    if (player.current_HP > player.max_hp) player.current_HP = player.max_hp;
    player.current_HP = parseInt(player.current_HP);
    h_p.text = player.current_HP;
    coin_t.text = parseInt(player.coin_count);

    background.draw();
    back_Dark.draw();
    js.draw();

    for (let i in torches) {
        if (torches[i].isInCamera()) torches[i].draw();
    }

    pjs.OOP.drawArr(rMap);
    pjs.OOP.drawArr(rMap);
    pjs.OOP.drawArr(stairs);

    for (let i in coins) {
        if (coins[i].isInCamera())coins[i].draw();
    }

    window_WH = game.getWH();
    heart.setPositionS(pjs.vector.point(window_WH.w - heart.w - 180, window_WH.h - heart.h - 30));
    coin.setPositionS(pjs.vector.point(window_WH.w - heart.w - 460, window_WH.h - coin.h - 30));
    h_p.setPositionS(pjs.vector.point(window_WH.w - h_p.w - 300, window_WH.h - heart.h - 10));
    coin_t.setPositionS(pjs.vector.point(window_WH.w - h_p.w - 650, window_WH.h - heart.h - 10));
    back_HP.setPositionS(pjs.vector.point(window_WH.w - back_HP.w - 140, window_WH.h - back_HP.h - 13));

    foreGround.setPositionS(pjs.vector.point(0, 0));
    foreGround.w = window_WH.w;
    foreGround.h = window_WH.h;

    if (!is_end) {
        if (foreGround.alpha > 0.03) {
            foreGround.alpha -= 0.02;
        }
        else foreGround.alpha = 0;
    }

    back_HP.draw();
    heart.draw();
    coin.draw();
    h_p.draw();
    coin_t.draw();

    for (let i in zombies) {
        if (zombies[i].current_Sprite.isInCamera()) {
            pjs.brush.drawText({
                text: parseInt(zombies[i].current_HP),
                x: zombies[i].current_Sprite.getPositionC().x,
                y: zombies[i].current_Sprite.getPosition().y - 20,
                color: "red",
                size: 20,
                align: "center",

            });
        }
    }

    for (let i in hills) {
        hills[i].draw();
    }

    //if(zombie.isInCamera())zombie.draw();

}

let map = {
    width: 50,
    height: 50,
    level: [
        '3                                                         2                 4            t    bb  9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9   t                                                    ',
        '3               9                 9      2                                  4           3333333333333333333333333333333333333333333333333333              t 3',
        '3               2                 2                             2           4                4             3                          4                  3333',
        '3                             2                     2                       4                4             3                          4                     3',
        '3  2        2                                                               4                4             3                          4                     3',
        '3                                                                           4                4             3                          4                     3  ',
        '3                                                                           4                4  b   99     37   5       5   t        84         33          3',
        '3                                                                           4                4 3333333333333333333333333333333333333334                     3 ',
        '3                                                                           4                4                                        4                  3333 ',
        '3                                                     6  9  9 59   6        4                4                                        4                     3     ',
        '3                                                      33333333333          4                4                                        4   bt                3                   ',
        '3                 6 9bb9 b9   6                                             4                4                                     33333333333              3               ',
        '3                  3333333333                                               4                4                               3333                           3                ',
        '3                                                                           4                46    5  99    5      6  3333                                  3    ',
        '3                                   6   9  t  9  6                          4                4 3333333333333333333                                          3                    ',
        '3                                    33333333333                            4                4        3 4 3                                                 3                ',
        '3                                                                           4                4        3 4 3                                                 3            ',
        '3                                                        6 b  5 99    6     4                4   9 t  3 4 3 t 9  b                                      33333            ',
        '3                                                         33333333333       4                4 33333333 4 333333333                                         3',
        '3          6 9 b5 9  6                  6   5 9   6                         4                4          4                                                   3            ',
        '3           33333333                     33333333                           4                4          4                         6   5  9   6              3                    ',
        '37                                                                          4               3333333333333333333                    333333333                3            ',
        '37                                                                          4                                                                                6              ',
        '37                                                                          4                                                                        b       6        ',
        '37    b             5         5         5                       5           4    9 9 9 9 9 9 9 9 9 9 9 9 9 9  5                    5                bbb      6             ',
        '31111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
    ]
}

pjs.OOP.forArr(map.level, function (string, y) {
    pjs.OOP.forArr(string, function (el, x) {
        if (el == 1) {
            rMap.push(game.newImageObject({
                file: "img/r.png",
                x: x * map.width,
                y: y * map.height,
                w: 50,
                h: 50
            }));
            c("adding block");
        }
        else if (el == 2) {
            torches.push(game.newImageObject({
                file: "img/star.png",
                x: x * map.width,
                y: y * map.height,
                w: 50,
                h: 50
            }));
        }
        else if (el == 3) {
            rMap.push(game.newImageObject({
                file: "img/block.jpg",
                x: x * map.width,
                y: y * map.height,
                w: 50,
                h: 50
            }));
        }
        else if (el == 4) {
            stairs.push(game.newImageObject({
                file: "img/stairs.png",
                x: x * map.width,
                y: y * map.height,
                w: 50,
                h: 50
            }));
        }
        else if (el == 5) {
            zombies.push(new Zombie(x * map.width, y * map.height - 68));
        }
        else if (el == 6) {
            walls_Zom.push(game.newRectObject({
                x: x * map.width,
                y: y * map.height,
                w: 3,
                h: 100,
                fillColor: 'red'
            }));
        }
        else if (el == 7) {
            walls_Zom.push(game.newRectObject({
                x: x * map.width - 50,
                y: y * map.height,
                w: 3,
                h: 100,
                fillColor: 'red'
            }));
        }
        else if (el == 8) {
            walls_Zom.push(game.newRectObject({
                x: x * map.width + 100,
                y: y * map.height,
                w: 3,
                h: 100,
                fillColor: 'red'
            }));
        }
        else if (el == 9) {
            coins.push(game.newImageObject({
                file: "img/coin.png",
                x: x * map.width,
                y: y * map.height - 10,
                w: 50,
                h: 50
            }));
        }
        else if (el == 't') {
            torches.push(game.newAnimationObject({
                animation: pjs.tiles.newImage("img/fire.png").getAnimation(0, 0, 18, 54, 8),
                x: x * map.width,
                y: y * map.height - 50,
                w: 50,
                h: 100,
                delay: 4
            }));
        }
        else if (el == 'b') {
            torches.push(game.newImageObject({
                file: "img/barrel.png",
                x: x * map.width,
                y: y * map.height,
                w: 50,
                h: 50
            }));
        }

    })
});

let DOING = function () {
    //if (player.x < 0) player.x = -player.x;

    COORDINATES();
    COLLISION();

    if (mouse.isPress("LEFT") && !player.on_stairs) {
        is_B = true;
        player.beat();
        player.is_beat = true;
    }
    else if (key.isPress("SPACE") && !player.in_sky && !is_B) {
        player.in_sky = true;
        player.dy = -17;

        setTimeout(function () {
            player.dy = player.speed_down;
        }, player.fly_time);
    }

    if ((key.isDown("D") || key.isDown("RIGHT")) && key.isDown("SHIFT") && !is_B) {
        player.run_Right();
        is_left_go = false;
    }
    else if ((key.isDown("A") || key.isDown("LEFT")) && key.isDown("SHIFT") && !is_B) {
        player.run_Left();
        is_left_go = true;
    }
    else if ((key.isDown("D") || key.isDown("RIGHT")) && !key.isDown("SHIFT") && !is_B) {
        player.go_Right();
        is_left_go = false;
    }
    else if ((key.isDown("A") || key.isDown("LEFT")) && !key.isDown("SHIFT") && !is_B) {
        player.go_Left();
        is_left_go = true;
    }
    else if (is_B && b_C < 36) {

        if (is_left_go) player.hit.setFlip(1, 0);
        else player.hit.setFlip(0, 0);
        player.beat();
    }
    else if (b_C == 36) {

        player.hit.setFrame(0);
        b_C = 0; is_B = false;
        player.is_beat = false;
    }
    else {

        if (is_left_go) {
            player.stay.setFlip(1, 0);
            player.jump.setFlip(1, 0);
        }
        else {
            player.stay.setFlip(0, 0);
            player.jump.setFlip(0, 0);
        }
        player.stay_();
    }

    if (is_B) b_C++;

    //player kill zombie
    for (let i in zombies) {
        if (zombies[i].current_Sprite.isInCamera()) {
            if (zombies[i].current_HP < 1) {
                coins.push(game.newImageObject({
                    file: "img/coin.png",
                    x: player.x + 160,
                    y: zombies[i].y + 40,
                    w: 50,
                    h: 50
                }));

                hills.push(game.newImageObject({
                    file: "img/heart.png",
                    x: player.x + 200,
                    y: zombies[i].y + 40,
                    w: 50,
                    h: 50
                }));

                zombies.splice(i, 1);
                foreGround.fillColor = 'blue';
                foreGround.alpha = 0.4;
                if (player.in_sky) foreGround.alpha = 0.7;
                player.kills_count++;
            }
        }
    }

    //zombie bite player
    for (let i in zombies) {
        if (zombies[i].current_Sprite.isInCamera() && !zombies[i].is_get_hit) {
            zombies[i].sprite_Setter();
            zombies[i].x += zombies[i].dx;

            if (zombies[i].is_bite) {
                if (zombies[i].current_Sprite.getFrame() == 4) {
                    player.current_HP -= 1.8;
                    if (back_HP.fillColor != "red") {
                        back_HP.fillColor = 'red';
                        setTimeout(function () {
                            back_HP.fillColor = "grey";
                        }, 800);
                    }
                }
            }
        }
        if (!player.is_beat && zombies[i].is_get_hit) {
            setTimeout(function () { zombies[i].is_get_hit = false; zombies[i].get_Hit.setFrame(0);}, 220);
        }
    }

}

let COLLISION = function () {

    let s = false;
    //player and stairs
    for (let i in stairs) {
        if (stairs[i].isStaticIntersect(player.current_Sprite.getStaticBox())) {
            s = true;
        }
    }

    player.on_stairs = s;

    //player collision
    for (let i in rMap) {
        if (rMap[i].isStaticIntersect(player.current_Sprite.getStaticBoxA(-player.current_speed, 0, player.current_speed))) {
            if (player.dx < 0) {
                player.dx = 0; player.x = rMap[i].x + rMap[i].w;
            }
        }
        if (rMap[i].isStaticIntersect(player.current_Sprite.getStaticBoxD(0, 0, player.current_speed))) {
            if (player.dx > 0) {
                player.dx = 0; player.x = rMap[i].x - player.w;
            }
        }
        if (rMap[i].isStaticIntersect(player.current_Sprite.getStaticBoxW(0, player.dy, 0, player.speed_down))) {
            if (player.dy < 0) {
                player.dy = player.speed_down; player.y = rMap[i].y + rMap[i].h;
            }
        }
        if (rMap[i].isStaticIntersect(player.current_Sprite.getStaticBoxS(0, 0, 0, player.speed_down))) {
            if (player.dy > 0) {
                if (!player.on_stairs) player.dy = 0; player.y = rMap[i].y - player.h;
                player.in_sky = false;
            }
        }

    }
    COORDINATES();

    let is_up = false;
    let is_dw = false;
    //up / down move
    for (let i in rMap) {
        if (rMap[i].isInCamera() && rMap[i].isStaticIntersect(player.current_Sprite.getStaticBoxW(0, -player.speed_down, 0, player.speed_down))) {
            is_up = true;
        }
        else if (rMap[i].isInCamera() && rMap[i].isStaticIntersect(player.current_Sprite.getStaticBoxS(0, 0, 0, player.speed_down))) {
            is_dw = true;
        }
    }

    //player on stairs
    if (player.on_stairs) {
        player.in_sky = false;
        if ((key.isDown("UP") || key.isDown("W")) && !is_up) {
            player.dy = -player.speed_on_stairs;
        }
        else if ((key.isDown("DOWN") || key.isDown("S")) && !is_dw) {
            player.dy = player.speed_on_stairs;
        }
        else player.dy = 0;
    }

    //collision zombie
    for (let i in zombies) {
        for (let j in walls_Zom) {
            if (zombies[i].current_Sprite.isInCamera()) {

                if (walls_Zom[j].isStaticIntersect(zombies[i].current_Sprite.getStaticBoxA(-zombies[i].dx, 0, zombies[i].dx))) {
                    if (zombies[i].dx < 0) {
                        zombies[i].dx = 0; zombies[i].x = walls_Zom[j].x + walls_Zom[j].w;
                    }
                }
                if (walls_Zom[j].isStaticIntersect(zombies[i].current_Sprite.getStaticBoxD(0, 0, zombies[i].dx))) {
                    if (zombies[i].dx > 0) {
                        zombies[i].dx = 0; zombies[i].x = walls_Zom[j].x - zombie_w;
                    }
                }

                if (this.dx == 0 && !this.is_bite) {
                    zombies[i].current_Sprite = zombies[i].stay;
                }

            }
        }
    }

    //player + coin
    for (let i in coins) {
        if (player.current_Sprite.isIntersect(coins[i])) {
            player.coin_count += 10;
            coins[i].setVisible(false);
            foreGround.fillColor = 'gold';
            foreGround.alpha = 0.4;
        }
    }

    //player + hill
    for (let i in hills) {
        if (player.current_Sprite.isIntersect(hills[i])) {
            player.current_HP += 7;
            hills[i].setVisible(false);
            foreGround.fillColor = '#D858C3';
            foreGround.alpha = 0.3;
        }
    }

    //player beat zombie
    if (player.is_beat && player.hit.getFrame() == 3) {
        for (let i in zombies) {
            if (zombies[i].current_Sprite.isInCamera()) {
                if (zombies[i].y > player.y - 50 && zombies[i].y < player.y + player.h + 50) {
                    if (is_left_go) {
                        if (zombies[i].x < player.x && zombies[i].x > player.x - 80) {
                            zombies[i].current_HP -= player.damage;
                            zombies[i].current_Sprite = zombies[i].get_Hit;
                            zombies[i].is_bite = false;
                            zombies[i].is_get_hit = true;
                        }
                        else zombies[i].is_get_hit = false;
                    }
                    else {
                        if (zombies[i].x > player.x && zombies[i].x < player.x + 80) {
                            zombies[i].current_HP -= player.damage;
                            zombies[i].current_Sprite = zombies[i].get_Hit;
                            zombies[i].is_bite = false;
                            zombies[i].is_get_hit = true;
                        }
                        else zombies[i].is_get_hit = false;
                    }
                }
                else zombies[i].is_get_hit = false;
            }
            else zombies[i].is_get_hit = false;
        }
    }

}

let COORDINATES = function () {
    player.hit.x = player.x;
    player.hit.y = player.y;

    player.run.x = player.x;
    player.run.y = player.y;

    player.stay.x = player.x;
    player.stay.y = player.y;

    player.walk.x = player.x;
    player.walk.y = player.y;

    player.jump.x = player.x;
    player.jump.y = player.y;

    player.roll.x = player.x;
    player.roll.y = player.y;

    player.up.x = player.x;
    player.up.y = player.y;

    for (let i in zombies) {
        zombies[i].attack.x = zombies[i].x;
        zombies[i].attack.y = zombies[i].y;

        zombies[i].stay.x = zombies[i].x;
        zombies[i].stay.y = zombies[i].y;

        zombies[i].get_Hit.x = zombies[i].x;
        zombies[i].get_Hit.y = zombies[i].y;

        zombies[i].walk.x = zombies[i].x;
        zombies[i].walk.y = zombies[i].y;
    }
}



game.newLoop('game', function () {

    DRAW();

    if (!is_end) {
        DOING();
        COLLISION();


        for (let i in zombies) {
            if (zombies[i].current_Sprite.isInCamera()) {
                if (zombies[i].dx == 0 && !zombies[i].is_bite && !zombies[i].is_get_hit) {
                    zombies[i].current_Sprite = zombies[i].stay;
                }
                zombies[i].current_Sprite.draw();
            }
        }


        player.y += player.dy;

        COORDINATES();



        if (!player.in_sky && !player.on_stairs) player.dy = player.speed_down;
        else {
            if (is_left_go) player.jump.setFlip(1, 0);
            else player.jump.setFlip(0, 0);
            if (player.in_sky && !player.is_beat) player.jump.draw();
            else if (player.on_stairs) player.up.draw();
        }
    }
    pjs.camera.setPositionC(pjs.vector.point(player.stay.getPosition(1).x, player.stay.getPosition(1).y));

    foreGround.draw();
    window_WH = game.getWH();
    
    if (player.current_HP <= 0) {
        SAVE();
        is_end = true;

        for (let i in zombies) {
            if (zombies[i].current_Sprite.isInCamera()) {
                zombies[i].current_Sprite = zombies[i].stay;
                zombies[i].current_Sprite.draw();
            }
        }
        player.fail.x = player.x;
        player.fail.y = player.y;
        player.fail.draw();

        foreGround.fillColor = "black";
        if (foreGround.alpha < 0.9) foreGround.alpha += 0.01;

        pjs.brush.drawTextS({
            x: innerWidth/2 - 50,
            y: innerHeight/2 - 250,
            text: "YOU DIED!",
            size: 140,
            align: "center",
            color: "red",
            strokeColor: 'grey',
            strokeWidth: 4,
            font: 'Franklin Gothic Medium'
        });

        menu_exit.setPositionS(pjs.vector.point(innerWidth / 2 - menu_exit.w, innerHeight / 2 + 200 - menu_exit.h));
        menu_exit.draw();

        if (mouse.isInStatic(menu_exit.getStaticBox())) {
            menu_exit.strokeColor = "green";
        }
        else {
            menu_exit.strokeColor = "#121C64";
        }

        if (mouse.isPeekStatic("LEFT", menu_exit.getStaticBox())) {
            location.replace('index.html');
        }
    }

});


setInterval(function () {

    //c(player.current_HP);
    //c(player.dy)
}, 500);


game.setLoop('game');
game.start();








