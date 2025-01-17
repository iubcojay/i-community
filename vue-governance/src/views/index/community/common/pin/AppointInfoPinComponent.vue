<template>
  <div class="appoint_info_panel" :style="positionStyle">
    <div class="text_panel">
      <span class="area_name_panel">{{areaInfo.name}}</span>
      <span class="user_name_panel">{{`(${ifSelected?username:'未委派'})`}}</span>
    </div>
    <div :class="[ifSelected?'top_mark_panel_selected':'top_mark_panel_unselected']"></div>
  </div>
</template>

<script>
export default {
  name: "AppointInfoPinComponent",
  props: ["areaInfo", "selectedParticipantList"],
  data() {
    return {
      username: undefined,
      ifSelected: false
    };
  },
  computed: {
    positionStyle() {
      return {
        left: this.areaInfo.winPos[0] - 100 + "px",
        bottom: this.areaInfo.winPos[3] + "px"
      };
    }
  },
  watch: {
    selectedParticipantList: {
      deep: true,
      handler(selectedParticipantList) {
        const participant = selectedParticipantList.find(
          item => item.areaId === this.areaInfo.id
        );
        const model = window.myEarth.getEarthObjByRef(
          "area_" + this.areaInfo.id
        );
        if (participant) {
          this.username = this.areaInfo.adminUser.find(
            user => user.id === participant.userId
          ).username;
          model.color[3] = 0.7;
          this.ifSelected = true;
        } else {
          this.username = undefined;
          model.color[3] = 0.3;
          this.ifSelected = false;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.appoint_info_panel {
  width: 200px;
  height: 80px;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: rgba(24, 49, 85, 0.8);
  border-radius: 5px;

  &::before {
    content: "";
    position: absolute;
    border: 12px solid;
    border-color: rgba(24, 49, 85, 0.8) transparent transparent transparent;
    bottom: -24px;
    left: 100px - 12px;
  }

  .text_panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    .area_name_panel {
      font-size: 23px;
      font-weight: 700;
    }

    .user_name_panel {
      font-size: 18px;
      font-weight: 500;
    }
  }

  .top_mark_panel{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    
  }

  .top_mark_panel_selected {
    .top_mark_panel();
    background: green;
  }

  .top_mark_panel_unselected {
    .top_mark_panel();
    background: gray;

  }

  
}
</style>