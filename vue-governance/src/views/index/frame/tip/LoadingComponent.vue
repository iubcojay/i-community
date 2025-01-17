<template>
  <div class="loading_container">
    <div class="tip_panel">
      <i class="iconfont icon-loading"></i>
      <div v-show="message.trim() !== ''" class="tip_text_panel">
        <div class="text_panel">{{ message }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingComponent",
  props: ["message"],
};
</script>

<style lang="less" scoped>
.loading_container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(1, 12, 22, 0.4);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 999;

  .tip_panel {
    width: 300px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    i {
      font-size: 100px;
      color: white;
      margin-bottom: 15px;

      animation: loading 2s linear infinite;

      @keyframes loading {
        0% {
          transform: rotateZ(0);
        }

        100% {
          transform: rotateZ(360deg);
        }
      }
    }

    .tip_text_panel {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: white;

      &::after {
        content: "";
        width: 40px;
        margin-left: 5px;
        font-size: 40px;
        animation: apostrophe 1s linear infinite;

        @keyframes apostrophe {
          0% {
            content: "·";
          }
          33% {
            content: "··";
          }
          66% {
            content: "···";
          }

          100% {
            content: "·";
          }
        }
      }

      .text_panel {
        font-size: 25px;
      }
    }
  }
}
</style>
