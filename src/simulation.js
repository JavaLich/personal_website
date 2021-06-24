import * as Three from 'three';

export class FramebufferFeedback {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.target = new Three.WebGLRenderTarget(width, height);
        this.temp = new Three.WebGLRenderTarget(width, height);

        this.advectScene = new Three.Scene();
        this.advectMat = new Three.ShaderMaterial({
            vertexShader: document.getElementById('vertex').textContent,
    	    fragmentShader: document.getElementById('advection').textContent,
            uniforms: {
                source: { value: this.temp.texture },
                velocity: { value: this.temp.texture },
                click: { value: false },
                size: { value: new Three.Vector2() }
            }
        });

        this.scene = new Three.Scene();
        this.geometry = new Three.PlaneGeometry(width, height);
        this.material = new Three.ShaderMaterial({
            vertexShader: document.getElementById('vertex').textContent,
    	    fragmentShader: document.getElementById('fragment').textContent,
            uniforms: {
                click: {value: false},
                density: {value: this.temp.texture}
            }
        });

        this.mesh = new Three.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        this.advectMesh = new Three.Mesh(this.geometry, this.advectMat);
        this.advectScene.add(this.advectMesh);
    }

    advect(renderer, camera, velocity) {
        this.advectMesh.material.fragmentShader = document.getElementById('advection').textContent;
        this.advectMesh.material.uniforms.source.value = this.target.texture;
        this.advectMesh.material.uniforms.velocity.value = velocity.target.texture;
        this.advectMesh.material.uniforms.click.value = false;
        this.advectMesh.material.uniforms.size.value = new Three.Vector2(1 / window.innerWidth, 1 / window.innerHeight);

        renderer.setRenderTarget(this.temp)
        renderer.render(this.advectScene, camera);

        this.swap();
    }

    update(renderer, camera) {
        this.mesh.material.fragmentShader = document.getElementById('fragment').textContent;
        this.mesh.material.uniforms.density.value = this.target.texture;
        this.mesh.material.uniforms.click.value = false;

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
