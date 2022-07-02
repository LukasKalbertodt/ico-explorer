import * as Three from "three";
import { Vector3 } from "three";
import { vec3 } from "./util";


type Options = {
    projectToSphere: boolean;
    tesselationLevel: number;
};

export const createMesh = (options: Options): Three.BufferGeometry => {
    const geometry = new Three.BufferGeometry();
    const vertices = [];
    for (const face of FACES) {
        vertices.push(...icoFace(face, options));
    }

    const vertexBuffer = new Float32Array(vertices);
    geometry.setAttribute("position", new Three.BufferAttribute(vertexBuffer, 3));

    // The constants below were made for an "z is up" coordinate system.
    geometry.rotateX(-Math.PI / 2);
    return geometry;
};

const icoFace = (indices: [number, number, number], options: Options): number[] => {
    const out = [];

    const v0 = VERTEX_POSITIONS[indices[0]];
    const v1 = VERTEX_POSITIONS[indices[1]];
    const v2 = VERTEX_POSITIONS[indices[2]];


    const dir0 = v1.clone().sub(v0);
    const dir1 = v2.clone().sub(v1);

    const max = options.tesselationLevel + 1;
    const gridPoint = (i: number, j: number): Vector3 => {
        const out = v0
            .clone()
            .add(dir0.clone().multiplyScalar(i / max))
            .add(dir1.clone().multiplyScalar(j / max));
        if (options.projectToSphere) {
            out.normalize();
        }
        return out;
    };

    for (let i = 0; i < max; i++) {
        for (let j = 0; j <= i; j++) {
            out.push(...gridPoint(i, j).toArray());
            out.push(...gridPoint(i + 1, j).toArray());
            out.push(...gridPoint(i + 1, j + 1).toArray());

            if (i + 1 != max) {
                out.push(...gridPoint(i + 1, j + 1).toArray());
                out.push(...gridPoint(i + 1, j).toArray());
                out.push(...gridPoint(i + 2, j + 1).toArray());
            }
        }
    }


    return out;
};


// Helper constants for vertex position values.
//
// The outer radius R of the pentagon is `2 / sqrt(5)`. From that, you can
// obtain the remaining points as simple sin or cos expressions.
const X0 = 0.525731112119133;   // R *  sin(2 * 2π/5) = 1 / (2 * sin(2π/5))
const X1 = 0.850650808352039;   // R *  sin(1 * 2π/5)
const Y0 = 0.276393202250021;   // R *  cos(1 * 2π/5)
const Y1 = 0.723606797749978;   // R * -cos(2 * 2π/5)
const Y2 = 0.894427190999915;   // R = 2 / sqrt(5)
const Z0 = 0.447213595499957;   // 1 / sqrt(5)

const VERTEX_POSITIONS = [
    vec3(0.0,  0.0,  1.0),  // a

    vec3( X0,   Y1,   Z0),  // b
    vec3( X1,  -Y0,   Z0),  // c
    vec3(0.0,  -Y2,   Z0),  // d
    vec3(-X1,  -Y0,   Z0),  // e
    vec3(-X0,   Y1,   Z0),  // f

    vec3(0.0,   Y2,  -Z0),  // g
    vec3( X1,   Y0,  -Z0),  // h
    vec3( X0,  -Y1,  -Z0),  // i
    vec3(-X0,  -Y1,  -Z0),  // j
    vec3(-X1,   Y0,  -Z0),  // k

    vec3(0.0,  0.0, -1.0),  // l
];

const FACES: [number, number, number][] = [
    [ 0,  2,  1] /* a c b */,
    [ 0,  3,  2] /* a d c */,
    [ 0,  4,  3] /* a e d */,
    [ 0,  5,  4] /* a f e */,
    [ 0,  1,  5] /* a b f */,

    [ 1,  7,  6] /* b h g */,
    [ 7,  1,  2] /* h b c */,
    [ 2,  8,  7] /* c i h */,
    [ 8,  2,  3] /* i c d */,
    [ 3,  9,  8] /* d j i */,
    [ 9,  3,  4] /* j d e */,
    [ 4, 10,  9] /* e k j */,
    [10,  4,  5] /* k e f */,
    [ 5,  6, 10] /* f g k */,
    [ 6,  5,  1] /* g f b */,

    [11,  6,  7] /* l g h */,
    [11,  7,  8] /* l h i */,
    [11,  8,  9] /* l i j */,
    [11,  9, 10] /* l j k */,
    [11, 10,  6] /* l k g */,
];
