function hello(str) { console.log(str); }
hello("START");

let canvas = document.querySelector("canvas");

let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;

window.onresize = function () {   
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
}

let ball = {   //настройки для сферы
    rotationY: 0,
    rotationX: 0,
    rotationZ: 0,
    positionY: 0,
    positionX: 0,
    positionZ: 0
}

let gui = new dat.GUI();
gui.add(ball, 'rotationY').min(-0.2).max(0.2).step(0.001);  //настройка пользовательского интерфейса
//передаем объект и значение, которое будем у него менять
gui.add(ball, 'rotationX').min(-0.2).max(0.2).step(0.001);
gui.add(ball, 'rotationZ').min(-0.2).max(0.2).step(0.001);
gui.add(ball, 'positionY').min(-5).max(5).step(0.1);
gui.add(ball, 'positionX').min(-5).max(5).step(0.1);
gui.add(ball, 'positionZ').min(-5).max(5).step(0.1);

let renderer = new THREE.WebGLRenderer({ canvas: canvas });   //Рендерер, передали свой канвас
renderer.setClearColor(0x000000);  //поставили черный цвет

let scene = new THREE.Scene();  //создали сцену
let camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 5000);  //создали перспективную камеру (чем дальше - тем меньше)
//передали угол обзора, пропорция отображения камеры
//Мы видим объект, если он расположен к нам не ближе чем 0,1px и не дальше 5000 px

camera.position.set(0, 0, 1000);
///У объектов в three.js есть свойство position, установка позиции: obj.position.set(x, y, z);
//0, 0, 1000   -камера будет по середине по x и  y, но немного ближе к нам


let light = new THREE.AmbientLight(0xffffff); //рассеяный свет (как солнце, светит везде) не имеет местоположения, напр
//авления, светит со всех сторон                  Но ему некуда падать, негде отразится

let geometry = new THREE.PlaneGeometry(1200, 400, 12, 12); //создаем плоскость, указываем ширину, высоту и кол-во фрагментов
//фрагмент - как квадратик, с которым можно будет отдельно работать
let material = new THREE.MeshBasicMaterial({ color: '#A7E0E3', /*wireframe: true*/ });  //wireframe - пустотелый ли объект
let mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x += 30;
mesh.position.y -= 150;

scene.add(mesh);

let geometry_s = new THREE.SphereGeometry(200, 12, 12);  //Сфера
let material_s = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors:THREE.FaceColors/*можно задать для каждой грани свой цвет*/ });
let mesh_s = new THREE.Mesh(geometry_s, material_s);
mesh_s.position.x -= 400;
mesh_s.position.y += 50;
ball.positionX = 0.3;
ball.rotationZ = -0.002;
scene.add(mesh_s);

let geometry_cube = new THREE.BoxGeometry(200, 200, 200, 10, 10, 10);
let material_cube = new THREE.MeshBasicMaterial({ color: "#04998B", vertexColors: THREE.FaceColors});
let cube = new THREE.Mesh(geometry_cube, material_cube);
cube.position.x = 300;
cube.position.y = 220;
scene.add(cube);

for (let i = 0; i < geometry_cube.faces.length; i++) {
    geometry_cube.faces[i].color.setRGB(Math.random(), Math.random(), Math.random());  //заполняем грани рандомным цветом
}

for (let i = 0; i < geometry_s.faces.length; i++) {
    geometry_s.faces[i].color.setRGB(Math.random(), Math.random(), Math.random());  //заполняем грани рандомным цветом
}

function loop() {
    mesh_s.rotation.y += ball.rotationY;
    mesh_s.rotation.x += ball.rotationX;
    mesh_s.rotation.z += ball.rotationZ;

    mesh_s.position.y += ball.positionY;
    mesh_s.position.x += ball.positionX;
    mesh_s.position.z += ball.positionZ;

    cube.rotation.y += ball.rotationY;
    cube.rotation.x += ball.rotationX;
    cube.rotation.z += ball.rotationZ;

    cube.position.y += ball.positionY;
    cube.position.x += ball.positionX;
    cube.position.z += ball.positionZ;

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

loop();