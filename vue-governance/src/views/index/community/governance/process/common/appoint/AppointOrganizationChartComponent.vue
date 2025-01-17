<template>
  <div
    class="appoint_graph_container_panel"
    ref="appoint_graph_container_panel"
  ></div>
</template>

<script>
import { Graph } from "@antv/x6";
import dagre from "dagre";
import * as _ from "lodash";
import { mapState } from "vuex";
import AppointAreaNodeComponent from '@/views/index/community/governance/process/common/appoint/AppointAreaNodeComponent'
import AppointUserNodeComponent from '@/views/index/community/governance/process/common/appoint/AppointUserNodeComponent'


export default {
  name: "AppointOrganizationChartComponent",
  props: ["areaInfoList", "selectedParticipantList"],
  data() {
    return {
      cell: {
        nodes: [],
        edges: [],
      },
      areaNodeShape: {
        width: 170,
        height: 80,
      },
      userNodeShape: {
        width: 150,
        height: 200,
      },

      recommendUserIdList: [],
    };
  },

  methods: {
    initComp() {
      this.initCanvas();
    },

    //第一次加载时初始化画布
    initCanvas() {
      this.registerComponents();
      this.initGraph();
      this.initCell();
      this.draw();
      this.autoFill();
    },

    registerComponents() {

      this.cancelledComponents()
      // 注册自定义节点
      // 注册地区节点
      Graph.registerNode("appoint-area-node", {
        inherit: "vue-shape",
        width: this.areaNodeShape.width,
        height: this.areaNodeShape.height,
        component: {
          template: `<appoint-area-node-component />`,
          components: {
            AppointAreaNodeComponent,
          },
        },
      });

      // 注册用户节点
      Graph.registerNode("appoint-user-node", {
        inherit: "vue-shape",
        width: this.userNodeShape.width,
        height: this.userNodeShape.height,
        component: {
          template: `<appoint-user-node-component />`,
          components: {
            AppointUserNodeComponent,
          },
        },
      });

      // 注册自定义边
      Graph.registerEdge(
        "org-edge",
        {
          zIndex: -1,
          attrs: {
            line: {
              strokeWidth: 2,
              stroke: "#A2B1C3",
              sourceMarker: null,
              targetMarker: null,
            },
          },
        },
        true
      );
    },

    cancelledComponents(){
      Graph.unregisterNode("appoint-area-node");
      Graph.unregisterNode("appoint-user-node");
      Graph.unregisterNode("org-edge");
    },


    //初始化画布
    initGraph() {
      this.graph = new Graph({
        container: this.$refs["appoint_graph_container_panel"],
        panning: {
          enabled: true,
        },
        interacting: false,
      });
      this.graph.enableMouseWheel();
      this.graph.zoom(-0.15);
    },

    // 根据areaList初始格式化点和边的信息
    initCell() {
      //清空已添加的节点和边
      this.cell.nodes = [];
      this.cell.edges = [];
      this.areaInfoList.forEach((area) => {
        // 加入area节点
        this.cell.nodes.push({
          id: "area_" + area.id,
          shape: "appoint-area-node",

          data: {
            width: this.areaNodeShape.width,
            height: this.areaNodeShape.height,
            areaInfo: area,
            ifSelected: false,
            selectAreaCallBack: this.selectAreaCallBack,
            unSelectAreaCallBack: this.unSelectAreaCallBack,
          },
        });

        // 非根节点
        if (!area.ifRoot) {
          // 加入边
          this.cell.edges.push({
            id: "edge_" + "area_" + area.superAreaId + "_area_" + area.id,
            source: "area_" + area.superAreaId,
            target: "area_" + area.id,
            shape: "org-edge",
          });

          // 加入user节点
          const recommendUserId = _.maxBy(
            area.adminUser,
            (user) => user.recommendFactor.score
          )?.id;
          if (!_.isUndefined(recommendUserId)) {
            this.recommendUserIdList.push(recommendUserId);
          }
          area.adminUser.forEach((user) => {
            this.cell.nodes.push({
              id: "user_" + user.id,
              shape: "appoint-user-node",
              data: {
                width: this.userNodeShape.width,
                height: this.userNodeShape.height,
                userInfo: user,
                ifRecommend: user.id === recommendUserId,
                ifSelected: false,
                selectUserCallBack: this.selectUserCallBack,
                unSelectUserCallBack: this.unSelectUserCallBack,
              },
            });

            this.cell.edges.push({
              id: "edge_" + "area_" + area.superAreaId + "_user_" + user.id,
              source: "area_" + area.id,
              target: "user_" + user.id,
              shape: "org-edge",
            });
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
      this.layout("TB");
      this.graph.centerContent();
    },

    // 自动布局函数
    layout(dir = "LR") {
      const nodes = this.graph.getNodes();
      const edges = this.graph.getEdges();
      const g = new dagre.graphlib.Graph();
      g.setGraph({ rankdir: dir, nodesep: 25, ranksep: 35 });
      g.setDefaultEdgeLabel(() => ({}));
      nodes.forEach((node) => {
        if (node.store.data.shape === "appoint-area-node") {
          g.setNode(node.id, {
            width: this.areaNodeShape.width,
            height: this.areaNodeShape.height,
          });
        } else if (node.store.data.shape === "appoint-user-node") {
          g.setNode(node.id, {
            width: this.userNodeShape.width,
            height: this.userNodeShape.height,
          });
        }
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

    autoFill() {
      this.selectedParticipantList.forEach((participant) =>
        this.selectUserCallBack({ id: participant.userId })
      );
      // if (this.selectedParticipantList.length === 0) {
      //   this.recommendFill();
      // } else {
      //   this.selectedParticipantList.forEach(participant =>
      //     this.selectUserCallBack({ id: participant.userId })
      //   );
      // }
    },

    recommendFill() {
      this.recommendUserIdList.forEach((userId) =>
        this.selectUserCallBack({ id: userId })
      );
      this.$message.success("成功应用推荐委派方案");
    },

    // 选择用户回调函数
    selectUserCallBack(userInfo) {
      const areaInfo = this.areaInfoList.find(
        (item) =>
          item.adminUser.findIndex((user) => user.id === userInfo.id) !== -1
      );
      const participant = this.selectedParticipantList.find(
        (item) => item.areaId === areaInfo.id
      );
      if (participant) {
        // 更换选择对象
        participant.userId = userInfo.id;
      } else {
        // 添加选择地区和对象
        this.selectedParticipantList.push({
          areaId: areaInfo.id,
          userId: userInfo.id,
        });
      }
      this.graphShader();
    },

    unSelectUserCallBack(userInfo) {
      const areaInfo = this.areaInfoList.find(
        (item) =>
          item.adminUser.findIndex((user) => user.id === userInfo.id) !== -1
      );
      const index = this.selectedParticipantList.findIndex(
        (item) => item.areaId === areaInfo.id
      );
      // 删除
      this.selectedParticipantList.splice(index, 1);
      this.graphShader();
    },

    selectAreaCallBack(areaInfo) {
      const participant = this.selectedParticipantList.find(
        (item) => item.areaId === areaInfo.id
      );
      if (!participant) {
        // 添加
        const userId = areaInfo.adminUser.find(
          (user) =>
            this.recommendUserIdList.findIndex((id) => id === user.id) !== -1
        ).id;
        this.selectedParticipantList.push({
          areaId: areaInfo.id,
          userId: userId,
        });
      }
      this.graphShader();
    },

    unSelectAreaCallBack(areaInfo) {
      const index = this.selectedParticipantList.findIndex(
        (item) => item.areaId === areaInfo.id
      );
      if (index !== -1) {
        this.selectedParticipantList.splice(index, 1);
      }
      this.graphShader();
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
  },

  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
  },

  mounted() {
    this.$nextTick(() => this.initComp());
  },

  
  beforeDestroy() {
    this.cancelledComponents()
  },


};
</script>

<style lang="less" scoped>
.appoint_graph_container_panel {
  width: 100%;
  height: 100%;
  // background: pink;
}
</style>
