import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { unreachable } from "./util/err";
import { setup } from "./setup";
import { setupLight } from "./light";


const main = () => {
    // Setup canvas and renderer
    const canvas = document.getElementById("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
        return unreachable("Canvas is not a canvas!!");
    }
    const { renderer, camera } = setup(canvas);


    const controls = setupCameraControls(camera, canvas);
    const scene = new Three.Scene();
    setupLight(scene);

    const geometry = new Three.BoxGeometry( 1, 1, 1 );
    const material = new Three.MeshPhysicalMaterial( { color: 0xffffff } );
    const cube = new Three.Mesh( geometry, material );
    scene.add( cube );






    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
};

const setupCameraControls = (camera: Three.Camera, canvas: HTMLCanvasElement): OrbitControls => {
    const controls = new OrbitControls(camera, canvas);
    controls.maxDistance = 5;
    controls.minDistance = 1;
    controls.rotateSpeed = 0.4;
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.autoRotate = true;
    camera.position.x = 1.2;
    camera.position.y = 0.9;
    camera.position.z = 0.8;
    return controls;
};

document.addEventListener("DOMContentLoaded", main);
