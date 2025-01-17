<template>
  <div class="top_bar_panel">
    <div class="top_bar_left_panel">
      <div class="top_bar_title_panel">
        <el-image :src="$StaticResourceAddress + '/img/icon/garage.png'" style="width: 40px"></el-image>
        <span style="margin-left: 10px;" class="title_text">智慧车库</span>
        <i class="iconfont icon-address user_icon"></i>
        <span style="color: white">{{ areaInfo.name }}</span>
        <i class="iconfont icon-user user_icon"></i>
        <span style="color: white">{{ userInfo.username }}</span>
      </div>
      <div class="slash_panel"></div>
      <div class="clock_panel">
        <menu-clock-component></menu-clock-component>
      </div>
    </div>
    <div class="top_bar_right_panel">
      <div class="top_bar_menu_icon_panel">
        <i
          class="iconfont icon-home top_bar_menu_icon hvr-grow-shadow"
          @click="handleIconClick('home')"
        ></i>

        <i
          class="iconfont icon-layers top_bar_menu_icon hvr-grow-shadow"
          @click="handleIconClick('unfold')"
        ></i>
        <i
          class="iconfont icon-full-screen top_bar_menu_icon hvr-grow-shadow"
          @click="handleIconClick('fullScreen')"
        ></i>
        <i
          class="iconfont icon-exit top_bar_menu_icon hvr-grow-shadow"
          @click="handleIconClick('exit')"
        ></i>
      </div>
      <div class="top_bar_menu_text_panel">
        <TopBarTextMenuComponent :menu-data="topBarMenuItemList" :active-group="activeGroup"></TopBarTextMenuComponent>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import TopBarTextMenuComponent from "@/views/garage.back1/frame/menu/top/TopBarTextMenuComponent";
import MenuClockComponent from "@/views/garage.back1/frame/menu/top/MenuClockComponent";

export default {
  name: "TopBarComponent",
  components: { TopBarTextMenuComponent, MenuClockComponent },
  props: ["topBarMenuItemList"],
  data() {
    return {
      activeGroup: {
        activeSubItem: undefined,
        activeMenuItem: undefined
      }
    };
  },

  methods: {
    handleIconClick(icon) {
      switch (icon) {
        case "home":
          if (window.myThreeJsScene.resetCamera()) {
            this.$message({
              message: "重置视角",
              type: "success",
              offset: 90
            });
          } else {
            this.$message({
              message: "当前处于聚焦模式，无法重置视角！",
              type: "warning"
            });
          }

          break;
        case "exit":
          this.$router
            .replace({
              path: "/index/community/home"
            })
            .then(() => {
              if (window.myThreeJsScene) {
                window.myThreeJsScene.clearScene;
                delete window.myThreeJsScene;
              }
            });

          break;

        case "unfold":
          window.myThreeJsScene.garage.toggleCeilingRaise();
          break;
        case "fullScreen":
          break;
      }
    }
  },
  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
    powerName() {
      // 有get和set方法

      switch (this.userInfo.power) {
        //权限错误
        case -1:
          this.$router
            .replace({
              path: "/login"
            })
            .then(() => {});
          break;
        //管理员
        case 0:
          return "管理员";
        //街道
        case 1:
          return "街道";
        //居委会
        case 2:
          return "居委会";
        //网格管理员
        case 3:
          return "网格管理员";
        //网格员
        case 4:
          return "网格员";
      }
    }
  }
};
</script>

<style scoped lang="less">
@font-face {
  font-family: top_title;
  src: url("/src/assets/font/title.ttf");
}

.top_bar_panel {
  position: absolute;
  background-color: rgba(24, 49, 85, 0.7);
  height: 80px;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  pointer-events: all;

  .top_bar_left_panel {
    display: flex;
    height: 100%;
    flex-direction: row;
    justify-content: left;
    align-items: center;

    .clock_panel {
      height: 100%;
      width: auto;
      box-sizing: border-box;
      border-top: var(--lightBlue) 4px solid;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    .top_bar_title_panel {
      height: 100%;
      width: auto;
      text-shadow: 0 0 10px #478de0, 0 0 20px #478de0, 0 0 30px #478de0;
      letter-spacing: 5px;
      padding-left: 20px;
      display: flex;
      flex-direction: row;
      justify-content: left;
      align-items: center;
      border-bottom: var(--lightBlue) 4px solid;
      box-sizing: border-box;

      .title_text {
        font-family: top_title;
        font-size: 25px;
        color: white;
      }

      .user_icon {
        font-size: 20px;
        color: var(--lightBlue);
        font-weight: 700;
        margin-right: 10px;
        margin-left: 20px;
      }
    }

    .slash_panel {
      width: 60px;
      background-color: var(--lightBlue);
      height: 100%;
      clip-path: polygon(
        0 calc(100% - 4px),
        0 100%,
        4px 100%,
        100% 4px,
        100% 0,
        calc(100% - 4px) 0
      );
    }
  }

  .top_bar_right_panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    border-top: var(--lightBlue) 4px solid;
    box-sizing: border-box;

    .top_bar_menu_icon_panel {
      display: flex;
      flex-direction: row;
      flex: 1;
      justify-content: right;
      align-items: center;
      z-index: 2;

      .top_bar_menu_icon {
        font-size: 25px;
        color: var(--lightBlue);
        font-weight: 700;
        margin: 0 10px;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .top_bar_menu_text_panel {
      display: flex;
      flex-direction: row;
      flex: 1;
      justify-content: right;
      align-items: center;
      z-index: 1;
    }
  }
}
</style>
