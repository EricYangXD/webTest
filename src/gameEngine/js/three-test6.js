var camera, scene, renderer;
var mesh, texture;
start();

function start() {
    clock();
    init();
    animate();
}

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;
    scene = new THREE.Scene();
    // 画一个平面
    // var geometry = new THREE.PlaneGeometry(500, 300, 1, 1);
    var geometry = new THREE.CubeGeometry(150, 150, 150);


    // 为平面赋予纹理坐标！！！他们之间的顺序是逆时针方向（规定！）！！！
    // geometry.vertices[0].uv = new THREE.Vector2(0, 0);
    // geometry.vertices[1].uv = new THREE.Vector2(2, 0);
    // geometry.vertices[2].uv = new THREE.Vector2(2, 2);
    // geometry.vertices[3].uv = new THREE.Vector2(0, 2);

    // 纹理坐标Texture怎么弄
    // THREE.Texture(image, mapping纹理坐标, wrapS x轴的纹理的回环方式, 
    // wrapT y轴的纹理回环方式, magFilter过滤的方式, minFilter过滤的方式, 
    // format加载的图片的格式, type存储纹理的内存的每一个字节的格式, anisotropy各向异性过滤 )

    // 加载纹理,注意：javascript没有加载本地路径文件的权限（跨域），所以不能使用绝对路径！
    // var texture = THREE.ImageUtils.loadTexture("./js/textures/a.jpg", null, function (t) {});
    // texture = new THREE.TextureLoader().load("./js/textures/a.jpg"); //新语法
    texture = new THREE.Texture(canvas);
    // 将纹理用于材质
    var material = new THREE.MeshBasicMaterial({
        map: texture //材质具有map属性
    });
    texture.needsUpdate = true;

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    //监听窗口变化
    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    texture.needsUpdate = true;
    mesh.rotation.y -= 0.01;
    mesh.rotation.x -= 0.01;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}