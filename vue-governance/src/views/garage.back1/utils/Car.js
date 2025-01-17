import { Color, LoopRepeat, Vector3, CatmullRomCurve3 } from 'three';
import { gsap } from 'gsap';
const _ = require('lodash');
const uuid = require('uuid')
import { removeModel } from '@/assets/js/threejs/threejsUtils'
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
// import CarInfoPanelComponent from '@/views/garage/common/panel/CarInfoPanelComponent'
import CarWhistlePanelComponent from '@/views/garage.back1/common/panel/CarWhistlePanelComponent'
import CarBasePanelComponent from '@/views/garage.back1/common/panel/CarBasePanelComponent'

export default class Car {
    constructor({ scene, type = "sedan", modelScale = [1, 1, 1], id = uuid.v1(), color = "white", license = "" }) {
        this.scene = scene
        this.type = type
        this.modelScale = modelScale
        this.color = new Color(color)
        this.modelObj = null
        this.animations = null
        this.actions = null
        this.id = id
        this.isForwarded = true
        this.license = license
        this.enterPathInfoList = []
        this.leavePathInfoList = []
        // -1-入库状态 0-停车状态 1-出库状态 2-异常状态
        this.parkingStatus = Car.PARKING_STATUS_STOP
        this.baseInfoPanelShow = false
        this.alarmType = Car.ALARM_TYPE_NONE

        // this.carInfoPanelTypeShowList = []
        this.parkingSpaceNumber = null
        this.initModel();
    }

    initModel() {
        let { modelObj, animations } = window.garageModelPool["car"][this.type]
        modelObj = modelObj.clone();
        this.animations = animations
        this.modelObj = modelObj;
        const shell = this.modelObj.getObjectByName('shell')
        if (shell.isMesh) {
            const material = shell.material.clone();
            material.color = this.color;
            shell.material = material;
        } else {
            shell.children.forEach(child => {
                const material = child.material.clone();
                material.color = this.color;
                child.material = material;
            })
        }

        this.modelObj.name = 'car_' + this.id

        const carGroup = this.scene.scene.getObjectByName('carGroup')
        if (carGroup) {
            carGroup.add(this.modelObj)
            this.actions = this.initAnimation(this.animations, this.scene.animationMixer)
        }
    }


    initAnimation(animations, animationMixer) {
        return animations.map(animation => {
            const action = animationMixer.clipAction(animation, this.modelObj)
            action.setDuration(1)
            action.name = animation.name
            action.loop = LoopRepeat
            return action
        })
    }

    destroyCar() {
        if (this.modelObj) {
            if (this.scene.lockControllerInfo.lockModel === this.modelObj) {
                this.scene.unlockController(this.modelObj)
            }

            let carGroup = this.scene.scene.getObjectByName('carGroup')
            if (carGroup) {
                removeModel(carGroup, this.modelObj)
                // this.animations.forEach(animation => {
                //     this.scene.animationMixer.uncacheClip(animation)
                // })
            }
        }
    }


    wheelForward(speed) {
        this.isForwarded = true
        this.actions.forEach(action => {
            if (!action.name.includes('back')) {
                action.play()
            } else {
                action.stop()
            }
        })
    }

    wheelRetreat(speed) {
        this.isForwarded = false
        this.actions.forEach(action => {
            if (action.name.includes('back')) {
                action.play()
            } else {
                action.stop()
            }
        })
    }

    wheelStop() {
        if (this.actions) {
            this.actions.forEach(action => { action.stop() })
        }
    }

    async moveTo(targetPositionInfo, isForwarded, duration) {
        if (isForwarded === true) {
            // 前进
            this.wheelForward()

            this.modelObj.lookAt(new Vector3(targetPositionInfo.x, targetPositionInfo.y, targetPositionInfo.z))
        } else if (isForwarded === false) {
            // 后退
            this.wheelRetreat()
            const currentPosition = [this.modelObj.position.x, this.modelObj.position.y, this.modelObj.position.z]
            const targetPosition = [targetPositionInfo.x, targetPositionInfo.y, targetPositionInfo.z]
            const backPosition = currentPosition.map((current, index) => current + (current - targetPosition[index]))
            this.modelObj.lookAt(new Vector3(backPosition[0], backPosition[1], backPosition[2]))
        }

        // 解决动画bug
        // 因为切换到后台，gsap动画暂停累加，在窗口切回前台时短时间一并执行
        // 清除动画，防止抖动
        gsap.killTweensOf(this.modelObj.position, 'x,y,z')
        if (document.visibilityState === "visible") {
            await gsap.to(this.modelObj.position, { x: targetPositionInfo.x, y: targetPositionInfo.y, z: targetPositionInfo.z, ease: "none", duration: duration }).then()
        } else {
            this.modelObj.position.set(targetPositionInfo.x, targetPositionInfo.y, targetPositionInfo.z)
        }
    }

