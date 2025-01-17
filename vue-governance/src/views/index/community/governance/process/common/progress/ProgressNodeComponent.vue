<template>
  <div
    :class="{
      progress_node_outer_accept_panel: status === 0,
      progress_node_outer_hand_panel: status === 1,
      progress_node_outer_finish_panel: status === 2,
    }"
    :style="{ height, width }"
  >
    <div class="area_panel">
      {{ area.name }}
    </div>
    <div class="user_panel">
      <div class="profile_panel">
        <img class="profile_img" :src="$StaticResourceAddress + user.profile" />
      </div>
      <div class="user_info_panel">
        <div class="username_panel">
          <span class="username_span">{{ user.username }}</span>
          <div
            :class="{
              accept_tag: status === 0,
              hand_tag: status === 1,
              finish_tag: status === 2,
            }"
          ></div>
        </div>
        <div class="phone_number_panel">{{ user.phoneNumber }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressNodeComponent",
  inject: ["getGraph", "getNode"],
  computed: {
    // 节点的全部信息
    nodeData() {
      return this.getNode().getData();
    },
    participant(){
      return this.getNode().getData().participant;
    },
    height() {
      return this.nodeData.height + "px";
    },
    width() {
      return this.nodeData.width + "px";
    },
    status() {
      return this.participant.status;
    },

    area() {
      return this.participant.area;
    },
    user() {
      return this.participant.user;
    },
  },
};
</script>

<style lang="less" scoped>
.progress_node_outer_panel {
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .area_panel {
    height: 30px;
    font-size: 18px;
    font-weight: 700;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .user_panel {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .profile_panel {
      height: 100%;
      width: 65px;

      .profile_img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .user_info_panel {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;

      .username_panel {
        flex: 3;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 5px;

        .username_span {
          font-size: 18px;
        }

        .status_tag {
          width: 45px;
          height: 20px;
          margin-left: 10px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          border-radius: 5px;
        }

        .hand_tag {
          .status_tag();
          color: #409eff;
          border: 1px solid #d9ecff;
          background-color: #ecf5ff;

          &::after {
            content: "进行中";
            font-weight: 700;
          }
        }

        .finish_tag {
          .status_tag();
          background-color: #f0f9eb;
          border-color: #e1f3d8;
          color: #67c23a;

          &::after {
            content: "已完成";
            font-weight: 700;
          }
        }

        .accept_tag {
          .status_tag();
          background-color: #f4f4f5;
          border-color: #e9e9eb;
          color: #909399;
          &::after {
            content: "待接收";
            font-weight: 700;
          }
        }
      }

      .phone_number_panel {
        flex: 2;
        font-size: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.progress_node_outer_accept_panel {
  .progress_node_outer_panel();
  color: white;
  border: 2px solid white;
  background: rgba(255, 255, 255, 0.2);

  .area_panel {
    border-bottom: 2px solid white;
  }
  .user_info_panel {
    border-left: 2px solid white;
  }
}

.progress_node_outer_hand_panel {
  .progress_node_outer_panel();
  color: rgb(80, 166, 255);
  border: 2px solid rgb(80, 166, 255);
  background: rgba(80, 166, 255, 0.2);
  animation: breathing 2s ease-in-out infinite;

  @keyframes breathing {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }

  .area_panel {
    border-bottom: 2px solid rgb(80, 166, 255);
  }
  .user_info_panel {
    border-left: 2px solid rgb(80, 166, 255);
  }
}

.progress_node_outer_finish_panel {
  .progress_node_outer_panel();
  color: rgb(103, 194, 58);
  border: 2px solid rgb(103, 194, 58);
  background: rgba(103, 194, 58, 0.2);
  .area_panel {
    border-bottom: 2px solid rgb(103, 194, 58);
  }
  .user_info_panel {
    border-left: 2px solid rgb(103, 194, 58);
  }
}
</style>
