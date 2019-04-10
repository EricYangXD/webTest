var renderer;
var stats;

function initThree() {
    // width = document.getElementById('canvas-frame').clientWidth;
    width = window.innerWidth;
    // height = document.getElementById('canvas-frame').clientHeight;
    height = window.innerHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    // document.getElementById('canvas-frame').appendChild(renderer.domElement);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF, 1.0);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById('canvas-frame').appendChild(stats.domElement);
}

var camera;
// 正(交)投影相机 THREE.OrthographicCamera( left, right, top, bottom, near, far ) 各个平面到相机中心点的距离
// 和 透视投影相机 THREE.PerspectiveCamera( fov视角, aspect窗口的宽高比, near近点距离, far远点距离 ) 都是正值.
// 透视投影有一个基本点，就是远处的物体比近处的物体小.
// 在工程建筑领域，正投影的例子很多，其特点是，远近高低比例都相同.
function initCamera() {

    // camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000);
    // scene.add(camera);

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);

    // 这个部分的camera.position是指相机放置的位置
    // camera.up是指相机以哪个方向为上方，根据右手坐标原理，可进行旋转模拟
    // camera.lookAt() 是指相机看向哪个点
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 1000;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt(0, 0, 0);
}

var scene;

function initScene() {
    scene = new THREE.Scene();
}

var light;

function initLight() { //没有光线时，物体皆为黑色
    // THREE.AmbientLight(hex)环境光
    // THREE.PointLight(hex, intensity光线强度, distance经过这个距离光线衰减为零)点光源
    // THREE.AreaLight(hex)区域光
    // THREE.DirectionalLight(hex, intensity)方向光/平行光源,位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
    // THREE.SpotLight(hex, intensity, distance, angle聚光灯着色的角度，用弧度作为单位, exponent光源模型中，衰减的一个参数，越大衰减约快)聚光灯
    light = new THREE.DirectionalLight(0x888800, 1);
    light.position.set(0, 0, 1);
    scene.add(light);
    // light = new THREE.PointLight(0x000000);
    // light.position.set(0, 0, 300);
    // scene.add(light);
}

var cube;
var mesh;

function initObject() {
    // 圆柱体:CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength)。
    // radiusTop: 柱体顶部半径
    // radiusBottom：柱体底部半径
    // height：柱体高度
    // radiusSegments：圆周分段，数字越高柱体越圆滑
    // heightSegments：高度分段，与上类似
    // openEnded：是否显示顶盖和底板
    // thetaStart, thetaLength：不明白，一种随时间的变化什么的

    // 材质
    // Lambert材质:在灰暗的或不光滑的表面产生均匀散射而形成的材质类型
    // var material=new THREE.MeshLambertMaterial({color:0x880000});

    // var geometry = new THREE.CylinderGeometry(100, 150, 400);
    // var material = new THREE.MeshLambertMaterial({
    //     color: 0x88ffff
    // });
    // mesh = new THREE.Mesh(geometry, material);
    // mesh.position = new THREE.Vector3(0, 0, 0);
    // scene.add(mesh);

    var geometry1 = new THREE.CubeGeometry(200, 100, 50, 4, 4);
    var material1 = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF
    });
    var mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.position.set(0, 0, 0);
    scene.add(mesh1);

    var geometry2 = new THREE.CubeGeometry(200, 100, 50, 4, 4);
    var material2 = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF
    });
    var mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.position.set(-300, 0, 0);
    scene.add(mesh2);

    var geometry3 = new THREE.CubeGeometry(200, 100, 50, 4, 4);
    var material3 = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF
    });
    var mesh3 = new THREE.Mesh(geometry3, material3);
    mesh3.position.set(0, -150, 0);
    scene.add(mesh3);

    var mesh4 = new THREE.Mesh(geometry3, material3);
    mesh4.position.set(0, 150, 0);
    scene.add(mesh4);

    var mesh5 = new THREE.Mesh(geometry3, material3);
    mesh5.position.set(300, 0, 0);
    scene.add(mesh5);

    var mesh6 = new THREE.Mesh(geometry3, material3);
    mesh6.position.set(0, 0, -100);
    scene.add(mesh6);
}

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    initTween();
    animation();

}

function animation() {
    // renderer.clear();

    // method 1: 让camera移动，使物体看起来向反方向移动。
    // camera.position.x -= 1;

    // method 2: 让物体移动。
    // mesh.position.x += 1;
    // mesh.position.y -= 1;
    // mesh.position.z += 2;

    changeFov();

    renderer.render(scene, camera);
    requestAnimationFrame(animation);

    stats.update();
    // method 3: 使用动画库tween.js进行移动
    TWEEN.update();
}

threeStart();


function initTween() {
    // new TWEEN.Tween(mesh.position) //mesh:物体；camera:相机
    new TWEEN.Tween(camera.position) //mesh:物体；camera:相机
        .to({
            x: -400 //要移动到的位置
        }, 3000).repeat(Infinity).start(); //3000是动画的持续时间
}

function setCameraFov(fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
}

function changeFov() {
    var txtFov = document.getElementById("txtFov").value;
    var val = parseFloat(txtFov);
    setCameraFov(val);
}