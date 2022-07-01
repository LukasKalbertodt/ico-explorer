import { Vector2, Vector3 } from "three";


export const vec2 = (x: number, y: number): Vector2 => new Vector2(x, y);
export const vec3 = (x: number, y: number, z: number): Vector3 => new Vector3(x, y, z);
