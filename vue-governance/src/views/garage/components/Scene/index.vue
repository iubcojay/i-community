<template>
  <div id="garage_scene_container" ref="garage_scene_container">
    <div v-if="ready" class="garage_scene_wrapper_container">
      <Garage></Garage>
      <Car v-for="car of cars" :key="car.id" :info="car"></Car>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import MyThreeJsScene from "@/views/garage.back1/utils/MyThreeJsScene.js";
import Garage from "@/views/garage.back1/components/Scene/Garage/index";
// import MyThreeJsScene from "@/assets/js/threejs/MyThreeJsScene.js";
// import Garage from "@/views/garage/common/ThreeJsGarageComponent.vue";
import Car from "@/views/garage.back1/components/Scene/Car/index";
import { getModelPool } from "@/views/garage.back1/utils/ModelLoader.js";
import { Group } from "three";
import { createWs } from "@/views/garage.back1/utils/WSUtil.js";
import {mapActions, mapMutations, mapState} from "vuex";

export default {
  name: "ThreeJsGarageComponent",
  components: {
    Garage,
    Car,
  },
  data() {
    return {
      ready: false,
      // garageStoryType: "begin",
    };
  },
  computed: {
    ...mapState("garageAbout", ["cars"]),
    ...mapState({
      garageStoryType: state => state.garageAbout.garageStoryType // 指定模块名
    }),
  },

  methods: {
    ...mapActions("garageAbout", ["updateGarageInfo"]),
    async initComp() {
      await this.initModelPool();
      this.initScene();
      await this.initWs();
      this.ready = true;
      this.$emit("scene");
    },
    ...mapMutations('garageAbout', { // 指定模块名
      updateGarageStoryType: 'updateGarageStoryType'
    }),
    destroyComp() {
      this.destroyModelPool();
      this.destroyScene();
      this.destroyWs();
    },

    async initModelPool() {
      window.garageModelPool = await getModelPool();
    },

    destroyModelPool() {
      window.garageModelPool = null;
    },

    initScene() {
        console.log("初始化了屏幕信息")

      window.garageScene = new MyThreeJsScene({
        container: this.$refs["garage_scene_container"],
        helperOptions: {
          gridHelper: false,
          axesHelper: false,
        },
        draco: {
          open: true,
          url: this.$StaticResourceAddress + "/draco/gltf/",
        },
        cameraOptions: {
          position: [-6.689614341938231, 39.98548073770579, -50.91144959218385],
          rotation: [
            -2.4758222840462705,
            -0.10297057258288292,
            -3.0610378516722863,
          ],
        },
      });
        console.log(window.garageScene)

      // 关闭点光源
      window.garageScene.spotLight.intensity = 0;

      // 关闭环境光
      window.garageScene.ambientLight.intensity = 0;

      // 添加carGroup
      const carGroup = new Group();
      carGroup.name = "carGroup";
      window.garageScene.scene.add(carGroup);
    },

    destroyScene() {
      window.garageScene?.clearScene();
      window.garageScene = null;
      this.destroyModelPool();
      this.ready = false;
    },
    async initWs() {
      const ws = await createWs(this.$WSAddress + "/garage/status");
      ws.send(
        JSON.stringify({
          tag: this.garageStoryType,
        })
      );
      ws.onmessage = ({ data }) => {
        const { tag, data: garageStatus } = JSON.parse(data);
        if (tag === "garage_status") {
          this.updateGarageInfo(garageStatus);
        }
      };
      this._ws = ws;
      this.updateGarageStoryType('begin');
    },

    destroyWs() {
      if (this._ws) {
        this._ws.close();
      }
    },
  },

  mounted() {
    this.initComp();
  },

  destroy() {
    this.destroyComp();
  },
};
</script>

<style lang="less" scoped>
#garage_scene_container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: all;

  .garage_scene_wrapper_container {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    pointer-events: none;
  }
}
</style>
