import * as THREE from 'three';
import './style.css';
import * as Simulation from './simulation.js'

function mousePress() {
    density.material.uniforms.click.value = true;
}
window.addEventListener('mousedown', mousePress);

function mouseRelease() {
    density.material.uniforms.click.value = false;
}
window.addEventListener('mouseup', mouseRelease);

function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    init();
}
window.addEventListener('resize', handleResize);

function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    camera.position.z = 1;

    renderer.setSize(width, height);

    density = new Simulation.FramebufferFeedback(width, height);
    velocity = new Simulation.FramebufferFeedback(width, height);

    var box = new THREE.PlaneGeometry(width, height);
    const box_material = new THREE.MeshBasicMaterial( {
        map: density.temp.texture,
    } );

    box_mesh = new THREE.Mesh(box, box_material);
    scene.add(box_mesh);
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
const renderer = new THREE.WebGLRenderer({canvas});

init();

function animate() {
    requestAnimationFrame(animate);

    density.update(renderer, camera);
    velocity.advect(renderer, camera, density, velocity);
    box_mesh.material.map = density.target.texture;

    renderer.setRenderTarget(null)
    renderer.render(scene, camera);
}
animate();
