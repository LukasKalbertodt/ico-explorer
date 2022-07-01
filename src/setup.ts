import * as Three from "three";
import { Camera, Renderer, Vector2 } from "three";

import { vec2 } from "./util";

/** Returns the physical size of the given canvas in pixels. */
const getPhysicalCanvasSize = (canvas: HTMLCanvasElement): Vector2 => {
    const [w, h] = [canvas.clientWidth, canvas.clientHeight]
        .map(x => x * window.devicePixelRatio)
        .map(x => Math.round(x));

    return vec2(w, h);
};

type SetupResult = {
    camera: Camera;
    renderer: Renderer;
};

export const setup = (canvas: HTMLCanvasElement): SetupResult => {
    const renderer = new Three.WebGLRenderer({ canvas, antialias: true });
    const camera = new Three.PerspectiveCamera(65, 4 / 3, 0.1, 1000);

    // We have to update the renderer and camera whenever the canvas changes size.
    let canvasSize = vec2(0, 0);
    const updateCanvasSize = () => {
        const size = getPhysicalCanvasSize(canvas);
        if (!canvasSize.equals(size)) {
            canvasSize = size;
            renderer.setSize(size.x, size.y, false);
            camera.aspect = size.x / size.y;
            console.debug(`Updated canvas rendering size to ${size.x}x${size.y}`);
        }
    };
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(canvas);
    updateCanvasSize();

    return { renderer, camera };
};
