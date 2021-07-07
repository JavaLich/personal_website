import * as Three from 'three';
import './style.css';
import * as Simulation from './simulation.js'

function mousePress() {
    window.click = true;
}
window.addEventListener('mousedown', mousePress);

function mouseRelease() {
    window.click = false;
}
window.addEventListener('mouseup', mouseRelease);

function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    init();
}
window.addEventListener('resize', handleResize);

function init() {
    scene = new Three.Scene();
    camera = new Three.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    camera.position.z = 1;

    renderer.setSize(width, height);

    density = new Simulation.FramebufferFeedback(width, height);
    velocity = new Simulation.FramebufferFeedback(width, height);

    var box = new Three.PlaneGeometry(width - 1, height - 1);
    const box_material = new Three.MeshBasicMaterial( {
        map: density.target.texture,
    } );

    box_mesh = new Three.Mesh(box, box_material);

    var edges = new Three.EdgesGeometry(box);
    var line = new Three.LineSegments(edges, new Three.LineBasicMaterial( { color: 0xff0000 } ));

    scene.add(box_mesh);
    scene.add(line);
}

var width = window.innerWidth;
var height = window.innerHeight;

var scene;
var camera;

var box_mesh;

var density;
var velocity;

const canvas = document.querySelector('#c');
const renderer = new Three.WebGLRenderer({canvas});

init();

//velocity.update(renderer, camera, 1.0 / 10.0);
//density.update(renderer, camera, 1.0);

function animate() {
    requestAnimationFrame(animate);

    velocity.advect(renderer, camera, velocity);
    density.advect(renderer, camera, velocity);

    if (window.click) 
        density.splat(renderer, camera);

    for (var i = 0; i < 10; i++) {
        velocity.diffuse(renderer, camera, velocity);
    }

    box_mesh.material.map = density.target.texture;

    renderer.setRenderTarget(null)
    renderer.render(scene, camera);
}
animate();
