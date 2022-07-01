import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { setupLight } from "./light";
import { createMesh } from "./mesh";
import { setup } from "./setup";
import { Ui } from "./ui";
import { getElement } from "./util";


const main = () => {
    const ui = new Ui();

    // Setup canvas and renderer
    const canvas = getElement("canvas", HTMLCanvasElement);
    const { renderer, camera } = setup(canvas);

    // Setup controls, scene and lighting.
    const controls = setupCameraControls(camera, canvas);
    const scene = new Three.Scene();
    setupLight(scene);

    // Prepare a group that holds all geometry.
    const objectGroup = new Three.Group();
    scene.add(objectGroup);

    // Generate the actual mesh (now and whenever something changes).
    const updateMesh = () => {
        objectGroup.clear();
        const object = createMesh({
            projectToSphere: ui.projectToSphere.checked,
            tesselationLevel: Number(ui.tesselationLevel.value),
        });
        addMesh(objectGroup, object);
    };
    updateMesh();
    ui.onChange(updateMesh);


    // Run main loop
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
};

const addMesh = (scene: Three.Group, mesh: Three.BufferGeometry) => {
    // Add the solid object.
    const material = new Three.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 80.0,
        flatShading: true,
    });
    const solid = new Three.Mesh(mesh, material);
    scene.add(solid);

    // Draw the same object as wireframe. We scale it up slightly to avoid the
    // wireframe lines z-fighting with the object.
    const line = new Three.LineSegments(
        new Three.WireframeGeometry(mesh.clone().scale(1.001, 1.001, 1.001)),
        new Three.LineBasicMaterial({ linewidth: 6 })
    );
    scene.add(line);
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
