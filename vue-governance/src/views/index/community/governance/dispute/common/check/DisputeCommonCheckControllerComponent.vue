<template>
  <div class="dispute-outer-container">
    <SideBarComponent>
      <DisputeCommonCheckLeftComponent v-show="ifSideBarShow.ifLeftPanelShow" slot="leftPanel"/>
      <DisputeCommonCheckRightComponent v-show="ifSideBarShow.ifRightPanelShow" slot="rightPanel"
                                        :incidents="incidents" :highlightIncident="highlightIncident"/>
    </SideBarComponent>
    <div class="pin-container" v-show="incidentsShow">
      <DisputeIncident v-for="incident of incidents" :key="incident.id" :incident="incident"
                       :isFocus="focusIncidentId === incident.id"/>
    </div>
  </div>
</template>

<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";
import DisputeCommonCheckLeftComponent
  from "@/views/index/community/governance/dispute/common/check/side/DisputeCommonCheckLeftComponent.vue";
import DisputeCommonCheckRightComponent
  from "@/views/index/community/governance/dispute/common/check/side/DisputeCommonCheckRightComponent.vue";
import {v1 as uuid} from "uuid";
import DisputeIncident from "@/views/index/community/governance/dispute/common/check/info/DisputeIncident.vue";

export default {
  name: "DisputeCommonCheckControllerComponent",
  components: {
    DisputeIncident,
    DisputeCommonCheckRightComponent,
    DisputeCommonCheckLeftComponent,
    SideBarComponent
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false
      },
      incidentsShow: false,
      incidents: [],
      focusIncidentId: undefined
    }
  },
  methods: {
    async initComp() {
      this.incidentsShow = false;
      this.setSideBarShowStatus(false, true);
      await this.getDisputeIncidents();
      await this.initCamera();
      this.incidentsShow = true;
    },

    initCamera() {
      return new Promise((resolve) => {
        const viewer = window.myEarth.viewer;
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(117.04295, 36.66245, 349.27),  // 目标位置
          orientation: {
            heading: Cesium.Math.toRadians(357),  // 视角方向（朝北）
            pitch: Cesium.Math.toRadians(-65),  // 俯仰角度（视线向下 45 度）
            roll: 0  // 滚动角度
          },
          duration: 2,// 飞行的持续时间，单位为秒
          complete: () => {
            resolve(1);
          }
        });
      })
    },

    setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
      this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow
      this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow
    },

    async getDisputeIncidents() {
      this.incidents = [
        {
          id: uuid(),
          title: "装修噪音扰民纠纷",
          description: "李先生投诉楼上邻居在晚上10点后进行装修，发出巨大噪音，严重影响了家人休息。邻居表示白天工作繁忙，只有晚上有时间进行装修。双方因沟通不畅发生争执。",
          result: "社区调解员介入后，双方达成协议，楼上邻居将装修时间调整至下午6点之前，并在必要时安装隔音措施。",
          img: this.$StaticResourceAddress + "/img/dispute/noise.png",
          position: {longitude: 117.0419016, latitude: 36.6644693, altitude: 23.67},
          date: new Date()
        },
        {
          id: uuid(),
          title: "水管漏水责任纠纷",
          description: "吴女士的房屋因楼上刘先生家中的水管破裂而遭受严重水渍损害。吴女士要求刘先生赔偿维修费用，但刘先生认为责任在于老旧管道，双方因赔偿问题争执不下。",
          result: "社区调解员联系了物业公司进行评估，确认管道问题属刘先生责任，最终双方同意由刘先生承担部分维修费用，物业也承诺在未来进行管道检修以避免类似事件。",
          img: this.$StaticResourceAddress + "/img/dispute/water.png",
          position: {longitude: 117.0422991, latitude: 36.6638074, altitude: 21.52},
          date: new Date()
        },
        {
          id: uuid(),
          title: "垃圾分类纠纷",
          description: "王先生多次发现邻居李女士未按规定进行垃圾分类，导致垃圾桶污染，影响全体居民的垃圾处理。王先生在小区群里公开指责李女士，双方言语激烈，甚至发生面对面争吵。",
          result: "居委会调解员出面调和，安排社区志愿者进行垃圾分类培训，并安装摄像头进行监督。李女士承认错误并表示今后会遵守分类规定，双方关系有所缓和。",
          img: this.$StaticResourceAddress + "/img/dispute/trash.png",
          position: {longitude: 117.0413931, latitude: 36.6633376, altitude: 3.69},
          date: new Date()
        },
        {
          id: uuid(),
          title: "停车位占用纠纷",
          description: "张女士发现小区内唯一的公共停车位长期被邻居王先生占用，且王先生将私人物品放置在车位上以防其他住户使用。张女士多次交涉未果，愤而向物业投诉",
          result: "物业管理部门安排了多次调解，最终王先生同意移除私人物品，并与其他住户合理共享车位，物业也计划新增临时停车位。",
          img: this.$StaticResourceAddress + "/img/dispute/park.png",
          position: {longitude: 117.0420470, latitude: 36.6630377, altitude: 4.75},
          date: new Date()
        },
      ]
    },

    highlightIncident(id) {
      this.focusIncidentId = id;
    }
  },
  mounted() {
    this.initComp();
  },

  beforeDestroy() {


  },

}
</script>

<style lang="less" scoped>
.dispute-outer-container {
  position: relative;
  width: 100%;
  height: 100%;

  .pin-container {
    position: relative;
    width: 100%;
    height: 100%
  }
}
</style>
