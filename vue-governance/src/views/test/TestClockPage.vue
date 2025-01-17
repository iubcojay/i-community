<template>
  <div class="outer_panel">
    <div class="bottom_outer_panel">
      <div class="bottom_menu_outer_panel">
        <div class="bottom_menu_panel">
          <div class="menu_item"></div>
          <div class="menu_item"></div>
          <div class="menu_item"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GarageAlarmPanelComponent from "@/views/garage.back1/common/panel/GarageAlarmPanelComponent";
export default {
  name: "TestClockPage",
  components: {
    GarageAlarmPanelComponent
  },

  methods: {
    initComp() {}
  },
  mounted() {
    this.initComp();
  }
};
</script>

<style lang="less" scoped>
.outer_panel {
  width: 100%;
  height: 100%;
  background-color: white;
  position: relative;

  .bottom_outer_panel {
    position: absolute;
    width: 100%;
    height: 80px;
    bottom: 0;
    background: pink;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .bottom_menu_outer_panel {
        height: 100%;
        width: 100%;
        background: blue;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;


      .bottom_menu_panel {


        // .menu_item {
        //   width: 200px;
        //   height: 100%;
        //   background: yellow;
        //   border: 1px solid black;
        //   box-sizing: border-box;
        // }
      }
    }
  }
}
</style>
