import * as THREE from 'three';
import './style.css'

var width = window.innerWidth;
var height = window.innerHeight;
var scale = 8;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(width, height);

const geometry = new THREE.PlaneGeometry(width / 2, height / 2, 1, 1);
// const material = new THREE.MeshBasicMaterial({color: 0xffffff});
 const material = new THREE.ShaderMaterial( {
     vertexShader: document.getElementById( 'vertex' ).textContent,
 	fragmentShader: document.getElementById( 'fragment' ).textContent
 } )

console.log(material.vertexShader)

// for (let y = 0; y < height / scale; y++) {
//     for (let x = 0; x < width / scale; x++) {
//         const mesh = new THREE.Mesh( geometry, material );
//         
//         mesh.position.x = x * scale - width / 2 + scale / 2;
//         mesh.position.y = y * scale - height / 2 + scale / 2;
//         
//         scene.add( mesh );
//     }
// }

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

camera.position.z = 1;

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}
animate();
