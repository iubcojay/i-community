<template>
  <div
    class="area_node_outer_panel"
    ref="area_node_outer_panel"
    :class="{'area_node_outer_panel_active':ifSelected}"
    :style="{height,width}"
    @click="handleNodeClick"
  >
    <div class="wrap_panel" ref="wrap_panel">
      <div class="front_panel">
        <div class="profile_panel">
          <div class="profile_img_frame">
            <img class="profile_img" :src="$StaticResourceAddress +userInfo.profile" />
          </div>
        </div>
        <div class="user_name_panel">{{userInfo.username}}</div>
        <div class="info_panel">
          <div class="info_item_panel">
            <div class="value_panel" :style="{color:userInfo.sex===0?'rgb(255,53,139)':'rgb(230,162,60)'}">{{userInfo.sex === 0?'女':'男'}}</div>
            <div class="key_panel">性别</div>
          </div>
          <div class="info_item_panel">
            <div class="value_panel">{{userInfo.age}}</div>
            <div class="key_panel">年龄</div>
          </div>
          <div class="info_item_panel">
            <div
              class="value_panel"
              :style="{'color':ifRecommend?'rgb(33, 194, 237)':'white'}"
            >{{userInfo.recommendFactor.score}}</div>
            <div class="key_panel">推荐</div>
          </div>
        </div>
      </div>

      <div class="back_panel">
        <div class="recommend_item_panel">
          <div class="recommend_item_key_panel">历史匹配率</div>
          <div class="recommend_item_value_panel">{{userInfo.recommendFactor.thm}}</div>
        </div>
        <div class="recommend_item_panel">
          <div class="recommend_item_key_panel">历史完成率</div>
          <div class="recommend_item_value_panel">{{userInfo.recommendFactor.tcr}}</div>
        </div>
        <div class="recommend_item_panel">
          <div class="recommend_item_key_panel">响应时间(时)</div>
          <div class="recommend_item_value_panel">{{userInfo.recommendFactor.atrt}}</div>
        </div>
        <div class="recommend_item_panel">
          <div class="recommend_item_key_panel">工龄(年)</div>
          <div class="recommend_item_value_panel">{{userInfo.recommendFactor.seniority}}</div>
        </div>
        <div class="recommend_item_panel">
          <div class="recommend_item_key_panel">推荐指数</div>
          <div class="recommend_item_value_panel">{{userInfo.recommendFactor.score}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppointUserNodeComponent",
  inject: ["getGraph", "getNode"],
  data() {
    return {
      // 是否被选择
      ifSelected: false
    };
  },
  computed: {
    // 节点的全部信息
    nodeData() {
      return this.getNode().getData();
    },
    height() {
      return this.nodeData.height + "px";
    },
    width() {
      return this.nodeData.width + "px";
    },

    // 用户信息
    userInfo() {
      return this.nodeData.userInfo;
    },

    // 选择回调函数
    selectUserCallBack() {
      return this.nodeData.selectUserCallBack;
    },

    //  取消选择回调函数
    unSelectUserCallBack() {
      return this.nodeData.unSelectUserCallBack;
    },

    // 是否为推荐节点
    ifRecommend() {
      return this.nodeData.ifRecommend;
    }
  },

  methods: {
    initComp() {
      this.setNodeData();
      const areaNodeOuterPanel = this.$refs['area_node_outer_panel']
      const wrapPanel = this.$refs['wrap_panel']
      areaNodeOuterPanel.addEventListener("mouseenter", () => {
        wrapPanel.classList.add("wrap_panel_hover");
      });

      areaNodeOuterPanel.addEventListener("mouseleave", () => {
        wrapPanel.classList.remove("wrap_panel_hover");
      });

    },
    setNodeData() {
      const nodeData = this.getNode().getData();

      this.ifSelected = nodeData.ifSelected;
      this.getNode().on("change:data", ({ current }) => {
        this.ifSelected = current.ifSelected;
      });
    },
    handleNodeClick() {
      if (this.ifSelected) {
        this.unSelectUserCallBack(this.userInfo);
      } else {
        this.selectUserCallBack(this.userInfo);
      }
    }
  },
  mounted() {
    this.initComp();
  }
};
</script>

<style lang="less" scoped>
.area_node_outer_panel {
  border: 2px solid white;
  border-radius: 5px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.2);
  
  .wrap_panel {
    position: relative;
    height: 100%;
    width: 100%;
    transform-style: preserve-3d;
    transition: transform 0.5s;

    .front_panel {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 2;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;

      .profile_panel {
        width: 100%;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .profile_img_frame {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid white;
          overflow: hidden;

          .profile_img {
            height: 100%;
            width: 100%;
            object-fit: cover;
          }
        }
      }

      .user_name_panel {
        position: relative;
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: white;
        font-size: 20px;

        &::after {
          position: absolute;
          content: "";
          width: 90%;
          height: 3px;
          left: 5%;
          bottom: 3px;
          background: white;
        }
      }

      .info_panel {
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        .info_item_panel {
          width: 40px;
          height: 50px;
          display: flex;
          flex-direction: column;

          .value_panel {
            height: 35px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 20px;
          }

          .key_panel {
            width: 100%;
            height: 15px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            color: rgba(255, 255, 255, 0.8);
            font-size: 13px;
          }
        }
      }
    }

    .back_panel {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      transform: rotateY(180deg);
      backface-visibility: hidden;
      display: flex;
      flex-direction: column;

      .recommend_item_panel {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 0 5px;

        &:not(:last-child) {
          &::after {
            content: "";
            position: absolute;
            width: calc(100% - 4px);
            height: 2px;
            left: 2px;
            bottom: 2px;
            background: white;
          }
        }

        .recommend_item_key_panel {
          height: 100%;
          flex: 1;
          color: rgba(255, 255, 255, 0.8);
          font-size: 15px;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .recommend_item_value_panel {
          height: 100%;
          width: 30px;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
          font-size: 18px;
          font-weight: 700px;
          color: white;
        }

        &:last-child {
          .recommend_item_key_panel {
            color: rgba(255, 255, 255, 1);
            font-size: 18px;
          }

          .recommend_item_value_panel {
            font-size: 20px;
            font-weight: 700px;
            color: rgb(33, 194, 237);
          }
        }
      }
    }
  }

  .wrap_panel_hover {
    transform: rotateY(180deg);
    cursor: pointer;
  }
}

.area_node_outer_panel_active {
  border: 2px solid rgb(33, 194, 237);
  background: rgba(33, 194, 237, 0.2);
}
</style>