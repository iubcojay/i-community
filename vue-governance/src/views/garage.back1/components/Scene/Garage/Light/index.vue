<template>
  <div class="light_container">
    <LightInfo
      v-if="lightMode"
      :id="info.id"
      :position="positionStyle"
      :content="info.title"
      :isOpen="isOpen"
    />
  </div>
</template>

<script>
import Light from "@/views/garage.back1/utils/Light.js";
import { Vector3 } from "three";
import { mapState } from "vuex";
import LightInfo from "./Panel/LightInfo.vue";

export default {
  components: { LightInfo },
  props: ["info"],
  data() {
    return {
      screenPosition: { left: 0, bottom: 0 },
    };
  },
  computed: {
    ...mapState("garageAbout", ["lightMode"]),
    isOpen() {
      return this.info.isOpen;
    },

    status() {
      return this.info.status;
    },
    centerPositionArray() {
      const positionList = this.info.positionList;
      return positionList.reduce(
        (pre, cur) => [
          pre[0] + cur[0] / positionList.length,
          5,
          pre[2] + cur[2] / positionList.length,
        ],
        [0, 5, 0]
      );
    },

    positionStyle() {
      return {
        left: this.screenPosition.left + "px",
        bottom: this.screenPosition.bottom + "px",
      };
    },
  },
  methods: {
    initComp() {
      this.initLight();
    },
    destroyComp() {
      this.destroyLight();
    },

    initLight() {
      const light = new Light({
        id: this.info.id,
        isOpen: this.info.isOpen,
        positionList: this.info.positionList,
        title: this.info.title,
        garage: window.garage,
      });
      if (!window.lights) {
        window.lights = [];
      }
      this._light = light;
      window.lights.push(light);
      this.addPositionListener();
    },

    destroyLight() {
      this._light.destroy();
      this.removePositionListener();
    },

    addPositionListener() {
      if (!window.garageScene) {
        return;
      }

      window.garageScene.addRenderFunc(this.vectorPosition2ScreenPosition);
    },

    removePositionListener() {
      window.garageScene.removeRenderFunc(this.vectorPosition2ScreenPosition);
    },

    vectorPosition2ScreenPosition() {
      const vector = new Vector3(...this.centerPositionArray);
      this.screenPosition = window.garageScene.vector32Screen(vector);
    },
  },
  mounted() {
    this.initComp();
  },
  destroyed() {
    this.destroyComp();
  },
  watch: {
    isOpen(value) {
      if (this._light) {
        if (value) {
          this._light.openLight();
        } else {
          this._light.closeLight();
        }
      }
    },
    lightMode(value) {
      if (this._light) {
        if (value) {
          this._light.enterLightFocusMode();
        } else {
          this._light.existLightFocusMode();
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.light_container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
