if (!Detector.webgl) {
    Detector.assGetWebGLMessage();
}
var container, stats, camera, controls, scene, renderer, cross;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / innerHeight,
        0.01,
        1e10
    );
    camera.position.z = 0.2;
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 5;
    controls.panSpeed = 2;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    scene = new THREE.Scene();
    scene.add(camera);

    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(200, 200, 1000).normalize();
    camera.add(dirLight);
    camera.add(dirLight.target);
    // THREE.BoxGeometry = function ( width, height, depth, 
    // widthSegments宽度分段份数, heightSegments, depthSegments )

    var geometry = new THREE.BoxGeometry(100, 100, 100);
    // for (var i = 0; i < geometry.faces.length; i += 2) {
    //     var hex = Math.random() * 0xffffff;
    //     geometry.faces[i].color.setHex(hex);
    //     geometry.faces[i + 1].color.setHex(hex);
    // }
    geometry.faces[0].color.setHex(0xff00ff);
    geometry.faces[1].color.setHex(0xffdd33);
    geometry.faces[2].color.setHex(0xddee22);
    geometry.faces[3].color.setHex(0x00ff22);
    geometry.faces[4].color.setHex(0xaaddff);
    geometry.faces[5].color.setHex(0x2233dd);

    var material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.FaceColors
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position = new THREE.Vector3(0, 0, 0);
    scene.add(mesh);

    // 使用VTKLoader加载3D模型
    var loader = new THREE.VTKLoader();
    // 旧版本vtkloader写法
    // loader.addEventListener('load', function (event) {
    //     var geometry = event.content;
    //     var mesh = new THREE.Mesh(geometry, material);
    //     mesh.position.setY(-0.09);
    //     scene.add(mesh);
    // });
    // loader.load("models/vtk/bunny.vtk");
    // 新版本vtkloader写法
    loader.load("models/vtk/bunny.vtk", function (geometry) {
        geometry.center();
        geometry.computeVertexNormals();
        var material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(-0.08, 0.005, 0);
        mesh.scale.multiplyScalar(0.3);
        scene.add(mesh);
    });
    // 同时可以加载vtp格式
    loader.load("models/vtk/cube_ascii.vtp", function (geometry) {
        geometry.center();
        geometry.computeVertexNormals();
        var material1 = new THREE.MeshLambertMaterial({
            color: 0xff0000, //设置纹理颜色
            side: THREE.DoubleSide
        });
        var mesh1 = new THREE.Mesh(geometry, material1);
        mesh1.position.set(0.08, 0.005, 0);
        mesh1.scale.multiplyScalar(0.02);
        scene.add(mesh1);
    });

    renderer = new THREE.WebGLRenderer({
        antialias: false
    });
    // 旧版本vtkloader写法
    // renderer.setClearColorHex(0x000000, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container = document.createElement("div");
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    // 旧版本写法，新版中依然可用
    // stats.domElement.style.position = "absolute";
    // stats.domElement.style.top = "0px";
    // container.appendChild(stats.domElement);
    container.appendChild(stats.dom);

    window.addEventListener(
        "resize",
        function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            controls.handleResize();
        },
        false
    );
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    stats.update();
}