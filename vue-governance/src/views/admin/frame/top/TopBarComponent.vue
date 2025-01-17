<template>
  <div class="top_bar_panel">
    <div class="top_menu_panel">
      <div class="menu_left_panel">
        <div v-if="!ifTitleTextShow" class="title_icon_panel">
          <i class="iconfont icon-data-admin icon_data_admin"></i>
        </div>

        <div v-if="ifTitleTextShow" class="title_text_panel">
          <i class="iconfont icon-data-admin icon_data_admin"></i>
          <div class="title_text">社会治理多源数据管理</div>
        </div>
      </div>
      <i class="iconfont icon-list icon_list" @click="handleListIconClick"></i>
      <div class="center_panel">
        <div class="top_menu_list_panel">
          <div
            v-for="menu of menuOptions"
            class="menu_item_panel"
            :class="{ menu_item_panel_active: menu.id === activeMenuIdList[0] }"
            :key="menu.id"
            @click="hanMenuItemClick(menu.id)"
          >
            <i class="iconfont" :class="menu.iconClass"></i>
            <span>{{ menu.title }}</span>
          </div>
        </div>
      </div>

      <div class="menu_right_panel">
        <div class="right_icon_panel">
          <i class="iconfont icon-log"></i>
          <i class="iconfont icon-alarm"></i>
          <i class="iconfont icon-shutdown" @click="exit"></i>
        </div>
        <div class="user_panel">
          <div class="profile_panel">
            <img :src="$StaticResourceAddress + '/img/profile/user_man.png'" />
          </div>
          <div class="user_info_panel">
            <div class="username_panel">{{ userInfo.username }}</div>
            <div class="phone_number_panel">{{ userInfo.phoneNumber }}</div>
          </div>
          <div class="icon_panel">
            <i class="iconfont icon-down icon_down"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "TopBarComponent",
  props: ["supData", "supMethods"],
  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
    menuOptions() {
      return this.supData.menuOptions;
    },
    activeMenuIdList() {
      return this.supData.activeMenuIdList;
    },

    changeFirstLevelMenu(){
      return this.supMethods.changeFirstLevelMenu;
    }
  },
  data() {
    return {
      ifTitleTextShow: true,
    };
  },
  methods: {
    handleListIconClick() {
      this.supMethods.toggleMenuStatus();
      this.ifTitleTextShow = !this.ifTitleTextShow;
    },

    exit() {
      this.$router.replace({ name: "login" });
    },

    hanMenuItemClick(firstLevelMenuId){
      this.changeFirstLevelMenu(firstLevelMenuId)
    }
  },
};
</script>

<style lang="less" scoped>
.top_bar_panel {
  width: 100%;
  height: 50px;
  .top_menu_panel {
    position: relative;
    height: 50px;
    width: 100%;
    background: rgb(2, 77, 137);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .menu_left_panel {
      color: white;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .title_text_panel {
        position: relative;
        width: 250px;
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow: hidden;
        .icon_data_admin {
          font-size: 20px;
          font-weight: 700;
          margin: 0 10px;
        }

        .title_text {
          white-space: nowrap;
          overflow: hidden;
          font-size: 20px;
          font-weight: 700;
        }
      }

      .title_icon_panel {
        width: 60px;
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .icon_data_admin {
          font-size: 20px;
          font-weight: 700;
        }
      }

      .text-title-enter-active {
        animation: text-title-show 0.2s linear both;
      }

      .text-title-leave-from {
        opacity: 0;
      }

      @keyframes text-title-show {
        0% {
          width: 60px;
        }

        100% {
          width: 250px;
        }
      }

      .icon-title-enter-active {
        animation: icon-title-show 0.2s linear both;
      }

      @keyframes icon-title-show {
        0% {
          width: 250px;
        }

        100% {
          width: 60px;
        }
      }
    }

    .icon_list {
      height: 50px;
      width: 50px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
      color: white;

      &:hover {
        cursor: pointer;
        i {
          font-size: 22px;
        }
      }

      i {
        font-size: 20px;
        color: white;
      }
    }

    .center_panel {
      height: 100%;
      flex: 1;

      .top_menu_list_panel {
        width: auto;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        padding: 0 10px;

        .menu_item_panel {
          height: 35px;
          width: 120px;
          margin: 0 10px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          color: white;
          padding: 0px 10px;

          &:hover {
            cursor: pointer;
            color: rgb(33, 194, 237);
          }

          i {
            margin-right: 10px;
            font-size: 18px;
          }

          span {
            font-size: 18px;
          }
        }
        .menu_item_panel_active {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          color: rgb(33, 194, 237);
        }
      }
    }

    .menu_right_panel {
      height: 100%;
      width: auto;
      display: flex;
      flex-direction: row;
      align-items: center;

      .right_icon_panel {
        height: 100%;
        width: auto;
        display: flex;
        flex-direction: row;
        align-items: center;

        i {
          width: 30px;
          height: 30px;
          color: white;
          font-size: 18px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          margin: 0 10px;
          border-radius: 5px;
          box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1);
          background: rgb(27, 91, 145);
          &:hover {
            cursor: pointer;
          }
        }
      }

      .user_panel {
        box-shadow: -2px 0px 3px rgba(0, 0, 0, 0.1);

        height: 100%;
        width: auto;
        width: 220px;
        height: 100%;
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        padding: 0 10px;

        .profile_panel {
          width: 50px;
          height: 100%;
          border-radius: 25px;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;

          img {
            width: 80%;
            height: 80%;
            object-fit: cover;
          }
        }
        .user_info_panel {
          width: 100px;
          height: 100%;
          display: flex;
          flex-direction: column;
          font-size: 14px;
          color: white;
          margin: 0 10px;
          font-weight: 700;
          box-sizing: border-box;
          padding: 3px 0px;

          .username_panel {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
          }

          .phone_number_panel {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
          }
        }
        .icon_panel {
          height: 100%;
          width: 30px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;

          .icon_down {
            font-size: 20px;
            color: white;
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>
