import * as Three from "three";
import { Vector3 } from "three";
import { sacsToCartesian } from "./projections/sacs";
import { Ui } from "./ui";
import { vec3 } from "./util";

export type ProjectionType = "none" | "normalize" | "sacs";

export type Options = {
    projection: ProjectionType;
    tesselationLevel: number;
    truncate: number;
};

export const createMesh = (options: Options, ui: Ui): Three.BufferGeometry => {
    const geometry = new Three.BufferGeometry();
    const triangles = new TriangleList();
    for (const face of FACES) {
        icoFace(face, triangles, options);
    }

    const vertexBuffer = new Float32Array(triangles.buffer);
    geometry.setAttribute("position", new Three.BufferAttribute(vertexBuffer, 3));

    const lenFactor = options.tesselationLevel + 1;
    const areaFactor = lenFactor * lenFactor;
    ui.areaStat.update(areaFactor * triangles.minArea, areaFactor * triangles.maxArea);
    ui.sideLengthStat.update(lenFactor * triangles.minSideLength, lenFactor * triangles.maxSideLength);
    ui.angleStat.update(triangles.minAngle, triangles.maxAngle);

    // The constants below were made for an "z is up" coordinate system.
    geometry.rotateX(-Math.PI / 2);
    return geometry;
};

const icoFace = (
    indices: [number, number, number],
    triangles: TriangleList,
    options: Options,
) => {
    const v0 = VERTEX_POSITIONS[indices[0]];
    const v1 = VERTEX_POSITIONS[indices[1]];
    const v2 = VERTEX_POSITIONS[indices[2]];

    const max = options.tesselationLevel + 1;
    const gridPoint = (i: number, j: number): Vector3 => {
        return PROJECTIONS[options.projection]((i - j) / max, j / max, [v0, v1, v2]);
    };

    for (let i = 0; i < max; i++) {
        for (let j = 0; j <= i; j++) {
            type Points = [[number, number], [number, number], [number, number]];
            const addTri = (points: Points) => {
                const distances = points.map(([i, j]) => Math.min(i, (max - i) + j, max - j));
                const distFromCorner = Math.min(...distances);

                if (distFromCorner < options.truncate) {
                    return;
                }

                const [[i0, j0], [i1, j1], [i2, j2]] = points;
                triangles.add([
                    gridPoint(i0, j0),
                    gridPoint(i1, j1),
                    gridPoint(i2, j2),
                ]);
            };

            addTri([
                [i, j],
                [i + 1, j],
                [i + 1, j + 1],
            ]);
            if (i + 1 != max) {
                addTri([
                    [i + 1, j + 1],
                    [i + 1, j],
                    [i + 2, j + 1],
                ]);
            }
        }
    }
};

type ProjFn = (
    p: number,
    q: number,
    base: [Three.Vector3, Three.Vector3, Three.Vector3],
) => Three.Vector3;

export const PROJECTIONS: Record<ProjectionType, ProjFn> = {
    "none": (p, q, [v0, v1, v2]) => {
        return v0.clone()
            .add(v1.clone().sub(v0).multiplyScalar(p))
            .add(v2.clone().sub(v0).multiplyScalar(q));
    },

    "normalize": (p, q, base) => PROJECTIONS["none"](p, q, base).normalize(),

    "sacs": (p, q, base) => sacsToCartesian([p, q, 1 - p - q], base),
};

type Triangle = [Vector3, Vector3, Vector3];

class TriangleList {
    buffer: number[] = [];
    minArea: number = Number.POSITIVE_INFINITY;
    maxArea: number = Number.NEGATIVE_INFINITY;
    minSideLength: number = Number.POSITIVE_INFINITY;
    maxSideLength: number = Number.NEGATIVE_INFINITY;
    minAngle: number = Number.POSITIVE_INFINITY;
    maxAngle: number = Number.NEGATIVE_INFINITY;

    add(tri: Triangle) {
        const area = triArea(tri);
        this.minArea = Math.min(area, this.minArea);
        this.maxArea = Math.max(area, this.maxArea);

        const lengths = [
            tri[0].distanceTo(tri[1]),
            tri[0].distanceTo(tri[2]),
            tri[1].distanceTo(tri[2]),
        ];
        this.minSideLength = Math.min(this.minSideLength, ...lengths);
        this.maxSideLength = Math.max(this.maxSideLength, ...lengths);

        const a2b = tri[1].clone().sub(tri[0]);
        const b2c = tri[2].clone().sub(tri[1]);
        const c2a = tri[0].clone().sub(tri[2]);
        const angles = [
            a2b.angleTo(b2c) * 180 / Math.PI,
            b2c.angleTo(c2a) * 180 / Math.PI,
            c2a.angleTo(a2b) * 180 / Math.PI,
        ];
        this.minAngle = Math.min(this.minAngle, ...angles);
        this.maxAngle = Math.max(this.maxAngle, ...angles);

        this.buffer.push(...tri[0].toArray());
        this.buffer.push(...tri[1].toArray());
        this.buffer.push(...tri[2].toArray());
    }
}

const triArea = (tri: Triangle): number => {
    const sideLen0 = tri[0].clone().sub(tri[1]).length();
    const sideLen1 = tri[0].clone().sub(tri[2]).length();
    return sideLen0 * sideLen1 / 2;
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
