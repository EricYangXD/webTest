// 写法一
// var THREE = require("three");
// import * as THREE from 'three';

var scene = new THREE.Scene(); //场景
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //透视相机
var renderer = new THREE.WebGLRenderer(); //渲染器
renderer.setSize(window.innerWidth, window.innerHeight); //设置渲染器宽高/窗口大小
document.body.appendChild(renderer.domElement); //渲染器renderer的domElement元素，表示渲染器中的画布，所有的渲染都是画在domElement上的
// 有多种模型：BoxGeometry()、CubeGeometry()
var geometry = new THREE.BoxGeometry(2, 1, 1); //(x,y,z,x1,y1,z1,materials,sides) // 模型对象
var material = new THREE.MeshBasicMaterial({ // 材质
    color: 0x00ffdd
});
var cube = new THREE.Mesh(geometry, material); // 网格材质
scene.add(cube);
camera.position.z = 5;

// 渲染循环
function render() { //一般是60FPS
    // requestAnimationFrame有很多的优点。
    // 最重要的一点或许就是当用户切换到其它的标签页时，它会暂停，因此不会浪费用户宝贵的处理器资源，以及损耗电池的使用寿命。
    requestAnimationFrame(render);
    cube.rotation.x += 0.01; //实现旋转
    cube.rotation.y += 0.01;
    renderer.render(scene, camera); //render( scene, camera, renderTarget, forceClear )
}
// webgl2兼容性检查
if (WEBGL.isWebGL2Available() === false) {
    document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
}

// 渲染之前先检查WebGL兼容性
if (WEBGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    render();
} else {
    var warning = WEBGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}