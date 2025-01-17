<template>
  <div class="facility_model_outer_panel">
    <div class="left_panel">
      <div class="top_panel">
        <div
          :class="{
            wrap_panel_left: selectedFacilityType === undefined,
            wrap_panel_right: selectedFacilityType !== undefined,
          }"
        >
          <div class="type_panel">
            <div
              v-for="typeInfo of facilityTypeList"
              :key="typeInfo.id"
              class="type_item_panel"
              @click="selectedFacilityType = typeInfo"
            >
              <i class="iconfont" :class="typeInfo.iconClass"></i>
              <span>{{ typeInfo.name }}</span>
              <i class="iconfont icon-arrow-right"></i>
            </div>
          </div>
          <div class="detail_panel">
            <div class="back_icon_panel" @click="handleBackClick">
              <i class="iconfont icon-arrow-right"></i>
            </div>
            <div class="facility_table_panel">
              <el-table
                :data="showFacilityList"
                style="width: 100%;"
                highlight-current-row
                max-height="400"
                @current-change="handleModelSelect"
              >
                <el-table-column label="图片" width="100">
                  <template slot-scope="scope">
                    <img
                      class="facility_picture_panel"
                      :src="$StaticResourceAddress + scope.row.picture"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="设施编号" min-width="200">
                  <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="模型格式" width="100">
                  <template slot-scope="scope">
                    <span>{{ scope.row.modelFormat }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="地理位置" width="150">
                  <template slot-scope="scope">
                    <div class="position_panel">
                      <span>{{ scope.row.position[0] }}</span>
                      <span>{{ scope.row.position[1] }}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom_panel">
        <div v-show="modelLoaderStatus === 0" class="no_text_panel">
          <i class="iconfont icon-json"></i>
          <span>模 型 源 数 据 展 示 区</span>
        </div>
        <div v-show="modelLoaderStatus === 1" class="no_text_panel">
          <el-skeleton
            style="
              width: 100%;
              height: 100%;
              padding: 15px;
              box-sizing: border-box;
            "
            :rows="8"
            animated
          />
        </div>
        <div v-if="modelLoaderStatus === 2" class="text_panel">
          <div class="text_top_panel">
            <div
              class="text_menu_panel"
              :class="{ text_menu_active: textMenuStatus === 0 }"
              @click="textMenuStatus = 0"
            >
              源数据
            </div>
            <div
              class="text_menu_panel"
              :class="{ text_menu_active: textMenuStatus === 1 }"
              @click="textMenuStatus = 1"
            >
              重构数据
            </div>
          </div>
          <div class="text_content_panel">
            <div
              :class="{
                text_content_wrap_panel_raw: textMenuStatus === 0,
                text_content_wrap_panel_object: textMenuStatus === 1,
              }"
            >
              <div class="raw_panel pretty_scrollbar">
                <vue-json-pretty
                  :deep="1"
                  :data="$data._selectedModelRawJson"
                  showIcon
                  showLineNumber
                  showLength
                />
              </div>
              <div class="object_panel pretty_scrollbar">
                <vue-json-pretty
                  :deep="1"
                  :data="$data._selectedModelObjectJson"
                  showIcon
                  showLineNumber
                  showLength
                  editableTrigger="dblclick"
                  @node-click="handleObjectNodeClick"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right_panel">
      <div v-show="modelLoaderStatus === 0" class="no_model_panel">
        <i class="iconfont icon-model"></i>
        <span>三 维 模 型 展 示 区</span>
      </div>
      <div v-show="modelLoaderStatus === 1" class="no_model_panel">
        <el-progress
          type="circle"
          :percentage="modelLoaderPercentage"
          style="margin-bottom: 20px;"
        ></el-progress>
        <span>模 型 加 载 中</span>
      </div>
      <div class="threejs_container" ref="threejsContainer"></div>
    </div>
  </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import FacilityModelScene from "@/assets/js/threejs/admin/facility/FacilityModelScene";
import * as _ from "lodash";

