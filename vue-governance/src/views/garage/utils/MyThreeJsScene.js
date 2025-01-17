import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { removeModel, getChildByName } from '@/assets/js/threejs/threejsUtils'
import Vue from 'vue'

import { gsap } from 'gsap';
const _ = require('lodash');

export default class MyThreeJsScene {
    constructor(options = {}, upDateFuncList = []) {
        this.options = options
        this.upDateFuncList = upDateFuncList
        this.container = options.container;
        this.clientWidth = this.container.clientWidth;
        this.clientHeight = this.container.clientHeight;
        this.scene = null
        this.camera = null
        this.renderCamera = null
        this.cameraList = [];
        this.renderer = null
        this.cssRenderer = null
        this.controller = null
        this.gridHelper = null
        this.axesHelper = null
        this.ambientLight = null
        this.spotLight = null
        this.textureLoader = null
        this.gltfLoader = null
        this.dracoLoader = null
        this.clock = null
        this.animationMixer = null
        this.lockControllerInfo = {
            lockControllerFunction: null,
            controllerStartFunction: null,
            controllerEndFunction: null,
            lockModel: null
        }

        this.initScene()
        this.initCamera()
        this.initRenderer()
        this.initCssRenderer()
        this.initController()
        this.initHelper()
        this.initLight()
        this.initLoader()
        this.initClock()
        this.initAnimationMixer()
        this.setWindowResizeListener()

    }
    initScene() {
        this.scene = new THREE.Scene()
        // scene.background = new THREE.Color("#ccc")
        // scene.environment = new THREE.Color("#ccc")
        this.scene.background = new THREE.Color("#2D2D2D")
        this.scene.environment = new THREE.Color("#2D2D2D")
    }

    initCamera() {
        const cameraOptions = this.options.cameraOptions
        // 相机
        this.camera = new THREE.PerspectiveCamera(75, this.clientWidth / this.clientHeight, 0.1, 1000);
        cameraOptions && cameraOptions.position ? this.camera.position.set(...cameraOptions.position) : this.camera.position.set(10, 10, 10);
        cameraOptions && cameraOptions.rotation ? this.camera.rotation.set(...cameraOptions.rotation) : "";
        this.add(this.camera)
        // 设置渲染相机为当前相机
        this.setRenderCamera(this.camera)
        this.cameraList.push(this.camera)
        // 调试
        // window.camera = this.camera
    }

