import * as Three from "three";


type Options = {
    projectToSphere: boolean;
    tesselationLevel: number;
};

export const createMesh = ({
    projectToSphere,
    tesselationLevel,
}: Options): Three.BufferGeometry => {
    return projectToSphere
        ? new Three.IcosahedronGeometry(1, tesselationLevel)
        : new Three.CylinderBufferGeometry(1);
};

