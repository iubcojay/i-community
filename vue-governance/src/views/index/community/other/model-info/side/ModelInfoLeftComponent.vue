<template>
  <div class="model_info_left_panel">
    <ArchPanelComponent style="margin-bottom: 10px;position: static;width: 60%" title=""
                        position="left" height="150px">
      <template slot="content">
        <div class="model_info_data_panel">
          <div class="model_info_img_panel">
            <el-image :src="$StaticResourceAddress+'/img/home/mianpian.png'"
                      style="height: 100%;width: 100%"></el-image>
          </div>
          <div class="model_info_text_panel">
            <div class="model_info_text_title">面片数量</div>
            <div class="model_info_text_content">
              1,320,347,896
            </div>
          </div>
        </div>
      </template>
    </ArchPanelComponent>
  </div>
</template>

<script>
import {mapState} from "vuex";
import ArchPanelComponent from "@/views/common/InfoPanel/sidepanel/ArchPanelComponent.vue";
import MyVideoPlayerComponent from "@/views/common/videoplayer/MyVideoPlayerComponent.vue";
import VueSeamlessScroll from 'vue-seamless-scroll'


export default {
  name: "ModelInfoLeftComponent",
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

<style scoped lang="less">
.model_info_left_panel {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: white;

  .model_info_data_panel {
    height: fit-content;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 30px;

    .model_info_img_panel {
      width: 60px;
      height: 60px;
    }

    .model_info_text_panel {
      .model_info_text_title {
        font-size: 22px;
        font-weight: bold;
      }

      .model_info_text_content {
        font-size: 20px;
      }
    }
  }
}

</style>
