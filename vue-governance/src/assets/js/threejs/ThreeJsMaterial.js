import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { gsap } from 'gsap';
const _ = require('lodash');

export default class ThreeJsMaterial {
    scene = null;
    camera = null;
    container = null;
    width = 0;
    height = 0;
    gridHelper = null;
    axesHelper = null;
    controller = null;
    mixerList = [];
    clock = null;
    renderCamera = null;
    perspectiveCamera = null;
    orthographicCamera = null;
    canvasShoot = null;
    cesiumMaterial = undefined;

    static materialCache = [];

    constructor(container) {
        this.container = container || document.createElement("div");
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.cesiumMaterial = new Cesium.ImageMaterialProperty({
            image: new Cesium.CallbackProperty(() => {
                return this.canvasShoot;
            }, false),
            transparent: true,
        })
        this.initClock();
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initController();
        this.initLight();

    }

    initClock() {
        this.clock = new THREE.Clock();
    }

    initScene() {
        this.scene = new THREE.Scene();
    }

    initCamera() {
        this.initPerspectiveCamera();
        this.initOrthographicCameraCamera();
        this.renderCamera = this.perspectiveCamera;
    }

    initPerspectiveCamera() {
        this.perspectiveCamera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.add(this.perspectiveCamera)
    }

    initOrthographicCameraCamera() {
        this.orthographicCamera = new THREE.OrthographicCamera(this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 1, 1000);
        this.add(this.orthographicCamera);
    }


    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true,
            alpha: true
            // preserveDrawingBuffer: true
        })

        this.renderer.setSize(this.width, this.height)
        this.container.appendChild(this.renderer.domElement)
        this.renderer.shadowMap.enabled = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.render();
    }

    initController() {
        this.controller = new OrbitControls(this.renderCamera, this.renderer.domElement)
        // this.controller.maxPolarAngle = 9 / 20 * Math.PI
        this.controller.minDistance = 0.5;
        this.controller.maxDistance = 500000;
        this.controller.keyPanSpeed = 20
        this.controller.screenSpacePanning = false
    }


    render() {
        let i = 0
        const interval = 10; // 五帧一次
        this.renderer.setAnimationLoop(() => {
            if (i % interval === 0) {
                if (this.controller) {
                    this.controller.update()
                }
                if (this.renderer && this.scene) {
                    this.renderer.render(this.scene, this.renderCamera)
                    this.canvasShoot = this.getCanvasShoot();
                }

                this.mixerList.forEach(mixer => {
                    let mixerUpdateDelta = this.clock.getDelta();

                    // If in single step mode, make one step and then do nothing (until the user clicks again)


                    // Update the animation mixer, the stats panel, and render this frame
                    mixer.update(mixerUpdateDelta);

                })
                i = 0
            } else {
                i++;
            }


        })

    }

    addBox() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(255, 255, 0) });
        const cube = new THREE.Mesh(geometry, material);
        gsap.to(cube.rotation, {
            x: Math.PI,
            y: Math.PI,
            z: Math.PI,
            duration: 3,
            ease: "linear",
            repeat: -1
        })

        this.add(cube);
    }

    addHelper() {
        this.addGridHelper()
        this.addAxesHelper()
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
    }

    addAmbientLight() {
        this.ambientLight = new THREE.AmbientLight('rgb(100, 100, 100)', 20); // soft white light
        this.add(this.ambientLight);
    }

    changeSize(width, height) {
        this.width = width
        this.height = height
        this.perspectiveCamera.aspect = this.width / this.height
        this.perspectiveCamera.updateProjectionMatrix();
        if (this.renderer) {
            this.renderer.setSize(this.width, this.height)
            this.renderer.setPixelRatio(window.devicePixelRatio)
        }
    }

    getCanvasShoot() {
        const oldCanvas = this.renderer.domElement;
        const newCanvas = document.createElement('canvas');
        const context = newCanvas.getContext('2d');
        //set dimensions
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;
        //apply the old canvas to the new one
        context.drawImage(oldCanvas, 0, 0);

        //return the new canvas
        return newCanvas;
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

    clearScene() {
        // this.removeModel(null, this.scene)
        this.renderer.setAnimationLoop(null)
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.renderer.renderLists.dispose();
        // this.container.removeChild(this.renderer.domElement)
        this.renderer.domElement = null;
        THREE.Cache.clear();
        this.controller && this.controller.dispose()
        this.scene.remove();
    }

    static getFlowMaterial({ backgroundColor, activeColor, duration = 3, height = 500, width = 500 }) {
        let flowMaterial = ThreeJsMaterial.materialCache.find(
            cache => cache.type === "FlowMaterial"
                && cache.backgroundColor === backgroundColor
                && cache.activeColor === activeColor
                && cache.duration === duration
                && cache.height === height
                && cache.width === width
        )?.material;

        if (!flowMaterial) {
            flowMaterial = new ThreeJsMaterial();
            const backgroundRgbaColor = getRgbaColor(backgroundColor)
            const activeRgbaColor = getRgbaColor(activeColor)
            const sceneHeight = height;
            const sceneWidth = width;
            flowMaterial.changeSize(sceneWidth, sceneHeight);
            flowMaterial.renderer.setClearColor(0x000000, 0);

            // 添加板子
            const backGroundPlaneGeometry = new THREE.PlaneGeometry(sceneWidth, sceneHeight);

            const backgroundPlaneMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color(backgroundRgbaColor.r / 255, backgroundRgbaColor.g / 255, backgroundRgbaColor.b / 255),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: backgroundRgbaColor.a
            });
            const backgroundPlaneMesh = new THREE.Mesh(
                backGroundPlaneGeometry,
                backgroundPlaneMaterial
            );
            flowMaterial.add(backgroundPlaneMesh);
            backgroundPlaneMesh.position.set(0, 0, 0);

            const activePlaneWidth = 0.05 * sceneWidth;
            const activePlaneGeometry = new THREE.PlaneGeometry(activePlaneWidth, sceneHeight);
            const activePlaneMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color(activeRgbaColor.r / 255, activeRgbaColor.g / 255, activeRgbaColor.b / 255),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: activeRgbaColor.a
            });
            const activePlaneMesh = new THREE.Mesh(
                activePlaneGeometry,
                activePlaneMaterial
            );
            flowMaterial.add(activePlaneMesh);
            activePlaneMesh.position.set(-0.5 * sceneWidth - 0.5 * activePlaneWidth, 0, 10);
            gsap.to(activePlaneMesh.position, {
                x: 0.5 * sceneHeight + 0.5 * activePlaneWidth,
                duration: duration,
                ease: "linear",
                repeat: -1
            })

            const left = -sceneWidth / 2;
            const right = sceneWidth / 2;
            const top = sceneHeight / 2;
            const bottom = -sceneHeight / 2;

            flowMaterial.renderCamera = new THREE.OrthographicCamera(
                left,
                right,
                top,
                bottom,
                1,
                1000
            );
            flowMaterial.renderCamera.position.set(0, 0, 50);
            flowMaterial.renderCamera.lookAt(0, 0, -100);

            ThreeJsMaterial.materialCache.push({
                type: "FlowMaterial",
                backgroundColor: backgroundColor,
                activeColor: activeColor,
                duration: duration,
                height: height,
                width: width,
                material: flowMaterial
            });
        }
        return flowMaterial;
    }

    static getTwinkleMaterial({ startColor, endColor, stepOneDuration = 0.5, stepTwoDuration = 3, height = 500, width = 500 }) {
        let twinkleMaterial = ThreeJsMaterial.materialCache.find(
            cache => cache.type === "TwinkleMaterial"
                && cache.startColor === startColor
                && cache.endColor === endColor
                && cache.stepOneDuration === stepOneDuration
                && cache.stepTwoDuration === stepTwoDuration
                && cache.height === height
                && cache.width === width
        )?.material;
        if (!twinkleMaterial) {
            twinkleMaterial = new ThreeJsMaterial();
            const startRgbaColor = getRgbaColor(startColor)
            const endRgbaColor = getRgbaColor(endColor)
            const sceneHeight = height;
            const sceneWidth = width;
            twinkleMaterial.changeSize(sceneWidth, sceneHeight);
            twinkleMaterial.renderer.setClearColor(0x000000, 0);


            const backGroundPlaneGeometry = new THREE.PlaneGeometry(sceneWidth, sceneHeight);

            const backgroundPlaneMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color(startRgbaColor.r / 255, startRgbaColor.g / 255, startRgbaColor.b / 255),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: startRgbaColor.a
            });
            const backgroundPlaneMesh = new THREE.Mesh(
                backGroundPlaneGeometry,
                backgroundPlaneMaterial
            );
            twinkleMaterial.add(backgroundPlaneMesh);
            backgroundPlaneMesh.position.set(0, 0, 0);


            const tl = gsap.timeline({
                repeat: -1,
            });
            tl.add(
                gsap.to(backgroundPlaneMaterial, {
                    opacity: endRgbaColor.a,
                    duration: stepOneDuration,
                })
            );

            tl.add(
                gsap.to(backgroundPlaneMaterial.color, {
                    r: endRgbaColor.r / 255,
                    g: endRgbaColor.g / 255,
                    b: endRgbaColor.b / 255,
                    duration: stepOneDuration,
                }),
                "<"
            );

            tl.add(
                gsap.to(backgroundPlaneMaterial, {
                    opacity: startRgbaColor.a,
                    duration: stepTwoDuration,
                }),
                ">"
            );

            tl.add(
                gsap.to(backgroundPlaneMaterial.color, {
                    r: startRgbaColor.r / 255,
                    g: startRgbaColor.g / 255,
                    b: startRgbaColor.b / 255,
                    duration: stepTwoDuration,
                }),
                "<"
            );

            const left = -sceneWidth / 2;
            const right = sceneWidth / 2;
            const top = sceneHeight / 2;
            const bottom = -sceneHeight / 2;

            twinkleMaterial.renderCamera = new THREE.OrthographicCamera(
                left,
                right,
                top,
                bottom,
                1,
                1000
            );
            twinkleMaterial.renderCamera.position.set(0, 0, 50);
            twinkleMaterial.renderCamera.lookAt(0, 0, -100);

            this.unSelectedCesiumMaterial = new Cesium.ImageMaterialProperty({
                image: new Cesium.CallbackProperty(() => {
                    return twinkleMaterial.canvasShoot;
                }, false),
                transparent: true,
            });

            ThreeJsMaterial.materialCache.push({
                type: "TwinkleMaterial",
                startColor: startColor,
                endColor: endColor,
                stepOneDuration: stepOneDuration,
                stepTwoDuration: stepTwoDuration,
                height: height,
                width: width,
                material: twinkleMaterial
            });

        }
        return twinkleMaterial;
    }

    static getScanMaterial({ color, height = 500, width = 500 }) {
        let scanMaterial = ThreeJsMaterial.materialCache.find(
            cache => cache.type === "ScanMaterial"
                && cache.color === color
                && cache.height === height
                && cache.width === width
        )?.material;
        if (!scanMaterial) {
            scanMaterial = new ThreeJsMaterial();
            const rgbaColor = getRgbaColor(color)
            const sceneHeight = height;
            const sceneWidth = width;
            scanMaterial.changeSize(sceneWidth, sceneHeight);
            scanMaterial.renderer.setClearColor(0x000000, 0);

            const left = -sceneWidth / 2;
            const right = sceneWidth / 2;
            const top = sceneHeight / 2;
            const bottom = -sceneHeight / 2;

            scanMaterial.renderCamera = new THREE.OrthographicCamera(
                left,
                right,
                top,
                bottom,
                1,
                1000
            );
            scanMaterial.renderCamera.position.set(0, 0, 100);
            scanMaterial.renderCamera.lookAt(0, 0, -100);

            this.unSelectedCesiumMaterial = new Cesium.ImageMaterialProperty({
                image: new Cesium.CallbackProperty(() => {
                    return twinkleMaterial.canvasShoot;
                }, false),
                transparent: true,
            });

            ThreeJsMaterial.materialCache.push({
                type: "TwinkleMaterial",
                startColor: startColor,
                endColor: endColor,
                stepOneDuration: stepOneDuration,
                stepTwoDuration: stepTwoDuration,
                height: height,
                width: width,
                material: scanMaterial
            });

        }
        return scanMaterial;
    }
}

function getOpacity(colorStr) {

    // 使用正则表达式匹配字符串
    const rgbaColor = getRgbaColor(colorStr);
    let opacity = 1;
    if (rgbaColor) {
        // 匹配成功，获取透明度值（在捕获组的第四个位置）
        opacity = parseFloat(rgbaColor.a);
    }
    return opacity || 1;
}

function getRgbaColor(colorStr) {
    const rgbaPattern = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/;
    const match = rgbaPattern.exec(colorStr);
    return match ? { r: parseFloat(match[1]), g: parseFloat(match[2]), b: parseFloat(match[3]), a: parseFloat(match[4]) } : undefined;
}


