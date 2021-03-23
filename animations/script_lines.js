function anim_Lines() {
    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext('2d');
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;


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
        redraw_Back();
        redraw_Particles();
        draw_Lines();
        requestAnimationFrame(loop);   //вызывает луп на 60 фпс
    }

    function init() {
        for (let i = 0; i < properties.particle_Count; i++) {
            particles.push(new Particle);
        }
        loop();  //запускает рекурсивную функцию в конце
    }

    init();

}




