    setRenderCamera(camera) {
        this.renderCamera = camera
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true
        })

        this.renderer.setSize(this.clientWidth, this.clientHeight)
        this.container.appendChild(this.renderer.domElement)
        this.renderer.shadowMap.enabled = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding
        // renderer.physicallyCorrectLights = true
        this.render();
    }

    initCssRenderer() {
        this.cssRenderer = new CSS2DRenderer();
        this.cssRenderer.setSize(this.clientWidth, this.clientHeight);
        this.cssRenderer.domElement.style.position = 'absolute';
        this.cssRenderer.domElement.style.top = '0px';
        // 此处尤其注意，必须设为none，否则控制器失效
        this.cssRenderer.domElement.style.pointerEvents = 'none'
        this.container.appendChild(this.cssRenderer.domElement);
    }

    initController() {
        // 此处尤其注意，不可new OrbitControls(this.camera, this.cssRenderer.domElement)，否则点击事件失效
        this.controller = new OrbitControls(this.camera, this.renderer.domElement)

        this.controller.maxPolarAngle = 9 / 20 * Math.PI
        this.controller.minDistance = 0.5;
        this.controller.maxDistance = 50;
        this.controller.keyPanSpeed = 20
        this.controller.screenSpacePanning = false
        // 设置键盘控制
        // this.controller.keys = {
        //     LEFT: 'KeyA', //left arrow
        //     UP: 'KeyW', // up arrow
        //     RIGHT: 'KeyD', // right arrow
        //     BOTTOM: 'KeyS' // down arrow
        // }
        // this.controller.listenToKeyEvents(window)
    }


    render() {
        this.renderer.setAnimationLoop(() => {
            if (this.controller) {
                this.controller.update()
            }
            if (this.renderer && this.scene && this.renderCamera) {
                this.renderer.render(this.scene, this.renderCamera)
            }
            if (this.cssRenderer && this.scene && this.renderCamera) {
                this.cssRenderer.render(this.scene, this.renderCamera)
            }

            if (this.animationMixer && this.clock) {
                const mixerUpdateDelta = this.clock.getDelta();
                this.animationMixer.update(mixerUpdateDelta)
            }

            if (this.lockControllerInfo.lockControllerFunction) {
                this.lockControllerInfo.lockControllerFunction()
            }

            this.upDateFuncList.forEach(fn => {
                fn()
            });
        })
    }


    initHelper() {
        this.options.helperOptions && this.options.helperOptions.gridHelper && this.addGridHelper()
        this.options.helperOptions && this.options.helperOptions.axesHelper && this.addAxesHelper()
    }

    addGridHelper() {
        this.gridHelper = new THREE.GridHelper(500, 50);
        this.gridHelper.material.opacity = 0.5
        this.gridHelper.material.transparent = true
        this.add(this.gridHelper);
    }

    addAxesHelper() {
        this.axesHelper = new THREE.AxesHelper(500)
        this.add(this.axesHelper)
    }


    initLight() {
        this.addAmbientLight()
        this.addSpotLight()
    }

    addAmbientLight() {
        this.ambientLight = new THREE.AmbientLight('rgb(100, 100, 100)', 2); // soft white light
        this.add(this.ambientLight);
    }

    addSpotLight() {
        this.spotLight = new THREE.SpotLight(0xffffff, 0.6);
        this.spotLight.position.set(500, 500, 500);
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.spotLight.shadow.camera.near = 500;
        this.spotLight.shadow.camera.far = 4000;
        this.spotLight.shadow.camera.fov = 30;
        this.add(this.spotLight);
    }

    initLoader() {
        this.textureLoader = new THREE.TextureLoader()
        this.gltfLoader = new GLTFLoader()

        // this.dracoLoader.setDecoderPath(STATICPATH + '/draco/');
        if (this.options.draco && this.options.draco.open) {
            this.dracoLoader = new DRACOLoader();
            this.dracoLoader.setDecoderPath(this.options.draco.url);
            this.dracoLoader.setDecoderConfig({ type: 'js' });
            this.dracoLoader.preload();
            this.gltfLoader.setDRACOLoader(this.dracoLoader);
        }

    }

    initAnimationMixer() {
        this.animationMixer = new THREE.AnimationMixer(this.scene);
    }


    setWindowResizeListener() {
        window.addEventListener('resize', () => {
            this.clientWidth = this.container.clientWidth
            this.clientHeight = this.container.clientHeight
            this.cameraList.forEach((camera) => {
                camera.aspect = this.clientWidth / this.clientHeight
                camera.updateProjectionMatrix()
            })
            if (this.renderer) {
                this.renderer.setSize(this.clientWidth, this.clientHeight)
                this.renderer.setPixelRatio(window.devicePixelRatio)
            }
            if (this.cssRenderer) {
                this.cssRenderer.setSize(this.clientWidth, this.clientHeight)
            }

        })
    }


    initClock() {
        this.clock = new THREE.Clock()
    }

    addRenderFunc(fn) {

        this.upDateFuncList.push(fn)
    }

    removeRenderFunc(fn) {
        _.remove(this.upDateFuncList, fun => fun === fn);
    }

    // flyTo(position, rotation, target = [0, 0, 0], duration = 1) {

    //     target && gsap.to(this.controller.target, { x: target[0], y: target[1], z: target[2], duration })
    //     position && gsap.to(this.renderCamera.position, { x: position[0], y: position[1], z: position[2], duration })
    //     rotation && gsap.to(this.renderCamera.rotation, { x: rotation[0], y: rotation[1], z: rotation[2], duration })
    // }

    flyTo(position, relativeCameraPosition = [5, 5, 5], duration = 1) {
        //  设置辅助物体
        const object = new THREE.Object3D()
        object.name = "tempObject"
        this.scene.add(object)
        object.position.set(...position)

        // 初始化车辆跟随相机
        const tempCamera = new THREE.Object3D()
        tempCamera.name = "tempCamera"
        object.add(tempCamera)

        // 设置跟随相机的位置（局部）
        tempCamera.position.set(...relativeCameraPosition)
        tempCamera.lookAt(object.position)

        // 设置轨道控制器中心
        gsap.to(this.controller.target, { x: object.position.x, y: object.position.y, z: object.position.z, duration: duration })

        // 设置全局相机位置
        this.camera.lookAt(object.position)
        const tempCameraWorldPosition = new THREE.Vector3()
        tempCamera.getWorldPosition(tempCameraWorldPosition)
        gsap.to(this.camera.position, { x: tempCameraWorldPosition.x, y: tempCameraWorldPosition.y, z: tempCameraWorldPosition.z, duration: duration })

        removeModel(this.scene, object)

    }

    flyToModel(object, relativeCameraPosition = [5, 5, 5], duration = 1) {
        // 初始化车辆跟随相机
        const tempCamera = new THREE.Object3D()
        tempCamera.name = "tempCamera"
        object.add(tempCamera)

        // 设置跟随相机的位置（局部）
        tempCamera.position.set(...relativeCameraPosition)
        tempCamera.lookAt(object.position)

        // 设置轨道控制器中心
        gsap.to(this.controller.target, { x: object.position.x, y: object.position.y, z: object.position.z, duration: duration })

        // 设置全局相机位置
        this.camera.lookAt(object.position)
        const tempCameraWorldPosition = new THREE.Vector3()
        tempCamera.getWorldPosition(tempCameraWorldPosition)
        gsap.to(this.camera.position, { x: tempCameraWorldPosition.x, y: tempCameraWorldPosition.y, z: tempCameraWorldPosition.z, duration: duration })

        // 删除辅助相机
        removeModel(object, tempCamera)
    }

    lockControllerAtModel(model, cameraInitPosition = [0, 12, 12], zoomInDuration = 1) {
        this.unlockController()

        // 禁止更换中心点
        this.controller.enablePan = false
        this.lockControllerInfo.lockModel = model

        // 初始化车辆跟随相机
        const followCamera = new THREE.PerspectiveCamera(75, this.clientWidth / this.clientHeight, 0.1, 1000);
        this.cameraList.push(followCamera)
        followCamera.name = "followCamera"
        model.add(followCamera)

        // 设置跟随相机的位置（局部）
        followCamera.position.set(...cameraInitPosition)
        followCamera.lookAt(model.position)


        // 设置轨道控制器中心
        const gsapPromise1 = gsap.to(this.controller.target, { x: model.position.x, y: model.position.y, z: model.position.z, duration: zoomInDuration }).then()

        // 设置全局相机位置与跟随相机一致
        this.camera.lookAt(model.position)
        const followCameraWorldPosition = new THREE.Vector3()
        followCamera.getWorldPosition(followCameraWorldPosition)
        const gsapPromise2 = gsap.to(this.camera.position, { x: followCameraWorldPosition.x, y: followCameraWorldPosition.y, z: followCameraWorldPosition.z, duration: zoomInDuration }).then()

        Promise.all([gsapPromise1, gsapPromise2]).then(() => {
            // 更换渲染相机到局部跟随相机
            this.renderCamera = followCamera
            this.lockControllerInfo.controllerStartFunction = () => {
                // 渲染相机换回全局相机前,全局相机与局部相机同步
                let followCameraPosition = new THREE.Vector3();
                followCamera.getWorldPosition(followCameraPosition)
                this.camera.position.copy(followCameraPosition)

                // 控制器控制时，渲染相机换回全局相机
                this.renderCamera = this.camera
            }

            this.lockControllerInfo.controllerEndFunction = () => {
                // 更换渲染相机到局部跟随相机前，局部相机与全局相机位置同步
                const tempVector = new THREE.Vector3()
                tempVector.copy(this.camera.position)
                model.worldToLocal(tempVector)
                followCamera.position.set(tempVector.x, tempVector.y, tempVector.z)
                followCamera.lookAt(model.position)

                // 控制器控制结束时，更换渲染相机到局部跟随相机
                this.renderCamera = followCamera
            }

            this.lockControllerInfo.lockControllerFunction = () => {
                // 控制器中心跟随物体
                this.controller.target.set(model.position.x, model.position.y, model.position.z)

            }

            this.controller.addEventListener('start', this.lockControllerInfo.controllerStartFunction)

            this.controller.addEventListener('end', this.lockControllerInfo.controllerEndFunction)

        })
    }

    unlockController() {
        const lockModel = this.lockControllerInfo.lockModel
        if (lockModel) {
            // 解禁更换中心点
            this.controller.enablePan = true

            // 删除controller 上绑定的事件
            this.controller.removeEventListener('start', this.lockControllerInfo.controllerStartFunction)
            this.controller.removeEventListener('end', this.lockControllerInfo.controllerEndFunction)

            const followCamera = getChildByName(lockModel, 'followCamera')
            // 将模型上添加的辅助摄像机从相机列表中删除
            _.remove(this.cameraList, camera => camera === followCamera)


            // 删除模型上添加的辅助摄像机
            removeModel(lockModel, followCamera)
            this.lockControllerInfo.lockModel = null

            // 恢复使用全局摄像机
            this.renderCamera = this.camera
        }

        this.lockControllerInfo = {
            lockControllerFunction: null,
            controllerStartFunction: null,
            controllerEndFunction: null,
            lockModel: null
        }
    }

    ifLockedModel(model) {
        if (this.lockControllerInfo.lockModel === model) {
            return true
        } else {
            return false
        }

    }

    resetCamera(duration = 1) {
        // 非聚焦模式重置视角
        if (!this.lockControllerInfo.lockModel) {
            gsap.to(this.camera.position, { x: -6.689614341938231, y: 39.98548073770579, z: -50.91144959218385, duration })
            gsap.to(this.controller.target, { x: 0, y: 0, z: 0, duration })
            return true
        } else {
            return false
        }
    }

    add(obj) {
        this.scene && (this.scene.add(obj))
    }

    removeModel(parent, child) {
        if (child.children.length) {
            let arr = child.children.filter(x => x);
            arr.forEach(a => {
                this.removeModel(child, a)
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

    addHtmlPanel(element, position) {
        const htmlPanel = new CSS2DObject(element);
        htmlPanel.position.set(...position);
        this.scene.add(htmlPanel)
        return htmlPanel
    }

    vector32Screen(vector3) {
        const standardVec = vector3.project(this.renderCamera);
        const centerX = this.clientWidth / 2;
        const centerY = this.clientHeight / 2;
        const left = Math.round(centerX * standardVec.x + centerX);
        const bottom = Math.round(centerY * standardVec.y + centerY);
        return { left: left, bottom: bottom }
    }

    clearScene() {
        this.removeModel(null, this.scene)
        // this.scene.background.dispose()
        this.renderer.setAnimationLoop(null)
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.renderer.renderLists.dispose();
        this.container.removeChild(this.renderer.domElement)
        this.renderer.domElement = null;
        THREE.Cache.clear();
        this.controller.dispose()
        this.scene.remove();
        this.dracoLoader.dispose()


        this.scene = null
        this.camera = null
        this.renderCamera = null
        this.renderer = null
        this.controller = null
        this.gridHelper = null
        this.axesHelper = null
        this.ambientLight = null
        this.spotLight = null
        this.textureLoader = null
        this.gltfLoader = null
        this.dracoLoader = null
        this.clock = null
        this.animationMixer = null

    }
}
