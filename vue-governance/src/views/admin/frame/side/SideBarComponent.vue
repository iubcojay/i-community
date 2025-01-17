<template>
  <div class="side_bar_panel pretty_scrollbar">
    <transition name="menu-title">
      <div
        v-show="menuStatus === 0"
        class="menu_title_panel"
        @mouseleave="handleSideBarLeave"
      >
        <div
          ref="firstLevelMenu"
          v-for="firstLevelMenuInfo of menuOptions"
          class="first_level_menu_item_panel"
          :class="{
            first_item_active:
              selectedFirstLevelMenuId === firstLevelMenuInfo.id,
            first_item_unfold:
              unfoldFirstLevelMenuId === firstLevelMenuInfo.id
          }"
          :key="firstLevelMenuInfo.id"
        >
          <div
            class="first_level_menu_title_panel"
            @click="handleFirstLevelTitleClick(firstLevelMenuInfo.id)"
          >
            <i
              class="iconfont icon_title"
              :class="[firstLevelMenuInfo.iconClass]"
            ></i>
            <span>{{ firstLevelMenuInfo.title }}</span>
            <i class="iconfont icon-down icon_down"></i>
          </div>
          <div class="second_level_menu_list_content_panel">
            <div
              v-for="secondLevelMenuInfo of firstLevelMenuInfo.children"
              class="second_level_menu_list_item_panel"
              :class="{
                second_item_active:
                  selectedSecondLevelMenuId === secondLevelMenuInfo.id,
              }"
              :key="secondLevelMenuInfo.id"
              @click="handleSecondLevelTitleClick(secondLevelMenuInfo)"
            >
              <div class="seconde_level_menu_title_panel">
                {{ secondLevelMenuInfo.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="menu-icon">
      <div v-show="menuStatus === 1" class="menu_icon_panel">
        <div
          v-for="firstLevelMenuInfo of menuOptions"
          class="menu_icon_item"
          :class="{
            menu_icon_item_active:
              firstLevelMenuInfo.id === selectedFirstLevelMenuId,
          }"
        >
          <i
            class="iconfont menu_icon"
            :class="[firstLevelMenuInfo.iconClass]"
          ></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { gsap } from "gsap";

export default {
  name: "SideBarComponent",
  props: ["supMethods","supData"],
  data() {
    return {
  

      unfoldFirstLevelMenuId: "",

      menuStatus: 0,
    };
  },

  computed: {
    menuOptions(){
      return this.supData.menuOptions
    },

    activeMenuIdList(){return this.supData.activeMenuIdList},

    selectedSecondLevelMenuId(){
      return this.activeMenuIdList[2]
    },

    selectedFirstLevelMenuId() {
      return this.activeMenuIdList[1]
    },
  },

  methods: {
    initComp() {
      this.initMenu();
    },

    initMenu() {
      this.unfoldFirstLevelMenuId = this.selectedFirstLevelMenuId
      this.updateMenuStatus(this.unfoldFirstLevelMenuId);
    },

    // 折叠和展开菜单列表
    updateMenuStatus(unfoldFirstLevelMenuId) {
      this.menuOptions.forEach((firstLevelMenuInfo, index) => {
        const targetNode = this.$refs.firstLevelMenu[index].querySelector(
          ".second_level_menu_list_content_panel"
        );
        if (firstLevelMenuInfo.id === unfoldFirstLevelMenuId) {
          gsap.to(targetNode, {
            duration: 0.5,
            height: 60 * firstLevelMenuInfo.children.length,
          });
        } else {
          gsap.to(targetNode, {
            duration: 0.5,
            height: 0,
          });
        }
      });
    },

    handleFirstLevelTitleClick(firstLevelMenuId) {
      this.unfoldFirstLevelMenuId = firstLevelMenuId;
      this.updateMenuStatus(firstLevelMenuId);
    },

    handleSecondLevelTitleClick(secondLevelMenuInfo) {
        this.$router.push({path:secondLevelMenuInfo.path})
    },

    handleSideBarLeave() {
      this.unfoldFirstLevelMenuId = this.selectedFirstLevelMenuId;
      this.updateMenuStatus(this.unfoldFirstLevelMenuId);
    },

    toggleMenuStatus() {
      if (this.menuStatus === 0) {
        this.menuStatus = 1;
      } else if (this.menuStatus === 1) {
        this.menuStatus = 0;
      }
    },
  },

 

  mounted() {
    this.initComp();
  },
};
</script>

<style lang="less" scoped>
.side_bar_panel {
  width: auto;
  height: 100%;
  // background: rgb(2, 77, 137);

  .menu_title_panel {
    box-sizing: border-box;
    width: 250px;
    height: 100%;

    .first_level_menu_item_panel {
      min-height: 60px;
      width: 250px;
      box-sizing: border-box;
      padding: 0px 15px;
      border-bottom: 1px gainsboro solid;
    
      .first_level_menu_title_panel {
        position: relative;
        width: 100%;
        height: 60px;
        color: gray;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        font-weight: 700;

        &:hover {
          cursor: pointer;
          // color: rgb(2, 77, 137);

          .icon_down {
            transform: rotateZ(0deg);
          }

          .icon_title {
            animation: jello-vertical 0.6s both;
          }

          @keyframes jello-vertical {
            0% {
              -webkit-transform: scale3d(1, 1, 1);
              transform: scale3d(1, 1, 1);
            }
            30% {
              -webkit-transform: scale3d(0.75, 1.25, 1);
              transform: scale3d(0.75, 1.25, 1);
            }
            40% {
              -webkit-transform: scale3d(1.25, 0.75, 1);
              transform: scale3d(1.25, 0.75, 1);
            }
            50% {
              -webkit-transform: scale3d(0.85, 1.15, 1);
              transform: scale3d(0.85, 1.15, 1);
            }
            65% {
              -webkit-transform: scale3d(1.05, 0.95, 1);
              transform: scale3d(1.05, 0.95, 1);
            }
            75% {
              -webkit-transform: scale3d(0.95, 1.05, 1);
              transform: scale3d(0.95, 1.05, 1);
            }
            100% {
              -webkit-transform: scale3d(1, 1, 1);
              transform: scale3d(1, 1, 1);
            }
          }
        }

        .icon_title {
          width: 30px;
          height: 30px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          margin-right: 10px;
        }

        .icon_down {
          position: absolute;
          width: 30px;
          height: 30px;
          font-size: 20px;
          font-weight: 700;
          top: 0;
          bottom: 0;
          right: 0;
          margin: auto;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          transform: rotateZ(-90deg);
          transition: 0.2s linear all;
        }

        span {
          font-size: 18px;
        }
      }

      .second_level_menu_list_content_panel {
        box-sizing: border-box;
        overflow: hidden;
        height: 0;

        .second_level_menu_list_item_panel {
          width: 100%;
          height: 50px;
          box-sizing: border-box;
          padding-left: 40px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          border-radius: 10px;
          margin: 5px 0;

          &:hover {
            background: rgba(65, 132, 187, 0.2);
            cursor: pointer;
          }

          .seconde_level_menu_title_panel {
            color: gray;
            font-size: 17px;
          }
        }

        .second_item_active {
          .seconde_level_menu_title_panel {
            color: rgb(2, 77, 137);
            font-weight: 600;
          }
        }
      }
    }

    .first_item_unfold{
      .icon_down{
        transform: rotateZ(0) !important;
      }
    }

    .first_item_active {
      .first_level_menu_title_panel {
        color: rgb(2, 77, 137);
      }
    }

  }

  .menu_icon_panel {
    width: 60px;
    display: flex;
    flex-direction: column;
    .menu_icon_item {
      width: 100%;
      height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .menu_icon {
        font-size: 30px;
        color: gray;
        font-weight: 700;
      }
    }

    .menu_icon_item_active {
      background: rgba(65, 132, 187, 0.2);
      .menu_icon {
        font-size: 30px;
        color: rgb(2, 77, 137);
      }
    }
  }

  .menu-title-enter-active {
    animation: menu-list-unfold-in 0.2s linear both;
  }

  @keyframes menu-list-unfold-in {
    0% {
      width: 60px;
    }
    100% {
      width: 250px;
    }
  }

  .menu-icon-enter-active {
    animation: menu-icon-unfold-in 0.2s linear both;
  }

  @keyframes menu-icon-unfold-in {
    0% {
      width: 250px;
    }
    100% {
      width: 60px;
    }
  }
}
</style>
