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

    const geometry = new Three.IcosahedronGeometry(1);


    // Add the solid object.
    const material = new Three.MeshPhysicalMaterial({ color: 0xffffff });
    scene.add(new Three.Mesh(geometry, material));

    // Draw the same object as wireframe. We scale it up slightly to avoid the
    // wireframe lines z-fighting with the object.
    const line = new Three.LineSegments(
        new Three.WireframeGeometry(geometry.clone().scale(1.001, 1.001, 1.001)),
        new Three.LineBasicMaterial({ linewidth: 8 })
    );
    scene.add(line);


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
    camera.position.x = 1.3;
    camera.position.y = 1.0;
    camera.position.z = 0.9;
    return controls;
};

document.addEventListener("DOMContentLoaded", main);
