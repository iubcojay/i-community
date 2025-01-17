<template>
  <div
    v-if="position"
    class="accident_poi_container"
    :style="{
      transform: `translateX(calc(${position.left} - 50%)) translateY(calc(${position.top} - 100%))`,
    }"
  >
    <div ref="accidentIcon" class="content_container">
      <i class="iconfont icon-accident"></i>
      <div ref="accidentContent" class="accident_content">
        道路汽车事故起火
      </div>
    </div>
    <div class="foot_container">
      <div ref="linePanel" class="line_panel"></div>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";
export default {
  name: "AccidentPoiComponent",
  props: {
    position: {
      default: () => {
        ({
          left: "-100%",
          top: "-100%",
        });
      },
    },
  },
  methods: {
    initComp() {
      this.animate();
    },
    animate() {
      var tl = gsap.timeline({ delay: 1 });
      tl.from(this.$refs.linePanel, { height: 0, duration: 0.5 });
      tl.fromTo(
        this.$refs.accidentIcon,
        { scale: 3, opacity: 0 },
        { scale: 1, opacity: 1 }
      );
      tl.fromTo(this.$refs.accidentContent, { scaleX: 0 }, { scaleX: 1 });
    },
  },

  mounted() {
    this.initComp();
  },
};
</script>

<style lang="less" scoped>
.accident_poi_container {
  position: relative;
  left: 0px;
  top: 0px;
  width: 60px;
  aspect-ratio: 2;
  transform: translateX(-50%) translateY(-100%);
  z-index: 10; // 确保容器在其他元素之上

  .content_container {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    background: rgb(245, 108, 108);
    border-radius: 50%;
    border: 5px double white;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 5px;
    box-shadow: 0 0 10px 5px rgba(245, 108, 108, 0.9);
    animation: pulse 1s infinite;
    z-index: 11; // 确保内容容器在其他元素之上

    i {
      font-size: 30px;
      color: white;
      font-weight: 1000;
      z-index: 12; // 确保图标在其他元素之上
    }

    .accident_content {
      position: absolute;
      width: 70px;
      height: 50px;
      top: 50%;
      transform: translateY(-50%);
      left: calc(100% + 10px);
      font-size: 16px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: white;
      text-shadow: 0 0 10px rgba(245, 108, 108, 0.9),
      0 0 20px rgba(245, 108, 108, 0.9), 0 0 30px rgba(245, 108, 108, 0.9);
      transform-origin: left;
      z-index: 12; // 确保文本内容在其他元素之上
    }
  }

  .foot_container {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    .line_panel {
      width: 3px;
      height: 100%;
      background: white;
    }
  }
}
</style>
