<template>
  <div class="home_left_panel">
    <div class="home_left_content_panel">

      <ArchPanelComponent style="position: static;width: 99.9%" height="99%" title="路口监控" position="left">
        <template slot="content">
          <div class="home_monitor_panel">
            <div class="home_monitor_title_panel">
                            <span>
                                 <i class="iconfont icon-monitor"></i>
                                解放路-十亩园街
                            </span>
              <i class="iconfont icon-change"></i>
            </div>
            <div class="home_monitor_video_panel">
              <!-- <MyVideoPlayerComponent panel-id="home_monitor_video"
                                      :url="$StaticResourceAddress+'/monitor/demo1.mp4'"></MyVideoPlayerComponent> -->
              <video class="monitor_video" autoplay muted :src="$StaticResourceAddress+'/monitor/demo1.mp4'"></video>
            </div>
          </div>
        </template>
      </ArchPanelComponent>
    </div>

  </div>
</template>

<script>
import {mapState} from "vuex";
import ArchPanelComponent from "@/views/common/InfoPanel/sidepanel/ArchPanelComponent";
import MyVideoPlayerComponent from "@/views/common/videoplayer/MyVideoPlayerComponent";
import VueSeamlessScroll from 'vue-seamless-scroll'


export default {
  name: "HomeLeftComponent",
  components: {ArchPanelComponent, MyVideoPlayerComponent, VueSeamlessScroll},
  data() {
    return {}
  },
  methods: {
    initComp() {
    },
  },

  mounted() {
    this.initComp()
  }
}
</script>

<style scoped>
.home_left_panel {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: left;
}

.home_left_content_panel {
  position: absolute;
  top:420px;
  height: 47%;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  box-sizing: border-box;
}

.home_situation_panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.home_situation_img_panel {
  height: 120px;
  width: 100%;
  margin-bottom: 10px;
}


.home_situation_text_panel {
  color: rgba(255, 255, 255, 0.50);
  flex: 1;
  overflow: hidden;
  font-size: 15px;
}

.activity_panel {
  display: flex;
  flex-direction: row;
  margin: 10px 0px;
}

.activity_img_panel {
  width: 150px;
  height: 80px;
}

.activity_text_panel {
  color: white;
  flex: 1;
  margin-left: 18px;
}

.activity_text_title_panel {
  font-size: 18px;
}

.activity_text_content_panel {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.home_monitor_panel {
  display: flex;
  height: 100%;
  flex-direction: column;
  box-sizing: border-box;

  overflow: hidden;
}

.home_monitor_title_panel {
  height: 25px;
  color: white;
  box-sizing: border-box;
  padding-bottom: 5px;
  border-bottom: white 1px solid;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.monitor_video {
  width: 100%;
  height: 100%;

}

</style>
