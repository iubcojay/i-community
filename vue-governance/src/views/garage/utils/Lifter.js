

export const LIFTER_STATUS_ANOMALY = -1
export const LIFTER_STATUS_AUTO = 0
export const LIFTER_STATUS_HAND = 1

const lifterActionMap = {
    1: { raise: 'lifter01.up', descend: 'lifter01.down' },
    2: { raise: 'lifter02.up', descend: 'lifter02.down' },
    3: { raise: 'lifter2.up', descend: 'lifter2.down' },
    4: { raise: 'lifter1.up', descend: 'lifter1.down' },
}


export default class Lifter {
    constructor({
        id,
        cameraPosition,
        isRaised,
        name,
        status,
        targetPosition,
        garage
    }) {
        this.id = id;
        this.cameraPosition = cameraPosition;
        this.isRaised = isRaised;
        this.name = name;
        this.status = status;
        this.targetPosition = targetPosition;
        this.garage = garage;
    }



    upLifter() {
        // 执行相关动画
        const { raise, descend } = lifterActionMap[this.id]
        this.garage.playAnimationByName(raise)
        this.garage.stopAnimationByName(descend)
    }

    downLifter() {
        // 执行相关动画
        const { raise, descend } = lifterActionMap[this.id]
        this.garage.playAnimationByName(descend)
        this.garage.stopAnimationByName(raise)
    }

    destroy() {

    }


}


Lifter.LIFTER_STATUS_ANOMALY = -1
Lifter.LIFTER_STATUS_AUTO = -1
Lifter.LIFTER_STATUS_HAND = -1