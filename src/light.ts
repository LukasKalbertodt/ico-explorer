import * as Three from "three";


export const setupLight = (scene: Three.Scene) => {
    const ambient = new Three.AmbientLight(0xFFFFFF, 0.4);
    scene.add(ambient);

    const directionalA = new Three.DirectionalLight(0xf0f55b, 0.6);
    directionalA.position.set(2, 1.2, 1).normalize();
    scene.add(directionalA);

    const directionalB = new Three.DirectionalLight(0xb6f2ec, 0.3);
    directionalB.position.set(-2, 0.1, -1.2).normalize();
    scene.add(directionalB);
};
