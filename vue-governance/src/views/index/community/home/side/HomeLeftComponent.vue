<template>
  <div class="home_left_panel">
    <div class="home_left_content_panel">
      <ArchPanelComponent style="flex:1;margin-bottom: 10px;position: static;width: 80%" title=" 社区概况"
                          position="left" height="300px">
        <template slot="content">
          <div class="home_situation_panel">
            <div class="home_situation_img_panel">
              <el-image :src="$StaticResourceAddress+'/img/home/situation.png'"
                        style="height: 100%;width: 100%"></el-image>
            </div>

            <div class="home_situation_text_panel">
              解放路街道，地处历下区中西部，东与建新街道相连，东南与文化东路街道交界，西南与千佛山街道办事处为邻，西与大明湖街道毗连，北与东关街道接壤。辖区总面积2.06平方千米。截至2019年，解放路街道辖区居民人口44591人。
            </div>
          </div>
        </template>
      </ArchPanelComponent>
      <ArchPanelComponent style="margin-bottom: 10px;position: static;width: 80%" height="270px" title="社区活动"
                          position="left">
        <template slot="content">
          <!--                   <div class="activity_panel">-->
          <!--                       <div class="activity_img_panel">-->
          <!--                           <el-image  :src="$StaticResourceAddress+'/img/tuanjian.png'" style="height: 100%;width: 100%"></el-image>-->
          <!--                       </div>-->
          <!--                       <div class="activity_text_panel">-->
          <!--                           <div class="activity_text_title_panel">-->
          <!--                               社区团建活动-->
          <!--                           </div>-->
          <!--                           <div class="activity_text_content_panel">-->
          <!--                               为促进社区志愿者间的相互了解。以提高志愿者队伍的默契...-->
          <!--                           </div>-->
          <!--                       </div>-->

          <!--                   </div>-->
          <div class="activity_panel">
            <div class="activity_img_panel">
              <el-image :src="$StaticResourceAddress+'/img/home/zhongqiu.png'"
                        style="height: 100%;width: 100%"></el-image>
            </div>
            <div class="activity_text_panel">
              <div class="activity_text_title_panel">
                社区中秋晚会
              </div>
              <div class="activity_text_content_panel">
                为居民们营造温馨的社区氛围，共同度过一个美好的中秋...
              </div>
            </div>

          </div>

          <div class="activity_panel">
            <div class="activity_img_panel">
              <el-image :src="$StaticResourceAddress+'/img/home/bahe.png'" style="height: 100%;width: 100%"></el-image>
            </div>
            <div class="activity_text_panel">
              <div class="activity_text_title_panel">
                社区拔河比赛
              </div>
              <div class="activity_text_content_panel">
                为展示激昂奋进精神风采，增进社区凝聚力，促进身心健康发展...
              </div>
            </div>

          </div>
        </template>
      </ArchPanelComponent>
      <ArchPanelComponent style="position: static;width: 80%" height="300px" title="路口监控" position="left">
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
              <video class="monitor_video" autoplay muted loop :src="$StaticResourceAddress+'/monitor/demo1.mp4'"></video>
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
  height: 100%;
  display: flex;
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
  font-size: 16px;
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