export default {
  name: "AdminFacilityModelComponent",
  components: { VueJsonPretty },
  data() {
    return {
      facilityList: [],
      facilityTypeList: [],
      modelLoaderStatus: 0,
      textMenuStatus: 0,
      selectedFacilityType: undefined,
      selectedFacility: undefined,
      modelLoaderPercentage: 0,
      _selectedModelRawJson: undefined,
      _selectedModelObjectJson: undefined,
    };
  },

  computed: {
    showFacilityList() {
      const showFacilityList = this.facilityList.filter(
        (facility) => facility.type === this.selectedFacilityType?.id
      );
      return showFacilityList;
    },
  },

  methods: {
    async initComp() {
      this.initThreeJsScene();
      await this.getFacilityTypeList();
      await this.getFacilityList();
      this.location();
    },

    initThreeJsScene() {
      this.threejsScene = new FacilityModelScene({
        container: this.$refs.threejsContainer,
        helperOptions: { gridHelper: false, axesHelper: false },
      });
    },

    async getFacilityTypeList(){
      const { data: facilityTypeList } = await this.$axios.post(
        "/admin/facilityType/list"
      );
     
      this.facilityTypeList = facilityTypeList;
    },

    async getFacilityList() {
      const { data: facilityList } = await this.$axios.post(
        "/admin/facility/list"
      );
      facilityList.forEach((facility) => {
        if (facility.position[0] > 0) {
          facility.position[0] = "东经 " + Math.abs(facility.position[0]) + "°";
        } else {
          facility.position[0] = "西经 " + Math.abs(facility.position[0]) + "°";
        }
        if (facility.position[1] > 0) {
          facility.position[1] = "北纬 " + Math.abs(facility.position[1]) + "°";
        } else {
          facility.position[1] = "南纬 " + Math.abs(facility.position[1]) + "°";
        }
      });
      this.facilityList = facilityList;
    },

    async handleModelSelect(row) {
      if (!_.isUndefined(row) && !_.isNull(row)) {
        this.selectedFacility = row;

        this.toModelLoadingStatus();

        await Promise.all([
          this.showModelTextContent(this.selectedFacility),
          this.showModel(this.selectedFacility),
        ]);

        this.toModelLoadedStatus();
      } else {
        this.toNoSelectedStatus();
      }
    },

    handleBackClick() {
      this.toNoSelectedStatus();
    },

    handleObjectNodeClick(nodeData) {
      if (nodeData.key === "id") {
        this.threejsScene.highLightObjectById(nodeData.content);
      } else if (nodeData.key === "name") {
        this.threejsScene.highLightObjectByName(nodeData.content);
      } else {
        this.threejsScene.unHighLightAll();
      }
    },

    async showModelTextContent(facility) {
      const { data: selectedModelJsonContent } = await this.$axios.get(
        facility.model
      );
      this.$data._selectedModelRawJson = selectedModelJsonContent;
    },

    async showModel(facility) {
      this.modelLoaderPercentage = 0;
      await this.threejsScene.addFocusModel(
        this.$StaticResourceAddress + facility.model,
        facility.modelFormat,
        facility.modelScale,
        (progress) => {
          this.modelLoaderPercentage = Math.round(progress * 100);
        }
      );

      this.$data._selectedModelObjectJson = this.shakeModelObject(
        this.threejsScene.focusModel
      );
    },

    toNoSelectedStatus() {
      this.selectedFacilityType = undefined;
      this.selectedFacility = undefined;
      this.$data._selectedModelRawJson = undefined;
      this.$data._selectedModelObjectJson = undefined;
      this.threejsScene.removeFocusModel();
      this.modelLoaderStatus = 0;
      this.textMenuStatus = 0;
    },

    toModelLoadingStatus() {
      this.modelLoaderStatus = 1;
    },

    toModelLoadedStatus() {
      this.modelLoaderStatus = 2;
    },

    shakeModelObject(modelObject) {
      const id = modelObject.uuid;
      const name = modelObject.name;
      const newModelObject = { id, name };

      const children = modelObject.children.map((child) =>
        this.shakeModelObject(child)
      );

      if (children.length > 0) {
        newModelObject.children = children;
      }
      return newModelObject;
    },

    location() {
      const facilityId = this.$route.params.facilityId;
      if (!_.isUndefined(facilityId)) {
        const targetFacility = this.facilityList.find(
          (facility) => facility.id === facilityId
        );
        if (!targetFacility) {
          this.$nextTick(() => {
            this.selectedFacilityType = targetFacility.type;
            this.handleModelSelect(targetFacility);
          });
        }
      }
    },
  },

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    this.threejsScene && this.threejsScene.clearScene();
    this.threejsScene = null;
  },
};
</script>

