import * as THREE from 'three';
import './style.css';
import { createDataTexture } from './helper.js'

var click = false;

function mousePress() {
    click = true;
}
window.addEventListener('mousedown', mousePress);

function mouseRelease() {
    click = false;
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
    bufferScene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    camera.position.z = 1;

    renderer.setSize(width, height);

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

    bufferScene.add(mesh);

    var box = new THREE.PlaneGeometry(100, 100);
    const box_material = new THREE.MeshBasicMaterial( {
        map: densityTarget.texture,
    } );

    var box_mesh = new THREE.Mesh(box, box_material);
    box_mesh.material.needsUpdate = true;
    scene.add(box_mesh);
}

var width = window.innerWidth;
var height = window.innerHeight;
var scale = 8;

var scene;
var bufferScene;
var camera;

var density = createDataTexture(width, height);
var densityTarget = new THREE.WebGLRenderTarget(width, height);

var geometry;
var material;
var mesh;

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});

init();

function animate() {
    requestAnimationFrame(animate);

    mesh.material.uniforms.click.value = click;

    renderer.setRenderTarget(densityTarget)
    renderer.render(bufferScene, camera);

    renderer.setRenderTarget(null)
    renderer.render(scene, camera);
}
animate();
