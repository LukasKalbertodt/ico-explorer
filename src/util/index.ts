import { Vector2, Vector3 } from "three";
import { bug } from "./err";


export const vec2 = (x: number, y: number): Vector2 => new Vector2(x, y);
export const vec3 = (x: number, y: number, z: number): Vector3 => new Vector3(x, y, z);

/** Retrieves a HTML element from the DOM by ID and asserts that it is of the given type */
export const getElement = <T extends HTMLElement>(id: string, ctor: { new (): T }): T => {
    const element = document.getElementById(id);
    return element instanceof ctor
        ? element
        : bug(`Element with id '${id}' is not an instance of '${ctor}`);
};
