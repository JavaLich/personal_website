import * as Three from 'three';

export class FramebufferFeedback {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.target = new Three.WebGLRenderTarget(width, height);
        this.temp = new Three.WebGLRenderTarget(width, height);

        this.diffuseScene = new Three.Scene();
        this.diffuseMat = new Three.ShaderMaterial({
            vertexShader: document.getElementById('vertex').textContent,
    	    fragmentShader: document.getElementById('diffusion').textContent,
            uniforms: {
                alpha: { value: 0.0 },
                rBeta: { value: 0.0 },
                x: { value: this.temp.texture },
                b: { value: this.temp.texture },
                size: {value: new Three.Vector2(window.innerWidth, window.innerHeight)}
            }
        });


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
        this.material = new Three.ShaderMaterial({
            vertexShader: document.getElementById('vertex').textContent,
    	    fragmentShader: document.getElementById('fragment').textContent,
            uniforms: {
                click: {value: false},
                density: {value: this.temp.texture},
                factor: {value: 1.0}
            }
        });

        this.geometry = new Three.PlaneGeometry(width, height);

        this.mesh = new Three.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        this.diffuseMesh = new Three.Mesh(this.geometry, this.diffuseMat);
        this.diffuseScene.add(this.diffuseMesh)

        this.advectMesh = new Three.Mesh(this.geometry, this.advectMat);
        this.advectScene.add(this.advectMesh);
    }

    diffuse(renderer, camera, velocity) {
        var dt = 1.0;
        var dx = 1.0;
        var n = window.innerHeight;
        var alpha = (dx * dx) / (n * dt);
        var rBeta = 1 / (4 + alpha);

        this.diffuseMesh.material.uniforms.alpha.value = alpha;
        this.diffuseMesh.material.uniforms.rBeta.value = rBeta;
        this.diffuseMesh.material.uniforms.x.value = velocity.target.texture;
        this.diffuseMesh.material.uniforms.b.value = this.target.texture;
        this.diffuseMesh.material.uniforms.size.value = new Three.Vector2(window.innerWidth, window.innerHeight);

        renderer.setRenderTarget(this.temp);
        renderer.render(this.diffuseScene, camera);

        this.swap();
    }

    advect(renderer, camera, velocity) {
        this.advectMesh.material.uniforms.source.value = this.target.texture;
        this.advectMesh.material.uniforms.velocity.value = velocity.target.texture;
        this.advectMesh.material.uniforms.click.value = false;
        this.advectMesh.material.uniforms.size.value = new Three.Vector2(1 / window.innerWidth, 1 / window.innerHeight);

        renderer.setRenderTarget(this.temp)
        renderer.render(this.advectScene, camera);

        this.swap();
    }

    update(renderer, camera, factor) {
        this.mesh.material.uniforms.density.value = this.target.texture;
        this.mesh.material.uniforms.click.value = false;
        this.mesh.material.uniforms.factor.value = factor;

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
