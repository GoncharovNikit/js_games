function hello() { alert('hello');}
let games_Count = 10;

let but_Change_Anim = document.querySelector('#anim_Change');

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;


let animations = [{ key: 'figure', foo: anim_Figure },
    { key: 'lines', foo: anim_Lines },
    { key: 'figure', foo: anim_Figure }];

let config_Gl = {
    default_Animation_index: 0,
    current_Animation_index: 0,
    is_play: true
}

but_Change_Anim.addEventListener('mousedown', function (event) {
    this.style.color = 'red';
    this.style.outline = 'none';
});

but_Change_Anim.addEventListener('mouseup', function (event) {
    this.style.borderColor = '#E7B00C';
    this.style.color = 'whitesmoke';
});

but_Change_Anim.addEventListener('mouseover', function (event) {
    this.style.borderColor = 'red';
});

but_Change_Anim.addEventListener('mouseout', function (event) {
    this.style.borderColor = '#E7B00C';
});

but_Change_Anim.addEventListener('click', function (event) {
    config_Gl.is_play = false;
    config_Gl.current_Animation_index++; config_Gl.current_Animation_index %= animations.length;
    console.log('Anim.length: ' + animations.length + '  Current index: ' + config_Gl.current_Animation_index);

    canvas.width = canvas.width;
    ctx.clearRect(0, 0, w, h);
    config_Gl.is_play = true;
    animations[config_Gl.current_Animation_index].foo();
});

document.body.onload = function () {
    animations[config_Gl.default_Animation_index].foo();
    config_Gl.current_Animation_index = config_Gl.default_Animation_index;

    

    for (let i = 1; i <= games_Count; i++) {
        let but_TMP = document.querySelector("#start" + i);
        console.log("BUTTON Setting: " + but_TMP);
        but_TMP.onclick = function (event) {
            document.location.replace('game' + i + '/index.html');
        }

        but_TMP.addEventListener('mousedown', function (event) {
            this.style.color = 'red';
            this.style.outline = 'none';
        });
        but_TMP.addEventListener('mouseup', function (event) {
            this.style.borderColor = '#E7B00C';
            this.style.color = 'whitesmoke';
        });
        but_TMP.addEventListener('mouseover', function (event) {
            this.style.borderColor = 'red';
        });
        but_TMP.addEventListener('mouseout', function (event) {
            this.style.borderColor = '#E7B00C';
        });        
    }

}


let config_F = {
    hue: 0,
    back_color: 'rgb(20, 30, 30, 0.01)',
    dirs_Count: 3,
    steps_to_turn: 25,
    dot_size: 2,
    dots_Count: 300,
    dot_velocity: 2,
    distance: 150,
    gradient_Len: 20,
    gridAngle: 0,
    koef_Y_speed: 0,
    koef_X_speed: 0
}

function set_Default_Figure() {
    config_F = {
        hue: 0,
        back_color: 'rgb(20, 30, 30, 0.01)',
        dirs_Count: 3,
        steps_to_turn: 25,
        dot_size: 2,
        dots_Count: 300,
        dot_velocity: 2,
        distance: 150,
        gradient_Len: 20,
        gridAngle: 0,
        koef_Y_speed: 0,
        koef_X_speed: 0
    }
}
































///animation figure
function anim_Figure() {
    let index_f = 'figure';
    let center_x, center_y;

    if (config_Gl.current_Animation_index == 2) { config_F.dirs_Count = 6; config_F.dot_velocity = 1; }
    else if (config_Gl.current_Animation_index == 0) { set_Default_Figure();  }


    function resize_Canvas() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        center_x = w / 2;
        center_y = h / 2;
    }

    resize_Canvas();

    window.addEventListener('resize', resize_Canvas);

    function draw_Rect(color, x, y, w, h, shadowColor, shadowBlur, gco) {
        ctx.globalCompositeOperation = gco;
        ctx.shadowColor = shadowColor || 'black';
        ctx.shadowBlur = shadowBlur || 1;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }

    class Dot {  //tochka
        constructor() {
            this.pos = { x: center_x, y: center_y };
            this.dir = config_F.dirs_Count == 6 ? (Math.random() * 3 | 0) * 2 : Math.random() * config_F.dirs_Count | 0; //от нуля до пяти
            this.step = 0;
        }

        redraw_Dot() {
            let xy = Math.abs(this.pos.x - center_x) + Math.abs(this.pos.y - center_y);
            let make_hue = (config_F.hue + xy / config_F.gradient_Len) % 360;
            let blur = config_F.dot_size - Math.sin(xy / 8) * 2;
            let color = 'hsl(' + make_hue + ', 100%, 50%)';
            let size = config_F.dot_size - Math.sin(xy / 9) * 2 - Math.sin(xy / 2);
            let x = this.pos.x - size / 2;
            let y = this.pos.y - size / 2;

            draw_Rect(color, x, y, size, size, color, blur, 'normal');
        }

        move_Dot() {
            this.pos.x += dirsList[this.dir].x * config_F.dot_velocity - config_F.koef_X_speed;
            this.pos.y += dirsList[this.dir].y * config_F.dot_velocity - config_F.koef_Y_speed;
            this.step++;
        }

        change_dir() {  //smena napravleniya
            if (this.step % config_F.steps_to_turn == 0) {
                this.dir = Math.random() > 0.5 ? (this.dir + 1) % config_F.dirs_Count : (this.dir + config_F.dirs_Count - 1) % config_F.dirs_Count;
            }
        }

        kill(id) {
            let percent = Math.random() * Math.exp(this.step / config_F.distance);
            if (percent > 100) {
                dots_list.splice(id, 1);
            }
        }
    }

    let dirsList = [];

    function createDirs() {
        for (let i = 0; i < 360; i += 360 / config_F.dirs_Count) {
            let angle = config_F.gridAngle + i;
            let x = Math.cos(angle * Math.PI / 180);
            let y = Math.sin(angle * Math.PI / 180);
            dirsList.push({ x: x, y: y });
        }
    }
    createDirs();

    let dots_list = [];

    function add_Dot() {
        if (dots_list.length < config_F.dots_Count && Math.random() > 0.8) {
            dots_list.push(new Dot());
            config_F.hue = (config_F.hue + 1) % 360;
        }
    }

    function refresh_Dots() {
        dots_list.forEach((i, id) => {
            i.move_Dot();
            i.redraw_Dot();
            i.change_dir();
            i.kill(id);
        });
    }

    function loop() {

        if ((!config_Gl.is_play) || index_f != animations[config_Gl.current_Animation_index].key) { ctx.clearRect(0, 0, w, h); return; }
        else {
            console.log('figure'); 

            //ctx.clearRect(0, 0, cw, ch);
            draw_Rect(config_F.back_color, 0, 0, w, h, 0, 0, 'normal');
            add_Dot();
            refresh_Dots();
            console.log('dirs count: ' + config_F.dirs_Count);
            requestAnimationFrame(loop);
        }
    }

    loop();

}








