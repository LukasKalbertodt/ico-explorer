// This implements Spherical Area Coordinates (SACs) for projecting vertices
// onto the sphere.
//
// Lei, Kin, Dongxu Qi, and Xiaolin Tian.
// "A new coordinate system for constructing spherical grid systems."
// Applied Sciences 10.2 (2020): 655.

import * as Three from "three";
import { vec3 } from "../util";


export const sacsToCartesian = (
    sacs: [number, number, number],
    base: [Three.Vector3, Three.Vector3, Three.Vector3],
): Three.Vector3 => {
    const [p1, p2, p3] = base;
    const [w1, w2, w3] = sacs;

    // Calculate the vertex angles and the area of the big triangle.
    const a1 = Math.acos(
        (p2.dot(p3) - p1.dot(p3) * p2.dot(p1))
            / (p3.clone().cross(p1).length() * p1.clone().cross(p2).length())
    );
    const a2 = Math.acos(
        (p1.dot(p3) - p2.dot(p3) * p2.dot(p1))
            / (p2.clone().cross(p3).length() * p1.clone().cross(p2).length())
    );
    const a3 = Math.acos(
        (p2.dot(p1) - p1.dot(p3) * p2.dot(p3))
            / (p3.clone().cross(p1).length() * p2.clone().cross(p3).length())
    );
    const area = a1 + a2 + a3 - Math.PI;

    // Assembly vector "k" from the paper.
    const k = vec3(
        Math.tan(area * w1 / 2) * (1 + p2.clone().dot(p3.clone())),
        Math.tan(area * w2 / 2) * (1 + p3.clone().dot(p1.clone())),
        Math.tan(area * w3 / 2) * (1 + p1.clone().dot(p2.clone())),
    );

    // Assembly matrix "A" from the paper.
    const row1 = p2.clone().cross(p3.clone())
        .sub(p2.clone().add(p3.clone()).multiplyScalar(Math.tan(area * w1 / 2)));
    const row2 = p3.clone().cross(p1.clone())
        .sub(p3.clone().add(p1.clone()).multiplyScalar(Math.tan(area * w2 / 2)));
    const row3 = p1.clone().cross(p2.clone())
        .sub(p1.clone().add(p2.clone()).multiplyScalar(Math.tan(area * w3 / 2)));
    const a = new Three.Matrix3();
    a.set(
        row1.x, row1.y, row1.z,
        row2.x, row2.y, row2.z,
        row3.x, row3.y, row3.z,
    );

    // Invert & transform to return the point.
    return k.applyMatrix3(a.invert());
};
