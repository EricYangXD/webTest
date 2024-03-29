threeStart();

// 渲染器
var renderer;

function initThree() {
    width = document.getElementById('canvas-frame').clientWidth;
    height = document.getElementById('canvas-frame').clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    document.getElementById('canvas-frame').appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF, 1.0);
}

// 摄像头
var camera;

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.x = 0;
    camera.position.y = 1000;
    camera.position.z = 0;
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;
    camera.lookAt(0, 0, 0); // 高版本中不再是对象的形式
}

// 场景
var scene;

function initScene() {
    scene = new THREE.Scene();
}

// 光线
var light;

function initLight() {
    light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
    light.position.set(100, 100, 200);
    scene.add(light);
}

// 几何图形
var cube;
// 画网格
function initObject() {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-500, 0, 0));
    geometry.vertices.push(new THREE.Vector3(500, 0, 0));
    for (var i = 0; i <= 20; i++) {
        var line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
            color: 0x000000,
            opacity: 0.2
        }));
        line.position.z = (i * 50) - 500;
        scene.add(line);

        var line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
            color: 0x000000,
            opacity: 0.2
        }));
        line.position.x = (i * 50) - 500;
        line.rotation.y = 90 * Math.PI / 180;
        scene.add(line);
    }
}

// 画线
// function initObject() {
//     var geometry = new THREE.Geometry();
//     var material = new THREE.LineBasicMaterial({
//         vertexColors: true
//     });
//     var color1 = new THREE.Color(0x444444),
//         // color2 = new THREE.Color(0xFF0000),
//         color3 = new THREE.Color(0xdd00ee);
//     // 线的材质可以由2点的颜色决定
//     var p1 = new THREE.Vector3(-100, 0, 100);
//     // var p2 = new THREE.Vector3(100, 0, -100);
//     var p3 = new THREE.Vector3(100, 0, 100);
//     geometry.vertices.push(p1);
//     // geometry.vertices.push(p2);
//     geometry.vertices.push(p3);
//     // 为顶点设置颜色
//     geometry.colors.push(color1, color3);
//     // THREE.Line: parameter THREE.LinePieces no longer supported. Use THREE.LineSegments instead.
//     var line = new THREE.LineSegments(geometry, material);
//     // var line = new THREE.Line(geometry, material, THREE.LinePieces);
//     scene.add(line);
// }

// Start
function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    renderer.clear();
    renderer.render(scene, camera);
}