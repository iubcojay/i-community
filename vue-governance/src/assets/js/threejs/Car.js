import * as THREE from 'three';
import Vue from 'vue';
import { gsap } from 'gsap';
const _ = require('lodash');
const uuid = require('uuid')
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { removeModel, getChildByName, getChildByNameIncludes } from '@/assets/js/threejs/threejsUtils'
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
// import CarInfoPanelComponent from '@/views/garage/common/panel/CarInfoPanelComponent'
import CarWhistlePanelComponent from '@/views/garage.back1/common/panel/CarWhistlePanelComponent'
import CarBasePanelComponent from '@/views/garage.back1/common/panel/CarBasePanelComponent'

export default class Car {
    #ifCarAdded = false
    #carTypeModelUrlDictionary = {
        'sedan': window.PLATFORM_CONFIG.StaticResourceAddress + '/model/garage/car/sedan.gltf',
        'sport': window.PLATFORM_CONFIG.StaticResourceAddress + '/model/garage/car/sport.gltf',
        'pickUp': window.PLATFORM_CONFIG.StaticResourceAddress + '/model/garage/car/pick_up.gltf',
        'suv': window.PLATFORM_CONFIG.StaticResourceAddress + '/model/garage/car/suv.gltf',
        'van': window.PLATFORM_CONFIG.StaticResourceAddress + '/model/garage/car/van.gltf',

    }
    #carTypeChineseNameDictionary = {
        'sedan': '小轿车',
        'sport': '跑车',
        'pickUp': '皮卡车',
        'suv': '越野车',
        'van': '厢式货车',

    }

    constructor({ carType = "sedan", modelScale = [1, 1, 1], id = uuid.v1(), gltfLoader = new GLTFLoader(), color = new THREE.Color('white'), license = "" }) {
        this.gltfLoader = gltfLoader
        this.myThreeJsScene = null
        this.type = carType
        this.modelUrl = this.#carTypeModelUrlDictionary[carType]
        this.modelScale = modelScale
        this.color = color
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

        this.intervalIdList = []
    }

    async initModel() {
        let { modelObj, animations } = await this.loaderGltfModel()
        this.animations = animations
        this.modelObj = modelObj.children[0]
        const shell = getChildByName(this.modelObj, 'shell')
        if (shell.isMesh) {
            shell.material.color = this.color
        } else {
            shell.children.forEach(child => {
                child.material.color = this.color
            })
        }

        this.modelObj.name = 'car_' + this.id
        // 添加基础信息面板
        this.addBaseInfoPanel()
        // 添加警告面板
        this.addAlarmPanel()
    }

    async loaderGltfModel() {
        let { scene: modelObj, animations } = await this.gltfLoader.loadAsync(this.modelUrl)
        return { modelObj, animations }
    }

    addCarToScene(basicThreeJsScene) {
        if (!this.#ifCarAdded && this.modelObj) {
            let carGroup = getChildByName(basicThreeJsScene.scene, 'carGroup')
            if (_.isUndefined(carGroup)) {
                carGroup = new THREE.Group()
                carGroup.name = "carGroup"
                basicThreeJsScene.add(carGroup)
            }
            carGroup.add(this.modelObj)
            this.actions = this.initAnimation(this.animations, basicThreeJsScene.animationMixer)
            this.#ifCarAdded = true
            this.myThreeJsScene = basicThreeJsScene
        }
    }

    initAnimation(animations, animationMixer) {
        return animations.map(animation => {
            const action = animationMixer.clipAction(animation, this.modelObj)
            action.setDuration(1)
            action.name = animation.name
            action.loop = THREE.LoopRepeat
            // action.play()
            return action
        })
    }

    clearCar(basicThreeJsScene) {
        if (this.#ifCarAdded && this.modelObj) {
            if (basicThreeJsScene.lockControllerInfo.lockModel === this.modelObj) {
                basicThreeJsScene.unlockController(this.modelObj)
                // basicThreeJsScene.resetCamera()
            }

            let carGroup = getChildByName(basicThreeJsScene.scene, 'carGroup')
            if (_.isUndefined(carGroup)) {
                carGroup = new THREE.Group()
                carGroup.name = "carGroup"
                basicThreeJsScene.add(carGroup)
            }
            removeModel(carGroup, this.modelObj)
            this.animations.forEach(animation => {
                basicThreeJsScene.animationMixer.uncacheClip(animation)
            })

            this.#ifCarAdded = false

        }
        this.intervalIdList.forEach(id => { id && clearInterval(id) })
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

            this.modelObj.lookAt(new THREE.Vector3(targetPositionInfo.x, targetPositionInfo.y, targetPositionInfo.z))
        } else if (isForwarded === false) {
            // 后退
            this.wheelRetreat()
            const currentPosition = [this.modelObj.position.x, this.modelObj.position.y, this.modelObj.position.z]
            const targetPosition = [targetPositionInfo.x, targetPositionInfo.y, targetPositionInfo.z]
            const backPosition = currentPosition.map((current, index) => current + (current - targetPosition[index]))
            this.modelObj.lookAt(new THREE.Vector3(backPosition[0], backPosition[1], backPosition[2]))
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

        const curve = new THREE.CatmullRomCurve3(positionInfoList.map(positionInfo => new THREE.Vector3(positionInfo.x, positionInfo.y, positionInfo.z)));
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

    async moveAlongPath({ positionInfoList, startIndex = 0, endIndex = positionInfoList.length - 1, durationFixFactor = 1, smoothFactor = 5 }) {
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
        this.modelObj.lookAt(new THREE.Vector3(smoothPositionInfoList[smoothStartIndex + 1].x, smoothPositionInfoList[smoothStartIndex + 1].y, smoothPositionInfoList[smoothStartIndex + 1].z))
        for (let index = smoothStartIndex + 1; index <= smoothEndIndex; index++) {
            const positionInfo = smoothPositionInfoList[index];
            newTimeStamp = positionInfo.timeStamp
            await this.moveTo(positionInfo, positionInfo.isForwarded, (newTimeStamp - originTimeStamp) / 1000 / durationFixFactor)
            originTimeStamp = newTimeStamp
        }
    }

    addBaseInfoPanel() {
        const infoPanelGroup = new THREE.Group()
        infoPanelGroup.name = "infoPanelGroup"
        infoPanelGroup.position.set(0, 2, 0)
        this.modelObj.add(infoPanelGroup)
        const createBaseInfoElement = () => {
            const BaseInfoPanelComponent = Vue.extend(CarBasePanelComponent)
            const baseInfoPanelComponent = new BaseInfoPanelComponent({
                propsData: {
                    position: "center",
                    infoData: {
                        id: this.id,
                        license: this.license,
                        type: this.#carTypeChineseNameDictionary[this.type],
                        color: '#' + this.color.getHexString(),
                        status: this.parkingStatus,
                        stopTime: this.parkingStatus === Car.PARKING_STATUS_STOP ? Math.round((new Date().getTime() - this.enterPathInfoList[0].timeStamp) / (24 * 60 * 60 * 1000)) : 0
                    },
                    closePanel: () => {
                        this.setBaseInfoPanelVisible(false)
                    },
                    lockCar: () => {
                        this.lockCar()
                    },
                    unlockCar: () => {
                        this.unlockCar()
                        this.myThreeJsScene.flyToModel(this.modelObj, [0, 20, 20])
                    },
                    ifLocked: this.myThreeJsScene?.ifLockedModel(this.modelObj) ? true : false

                }
            }).$mount()
            let panelElement = baseInfoPanelComponent.$el
            return panelElement
        }
        let panelElement = createBaseInfoElement()
        const containerElement = document.createElement('div')
        containerElement.appendChild(panelElement)
        const infoPanel = new CSS2DObject(containerElement);
        infoPanel.name = "car_base_info_panel"
        infoPanelGroup.add(infoPanel)
        infoPanel.visible = false

        // 存储一些上一次的值，若发生改变才更新面板信息
        let lastStatus = this.parkingStatus
        let lastStopTime = Car.PARKING_STATUS_STOP ? Math.round((new Date().getTime() - this.enterPathInfoList[0].timeStamp) / (24 * 60 * 60 * 1000)) : 0

        //设置定时器更新信息
        const baseInfoPanelIntervalId = setInterval(() => {
            if (lastStatus !== this.parkingStatus || lastStopTime !== (Car.PARKING_STATUS_STOP ? Math.round((new Date().getTime() - this.enterPathInfoList[0].timeStamp) / (24 * 60 * 60 * 1000)) : 0)) {
                // 更新旧值
                lastStatus = this.parkingStatus
                lastStopTime = this.parkingStatus === Car.PARKING_STATUS_STOP ? Math.round((new Date().getTime() - this.enterPathInfoList[0].timeStamp) / (24 * 60 * 60 * 1000)) : 0

                // 删除自己
                panelElement.parentNode.removeChild(panelElement);
                // 更新面板信息
                panelElement = createBaseInfoElement()
                containerElement.appendChild(panelElement)
            }
        }, 1000)
        this.intervalIdList.push(baseInfoPanelIntervalId)
    }

    // 添加警告信息面板函数，重复刷新监听
    addAlarmPanel() {
        const alarmPanelGroup = new THREE.Group()
        alarmPanelGroup.name = "alarmPanelGroup"
        alarmPanelGroup.position.set(0, 2, 0)
        this.modelObj.add(alarmPanelGroup)

        let lastAlarmType = Car.ALARM_TYPE_NONE
        let lastBaseInfoPanelShow = this.baseInfoPanelShow

        const alarmIntervalId = setInterval(() => {
            // 当警告内容变化，或者信息面板展示或者隐藏时，更新
            if (lastAlarmType !== this.alarmType || lastBaseInfoPanelShow !== this.baseInfoPanelShow) {
                lastAlarmType = this.alarmType
                lastBaseInfoPanelShow = this.baseInfoPanelShow
                // 清除所有的警告面板
                alarmPanelGroup.children.forEach(alarmPanel => { removeModel(alarmPanelGroup, alarmPanel) })
                switch (this.alarmType) {
                    case Car.ALARM_TYPE_NONE:
                        // 啥也不添加
                        break;

                    case Car.ALARM_TYPE_WHISTLE:
                        //添加响铃面板
                        const WhistlePanelComponent = Vue.extend(CarWhistlePanelComponent)
                        const whistlePanelComponent = new WhistlePanelComponent({
                            propsData: {
                                position: lastBaseInfoPanelShow ? "right" : "center"
                            }
                        }).$mount()
                        let whistlePanelElement = whistlePanelComponent.$el
                        const containerElement = document.createElement('div')
                        containerElement.appendChild(whistlePanelElement)
                        const whistlePanel = new CSS2DObject(containerElement);
                        whistlePanel.name = "car_alarm_panel_" + this.alarmType
                        alarmPanelGroup.add(whistlePanel)
                        break;
                }
            }
        }, 500)
        this.intervalIdList.push(alarmIntervalId)
    }


    setBaseInfoPanelVisible(visible) {
        this.baseInfoPanelShow = visible;
        const infoPanelGroup = getChildByName(this.modelObj, "infoPanelGroup")
        getChildByName(infoPanelGroup, 'car_base_info_panel').visible = visible
    }

    lockCar() {
        if (this.#ifCarAdded) {
            this.myThreeJsScene.lockControllerAtModel(this.modelObj)
        }
    }

    unlockCar() {
        if (this.#ifCarAdded) {
            this.myThreeJsScene.unlockController()
        }
    }


}

Car.PARKING_STATUS_ENTER = -1
Car.PARKING_STATUS_STOP = 0
Car.PARKING_STATUS_LEAVE = 1
Car.PARKING_STATUS_ANOMALY = 2

Car.ALARM_TYPE_NONE = 0
Car.ALARM_TYPE_WHISTLE = 1

