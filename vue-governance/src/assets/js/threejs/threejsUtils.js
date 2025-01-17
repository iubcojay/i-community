import { gsap } from 'gsap';
import * as THREE from 'three';

export function getChildByName(modelObj, childName) {
    if (modelObj === undefined || modelObj === null) {
        return undefined;
    }
    const childList = modelObj.children.filter(child => child.name === childName)
    if (childList.length === 1) {
        return childList[0]
    } else if (childList.length === 0) {
        return undefined
    } else {
        return childList
    }
}

export function getChildByNameIncludes(modelObj, childName) {
    const childList = modelObj.children.filter(child => child.name.includes(childName))
    if (childList.length === 1) {
        return childList[0]
    } else {
        return childList
    }
}

export function removeModel(parent, child) {
    if (child.children.length) {
        let arr = child.children.filter(x => x);
        arr.forEach(a => {
            removeModel(child, a)
        })
    }
    if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
        child.geometry.dispose();
    } else if (child.material) {
        child.material.dispose();
    }
    child.removeFromParent();
    if (parent) {
        parent.remove(child);
    }
}
