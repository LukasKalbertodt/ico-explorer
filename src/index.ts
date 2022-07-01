import * as Three from "three";

import { unreachable } from "./util/err";
import { setup } from "./setup";


const main = () => {
    // Setup canvas and renderer
    const canvas = document.getElementById("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
        return unreachable("Canvas is not a canvas!!");
    }
    const { renderer, camera } = setup(canvas);


    const scene = new Three.Scene();
    const geometry = new Three.BoxGeometry( 1, 1, 1 );
    const material = new Three.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new Three.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    function animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }
    animate();
};


document.addEventListener("DOMContentLoaded", main);
