import { getElement } from "./util";

export class Ui {
    projectToSphere: HTMLInputElement;
    tesselationLevel: HTMLInputElement;

    areaFactor: HTMLDivElement;
    sideLengthFactor: HTMLDivElement;

    constructor() {
        this.projectToSphere = getElement("projectToSphere", HTMLInputElement);
        this.tesselationLevel = getElement("tesselationLevel", HTMLInputElement);
        this.areaFactor = getElement("areaFactor", HTMLDivElement);
        this.sideLengthFactor = getElement("sideLengthFactor", HTMLDivElement);
    }

    onChange(handler: () => void) {
        this.projectToSphere.addEventListener("change", handler);
        this.tesselationLevel.addEventListener("input", handler);
    }
}

