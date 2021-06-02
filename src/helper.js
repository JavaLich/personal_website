import * as THREE from 'three';

export function createDataTexture(width, height) {
    var data = new Uint8Array(width * height * 4);
    
    for (let i = 0; i < width * height * 4; i += 4) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 255;
    }
    
    data = new Uint8Array(data);

    var tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    tex.needsUpdates = true;

    return tex;
}

function mouseClick() {
    click = true;
}
window.addEventListener('mousedown', mouseClick);

function mouseRelease() {
    click = false;
}
window.addEventListener('mouseup', mouseRelease);
