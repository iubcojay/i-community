<template>
  <div class="progress_outer_panel">
    <div class="progress_chart_panel" ref="progress_chart_panel"></div>
    <div class="progress_detail_mask_panel" v-show="ifProgressDetailPanelShow">
      <transition name="progress-detail">
        <div
          class="progress_detail_panel"
          v-if="ifProgressDetailPanelShow"
        >
        <progress-detail-component :interview-info="selectedParticipant.interviewInfo" :close-detail-panel="()=>{ifProgressDetailPanelShow = false}"></progress-detail-component>

      </div>
      </transition>
    </div>
  </div>
</template>

<script>
import insertCss from "insert-css";
import { Graph } from "@antv/x6";
import dagre from "dagre";
import * as _ from "lodash";
import { mapState } from "vuex";
import ProgressNodeComponent from '@/views/index/community/governance/process/common/progress/ProgressNodeComponent'
import ProgressGridNodeComponent from '@/views/index/community/governance/process/common/progress/ProgressGridNodeComponent'
import ProgressDetailComponent from '@/views/index/community/governance/process/common/progress/ProgressDetailComponent'

export default {
  name: "ProgressChartComponent",
  props: ["task"],
  inject: ["showGridManPath"],
  components:{ProgressDetailComponent},
  data() {
    return {
      cell: {
        nodes: [],
        edges: [],
      },
      progressNodeShape: {
        width: 190,
        height: 100,
      },
      ifProgressDetailPanelShow: false,
      selectedParticipant:undefined
    };
  },

  methods: {
    initComp() {
      this.insertLineStyle();
      this.initCanvas();
    },

    insertLineStyle() {
      this.tempLineStyle = insertCss(`
        @keyframes flow-line {
          to {
              stroke-dashoffset: -1000
          }
        }
      `);
    },

    //第一次加载时初始化画布
    async initCanvas() {
      this.registerComponents();
      this.initGraph();
      await this.initCell();
      this.draw();
    },

    registerComponents() {
      this.cancelledComponents();
      // 注册自定义节点
      // 注册地区节点
      Graph.registerNode("progress-node", {
        inherit: "vue-shape",
        width: this.progressNodeShape.width,
        height: this.progressNodeShape.height,
        component: {
          template: `<progress-node-component/>`,
          components: {
            ProgressNodeComponent,
          },
        },
      });

      Graph.registerNode("progress-grid-node", {
        inherit: "vue-shape",
        width: this.progressNodeShape.width,
        height: this.progressNodeShape.height,
        component: {
          template: `<progress-grid-node-component/>`,
          components: {
            ProgressGridNodeComponent,
          },
        },
      });

      // 注册自定义边
      Graph.registerEdge("pending-edge", {
        zIndex: -1,
        attrs: {
          line: {
            stroke: "white",
            strokeDasharray: 5,
            targetMarker: "classic",
            style: {
              animation: "flow-line 70s infinite linear",
            },
          },
        },
      });

      Graph.registerEdge("finish-edge", {
        zIndex: 1,
        attrs: {
          line: {
            stroke: "rgb(103,194,71)",
          },
        },
      });
    },

    cancelledComponents() {
      Graph.unregisterNode("progress-node");
      Graph.unregisterNode("progress-grid-node");
      Graph.unregisterEdge("pending-edge");
      Graph.unregisterEdge("finish-edge");
    },

    //初始化画布
    initGraph() {
      this.graph = new Graph({
        container: this.$refs["progress_chart_panel"],
        panning: {
          enabled: true,
        },
        interacting: false,
      });
      this.graph.enableMouseWheel();
    },

    // 根据areaList初始格式化点和边的信息
    async initCell() {
      //清空已添加的节点和边
      this.cell.nodes = [];
      this.cell.edges = [];

      // 填充参与者信息
      let filledParticipantList = [];
      let participantList = _.cloneDeep(this.task.participantInfo);
      for (let participant of participantList) {
        const { data: area } = await this.$axios.post(
          "/area/getAreaById",
          this.$common.packagingAxiosParam({ id: participant.areaId })
        );
        const { data: user } = await this.$axios.post(
          "/user/getUserById",
          this.$common.packagingAxiosParam({ id: participant.userId })
        );
        filledParticipantList.push({
          area,
          user,
          ...participant,
        });
      }

      filledParticipantList.forEach((filledParticipant) => {
          console.log("filled",filledParticipant)
        if ((filledParticipant.area.type === 4 && filledParticipant.result !== "已到达现场并已完成疏散人群和清理消防通道") && filledParticipant.user.id !== 17) {
          // 加入网格员节点，特殊处理
          this.cell.nodes.push({
            id: "progress_" + filledParticipant.area.id,
            shape: "progress-grid-node",

            data: {
              width: this.progressNodeShape.width,
              height: this.progressNodeShape.height,
              participant: filledParticipant,
              progressPathCallback: this.progressPathCallback,
              progressPathBuildingCallback: this.progressPathBuildingCallback,
            },
          });
        } else {
          // 加入节点
          this.cell.nodes.push({
            id: "progress_" + filledParticipant.area.id,
            shape: "progress-node",

            data: {
              width: this.progressNodeShape.width,
              height: this.progressNodeShape.height,
              participant: filledParticipant,
            },
          });
        }

        if (filledParticipant.area.superAreaId) {
          this.cell.edges.push({
            id:
              "edge_" +
              filledParticipant.area.superAreaId +
              "_" +
              filledParticipant.area.id,
            source: "progress_" + filledParticipant.area.superAreaId,
            target: "progress_" + filledParticipant.area.id,
            shape:
              filledParticipant.status !== 0 ? "finish-edge" : "pending-edge",
          });
        }
      });
    },

    // 绘制函数
    draw() {
      // 绘制节点
      this.cell.nodes.forEach((nodeInfo) => {
        this.graph.addNode(nodeInfo);
      });
      this.cell.edges.forEach((edgeInfo) => {
        this.graph.addEdge(edgeInfo);
      });

      // 自动布局
      this.layout("LR");
      this.graph.centerContent();
    },

    // 自动布局函数
    layout(dir = "LR") {
      const nodes = this.graph.getNodes();
      const edges = this.graph.getEdges();
      const g = new dagre.graphlib.Graph();
      g.setGraph({ rankdir: dir, nodesep: 25, ranksep: 150 });
      g.setDefaultEdgeLabel(() => ({}));
      nodes.forEach((node) => {
        g.setNode(node.id, {
          width: this.progressNodeShape.width,
          height: this.progressNodeShape.height,
        });
      });

      edges.forEach((edge) => {
        const source = edge.getSource();
        const target = edge.getTarget();
        g.setEdge(source.cell, target.cell);
      });

      dagre.layout(g);

      this.graph.freeze();
      g.nodes().forEach((id) => {
        const node = this.graph.getCell(id);
        if (node) {
          const pos = g.node(id);
          node.position(pos.x - 0.5 * pos.width, pos.y - 0.5 * pos.height);
        }
      });

      edges.forEach((edge) => {
        const source = edge.getSourceNode();
        const target = edge.getTargetNode();
        const sourceBBox = source.getBBox();
        const targetBBox = target.getBBox();
        if ((dir === "LR" || dir === "RL") && sourceBBox.y !== targetBBox.y) {
          const gap =
            dir === "LR"
              ? targetBBox.x - sourceBBox.x - sourceBBox.width
              : -sourceBBox.x + targetBBox.x + targetBBox.width;
          const fix = dir === "LR" ? sourceBBox.width : 0;
          const x = sourceBBox.x + fix + gap / 2;
          edge.setVertices([
            { x, y: sourceBBox.center.y },
            { x, y: targetBBox.center.y },
          ]);
        } else if (
          (dir === "TB" || dir === "BT") &&
          sourceBBox.x !== targetBBox.x
        ) {
          const gap =
            dir === "TB"
              ? targetBBox.y - sourceBBox.y - sourceBBox.height
              : -sourceBBox.y + targetBBox.y + targetBBox.height;
          const fix = dir === "TB" ? sourceBBox.height : 0;
          const y = sourceBBox.y + fix + gap / 2;
          edge.setVertices([
            { x: sourceBBox.center.x, y },
            { x: targetBBox.center.x, y },
          ]);
        } else {
          edge.setVertices([]);
        }
      });
      this.graph.unfreeze();
    },

    graphShader() {
      const nodes = this.graph.getNodes();
      const edges = this.graph.getEdges();
      const root = nodes.find((node) => node.id === "area_" + this.areaInfo.id);

      nodes.forEach((node) => {
        if (node.store.data.shape === "appoint-user-node") {
          // 用户节点
          if (
            this.selectedParticipantList.findIndex(
              (item) => "user_" + item.userId === node.id
            ) !== -1
          ) {
            // 选中
            node.setData({
              ifSelected: true,
            });
          } else {
            // 未选中
            node.setData({
              ifSelected: false,
            });
          }
        } else {
          // 地区
          if (
            this.selectedParticipantList.findIndex(
              (item) => "area_" + item.areaId === node.id
            ) !== -1
          ) {
            // 选中
            node.setData({
              ifSelected: true,
            });
          } else {
            // 未选中
            node.setData({
              ifSelected: false,
            });
          }
        }
      });

      edges.forEach((edge) => {
        const sourceId = edge.store.data.source.cell;
        const targetId = edge.store.data.target.cell;

        if (
          this.selectedParticipantList.findIndex(
            (participant) =>
              ("area_" + participant.areaId === sourceId &&
                "user_" + participant.userId === targetId) ||
              "area_" + participant.areaId === targetId
          ) !== -1
        ) {
          // 相关边
          // 设置颜色
          edge.attr("line/stroke", "rgb(33, 194, 237)");
          // 设置层级避免遮挡
          edge.toFront();
        } else {
          // 无关边
          // 还原颜色
          edge.attr("line/stroke", "#A2B1C3");
          // 还原层级
          edge.toBack();
        }
      });

      if (this.selectedParticipantList.length > 0) {
        root.setData({
          ifSelected: true,
        });
      } else {
        root.setData({
          ifSelected: false,
        });
      }
    },

    progressPathCallback(participant) {
      this.showGridManPath(participant);
    },

    progressPathBuildingCallback(participant) {
      this.selectedParticipant = participant;
      this.ifProgressDetailPanelShow = true;
    },
  },

  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
  },

  mounted() {
    this.$nextTick(() => this.initComp());
  },

  beforeDestroy() {
    this.cancelledComponents();
  },
};
</script>

<style lang="less" scoped>
.progress_outer_panel {
  position: relative;
  width: 100%;
  height: 100%;
  .progress_chart_panel {
    width: 100%;
    height: 100%;
  }

  .progress_detail_mask_panel {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);

    .progress_detail_panel {
      width: auto;
      height: auto;
    }
  }
}

.progress-detail-enter-active {
  animation: scale-in-center 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes scale-in-center {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
