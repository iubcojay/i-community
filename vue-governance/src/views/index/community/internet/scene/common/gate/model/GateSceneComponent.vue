<template>
  <div class="scene_container" ref="sceneContainer">
    <div class="back_button" @click="handleBackBtnClick">
      <i class="iconfont icon-left" style="margin-right: 10px;"></i>
      返 回
    </div>
    <template v-if="sceneReady">
      <gate-component></gate-component>
    </template>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import GateComponent from "@/views/index/community/internet/scene/common/gate/model/GateComponent";

class TScene {
  constructor({
    container,
    clientWidth,
    clientHeight,
    cameraPosition = [10, 10, 10],
    cameraRotation = [0, 0, 0],
    grid = false,
    axes = false,
    dracoUrl,
    lightIntensity = 4,
  }) {
    this.container = container;
    this.clientWidth = clientWidth;
    this.clientHeight = clientHeight;
    this.cameraPosition = cameraPosition;
    this.cameraRotation = cameraRotation;
    this.grid = grid;
    this.axes = axes;
    this.dracoUrl = dracoUrl;
    this.lightIntensity = lightIntensity;
    this.scene = null;
    this.camera = null;
    this.renderCamera = null;
    this.renderer = null;
    this.cssRenderer = null;
    this.controller = null;
    this.gridHelper = null;
    this.axesHelper = null;
    this.ambientLight = null;
    this.spotLight = null;
    this.textureLoader = null;
    this.gltfLoader = null;
    this.dracoGltfLoader = null;
    this.dracoLoader = null;
    this.clock = null;
    this.mixerList = [];
    this.renderCallback = [];
  }

  init() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initController();
    this.initHelper();
    this.initLight();
    this.initLoader();
    this.initClock();
    this.setWindowResizeListener();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#000000");
    this.scene.environment = new THREE.Color("#000000");
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.clientWidth / this.clientHeight,
      0.1,
      1000
    );
    this.add(this.camera);
    this.camera.position.set(...this.cameraPosition);
    this.renderCamera = this.camera;
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });

    this.renderer.setSize(this.clientWidth, this.clientHeight);
    this.container.appendChild(this.renderer.domElement);
    this.renderer.shadowMap.enabled = true;
    // 旧版threejs
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    // 新版 threejs
    // this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    // renderer.physicallyCorrectLights = true
    this.render();
  }

  render() {
    this.renderer.setAnimationLoop(() => {
      const delta = this.clock.getDelta();
      if (this.controller && this.renderCamera === this.camera) {
        this.controller.update();
      }
      if (this.renderer && this.scene && this.renderCamera) {
        this.renderer.render(this.scene, this.renderCamera);
      }
      this.mixerList.forEach((mixer) => {
        mixer.update(delta);
      });

      this.renderCallback.forEach((callback) => callback({ delta }));
    });
  }

  initController() {
    // 此处尤其注意，不可new OrbitControls(this.camera, this.cssRenderer.domElement)，否则点击事件失效
    this.controller = new OrbitControls(this.camera, this.renderer.domElement);
    this.controller.maxPolarAngle = (9 / 20) * Math.PI;
    this.controller.screenSpacePanning = false;
    this.controller.zoomSpeed = 0.5;
    this.controller.rotateSpeed = 0.5;
    this.controller.panSpeed = 1;
  }

  initHelper() {
    this.addGridHelper();
    this.addAxesHelper();
  }

  addGridHelper() {
    if (this.grid) {
      this.gridHelper = new THREE.GridHelper(500, 500);
      this.gridHelper.material.opacity = 0.5;
      this.gridHelper.material.transparent = true;
      this.add(this.gridHelper);
    }
  }

  addAxesHelper() {
    if (this.axes) {
      this.axesHelper = new THREE.AxesHelper(500);
      this.add(this.axesHelper);
    }
  }

  addMixer(mixer) {
    this.mixerList.push(mixer);
  }

  removeMixer(mixer) {
    this.mixerList = this.mixerList.filter((item) => item !== mixer);
  }

  addRenderCallback(callback) {
    this.renderCallback.push(callback);
  }

  removeRenderCallback(callback) {
    this.renderCallback = this.renderCallback.filter(
      (item) => item !== callback
    );
  }

  initLight() {
    this.addAmbientLight();
    // this.addSpotLight()
  }

  addAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(
      "rgb(100, 100, 100)",
      this.lightIntensity
    ); // soft white light
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
    this.textureLoader = new THREE.TextureLoader();
    this.gltfLoader = new GLTFLoader();

    if (this.dracoUrl) {
      this.dracoGltfLoader = new GLTFLoader();
      this.dracoLoader = new DRACOLoader();
      this.dracoLoader.setDecoderPath(this.dracoUrl);
      this.dracoLoader.setDecoderConfig({ type: "js" });
      this.dracoLoader.preload();
      this.dracoGltfLoader.setDRACOLoader(this.dracoLoader);
    }
  }

  initClock() {
    this.clock = new THREE.Clock();
  }

  setWindowResizeListener() {
    this._resizeListenerCallback = this.resizeListenerCallback.bind(this);
    window.addEventListener("resize", this._resizeListenerCallback);
  }

  removeWindowResizeListener() {
    window.removeEventListener("resize", this._resizeListenerCallback);
  }

  resizeListenerCallback() {
    this.clientWidth = this.container.clientWidth;
    this.clientHeight = this.container.clientHeight;
    this.renderCamera.aspect = this.clientWidth / this.clientHeight;
    this.renderCamera.updateProjectionMatrix();

    if (this.renderer) {
      this.renderer.setSize(this.clientWidth, this.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
    }
  }

  add(obj) {
    this.scene && this.scene.add(obj);
  }

  removeObject(child) {
    if (child && child.children.length) {
      let arr = child.children.filter((x) => x);
      arr.forEach((a) => {
        this.removeObject(a);
      });
    }
    if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
      if (child.material.map) child.material.map.dispose();
      child.material.dispose();
      child.geometry.dispose();
    } else if (child && child.material) {
      child.material.dispose();
    }
    child.removeFromParent();
  }

  clearScene() {
    this.removeObject(this.scene);
    this.renderer.setAnimationLoop(null);
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.renderLists.dispose();
    this.container.removeChild(this.renderer.domElement);
    this.renderer.domElement = null;
    this.renderCallback = [];
    THREE.Cache.clear();
    this.controller?.dispose();
    this.scene.remove();
    this.dracoLoader && this.dracoLoader.dispose();
    this.scene = null;
    this.camera = null;
    this.renderCamera = null;
    this.renderer = null;
    this.controller = null;
    this.gridHelper = null;
    this.axesHelper = null;
    this.ambientLight = null;
    this.spotLight = null;
    this.textureLoader = null;
    this.gltfLoader = null;
    this.dracoGltfLoader = null;
    this.dracoLoader = null;
    this.clock = null;
    this.animationMixer = null;
    this.removeWindowResizeListener();
  }
}

