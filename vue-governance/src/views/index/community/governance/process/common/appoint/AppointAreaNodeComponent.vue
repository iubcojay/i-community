<template>
  <div
    class="area_node_outer_panel"
    :class="{'area_node_outer_panel_active':ifSelected}"
    :style="{height,width}"
    @click="handleAreaNodeClick(areaInfo)"
    ref="area_node_outer_panel"
  >{{areaInfo.name}}</div>
</template>

<script>
export default {
  name: "AppointAreaNodeComponent",
  inject: ["getGraph", "getNode"],
  data() {
    return {
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
    areaInfo() {
      return this.nodeData.areaInfo;
    },

    selectAreaCallBack() {
      return this.nodeData.selectAreaCallBack;
    },

    unSelectAreaCallBack() {
      return this.nodeData.unSelectAreaCallBack;
    },
    ifRootNode() {
      return this.areaInfo.adminUser.length === 0;
    }
  },

  methods: {
    initComp() {
      this.setNodeData();
      this.setAreaNodeHoverListener();
    },
    setNodeData() {
      const nodeData = this.getNode().getData();
      this.ifSelected = nodeData.ifSelected;
      this.getNode().on("change:data", ({ current }) => {
        this.ifSelected = current.ifSelected;
      });
    },

    handleAreaNodeClick(areaInfo) {
      if (!this.ifRootNode) {
        if (this.ifSelected) {
          this.unSelectAreaCallBack(areaInfo);
        } else {
          this.selectAreaCallBack(areaInfo);
        }
      }
    },

    setAreaNodeHoverListener() {
      const areaNodeOuterPanel = this.$refs["area_node_outer_panel"];
      if (!this.ifRootNode) {
        areaNodeOuterPanel.addEventListener("mouseover", function() {
          areaNodeOuterPanel.classList.add("area_node_outer_panel_hover");
        });

        areaNodeOuterPanel.addEventListener("mouseout", function() {
          areaNodeOuterPanel.classList.remove("area_node_outer_panel_hover");
        });
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
  color: white;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.area_node_outer_panel_hover {
  cursor: pointer;
  border: 2px solid rgb(33, 194, 237);
}

.area_node_outer_panel_active {
  border: 2px solid rgb(33, 194, 237);
  background: rgba(33, 194, 237, 0.2);
}
</style>
