import * as Three from 'three';

var cursorX;
var cursorY;
document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}
document.onmousepress = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}

export class FramebufferFeedback {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.target = new Three.WebGLRenderTarget(width, height);
        this.temp = new Three.WebGLRenderTarget(width, height);

        this.splatScene = new Three.Scene();
        this.splatMat = new Three.ShaderMaterial({
            vertexShader: document.getElementById('vertex').textContent,
    	    fragmentShader: document.getElementById('splat').textContent,
            uniforms: {
                mousePos: { value: new Three.Vector2(cursorX, cursorY) },
                source: { value: this.temp.texture }
            }
        });

        this.diffuseScene = new Three.Scene();
        this.diffuseMat = new Three.ShaderMaterial({
            vertexShader: document.getElementById('vertex').textContent,
    	    fragmentShader: document.getElementById('diffusion').textContent,
            uniforms: {
                alpha: { value: 1.0 },
                rBeta: { value: 1.0 },
                x: { value: this.temp.texture },
                size: {value: new Three.Vector2(window.innerWidth, window.innerHeight)}
            }
        });

        this.advectScene = new Three.Scene();
        this.advectMat = new Three.ShaderMaterial({
            vertexShader: document.getElementById('vertex').textContent,
    	    fragmentShader: document.getElementById('advection').textContent,
            uniforms: {
                source: {},
                velocity: {},
                click: {},
                size: {}
            }
        });

        this.scene = new Three.Scene();
        this.material = new Three.ShaderMaterial({
            vertexShader: document.getElementById('vertex').textContent,
    	    fragmentShader: document.getElementById('fragment').textContent,
            uniforms: {
                density: {},
                factor: {}
            }
        });

        this.geometry = new Three.PlaneGeometry(width, height);

        this.mesh = new Three.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        this.diffuseMesh = new Three.Mesh(this.geometry, this.diffuseMat);
        this.diffuseScene.add(this.diffuseMesh)

        this.advectMesh = new Three.Mesh(this.geometry, this.advectMat);
        this.advectScene.add(this.advectMesh);

        this.splatMesh = new Three.Mesh(this.geometry, this.splatMat);
        this.splatScene.add(this.splatMesh);
    }

    splat(renderer, camera) {
        this.splatMat.uniforms.mousePos.value = new Three.Vector2(cursorX / window.innerWidth, 1 -cursorY / window.innerHeight);
        this.splatMat.uniforms.source.value = this.target.texture;

        renderer.setRenderTarget(this.temp);
        renderer.render(this.splatScene, camera);

        this.swap();
    }

    diffuse(renderer, camera, velocity) {
        var dt = 1.0;
        var dx = 1.0;
        var viscosity = 0.001;
        var alpha = (dx * dx) / (viscosity * dt);
        var rBeta = dt / (4 + alpha);

        this.diffuseMesh.material.uniforms.alpha.value = alpha;
        this.diffuseMesh.material.uniforms.rBeta.value = rBeta;
        this.diffuseMesh.material.uniforms.x.value = velocity.target.texture;
        this.diffuseMesh.material.uniforms.size.value = new Three.Vector2(window.innerWidth, window.innerHeight);

        renderer.setRenderTarget(this.temp);
        renderer.render(this.diffuseScene, camera);

        this.swap();
    }

    advect(renderer, camera, velocity) {
        this.advectMesh.material.uniforms.source.value = this.target.texture;
        this.advectMesh.material.uniforms.velocity.value = velocity.target.texture;
        this.advectMesh.material.uniforms.size.value = new Three.Vector2(1 / window.innerWidth, 1 / window.innerHeight);

        renderer.setRenderTarget(this.temp)
        renderer.render(this.advectScene, camera);

        this.swap();
    }

    update(renderer, camera, factor) {
        this.mesh.material.uniforms.density.value = this.target.texture;
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
