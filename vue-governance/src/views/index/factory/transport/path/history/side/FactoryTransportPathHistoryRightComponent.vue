<template>
  <folder-panel-component
    position="right"
    title="车辆信息"
    height="fit-content"
  >
    <template slot="menuIcon">
      <i
        class="title_icon iconfont icon-model"
        :class="{ active: status === STATUS_MODEL }"
        @click="changeStatus(STATUS_MODEL)"
      ></i>
      <i
        class="title_icon iconfont icon-video"
        :class="{ active: status === STATUS_VIDEO }"
        @click="changeStatus(STATUS_VIDEO)"
      ></i>
      <i class="title_icon iconfont icon-close"></i>
    </template>
    <template slot="content">
      <div class="info_container">
        <div class="media_container">
          <div
            ref="modelContainer"
            v-show="status === STATUS_MODEL"
            class="model_container"
          ></div>
          <div v-show="status === STATUS_VIDEO" class="video_container">
            <video class="record_video" v-if="pathInfo" ref="recordVideo">
              <source
                :src="$StaticResourceAddress + pathInfo.record"
                type="video/mp4"
              />
              暂无行车记录
            </video>
          </div>
        </div>
        <div class="text_container">
          <table class="truck_text_table">
            <tr>
              <td class="key_panel">车牌</td>
              <td class="value_panel">{{ truckInfo.plateNumber }}</td>
            </tr>
            <tr>
              <td class="key_panel">车型</td>
              <td class="value_panel">{{ truckInfo.type }}</td>
            </tr>
            <tr>
              <td class="key_panel">容量</td>
              <td class="value_panel">{{ truckInfo.capacity }}</td>
            </tr>
            <tr>
              <td class="key_panel">货物</td>
              <td class="value_panel">{{ truckInfo.goods }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="time_line_container">
        <truck-path-time-line-bar-component
          ref="timeLine"
          :start-time="startTime"
          :end-time="endTime"
          @change="handleTimeLineChange"
          @play="handleTimeLinePlay"
          @pause="handleTimeLinePause"
          @stop="handleTimeLineStop"
        ></truck-path-time-line-bar-component>
      </div>
    </template>
  </folder-panel-component>
</template>

<script>
import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
import TruckPathTimeLineBarComponent from "@/views/index/factory/transport/path/history/components/TruckPathTimeLineBarComponent";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";

const STATUS_VIDEO = "video";
const STATUS_MODEL = "model";
export default {
  name: "FactoryTransportPathHistoryRightComponent",
  components: {
    FolderPanelComponent,
    TruckPathTimeLineBarComponent,
  },
  props: ["supData", "supMethods"],
  data() {
    return {
      STATUS_VIDEO,
      STATUS_MODEL,
      status: STATUS_MODEL,
    };
  },
  computed: {
    pathInfo() {
      return this.supData.selectedHistoryTruckPathInfo;
    },
    truckInfo() {
      if (this.supData.selectedHistoryTruckPathInfo?.truckInfo) {
        return this.supData.selectedHistoryTruckPathInfo.truckInfo;
      } else {
        return {};
      }
    },
    startTime() {
      if (this.pathInfo) {
        return new Date(this.pathInfo.path.at(0).timeStamp);
      } else {
        return new Date();
      }
    },
    endTime() {
      if (this.pathInfo) {
        return new Date(this.pathInfo.path.at(-1).timeStamp);
      } else {
        return new Date();
      }
    },
  },
  methods: {
    initComp() {
      this.initModelScene();
    },

    async initModelScene() {
      const modelContainer = this.$refs["modelContainer"];
      this.clearModelScene();
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        modelContainer.clientWidth / modelContainer.clientHeight,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
      renderer.setClearColor(0xeeeeee, 0.0);
      modelContainer.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
      scene.add(ambientLight);

      // const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
      // scene.add(helper);

      this._modelScene = scene;
      this._modelCamera = camera;
      this._modelRenderer = renderer;

      const animate = () => {
        if (!this._modelScene) {
          return;
        }
        requestAnimationFrame(animate.bind(this));
        renderer.render(this._modelScene, this._modelCamera);
      };

      animate();
    },

    clearModelScene() {
      if (this._modelRenderer) {
        const modelContainer = this.$refs["modelContainer"];
        this._modelRenderer.setAnimationLoop(null);
        this._modelRenderer.dispose();
        this._modelRenderer.forceContextLoss();
        this._modelRenderer.renderLists.dispose();
        modelContainer.removeChild(this._modelRenderer.domElement);
        this._modelRenderer.domElement = null;
      }
      if (this._modelScene) {
        this._modelScene.remove();
        this._modelScene = null;
      }
      this._modelRenderer = undefined;
      this._modelScene = undefined;
      this._modelCamera = undefined;
    },

    updateModelScene() {
      this.$nextTick(async () => {
        if (
          this._modelRenderer &&
          this._modelScene &&
          this._modelCamera &&
          this.truckInfo.modelUrl
        ) {
          const modelContainer = this.$refs["modelContainer"];
          const truckModelName = "model_truck";
          const directionalLightName = "light_directional";
          this._modelCamera = new THREE.PerspectiveCamera(
            75,
            modelContainer.clientWidth / modelContainer.clientHeight,
            0.1,
            1000
          );
          this._modelRenderer.setSize(
            modelContainer.clientWidth,
            modelContainer.clientHeight
          );
          const oldModelObj = this._modelScene.getObjectByName(truckModelName);
          oldModelObj && this._modelScene.remove(oldModelObj);
          const loader = new GLTFLoader();
          let { scene: modelObj } = await loader.loadAsync(
            this.$StaticResourceAddress + this.truckInfo.modelUrl
          );
          modelObj.name = truckModelName;
          modelObj.position.set(0, 0, 0);
          gsap.fromTo(
            modelObj.rotation,
            { x: 0, y: 0, z: 0 },
            {
              x: 0,
              y: THREE.MathUtils.degToRad(360),
              z: 0,
              duration: 20,
              ease: "none",
              repeat: -1,
            }
          );
          this._modelScene.add(modelObj);

          const boundingBox = new THREE.Box3().setFromObject(modelObj);
          const maxLength = Math.max(
            boundingBox.max.x,
            boundingBox.max.y,
            boundingBox.max.z
          );
          this._modelCamera.position.x = maxLength * 1.5;
          this._modelCamera.position.y = maxLength * 1;
          this._modelCamera.position.z = maxLength * 1.5;
          this._modelCamera.lookAt(new THREE.Vector3(0, 0, 0));

          const oldDirectionalLight = this._modelScene.getObjectByName(
            directionalLightName
          );
          oldDirectionalLight && this._modelScene.remove(oldDirectionalLight);
          const directionalLight = new THREE.DirectionalLight(0xffffff);
          directionalLight.intensity = 0.7;
          directionalLight.name = directionalLightName;
          this._modelScene.add(directionalLight);

          directionalLight.position.x = maxLength * 3;
          directionalLight.position.y = maxLength * 3;
          directionalLight.position.z = maxLength * 3;
        }
      });
    },

    changeStatus(status) {
      this.status = status;
      this.updateModelScene();
    },

    handleTimeLineChange(timeStamp) {
      this.setVideo(timeStamp - this.startTime.getTime());
      this.setModel(timeStamp);
    },

    handleTimeLinePlay(timeStamp) {
      this.palyVideo(timeStamp - this.startTime.getTime());
      this.palyModel(timeStamp);
    },

    handleTimeLinePause(timeStamp) {
      this.pauseVideo(timeStamp - this.startTime.getTime());
      this.pauseModel(timeStamp);
    },

    handleTimeLineStop() {
      this.stopVideo();
      this.stopModel();
    },

    palyVideo(timeStamp) {
      const videoElement = this.$refs["recordVideo"];
      if (videoElement) {
        videoElement.currentTime = timeStamp / 1000;
        videoElement?.play();
      }
    },

    pauseVideo(timeStamp) {
      const videoElement = this.$refs["recordVideo"];
      if (videoElement) {
        videoElement?.pause();
        videoElement.currentTime = timeStamp / 1000;
      }
    },

    stopVideo() {
      const videoElement = this.$refs["recordVideo"];
      if (videoElement) {
        videoElement?.pause();
        videoElement.currentTime = 0;
      }
    },

    setVideo(timeStamp) {
      const videoElement = this.$refs["recordVideo"];
      if (videoElement) {
        videoElement.currentTime = timeStamp / 1000;
      }
    },

    palyModel(timeStamp) {
      window.myEarth.viewer.clock.currentTime = new Cesium.JulianDate.fromDate(
        new Date(timeStamp)
      );
      window.myEarth.viewer.clock.shouldAnimate = true;
    },

    pauseModel(timeStamp) {
      window.myEarth.viewer.clock.currentTime = new Cesium.JulianDate.fromDate(
        new Date(timeStamp)
      );
      window.myEarth.viewer.clock.shouldAnimate = false;
    },

    stopModel() {
      window.myEarth.viewer.clock.currentTime = window.myEarth.viewer.clock.startTime.clone();
      window.myEarth.viewer.clock.shouldAnimate = false;
    },

    setModel(timeStamp) {
      window.myEarth.viewer.clock.currentTime = new Cesium.JulianDate.fromDate(
        new Date(timeStamp)
      );
    },
  },

  watch: {
    pathInfo: {
      immediate: true,
      handler() {
        this.updateModelScene();
        this.$refs["timeLine"]?.resetData();
      },
    },
  },
  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    this.clearModelScene();
    this.res;
  },
};
</script>

<style lang="less" scoped>
.title_icon {
  color: white;
  &.active {
    color: var(--lightBlue) !important;
    &:hover {
      cursor: default !important;
    }
  }
}

.info_container {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: row;

  .media_container {
    height: 100%;
    flex: 1;
    border: 1px solid white;
    border-radius: 10px;
    overflow: hidden;

    .model_container {
      width: 100%;
      height: 100%;
    }

    .video_container {
      width: 100%;
      height: 100%;
      .record_video {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
    }
  }

  .text_container {
    color: white;
    width: 150px;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid white;
    border-radius: 10px;
    margin-left: 10px;
    padding: 5px;
    .truck_text_table {
      width: 100%;
      height: 100%;

      .key_panel {
        font-weight: 700;
      }

      .value_panel {
        text-align: right;
        font-style: italic;
      }
    }
  }
}

.time_line_container {
  width: 100%;
  height: fit-content;
  margin-top: 30px;
}
</style>
