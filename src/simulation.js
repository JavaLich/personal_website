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
    }

    advect(renderer, camera, velocity, source) {
        this.mesh.material.fragmentShader = document.getElementById('advection').textContent;
        this.mesh.material.uniforms.source = { value: source.target.texture };
        this.mesh.material.uniforms.velocity = { value: velocity.target.texture };
        this.mesh.material.uniforms.click = { value: window.click };
        this.mesh.material.uniforms.size = { value: new THREE.Vector2(window.innerWidth, window.innerHeight) };

        renderer.setRenderTarget(source.temp)
        renderer.render(this.scene, camera);

        source.swap();
    }

    update(renderer, camera) {
        this.mesh.material.fragmentShader = document.getElementById('fragment').textContent;
        this.mesh.material.uniforms.density.value = this.target.texture;
        this.mesh.material.uniforms.click.value = window.click;

        renderer.setRenderTarget(this.temp)
        renderer.render(this.scene, camera);

        this.swap();
    }

    swap() {
        var t = this.target;
        this.target = this.temp;
        this.temp = t;
    }
}
