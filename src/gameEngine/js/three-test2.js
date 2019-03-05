var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

var scene = new THREE.Scene();
// LineDashedMaterial
// var material = new THREE.LineBasicMaterial({
//     color: 0x00eeff
// });
// var geometry = new THREE.Geometry();
// geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
// geometry.vertices.push(new THREE.Vector3(0, 10, 0));
// geometry.vertices.push(new THREE.Vector3(10, 0, 0));

// var line = new THREE.Line(geometry, material);

// scene.add(line);
// renderer.render(scene, camera);


var MAX_POINTS = 500;
var geometry = new THREE.BufferGeometry();
var positions = new Float32Array(MAX_POINTS * 3);

geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
var drawCount = 2;
geometry.setDrawRange(0, drawCount);

var material = new THREE.LineBasicMaterial({
    color: 0xffdd00,
    linewidth: 2
});
var line = new THREE.Line(geometry, material);
scene.add(line);

var positions = line.geometry.attributes.position.array;
var x = y = z = index = 0;
for (var i = 0, l = MAX_POINTS; i < l; i++) {
    positions[index++] = x;
    positions[index++] = y;
    positions[index++] = z;
    x += (Math.random() - 0.5) * 30;
    y += (Math.random() - 0.5) * 30;
    z += (Math.random() - 0.5) * 30;
}

function render() {
    requestAnimationFrame(render);
    line.geometry.attributes.position.needsUpdate = true; // 需要加在第一次渲染之后
    line.geometry.setDrawRange(0, 400);
    // cube.rotation.x += 0.01; 
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
render();