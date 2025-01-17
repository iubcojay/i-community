import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

import { gsap } from 'gsap';
const _ = require('lodash');

export default class MyThreeJsScene {
    constructor(options = {}) {
        this.options = options
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

        this.focusModel = null
        this.focusObject = null
        this.focusModelActionList = []


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
        this.scene.background = new THREE.Color("white")
        this.scene.environment = new THREE.Color("white")
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
        this.controller.enablePan = false
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

        this.removeModel(this.scene, object)

    }

    flyToModel(object, relativeCameraPosition = [5, 5, 5], duration = 1) {
        // 初始化跟随相机
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
        this.removeModel(object, tempCamera)
    }


    add(obj) {
        this.scene && (this.scene.add(obj))
    }

    async addFocusModel(modelUrl, modelFormat, modelScale, progressCallback = () => { }) {
        this.removeFocusModel()
        let loadResult
        switch (modelFormat) {
            case "gltf":
                loadResult = await this.gltfLoader.loadAsync(modelUrl, (xhl) => {
                    progressCallback(xhl.loaded / xhl.total)
                })
                break

        }

        let { scene: modelObj, animations: animations } = loadResult
        modelObj.scale.set(...modelScale)
        modelObj.position.set(0,0,0)
        this.focusModel = modelObj
        this.focusModel.traverse(object => {
            if (object.material) {
                object.currentHex = object.material.emissive.getHex();
            }
        })
        this.add(this.focusModel)
        this.focusModelActionList = animations.map(animation => {
            const action = this.animationMixer.clipAction(animation, this.focusModel)
            action.name = animation.name
            // 只执行一次
            action.loop = THREE.LoopOnce
            // 执行结束保持结束状态
            action.clampWhenFinished = true
            return action
        })

        this.flyToModel(this.focusModel, modelScale.map(scale => 10 / scale))
    }

    removeFocusModel() {
        this.focusModel && this.removeModel(this.scene, this.focusModel)
        this.focusObject = null
        this.focusModel = null
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
        this.dracoLoader && this.dracoLoader.dispose()


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


    highLightObjectByName(objectName) {
        const targetObject = this.focusModel.getObjectByName(objectName)
        this.highLightObject(targetObject)

    }

    highLightObjectById(objectId) {
        const targetObject = this.focusModel.getObjectByProperty("uuid", objectId)
        this.highLightObject(targetObject)
    }

    highLightObject(object) {
        // 清除旧高亮
       this.unHighLightAll()
        this.focusObject = object
        this.focusObject.traverse((object) => {

            if (object.material) {
                object.material.emissive.setStyle("rgb(255, 0, 0)")
            }

        })
    }

    unHighLightAll() {
        if (this.focusObject) {
            this.focusObject.traverse((object) => {
                if (object.material) {
                    object.material.emissive.setHex(object.currentHex);
                }
            })
        }
    }


}
