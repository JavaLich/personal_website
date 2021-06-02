import * as THREE from 'three';
import './style.css';
import { createDataTexture } from './helper.js'

var click = false;

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

    renderer.setSize(width, height);

    scene.add(mesh);
}

var width = window.innerWidth;
var height = window.innerHeight;
var scale = 8;

var scene;
var camera;

var density = createDataTexture(width, height);

var geometry;
var material;
var mesh;

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});

init();

function animate() {
    requestAnimationFrame(animate);

    mesh.material.uniforms.click.value = click;

    renderer.render(scene, camera);
}
animate();
