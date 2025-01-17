<template>
  <div
    class="side_bar_panel"
    :style="{ height: height }"
    :class="[
      position === 'left' ? 'side_panel_left_in' : 'side_panel_right_in',
    ]"
  >
    <div class="panel_content">
      <div class="panel_title">{{ title }}</div>
      <div class="inner_panel pretty_scrollbar">
        <slot name="content"></slot>
      </div>
      <div
        v-for="position of ['lt', 'lb', 'rb', 'rt', 'l', 'r', 't', 'b']"
        :class="'border_' + position"
        :key="position"
      ></div>
      <div class="slash_left"></div>
      <div class="slash_right"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArchPanelComponent",
  props: ["height", "title", "position"],
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
  box-sizing: border-box;

  .panel_content {
    position: relative;
    flex: 1;
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
    padding: 10px 20px 20px 20px;
    border-radius: 15px;

    &:before {
      content: "";
      position: absolute;
      left: 40%;
      bottom: 15px;
      height: 5px;
      width: 20%;
      background-color: @lightBlue;
    }

    .panel_title {
      color: darkred;
      height: 30px;
    }

    .inner_panel {
      height: calc(100% - 40px);
      overflow: auto;
      overflow-x: hidden;
    }

    .corner_border() {
      position: absolute;
      width: 40px;
      height: 40px;
      box-sizing: border-box;
    }

    .edge_border() {
      position: absolute;
      background-color: rgb(2, 77, 137);
    }

    .corner_border() {
      position: absolute;
      width: 40px;
      height: 40px;
      box-sizing: border-box;
      pointer-events: none;
    }

    .border_rt {
      right: 0;
      top: 0;
      border-radius: 0px 15px 0px 0px;
      border-right: 5px @lightBlue solid;
      border-top: 5px @lightBlue solid;
      .corner_border();
    }

    .border_rb {
      right: 0;
      bottom: 0;
      border-radius: 0px 0px 15px 0px;
      border-right: 5px @lightBlue solid;
      border-bottom: 5px @lightBlue solid;
      .corner_border();
    }

    .border_lt {
      left: 0;
      top: 0;
      border-radius: 15px 0px 0px 0px;
      border-left: 5px @lightBlue solid;
      border-top: 5px @lightBlue solid;
      .corner_border();
    }

    .border_lb {
      left: 0;
      bottom: 0;
      border-radius: 0px 0px 0px 15px;
      border-left: 5px @lightBlue solid;
      border-bottom: 5px @lightBlue solid;
      .corner_border();
    }

    .border_l {
      .edge_border();
      left: 0;
      top: 40px;
      height: calc(100% - 80px);
      width: 5px;
    }

    .border_r {
      .edge_border();
      right: 0;
      top: 40px;
      height: calc(100% - 80px);
      width: 5px;
    }

    .border_t {
      .edge_border();
      left: 40px;
      top: 0;
      width: calc(100% - 80px);
      height: 5px;
      border-radius: 0 0 0 5px;
    }

    .border_b {
      .edge_border();
      left: 40px;
      bottom: 0;
      width: calc(100% - 80px);
      height: 5px;
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
