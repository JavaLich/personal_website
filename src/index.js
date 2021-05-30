import * as THREE from 'three';
import './style.css'

var width = window.innerWidth;
var height = window.innerHeight;
var scale = 8;


var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(width, height);

var geometry = new THREE.PlaneGeometry(width, height, 1, 1);
var material = new THREE.ShaderMaterial( {
    vertexShader: document.getElementById( 'vertex' ).textContent,
	fragmentShader: document.getElementById( 'fragment' ).textContent
} );
var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

camera.position.z = 1;

function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    camera.position.z = 1;
    renderer.setSize(width, height);
    geometry = new THREE.PlaneGeometry(width, height, 1, 1);
    material = new THREE.ShaderMaterial( {
        vertexShader: document.getElementById( 'vertex' ).textContent,
    	fragmentShader: document.getElementById( 'fragment' ).textContent
    } );
    mesh = new THREE.Mesh( geometry, material );
    scene = new THREE.Scene();
    scene.add( mesh );
}
window.addEventListener('resize', handleResize);

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}
animate();
