import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { setupLight } from "./light";
import { createMesh, Options as MeshOptions, PROJECTIONS, ProjectionType } from "./mesh";
import { setup } from "./setup";
import { Ui } from "./ui";
import { getElement } from "./util";
import { Bug } from "./util/err";


const LOCAL_STORAGE_KEY = "icoExplorerSettings";
const LOCAL_STORAGE_AUTO_ROTATE_KEY = "icoExplorerAutoRotate";

const main = () => {
    const ui = new Ui();

    // Intially load options from local storage
    const initialSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (initialSettings) {
        const obj = JSON.parse(initialSettings);
        const expectedFields = ["projection", "tesselationLevel", "truncate"];
        if (expectedFields.every(field => field in obj)) {
            ui.projection.value = obj.projection;
            ui.tesselationLevel.value = obj.tesselationLevel;
            ui.truncate.value = obj.truncate;
        }
    }

    // Setup canvas and renderer
    const canvas = getElement("canvas", HTMLCanvasElement);
    const { renderer, camera } = setup(canvas);

    // Setup controls, scene and lighting.
    ui.autoRotate.checked = localStorage.getItem(LOCAL_STORAGE_AUTO_ROTATE_KEY) !== "false";
    const controls = setupCameraControls(camera, canvas, ui.autoRotate.checked);
    const scene = new Three.Scene();
    setupLight(scene);
    ui.autoRotate.addEventListener("change", () => {
        controls.autoRotate = ui.autoRotate.checked;
        localStorage.setItem(LOCAL_STORAGE_AUTO_ROTATE_KEY, ui.autoRotate.checked.toString());
    });

    // Prepare a group that holds all geometry.
    const objectGroup = new Three.Group();
    scene.add(objectGroup);

    // Generate the actual mesh (now and whenever something changes).
    const updateMesh = () => {
        const proj = ui.projection.value;

        if (!(proj in PROJECTIONS)) {
            throw new Bug(`invalid projection type: ${proj}`);
        }
        const options: MeshOptions = {
            projection: proj as ProjectionType,
            tesselationLevel: Number(ui.tesselationLevel.value),
            truncate: Number(ui.truncate.value),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(options));
        objectGroup.clear();
        const object = createMesh(options, ui);
        addMesh(objectGroup, object);
    };
    updateMesh();
    ui.onMeshOptionChange(updateMesh);


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

const setupCameraControls = (
    camera: Three.Camera,
    canvas: HTMLCanvasElement,
    autoRotate: boolean,
): OrbitControls => {
    const controls = new OrbitControls(camera, canvas);
    controls.maxDistance = 5;
    controls.minDistance = 1;
    controls.rotateSpeed = 0.4;
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.autoRotate = autoRotate;
    camera.position.x = 1.85;
    camera.position.y = 0.5;
    return controls;
};

document.addEventListener("DOMContentLoaded", main);
