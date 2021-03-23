function hello(str) { console.log(str); }
hello("START");

let canvas = document.querySelector("canvas");

let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;

window.onresize = function () {   
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
}

let ball = {   //��������� ��� �����
    rotationY: 0,
    rotationX: 0,
    rotationZ: 0,
    positionY: 0,
    positionX: 0,
    positionZ: 0
}

let gui = new dat.GUI();
gui.add(ball, 'rotationY').min(-0.2).max(0.2).step(0.001);  //��������� ����������������� ����������
//�������� ������ � ��������, ������� ����� � ���� ������
gui.add(ball, 'rotationX').min(-0.2).max(0.2).step(0.001);
gui.add(ball, 'rotationZ').min(-0.2).max(0.2).step(0.001);
gui.add(ball, 'positionY').min(-5).max(5).step(0.1);
gui.add(ball, 'positionX').min(-5).max(5).step(0.1);
gui.add(ball, 'positionZ').min(-5).max(5).step(0.1);

let renderer = new THREE.WebGLRenderer({ canvas: canvas });   //��������, �������� ���� ������
renderer.setClearColor(0x000000);  //��������� ������ ����

let scene = new THREE.Scene();  //������� �����
let camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 5000);  //������� ������������� ������ (��� ������ - ��� ������)
//�������� ���� ������, ��������� ����������� ������
//�� ����� ������, ���� �� ���������� � ��� �� ����� ��� 0,1px � �� ������ 5000 px

camera.position.set(0, 0, 1000);
///� �������� � three.js ���� �������� position, ��������� �������: obj.position.set(x, y, z);
//0, 0, 1000   -������ ����� �� �������� �� x �  y, �� ������� ����� � ���


let light = new THREE.AmbientLight(0xffffff); //��������� ���� (��� ������, ������ �����) �� ����� ��������������, ����
//�������, ������ �� ���� ������                  �� ��� ������ ������, ����� ���������

let geometry = new THREE.PlaneGeometry(1200, 400, 12, 12); //������� ���������, ��������� ������, ������ � ���-�� ����������
//�������� - ��� ���������, � ������� ����� ����� �������� ��������
let material = new THREE.MeshBasicMaterial({ color: '#A7E0E3', /*wireframe: true*/ });  //wireframe - ���������� �� ������
let mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x += 30;
mesh.position.y -= 150;

scene.add(mesh);

let geometry_s = new THREE.SphereGeometry(200, 12, 12);  //�����
let material_s = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors:THREE.FaceColors/*����� ������ ��� ������ ����� ���� ����*/ });
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
    geometry_cube.faces[i].color.setRGB(Math.random(), Math.random(), Math.random());  //��������� ����� ��������� ������
}

for (let i = 0; i < geometry_s.faces.length; i++) {
    geometry_s.faces[i].color.setRGB(Math.random(), Math.random(), Math.random());  //��������� ����� ��������� ������
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