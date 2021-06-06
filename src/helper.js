import * as THREE from 'three';

export class FramebufferFeedback {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.targetA = new THREE.WebGLRenderTarget(width, height);
        this.targetB = new THREE.WebGLRenderTarget(width, height);
    }

    swap() {
        var t = this.targetA;
        this.targetA = this.targetB;
        this.targetB = t;
    }
}
