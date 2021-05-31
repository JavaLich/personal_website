import * as THREE from 'three';
import './style.css';

function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    camera.position.z = 1;

    geometry = new THREE.PlaneGeometry(width, height);
    material = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vertex').textContent,
    	fragmentShader: document.getElementById('fragment').textContent,
        uniforms: {
            click: {value: click},
            density: {value: density }
        }
    });
    mesh = new THREE.Mesh(geometry, material);
}

var width = window.innerWidth;
var height = window.innerHeight;
var scale = 8;

var scene;
var camera;

var data = new Uint8Array(width * height * 4);

var click = false;

for (let i = 0; i < width * height * 4; i += 4) {
    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = 255;
}

data = new Uint8Array(data);

var density = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
density.needsUpdates = true;

init();

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(width, height);

var geometry = new THREE.PlaneGeometry(width, height, 1, 1);
var material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertex').textContent,
	fragmentShader: document.getElementById('fragment').textContent,
    uniforms: {
        click: {value: click},
        density: {value: density }
    }
});
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    init();

    renderer.setSize(width, height);
    scene.add(mesh);
}
window.addEventListener('resize', handleResize);

function mouseClick() {
    click = true;
}
window.addEventListener('mousedown', mouseClick);

function mouseRelease() {
    click = false;
}
window.addEventListener('mouseup', mouseRelease);

function animate() {
    requestAnimationFrame(animate);

    mesh.material.uniforms.click.value = click;

    renderer.render(scene, camera);
}
animate();
