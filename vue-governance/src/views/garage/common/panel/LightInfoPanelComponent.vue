<template>
  <div class="light_info_outer_panel">
    <div class="content_panel">
      <div class="light_info_panel">
        <div class="light_icon_panel">
          <i class="iconfont icon-light light_icon" :style="{'color': lightOpen?'white':'gray'}"></i>
        </div>
        <span class="content_span" :style="{'color': lightOpen?'white':'gray'}">{{ content }}</span>
        <div class="switch_panel">
          <input
            type="checkbox"
            class="switch-button"
            :id="'switch-button-' + switchId"
            :checked="lightOpen"
            @change="handleSwitchChange"
          />
          <label :for="'switch-button-' + switchId"></label>
        </div>
      </div>
      <div class="triangle_panel"></div>
    </div>
    <div class="padding_panel"></div>
  </div>
</template>

<script>
const uuid = require("uuid");
export default {
  name: "LightInfoPanelComponent",
  props: {
    content: {
      default: "灯"
    },
    isOpen: {
      default: false
    },
    changeFunc: {
      default: () => {}
    }
  },

  data() {
    return {
      switchId: uuid.v1(),
      lightOpen: this.isOpen
    };
  },
  methods: {
    initComp() {},

    handleSwitchChange() {
      this.lightOpen = !this.lightOpen;
      this.changeFunc();
    }
  },
  mounted() {
    this.initComp();
  }
};
</script>

<style lang="less" scoped>
.light_info_outer_panel {
  width: 150px;
  height: 140px;
  display: flex;
  flex-direction: column;
  // pointer-events: all;
  @lightBlue: rgb(33, 194, 237);
  @darkBlue: rgb(2, 77, 137);
  @unActive: gray;
  @active: white;

  .content_panel {
    width: 100%;
    height: 50%;
    pointer-events: all;

    .light_info_panel {
      background: fade(@darkBlue, 80);
      width: 100%;
      height: 100%;
      flex: 1;
      box-sizing: border-box;
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-content: center;

      div {
        margin: 0 5px;
      }
    }

    .light_icon_panel {
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .light_icon {
        font-size: 25px;
        font-weight: 700;
      }
    }

    .content_span {
      color: white;
      font-size: 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .switch_panel {
      width: auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .switch-button {
        display: none;
        /*隐藏表单元素*/
      }

      .switch-button + label {
        /*+选择器选择紧跟“+”左边选择器的第一个元素*/
        display: inline-block;
        position: relative;
        transition: all 0.3s;
        width: 45px;
        height: 24px;
        border-radius: 15px;
        background-color: gray;
        margin: 0 5px;

        &:hover {
          cursor: pointer;
        }
      }

      .switch-button:checked + label {
        /*选中表单后的样式，:checked表示checkbox被选中后的状态*/
        background-color: white;
      }

      .switch-button + label::before {
        /*使用伪元素生成一个按钮*/
        content: "";
        display: block;
        height: 20px;
        width: 20px;
        position: absolute;
        border-radius: 20px;
        left: 2px;
        top: 2px;
        background-color: fade(@darkBlue, 60);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        transition: all 0.3s;
      }

      .switch-button:checked + label::before {
        /*checkbox选中时按钮的样式*/
        left: 22px;
        transition: all 0.2s linear;
      }
    }

    .triangle_panel {
      height: 10px;
      width: 100%;
      background: fade(@darkBlue, 90);
      clip-path: polygon(40% 0, 60% 0, 50% 100%);
    }
  }

  .padding_panel{
    width: 100%;
    height: 50%;
    pointer-events: none;
    opacity: 0;
  }
}
</style>
