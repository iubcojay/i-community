<template>
  <div class="factory_car_container">
    <fuel-truck-component
      v-for="truckInfo of truckInfoList"
      :truckInfo="truckInfo"
      :key="truckInfo.id"
    ></fuel-truck-component>
  </div>
</template>

<script>
import FuelTruckComponent from "./components/FuelTruckComponent.vue";
import { mapMutations } from "vuex";
export default {
  name: "FactoryCarControllerComponent",
  components: {
    FuelTruckComponent,
  },
  data() {
    return {
      truckInfoList: [
        {
          id: "1",
          plateNumber: "鲁A·F81Y9",
          modelUrl:
            this.$StaticResourceAddress + "/model/factory/car/fuel_truck1.glb",
        },
        {
          id: "2",
          plateNumber: "鲁A·X3H62",
          modelUrl:
            this.$StaticResourceAddress + "/model/factory/car/fire_truck.glb",
        },
      ],
    };
  },
  methods: {
    ...mapMutations("menuAbout", ["setIfBottomMenuFold"]),
    ...mapMutations("regionAbout", ["setCurrentRegion"]),
    async initPage() {
      this.hindBottomMenu();
      await this.initPosition();
    },

    hindBottomMenu() {
      this.setIfBottomMenuFold(true);
    },

    async initPosition() {
      const targetPosition = [2.044715790240727, 0.6404916950536464, 0];
      const height = 2500;
      const angleOffset = [(0 * Math.PI) / 180, (-45 * Math.PI) / 180, 0];
      let duration = 0.5;

      if (this.$store.state.regionAbout.currentRegion.name !== "历下区") {
        duration = 0;
      }
      window.myEarth.flyToPosition(
        targetPosition,
        height,
        angleOffset,
        duration
      );
      this.setCurrentRegion({ name: "factory" });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, duration * 1000);
      });
    },
  },
  mounted() {
    this.initPage();
  },

  beforeDestroy() {},
};
</script>

<style lang="less" scoped>
.factory_car_container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  user-select: none;
}
</style>
