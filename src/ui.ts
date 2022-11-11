import { getElement } from "./util";
import { Bug } from "./util/err";

export class Ui {
    projectionForm: HTMLFormElement;
    projection: RadioNodeList;
    tesselationLevel: HTMLInputElement;
    truncate: HTMLInputElement;

    areaStat: RangeIndicator;
    sideLengthStat: RangeIndicator;
    angleStat: RangeIndicator;

    constructor() {
        this.projectionForm = getElement("projection", HTMLFormElement);
        const proj = this.projectionForm.elements.namedItem("projection");
        if (!(proj instanceof RadioNodeList)) {
            throw new Bug("radio list not found");
        }
        this.projection = proj;

        this.tesselationLevel = getElement("tesselationLevel", HTMLInputElement);
        this.truncate = getElement("truncate", HTMLInputElement);
        this.areaStat = new RangeIndicator("areaStat");
        this.sideLengthStat = new RangeIndicator("sideLengthStat");
        this.angleStat = new RangeIndicator("angleStat", "°");
    }

    onChange(handler: () => void) {
        this.projectionForm.addEventListener("change", handler);
        this.tesselationLevel.addEventListener("input", handler);
        this.truncate.addEventListener("input", handler);
    }
}

export class RangeIndicator {
    html: HTMLDivElement;
    valueUnit?: string;

    constructor(id: string, valueUnit?: string) {
        this.html = getElement(id, HTMLDivElement);
        this.valueUnit = valueUnit;
    }

    update(min: number, max: number) {
        const round = (n: number, digits: number): number => {
            const base = Math.pow(10, digits);
            return Math.round(n * base) / base;
        };

        const factor = max / min;
        this.html.innerHTML = `<div>${round(factor, 2)}x</div>`
            + (this.valueUnit
                ? `<div>${round(min, 1)}${this.valueUnit}–${round(max, 1)}${this.valueUnit}</div>`
                : "");
    }
}
