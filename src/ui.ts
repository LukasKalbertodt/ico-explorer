import { getElement } from "./util";

export class Ui {
    projectToSphere: HTMLInputElement;

    constructor() {
        this.projectToSphere = getElement("projectToSphere", HTMLInputElement);
    }

    onChange(handler: () => void) {
        this.projectToSphere.addEventListener("change", handler);
    }
};