export default {
  name: "GateSceneComponent",
  components: {
    GateComponent,
  },
  data() {
    return {
      sceneReady: false,
    };
  },
  methods: {
    initPage() {
      this.initScene();
    },
    destroyPage() {
      this.destroyScene();
    },

    // 场景
    initScene() {
      const container = this.$refs.sceneContainer;
      const tScene = new TScene({
        container,
        clientWidth: container.clientWidth,
        clientHeight: container.clientHeight,
        axes: false,
        grid: false,
        dracoUrl: this.$StaticResourceAddress + "/draco/gltf/",
      });
      tScene.init();
      window.gateScene = tScene;
      window.gateScene.ambientLight.intensity = 5;
      window.gateScene.camera.position.set(0, 10, 6);

      // 限制视角
      window.gateScene.controller.enablePan = false;
      window.gateScene.controller.maxDistance = 12;
      window.gateScene.controller.maxPolarAngle = (9 / 20) * Math.PI;
      window.gateScene.controller.minAzimuthAngle = -0.3 * Math.PI;
      window.gateScene.controller.maxAzimuthAngle = 0.3 * Math.PI;
      this.sceneReady = true;
    },

    destroyScene() {
      window.gateScene?.clearScene();
      window.gateScene = null;
    },

    handleBackBtnClick() {
      this.$router.replace(
        "/index/community/internet/monitor/common/broadcast"
      );
    },
  },
  mounted() {
    this.initPage();
  },
  destroyed() {
    this.destroyPage();
  },
};
</script>

<style lang="less" scoped>
.scene_container {
  width: 100vw;
  height: 100vh;
  position: relative;

  .back_button {
    position: absolute;
    left: 10px;
    top: 90px;
    font-size: 22px;
    color: white;
    width: 120px;
    height: 50px;
    z-index: 1;
    background-color: var(--lightBlue);
    opacity: 0.8;
    border-radius: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 10px;
    transition: 0.3s;
  }

  .back_button:hover {
    transform: scale(1.1);
    cursor: pointer;
    opacity: 1;
  }
}
</style>
