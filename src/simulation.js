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
                density: {value: this.temp.texture}
            }
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        this.advectionScene = new THREE.Scene();
        this.advectMat = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('vertex').textContent,
    	    fragmentShader: document.getElementById('advection').textContent,
            uniforms: {
                click: {value: false},
                density: {value: this.temp.texture},
                velocity: {value: this.temp.texture}
            }
        });
        this.advectMesh = new THREE.Mesh(this.geometry, this.advectMat);
        this.advectionScene.add(this.advectMesh);
    }

    advect(renderer, camera, density, velocity) {
        this.advectMesh.material.uniforms.density.value = density.temp.texture;
        this.advectMesh.material.uniforms.velocity.value = velocity.temp.texture;
        renderer.setRenderTarget(velocity.target)
        renderer.render(this.advectionScene, camera);

        velocity.swap();

        velocity.advectMat.uniforms.velocity.value = velocity.temp.texture;
    }

    update(renderer, camera) {
        this.mesh.material.uniforms.density.value = this.temp.texture;
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