/////animation lines
function anim_Lines() {
    let index_l = 'lines';

    let particles = [];   //частицы

    let properties = {
        back_Color: '#5A564A',
        particle_Color: '#E7B00C',
        particle_Radius: 3,
        particle_Count: 180,
        particle_MAX_Velocity: 0.5,
        line_length: 250,
        particle_Life: 6
    }

    window.onresize = function () {   //При изменении размера окна - меняется и канвас
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.velocity_X = Math.random() * (properties.particle_MAX_Velocity * 2) - properties.particle_MAX_Velocity;
            this.velocity_Y = Math.random() * (properties.particle_MAX_Velocity * 2) - properties.particle_MAX_Velocity;
            this.life = Math.random() * properties.particle_Life * 60;
        }
        redraw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, properties.particle_Radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = properties.particle_Color;
            ctx.fill();
        }

        change_Position() {
            this.x + this.velocity_X > w && this.velocity_X > 0 || this.x + this.velocity_X < 0 && this.velocity_X < 0 ?
                this.velocity_X *= -1 : this.velocity_X;

            this.y + this.velocity_Y > h && this.velocity_Y > 0 || this.y + this.velocity_Y < 0 && this.velocity_Y < 0 ?
                this.velocity_Y *= -1 : this.velocity_Y;

            this.x += this.velocity_X;
            this.y += this.velocity_Y;
        }
        kill() {
            if (this.life < 1) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.velocity_X = Math.random() * (properties.particle_MAX_Velocity * 2) - properties.particle_MAX_Velocity;
                this.velocity_Y = Math.random() * (properties.particle_MAX_Velocity * 2) - properties.particle_MAX_Velocity;
                this.life = Math.random() * properties.particle_Life * 60;
            }
            this.life--;
        }
    }

    function redraw_Back() {
        ctx.fillStyle = properties.back_Color;
        ctx.fillRect(0, 0, w, h);
    }

    function draw_Lines() {
        let x1, y1, x2, y2, length, opacity;

        for (let i = 0; i < particles.length; i++) {
            for (let j = 0; j < particles.length; j++) {
                x1 = particles[i].x;
                y1 = particles[i].y;
                x2 = particles[j].x;
                y2 = particles[j].y;

                length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                if (length < properties.line_length) {
                    opacity = 1 - length / properties.line_length;

                    ctx.lineWidth = '0.5';
                    ctx.strokeStyle = 'rgb(231, 176, 12, ' + opacity + ')';

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }
    }

    function redraw_Particles() {
        for (let i in particles) {
            particles[i].kill();
            particles[i].redraw();
            particles[i].change_Position();
        }
    }

    function loop() {
        if ((!config_Gl.is_play) && index != animations[config_Gl.current_Animation_index].key) return;

        redraw_Back();
        redraw_Particles();
        draw_Lines();

        if ((!config_Gl.is_play) || index_l != animations[config_Gl.current_Animation_index].key) { ctx.clearRect(0, 0, w, h); return; }
        else {
            console.log('lines INDEX: ' + index_l); requestAnimationFrame(loop);
        }

        //requestAnimationFrame(loop);   //вызывает луп на 60 фпс
    }

    function init() {
        for (let i = 0; i < properties.particle_Count; i++) {
            particles.push(new Particle);
        }
        loop();  //запускает рекурсивную функцию в конце
    }

    init();

}

