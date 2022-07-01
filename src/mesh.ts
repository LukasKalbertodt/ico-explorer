import * as Three from "three";


type Options = {
    projectToSphere: boolean;
};

export const createMesh = ({ projectToSphere }: Options): Three.BufferGeometry => {
    return projectToSphere
        ? new Three.IcosahedronGeometry(1)
        : new Three.CylinderBufferGeometry(1);
};

