


import { gsap } from "gsap"
import { Color } from "three";

export default class Lifter {
    constructor({
        id,
        isOpen,
        positionList,
        title,
        garage
    }) {
        this.id = id;
        this.isOpen = isOpen;
        this.positionList = positionList;
        this.title = title;
        this.garage = garage;
        this.initModel()
    }

    initModel() {
        const lineGroup = this.garage.modelObj.getObjectByName("lineGroup")
        this.lightAreaLine = lineGroup.getObjectByName('light_area_line_' + this.id)

        const lightSourceGroup = this.garage.modelObj.getObjectByName('lightSourceGroup')
        this.lightSource = lightSourceGroup.getObjectByName('light_source_' + this.id)

        if (this.isOpen) {
            this.openLight()
        } else {
            this.closeLight()
        }
    }

    openLight() {
        // 点亮线框
        this.lightAreaLine.material.color = new Color('white')

        //点亮点光源
        this.lightSource.intensity = 1.5

    }

    closeLight() {
        // 关闭线框
        this.lightAreaLine.material.color = new Color('black')

        // 熄灭光源
        this.lightSource.intensity = 0
    }

    enterLightFocusMode() {
        this.lightAreaLine.visible = true
        gsap.killTweensOf(this.lightAreaLine.position, 'x,y,z')
        gsap.to(this.lightAreaLine.position, { x: 0, y: 4, z: 0, duration: 1 });

    }

    async existLightFocusMode() {

        gsap.killTweensOf(this.lightAreaLine.position, 'x,y,z')
        await gsap.to(this.lightAreaLine.position, { x: 0, y: 0, z: 0, duration: 0.5 }).then();
        this.lightAreaLine.visible = false
    }

    destroy() {

    }


}