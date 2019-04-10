if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}



var views = [];
var scene, renderer;
var mouseX = 0,
    mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function View(canvas, fullWidth, fullHeight, viewX, viewY, viewWidth, viewHeight) {
    canvas.width = viewWidth * window.devicePixelRatio;
    canvas.height = viewHeight * window.devicePixelRatio;
    // getContext() 方法返回一个用于在画布上绘图的环境。
    var context = canvas.getContext('2d');
    var camera = new THREE.PerspectiveCamera(20, viewWidth / viewHeight, 1, 10000);
    // 这是设置相机的有效显示部分，表示只显示相机里面的一个部分。对照上一节的图，就是显示视口部分。
    // setViewOffset(fullWidth, fullHeight, x, y, width, height) 各个参数的解释如下：
    // fullWidth：整个视图（口）的宽度，也可以理解为相机的宽度。
    // fullHeight：整个视图（口）的高度，也可以理解为相机的高度。
    // x：视图的x轴偏移位置，及要显示的部分相对于左上角的偏移。
    // y：视图的y轴偏移位置。
    // width：子视图的宽度，只有这个宽度才被显示。
    // height：子视图的高度，只有这个高度才被显示。
    camera.setViewOffset(fullWidth, fullHeight, viewX, viewY, viewWidth, viewHeight);
    camera.position.z = 1800;
    // 将结果渲染到canvas（div）中
    this.render = function () {
        // 根据鼠标来为相机设置不同的位置，从而得到不同视角观看场景的机会
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        // 相机永远指向场景的原点位置，场景的位置默认在世界坐标的原点，而且一般我们不会移动scene的位置
        camera.lookAt(scene.position);
        // 设置渲染器的宽度和高度
        renderer.setViewport(0, 0, viewWidth, viewHeight);
        // 根据场景和相机渲染整个画面
        renderer.render(scene, camera);
        // 将渲染器的渲染结果domElement绘制到context中，也就是canvas画布中。
        context.drawImage(renderer.domElement, 0, 0);
    };
}

function init() {
    var canvas1 = document.getElementById('canvas1');
    var canvas2 = document.getElementById('canvas2');
    var canvas3 = document.getElementById('canvas3');

    var fullWidth = 550;
    var fullHeight = 600;
    // 
    views.push(new View(canvas1, fullWidth, fullHeight, 0, 0, canvas1.clientWidth, canvas1.clientHeight));
    views.push(new View(canvas2, fullWidth, fullHeight, 150, 200, canvas2.clientWidth, canvas2.clientHeight));
    views.push(new View(canvas3, fullWidth, fullHeight, 75, 300, canvas3.clientWidth, canvas3.clientHeight));

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1).normalize();
    scene.add(light);
    // 使用canvas添加阴影效果
    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    var context = canvas.getContext('2d');

    // 创建一个放射性渐变，渐变从画布的中心开始，到以canvas.width/2为半径的圆结束
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    // 在离画布中心canvas.width*0.1的位置添加一种颜色
    gradient.addColorStop(0.1, 'rgba(210,210,210,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,1)');
    // 填充方式就是刚才创建的渐变填充
    context.fillStyle = gradient;
    // 实际的在画布上绘制渐变。
    context.fillRect(0, 0, canvas.width, canvas.height);
    // 将画布转化为纹理
    var shadowTexture = new THREE.CanvasTexture(canvas);
    // CanvasTexture可以从canvas画布中创建一个纹理，然后由纹理定义材质
    var shadowMaterial = new THREE.MeshBasicMaterial({
        map: shadowTexture
    });

    var shadowGeo = new THREE.PlaneBufferGeometry(300, 300, 1, 1);
    var shadowMesh;
    shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    shadowMesh.position.y = -250;
    shadowMesh.rotation.x = -Math.PI / 2;
    scene.add(shadowMesh);

    shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    shadowMesh.position.x = -400;
    shadowMesh.position.y = -250;
    shadowMesh.rotation.x = -Math.PI / 2;
    scene.add(shadowMesh);

    shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    shadowMesh.position.x = 400;
    shadowMesh.position.y = -250;
    shadowMesh.rotation.x = -Math.PI / 2;
    scene.add(shadowMesh);
    // 20面体的半径是200单位
    var radius = 200;
    // 生成3个20面体
    var geometry1 = new THREE.IcosahedronBufferGeometry(radius, 1);
    // 从20面体中的顶点数组（geometry1.attributes.position）中获得顶点的个数
    // 目的是为每个顶点设置一个颜色属性
    var count = geometry1.attributes.position.count;
    // 为几何体设置一个颜色属性，颜色属性的属性名必须是‘color’，这样Three.js才认识。
    geometry1.addAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));

    var geometry2 = geometry1.clone();
    var geometry3 = geometry1.clone();
    // 声明一个临时的颜色值，待会用来作为中间结果。
    var color = new THREE.Color();
    // 获得3个几何体的位置属性数组
    var positions1 = geometry1.attributes.position;
    var positions2 = geometry2.attributes.position;
    var positions3 = geometry3.attributes.position;
    // 获得3个几何体的颜色属性数组
    var colors1 = geometry1.attributes.color;
    var colors2 = geometry2.attributes.color;
    var colors3 = geometry3.attributes.color;
    // 为每个顶点设置一种颜色
    for (var i = 0; i < count; i++) {
        color.setHSL((positions1.getY(i) / radius + 1) / 2, 1.0, 0.5);
        colors1.setXYZ(i, color.r, color.g, color.b);
        color.setHSL(0, (positions2.getY(i) / radius + 1) / 2, 0.5);
        colors2.setXYZ(i, color.r, color.g, color.b);
        color.setRGB(1, 0.8 - (positions3.getY(i) / radius + 1) / 2, 0);
        colors3.setXYZ(i, color.r, color.g, color.b);
    }
    // function setHSL( h色相, s饱和度, l亮度 )
    // 使用两种不同的材质模拟20面体表面的线条
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        shininess: 0
    });

    var wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        transparent: true
    });

    var mesh1 = new THREE.Mesh(geometry1, material);
    var wireframe = new THREE.Mesh(geometry1, wireframeMaterial);
    // 
    mesh1.add(wireframe);
    mesh1.position.x = -400;
    mesh1.rotation.x = -1.87;
    scene.add(mesh1);

    var mesh2 = new THREE.Mesh(geometry2, material);
    var wireframe = new THREE.Mesh(geometry2, wireframeMaterial);
    mesh2.add(wireframe);
    mesh2.position.x = 400;
    scene.add(mesh2);

    var mesh3 = new THREE.Mesh(geometry3, material);
    var wireframe = new THREE.Mesh(geometry3, wireframeMaterial);
    mesh3.add(wireframe);
    scene.add(mesh3);
    // 将渲染器设置为反锯齿，这样渲染的图像更清晰，质量越高，当然消耗了更多CPU资源。
    // 然后通过setSize函数设置了渲染器的高度和宽度正好等于container的高度和宽度。
    // 最后将渲染器的结果加到container中，这样渲染的结果才能显示出来。
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(fullWidth, fullHeight);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}
// 监听鼠标移动的事件,得到鼠标的位置
// event.ClientX和event.ClientY的原点是窗口左上角，通过减去窗口一半的距离。
// 让mouseX和mouseY，当鼠标在窗口中心点的时候，其值为0，这样原点就好像移动到了窗口的中心位置。
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function animate() {
    for (var i = 0; i < views.length; ++i) {
        views[i].render();
    }
    requestAnimationFrame(animate);
}

init();
animate();