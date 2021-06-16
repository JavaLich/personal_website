import * as THREE from 'three';

export class FramebufferFeedback {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.target = new THREE.WebGLRenderTarget(width, height);
        this.temp = new THREE.WebGLRenderTarget(width, height);

        this.scene = new THREE.Scene();
        this.geometry = new THREE.PlaneGeometry(width, height);
        this.material = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('vertex').textContent,
    	    fragmentShader: document.getElementById('fragment').textContent,
            uniforms: {
                click: {value: false},
                density: {value: this.temp.texture }
            }
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
    }

    update(renderer, camera) {
        renderer.setRenderTarget(this.target)
        renderer.render(this.scene, camera);

        this.swap();

        this.material.uniforms.density.value = this.temp.texture;
    }

    swap() {
        var t = this.target;
        this.target = this.temp;
        this.temp = t;
    }
}
