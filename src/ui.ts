import { getElement } from "./util";

export class Ui {
    projectToSphere: HTMLInputElement;
    tesselationLevel: HTMLInputElement;

    constructor() {
        this.projectToSphere = getElement("projectToSphere", HTMLInputElement);
        this.tesselationLevel = getElement("tesselationLevel", HTMLInputElement);
    }

    onChange(handler: () => void) {
        this.projectToSphere.addEventListener("change", handler);
        this.tesselationLevel.addEventListener("input", handler);
    }
}

