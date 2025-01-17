<template>
  <div
    class="side_bar_panel"
    :style="{height:height}"
    :class="[position==='left'?'side_panel_left_in':'side_panel_right_in']"
  >
    <div class="panel_header">
      <div class="panel_title">
        <div class="border_lt"></div>
        <div
          style="position: absolute;left: 40px;top: 0;height: 5px;width: calc(100% - 40px);background-color: rgb(2, 77, 137)"
        ></div>
        <div class="slash_top"></div>
        {{title}}
      </div>

      <div class="panel_menu">
        <slot name="menuIcon"></slot>
      </div>
    </div>
    <div class="panel_content">
      <div class="slash_left"></div>
      <div class="slash_right"></div>
      <div class="inner_panel pretty_scrollbar">
        <slot name="content"></slot>
      </div>
      <div
        v-for="position of ['lb','rb','rt','l','r','t','b']"
        :class="'border_'+position"
        :key="position"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FolderPanelComponent",
  props: ["height", "title", "position"]
};
</script>

<style scoped lang="less">
.side_bar_panel {
  @lightBlue: rgb(33, 194, 237);
  @darkBlue: rgb(2, 77, 137);
  background-color: rgba(0, 0, 0, 0);
  width: 100%;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  pointer-events: visible;
  position: absolute;
  z-index: 3;

  .panel_header {
    height: 40px;
    width: 100%;
    /*background-color: rgba(0,0,0,0);*/
    border-radius: 15px 15px 0px 0px;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;

    .panel_title {
      position: relative;
      height: 100%;
      background-color: rgba(24, 49, 85, 0.9);
      border-radius: 15px 0 0 0;
      clip-path: polygon(0 0, calc(90% - 5px) 0%, 100% 41px, 0% 41px);
      color: white;
      font-size: 20px;
      font-weight: 500;
      line-height: 40px;
      box-sizing: border-box;
      padding-left: 40px;
      flex: 50% 1 1;
    }

    .panel_menu {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: right;
      flex: 50% 1 1;

      i {
        font-weight: 900;
        font-size: 20px;
        margin: 0 10px;
        color: white;

        &:hover {
          cursor: pointer;
          color: @lightBlue;
        }
      }
    }
  }

  .panel_content {
    position: relative;
    flex: 1;
    border-radius: 0px 15px 15px 15px;
    background-color: rgba(24, 49, 85, 0.9);
    width: 100%;
    clip-path: polygon(
      100% 0%,
      0% 0%,
      0% 100%,
      30% 100%,
      40% calc(100% - 15px),
      60% calc(100% - 15px),
      70% 100%,
      100% 100%
    );
    box-sizing: border-box;
    padding: 30px 20px 40px 20px;

    &:before {
      content: "";
      position: absolute;
      left: 40%;
      bottom: 15px;
      height: 5px;
      width: 20%;
      background-color: @lightBlue;
    }

    .inner_panel {
      min-height: 300px;
      max-height: 700px;
      overflow: auto;
      overflow-x: hidden;
    }
  }

  .panel_border() {
    position: absolute;
    width: 40px;
    height: 40px;
    box-sizing: border-box;
  }

  .border_rt {
    right: 0;
    top: 0;
    border-radius: 0px 15px 0px 0px;
    border-right: 5px @lightBlue solid;
    border-top: 5px @lightBlue solid;
    .panel_border();
  }

  .border_rb {
    right: 0;
    bottom: 0;
    border-radius: 0px 0px 15px 0px;
    border-right: 5px @lightBlue solid;
    border-bottom: 5px @lightBlue solid;
    .panel_border();
  }

  .border_lt {
    left: 0;
    top: 0;
    border-radius: 15px 0px 0px 0px;
    border-left: 5px @lightBlue solid;
    border-top: 5px @lightBlue solid;
    .panel_border();
  }

  .border_lb {
    left: 0;
    bottom: 0;
    border-radius: 0px 0px 0px 15px;
    border-left: 5px @lightBlue solid;
    border-bottom: 5px @lightBlue solid;
    .panel_border();
  }

  .border_l {
    position: absolute;
    left: 0;
    top: 0;
    height: calc(100% - 40px);
    width: 5px;
    background-color: @darkBlue;
  }

  .border_r {
    position: absolute;
    right: 0;
    top: 40px;
    height: calc(100% - 80px);
    width: 5px;
    background-color: @darkBlue;
  }

  .border_t {
    position: absolute;
    right: 40px;
    top: 0;
    width: calc(50% - 35px);
    height: 5px;
    background-color: @darkBlue;
    border-radius: 0 0 0 5px;
  }

  .border_b {
    position: absolute;
    left: 40px;
    bottom: 0;
    width: calc(100% - 80px);
    height: 5px;
    background-color: @darkBlue;
  }

  .slash_left {
    position: absolute;
    left: 30%;
    bottom: 0;
    width: 10%;
    height: 20px;
    background-color: @darkBlue;
    clip-path: polygon(0 calc(100% - 5px), 100% 0, 100% 5px, 0 100%);
  }

  .slash_right {
    position: absolute;
    right: 30%;
    bottom: 0;
    width: 10%;
    height: 20px;
    background-color: @darkBlue;
    clip-path: polygon(0 0, 100% calc(100% - 5px), 100% 100%, 0 5px);
  }

  .slash_top {
    position: absolute;
    right: 0;
    bottom: 0;
    width: calc(10% + 10px);
    height: 100%;

    background-color: @darkBlue;
    clip-path: polygon(0 0, calc(100% - 5px) 100%, 100% 100%, 5px 0);
  }
}

/*边框左进入*/
.side_panel_left_in {
  -webkit-animation: side_panel_left_in 1.1s both;
  animation: side_panel_left_in 1.1s both;
}

/*边框右进入*/
.side_panel_right_in {
  -webkit-animation: side_panel_right_in 1.1s both;
  animation: side_panel_right_in 1.1s both;
}

@-webkit-keyframes side_panel_right_in {
  0% {
    -webkit-transform: translateX(600px);
    transform: translateX(600px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateX(68px);
    transform: translateX(68px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateX(32px);
    transform: translateX(32px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateX(8px);
    transform: translateX(8px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}
@keyframes side_panel_right_in {
  0% {
    -webkit-transform: translateX(600px);
    transform: translateX(600px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateX(68px);
    transform: translateX(68px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateX(32px);
    transform: translateX(32px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateX(8px);
    transform: translateX(8px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}

@-webkit-keyframes side_panel_left_in {
  0% {
    -webkit-transform: translateX(-600px);
    transform: translateX(-600px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateX(-68px);
    transform: translateX(-68px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateX(-28px);
    transform: translateX(-28px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateX(-8px);
    transform: translateX(-8px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}
@keyframes side_panel_left_in {
  0% {
    -webkit-transform: translateX(-600px);
    transform: translateX(-600px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateX(-68px);
    transform: translateX(-68px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateX(-28px);
    transform: translateX(-28px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateX(-8px);
    transform: translateX(-8px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}
</style>
