import * as Three from 'three';
import './style.css';
import * as Simulation from './simulation.js'

function mousePress() {
    velocity.advectMesh.material.uniforms.click.value = true;
}
window.addEventListener('mousedown', mousePress);

function mouseRelease() {
    velocity.advectMesh.material.uniforms.click.value = false;
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

var bufferScene;
var box_mesh;

var density;
var velocity;

var geometry;
var material;
var mesh;

const canvas = document.querySelector('#c');
const renderer = new Three.WebGLRenderer({canvas});

init();

density.update(renderer, camera);
velocity.update(renderer, camera);

function animate() {
    requestAnimationFrame(animate);

    velocity.advect(renderer, camera, velocity);
    density.advect(renderer, camera, velocity);

    for (var i = 0; i < 20; i++) {
        velocity.diffuse(renderer, camera, velocity);
        density.diffuse(renderer, camera, velocity);
    }

    box_mesh.material.map = density.target.texture;

    renderer.setRenderTarget(null)
    renderer.render(scene, camera);
}
animate();