    getSmoothPositionInfoList(positionInfoList, smoothFactor = 10) {
        const periodNum = smoothFactor
        // 曲线分段总段数
        const periodSum = (positionInfoList.length - 1) * periodNum

        const curve = new CatmullRomCurve3(positionInfoList.map(positionInfo => new Vector3(positionInfo.x, positionInfo.y, positionInfo.z)));
        curve.curveType = 'chordal'; // 曲线类型
        curve.closed = false; // 曲线是否自动闭环
        // 分段后的点坐标
        const points = curve.getPoints(periodSum); // 分段值
        const smoothPositionInfoList = points.map((point, index) => {

            // 第一个点直接返回
            if (index === 0) {
                return {
                    x: point.x,
                    y: point.y,
                    z: point.z,
                    timeStamp: positionInfoList[0].timeStamp,
                    isForwarded: positionInfoList[0].isForwarded,
                }
            } else {
                // 插值前的后一个坐标
                let originEndIndex = Math.floor((index - 1) / periodNum) + 1

                // 结束time - (总持续时间/段数 )* (结束index - index)
                let timeStamp = positionInfoList[originEndIndex].timeStamp - (positionInfoList[originEndIndex].timeStamp - positionInfoList[originEndIndex - 1].timeStamp) / periodNum * (originEndIndex * periodNum - index)
                return {
                    x: point.x,
                    y: point.y,
                    z: point.z,
                    timeStamp: timeStamp,
                    isForwarded: positionInfoList[originEndIndex].isForwarded,
                }
            }

        })
        return smoothPositionInfoList

    }

    async moveAlongPath({ positionInfoList, startIndex = 0, endIndex = positionInfoList.length - 1, durationFixFactor = 0.3, smoothFactor = 5 }) {
        positionInfoList = _.cloneDeep((positionInfoList))
        // 分段插值，形成曲线
        // 每两点之间分成periodNum段
        const smoothPositionInfoList = this.getSmoothPositionInfoList(positionInfoList, smoothFactor)

        // 将起始下标转换为插值后的起始下标，支持负数
        let smoothStartIndex = 0
        if (startIndex >= 0) {
            smoothStartIndex = startIndex * smoothFactor
        } else {
            smoothStartIndex = (positionInfoList.length + startIndex) * smoothFactor
        }

        // 将结束下标转换为插值后的结束下标，支持负数
        let smoothEndIndex = 0
        if (endIndex >= 0) {
            smoothEndIndex = endIndex * smoothFactor
        } else {
            smoothEndIndex = (positionInfoList.length + endIndex) * smoothFactor
        }

        let startPositionInfo = smoothPositionInfoList[smoothStartIndex]
        let originTimeStamp = startPositionInfo.timeStamp
        let newTimeStamp = 0

        this.modelObj.position.set(startPositionInfo.x, startPositionInfo.y, startPositionInfo.z)
        this.modelObj.lookAt(new Vector3(smoothPositionInfoList[smoothStartIndex + 1].x, smoothPositionInfoList[smoothStartIndex + 1].y, smoothPositionInfoList[smoothStartIndex + 1].z))
        for (let index = smoothStartIndex + 1; index <= smoothEndIndex; index++) {
            const positionInfo = smoothPositionInfoList[index];
            newTimeStamp = positionInfo.timeStamp
            await this.moveTo(positionInfo, positionInfo.isForwarded, (newTimeStamp - originTimeStamp) / 1000 / durationFixFactor)
            originTimeStamp = newTimeStamp
        }
    }

    lockCar() {
        this.scene.lockControllerAtModel(this.modelObj)
    }

    unlockCar() {
        this.scene.unlockController()
    }
}

export const PARKING_STATUS_ENTER = -1;
export const PARKING_STATUS_STOP = 0;
export const PARKING_STATUS_LEAVE = 1;
export const PARKING_STATUS_ANOMALY = 2;


export const ALARM_TYPE_NONE = 0;
export const ALARM_TYPE_WHISTLE = 1;

export const carTypeChineseNameDictionary = {
    'sedan': '小轿车',
    'sport': '跑车',
    'pickUp': '皮卡车',
    'suv': '越野车',
    'van': '厢式货车',
}

Car.PARKING_STATUS_ENTER = PARKING_STATUS_ENTER
Car.PARKING_STATUS_STOP = PARKING_STATUS_STOP
Car.PARKING_STATUS_LEAVE = PARKING_STATUS_LEAVE
Car.PARKING_STATUS_ANOMALY = PARKING_STATUS_ANOMALY

Car.ALARM_TYPE_NONE = ALARM_TYPE_NONE
Car.ALARM_TYPE_WHISTLE = ALARM_TYPE_WHISTLE

Car.carTypeChineseNameDictionary = carTypeChineseNameDictionary

