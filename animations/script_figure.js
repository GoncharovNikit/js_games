function anim_Figure() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    let cw, ch, center_x, center_y;

    function resize_Canvas() {
        cw = canvas.width = innerWidth;
        ch = canvas.height = innerHeight;
        center_x = cw / 2;
        center_y = ch / 2;
    }

    resize_Canvas();

    window.addEventListener('resize', resize_Canvas);

    const config = {
        hue: 0,
        back_color: 'rgb(20, 30, 30, 0.01)',
        dirs_Count: 3,
        steps_to_turn: 25,
        dot_size: 2,
        dots_Count: 300,
        dot_velocity: 2,
        distance:150,
        gradient_Len: 20,
        gridAngle: 0,
        koef_Y_speed: 0,
        koef_X_speed: 0,
    }

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
            this.dir = config.dirs_Count == 6 ? (Math.random() * 3 | 0)*2: Math.random() * config.dirs_Count | 0; //от нуля до пяти
            this.step = 0;
        }

        redraw_Dot() {
            let xy = Math.abs(this.pos.x - center_x) + Math.abs(this.pos.y - center_y);
            let make_hue = (config.hue + xy / config.gradient_Len) % 360;
            let blur = config.dot_size - Math.sin(xy / 8) * 2;
            let color = 'hsl(' + make_hue + ', 100%, 50%)';
            let size = config.dot_size - Math.sin(xy / 9) * 2 - Math.sin(xy / 2);
            let x = this.pos.x - size / 2;
            let y = this.pos.y - size / 2;

            draw_Rect(color, x, y, size, size, color, blur, 'normal');
        }

        move_Dot() {
            this.pos.x += dirsList[this.dir].x * config.dot_velocity - config.koef_X_speed;
            this.pos.y += dirsList[this.dir].y * config.dot_velocity - config.koef_Y_speed;
            this.step++;
        }

        change_dir() {  //smena napravleniya
            if (this.step % config.steps_to_turn == 0) {
                this.dir = Math.random() > 0.5 ? (this.dir + 1) % config.dirs_Count : (this.dir + config.dirs_Count - 1) % config.dirs_Count;
            }
        }

        kill(id) {
            let percent = Math.random() * Math.exp(this.step / config.distance);
            if (percent > 100) {
                dots_list.splice(id, 1); 
            }
        }
    }  

    let dirsList = [];

    function createDirs() {
        for (let i = 0; i < 360; i += 360 / config.dirs_Count) {
            let angle = config.gridAngle + i;
            let x = Math.cos(angle * Math.PI / 180);
            let y = Math.sin(angle * Math.PI / 180);
            dirsList.push({ x: x, y: y });
        }
    }
    createDirs();

    let dots_list = [];

    function add_Dot() {
        if (dots_list.length < config.dots_Count && Math.random() > 0.8) {
            dots_list.push(new Dot());
            config.hue = (config.hue + 1) % 360;
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
        //ctx.clearRect(0, 0, cw, ch);
        draw_Rect(config.back_color, 0, 0, cw, ch, 0, 0, 'normal');
        add_Dot();
        refresh_Dots();

        requestAnimationFrame(loop);
    }

    loop();

    //canvas.onmousemove = function (event) {
    //    let x = event.offsetX / 1000;
    //    let y = event.offsetY / 1000;
        
    //}

}


