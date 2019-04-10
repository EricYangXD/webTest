var container, stats, camera, scene, renderer, mesh;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );
    camera.position.x = 100;
    camera.position.y = 300;
    camera.position.z = 600;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt(0, 0, 0);
    scene = new THREE.Scene();
    scene.add(camera);
    // var light = new THREE.AmbientLight(0xFF0000);
    // light.position.set(100, 100, 200);
    // scene.add(light);
    var light = new THREE.DirectionalLight(0x888800, 1);
    light.position.set(0, 0, 1);
    scene.add(light);
    // THREE.BoxGeometry = function ( width, height, depth, 
    // widthSegments宽度分段份数, heightSegments, depthSegments )
    var geometry = new THREE.BoxGeometry(100, 100, 100);
    // var geometry = new THREE.CubeGeometry(200, 100, 50, 4, 4);
    // 因为1個正方形面是由2个三角形组成的,三个点才能保证一定在一个面上
    for (var i = 0; i < geometry.faces.length; i += 2) {
        var hex = Math.random() * 0xffffff;
        geometry.faces[i].color.setHex(hex);
        geometry.faces[i + 1].color.setHex(hex);
    }
    // geometry.faces[0].color.setHex(0xcc00ff);
    // geometry.faces[1].color.setHex(0xffdd33);
    // geometry.faces[2].color.setHex(0xddee22);
    // geometry.faces[3].color.setHex(0x00ff22);
    // geometry.faces[4].color.setHex(0xaaddff);
    // geometry.faces[5].color.setHex(0x2233dd);


    var material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.FaceColors
        // color: 0xff0000
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position = new THREE.Vector3(0, 0, 0);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: false
    });
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xFFFFFF, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container = document.createElement("div");
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    window.addEventListener(
        "resize",
        function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        },
        false
    );
}

function animate() {
    // var rotation = new THREE.Euler();

    mesh.rotation.x += 0.1; //弧度！！！
    mesh.rotation.y += 0.1;
    mesh.rotation.z += 0.1;
    // mesh.position.x += 0.1;
    // mesh.position.z -= 0.1;
    // mesh.rotateY(0.1);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
}
initGrid();
// 绘制网格
// THREE.GridHelper: setColors() removed, 
// pass them in the constructor instead: new THREE.GridHelper( size, step, color1, color2 ).
// new THREE.GridHelper( size, step, color1, color2 )
function initGrid() {
    var helper = new THREE.GridHelper(1000, 50, 0x0000ff, 0x808080);
    // 旧版本写法 helper.setColors() has been deprecated
    // var helper = new THREE.GridHelper(1000, 50);
    // helper.setColors(0x0000ff, 0x808080);
    scene.add(helper);
}