<style lang="less" scoped>
.facility_model_outer_panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  .left_panel {
    height: 100%;
    width: 600px;
    display: flex;
    flex-direction: column;

    .top_panel {
      width: 100%;
      height: 450px;
      background: white;
      margin-bottom: 15px;
      border-radius: 15px;
      overflow: hidden;

      .wrap_panel {
        height: 100%;
        width: 200%;
        left: 0;
        top: 0;
        display: flex;
        // transform: scaleX(-100%);
        flex-direction: row;
        transition: 0.3s all ease-in-out;

        .type_panel {
          width: 50%;
          height: 100%;
          box-sizing: border-box;
          padding: 10px;

          .type_item_panel {
            position: relative;
            width: 100%;
            height: 50px;
            border: 2px solid gainsboro;
            border-radius: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            color: rgb(2, 77, 137);
            margin: 10px 0px;
            box-sizing: border-box;
            padding: 0 10px;

            &:hover {
              cursor: pointer;
              border: 2px solid rgb(2, 77, 137);
              i {
                font-weight: 600;
              }

              span {
                font-weight: 600;
              }
              .icon-arrow-right {
                visibility: visible;
              }
            }

            i {
              font-size: 25px;
              font-weight: 500;
              margin-right: 10px;
            }

            span {
              font-size: 18px;
            }

            .icon-arrow-right {
              position: absolute;
              top: 0;
              bottom: 0;
              margin: auto;
              right: 10px;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              visibility: hidden;
            }
          }
        }

        .detail_panel {
          position: relative;
          width: 50%;
          height: 100%;
          box-sizing: border-box;
          padding: 10px;
          padding-top: 30px;

          .back_icon_panel {
            position: absolute;
            left: 10px;
            top: 10px;
            transform: rotate(180deg);

            &:hover {
              cursor: pointer;
              color: rgb(2, 77, 137);
              transform: scale(1.1) rotate(180deg);
            }

            i {
              font-size: 25px;
              font-weight: 600;
            }
          }

          .facility_table_panel {
            height: 100%;
            width: 100%;
            overflow: auto;

            &:hover {
              cursor: pointer;
            }

            .facility_picture_panel {
              width: 50px;
              height: 50px;
              object-fit: cover;
            }

            .position_panel {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: space-around;
            }
          }
        }
      }

      .wrap_panel_left {
        .wrap_panel();
        transform: translateX(0);
      }

      .wrap_panel_right {
        .wrap_panel();
        transform: translateX(-50%);
      }
    }

    .bottom_panel {
      position: relative;
      width: 100%;
      flex: 1;
      background: white;
      border-radius: 15px;
      overflow: hidden;

      .text_panel {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 5px;

        .text_top_panel {
          height: 40px;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          box-sizing: border-box;
          .text_menu_panel {
            width: 60px;
            color: rgb(2, 77, 137);
            padding: 5px 7px;
            font-size: 15px;
            font-weight: 500;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border-bottom: 2px solid rgb(2, 77, 137);

            &:hover:not(.text_menu_active) {
              color: rgb(2, 77, 137);
              font-weight: 700;
              cursor: pointer;
            }
          }

          .text_menu_active {
            background: rgb(2, 77, 137);
            color: white;
            font-weight: 700;
          }
        }

        .text_content_panel {
          position: relative;
          flex: 1;
          width: 100%;
          overflow: hidden;

          .text_content_wrap_panel {
            position: absolute;
            width: 200%;
            height: 100%;
            left: 0;
            top: 0;
            display: flex;
            flex-direction: row;
            transition: 0.3s ease-in-out all;

            .raw_panel {
              width: 50%;
              height: 100%;
            }

            .object_panel {
              width: 50%;
              height: 100%;
            }
          }

          .text_content_wrap_panel_raw {
            .text_content_wrap_panel();
            transform: translateX(0%);
          }

          .text_content_wrap_panel_object {
            .text_content_wrap_panel();
            transform: translateX(-50%);
          }
        }
      }

      .no_text_panel {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        i {
          font-size: 180px;
          color: rgb(2, 77, 137);
        }

        span {
          font-size: 20px;
          color: gray;
          font-style: italic;
        }
      }
    }
  }

  .right_panel {
    position: relative;
    height: 100%;
    flex: 1;
    background: white;
    margin-left: 15px;
    border-radius: 15px;
    overflow: hidden;

    .threejs_container {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 1;
    }

    .no_model_panel {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: white;

      i {
        font-size: 180px;
        color: rgb(2, 77, 137);
        margin-bottom: 30px;
      }

      span {
        font-size: 20px;
        color: gray;
        font-style: italic;
      }
    }
  }
}

/*设置滚动条样式*/
.pretty_scrollbar {
  overflow: auto;

  &::-webkit-scrollbar {
    width: 5px;
    height: 10px;
    background: transparent;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c7c9cc;
    border-radius: 3px;
  }
}
</style>
