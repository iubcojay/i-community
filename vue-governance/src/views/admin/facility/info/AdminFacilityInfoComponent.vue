<template>
  <div class="facility_info_outer_panel">
    <div class="left_panel">
      <div class="search_panel">
        <div class="search_box">
          <i class="iconfont icon-search icon_search"></i>
          <div class="select_panel">
            <el-select
              class="select_list"
              v-model="searchType"
              size="mini"
              placeholder="请选择"
            >
              <el-option :key="-1" label="全部" :value="-1"> </el-option>
              <el-option
                v-for="facilityTypeInfo in facilityTypeList"
                :key="facilityTypeInfo.id"
                :label="facilityTypeInfo.name"
                :value="facilityTypeInfo.id"
              >
              </el-option>
            </el-select>
          </div>

          <input
            type="text"
            class="search_input"
            v-model="keywords"
            placeholder="输入关键词搜索设施"
          />
          <el-button class="search_button" type="primary" @click="searchInfo"
            >搜 索</el-button
          >
        </div>
      </div>
      <div class="facility_list_panel">
        <el-table :data="facilityList" style="width: 100%;">
          <el-table-column label="ID" min-width="200">
            <template slot-scope="scope">
              <span
                class="facility_id_panel"
                :class="{
                  selected_facility_id:
                    selectedFacility && selectedFacility.id === scope.row.id,
                }"
                >{{ scope.row.id }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="实物图片" width="120">
            <template slot-scope="scope">
              <img
                class="facility_img"
                :src="$StaticResourceAddress + scope.row.picture"
              />
            </template>
          </el-table-column>
          <el-table-column label="类型" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.type.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="位置" width="135">
            <template slot-scope="scope">
              <div class="position_panel">
                <span>{{ scope.row.positionStr[0] }}</span>
                <span>{{ scope.row.positionStr[1] }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="" width="120">
            <template slot-scope="scope">
              <div class="operation_button_panel">
                <i
                  class="iconfont icon-address operation_icon"
                  @click="handleLocationClick(scope.row)"
                ></i>

                <i
                  class="iconfont icon-model operation_icon"
                  @click="handleModelClick(scope.row)"
                ></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination_panel">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalFacilityNumber"
          :pageSize="pageSize"
          :current-page.sync="currentPageNumber"
          @current-change="searchInfo"
        >
        </el-pagination>
      </div>
    </div>
    <div class="right_panel">
      <div
        :class="{
          wrap_panel_left: displayPanelShowStatus === 0,
          wrap_panel_right: displayPanelShowStatus === 1,
        }"
      >
        <div id="cesium_panel" class="cesium_panel">
          <facility-pin-component
            v-if="
              displayPanelShowStatus === 0 && selectedFacility !== undefined
            "
            :winPos="selectedFacility.winPos"
            :iconClass="selectedFacility.type.iconClass"
          ></facility-pin-component>
        </div>
        <div class="threejs_panel">
          <div class="model_panel">
            <div v-show="modelLoaderStatus === 1" class="no_model_panel">
              <el-progress
                type="circle"
                :percentage="modelLoaderPercentage"
              ></el-progress>
              <span>模 型 加 载 中</span>
            </div>
            <div ref="threejsContainer" class="threejs_container"></div>
          </div>
          <div class="file_panel">
            <div class="raw_data_panel">
              <div class="title_panel">源 数 据</div>
              <el-skeleton
                v-if="modelLoaderStatus === 1"
                style="width: 100%; height: 100%;"
                :rows="7"
                animated
              />
              <div v-else class="text_content pretty_scrollbar">
                <vue-json-pretty
                  :deep="1"
                  :data="$data._selectedModelRawJson"
                  showIcon
                  showLineNumber
                  showLength
                />
              </div>
            </div>
            <i class="iconfont icon-arrow-right icon_arrow"></i>
            <div class="object_data_panel">
              <div class="title_panel">结 构 数 据</div>
              <el-skeleton
                v-if="modelLoaderStatus === 1"
                style="width: 100%; height: 100%;"
                :rows="7"
                animated
              />
              <div v-else class="text_content pretty_scrollbar">
                <vue-json-pretty
                  :deep="1"
                  :data="$data._selectedModelObjectJson"
                  showIcon
                  showLineNumber
                  showLength
                  @node-click="handleObjectNodeClick"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyEarth from "@/assets/js/cesium/MyEarth.js";
import FacilityPinComponent from "@/views/admin/facility/info/FacilityPinComponent";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import FacilityModelScene from "@/assets/js/threejs/admin/facility/FacilityModelScene";

export default {
  name: "AdminFacilityInfoComponent",
  components: { FacilityPinComponent, VueJsonPretty },
  data() {
    return {
      facilityTypeList: [],
      facilityList: [],
      keywords: "",
      searchType: -1,
      pageSize: 6,
      currentPageNumber: 1,
      totalFacilityNumber: 0,

      displayPanelShowStatus: 0,

      selectedFacility: undefined,

      _selectedModelRawJson: undefined,
      _selectedModelObjectJson: undefined,
      modelLoaderStatus: 0,
      modelLoaderPercentage: 0,
    };
  },

  methods: {
    initComp() {
      this.initFacilityInfo();
      this.initEarth();
      this.initThreeJsScene();
    },
    async initFacilityInfo() {
      this.facilityTypeList = (
        await this.$axios.post("/admin/facilityType/list")
      ).data;
      await this.searchInfo();
    },

    async searchInfo() {
      const { totalNum: totalFacilityNumber, list: facilityList } = (
        await this.$axios.post(
          "/admin/facility/search/page",
          this.$common.packagingAxiosParam({
            keywords: this.keywords,
            pageNum: this.currentPageNumber,
            pageSize: this.pageSize,
            type: this.searchType,
          })
        )
      ).data;

      this.totalFacilityNumber = totalFacilityNumber;

      this.facilityList = facilityList;

      this.facilityList.forEach((facility) => {
        // 填充类型信息
        facility.type = this.facilityTypeList.find(
          (typeInfo) => typeInfo.id === facility.type
        );

        // 填充经纬度文字
        const lon =
          facility.position[0] > 0
            ? `东经 ${facility.position[0]}°`
            : `西经 ${facility.position[0]}°`;
        const lat =
          facility.position[1] > 0
            ? `东经 ${facility.position[1]}°`
            : `西经 ${facility.position[1]}°`;
        this.$set(facility, "positionStr", [lat, lon]);
      });
    },

    initEarth() {
      this.myEarth = new MyEarth("cesium_panel");
      this.myEarth.addTianDiOnlineImagery();
      this.myEarth.addTianDiOnlineAnnotationy();

      this.myEarth.camera.flyTo(
        [2.042793240860197, 0.6398989262457605, 38.67157438460474],
        400,
        [(0 * Math.PI) / 180, (-90 * Math.PI) / 180, 0],
        2
      );
      // this.myEarth.pushEntityToEarth("tileset_community", {
      //   xbsjType: "Tileset",
      //   name: "解放路社区",
      //   url: this.$StaticResourceAddress + "/model/jiefanglu50_50/tileset.json",
      //   // "maximumScreenSpaceError": 16,
      //   maximumScreenSpaceError: 256,
      //   // "maximumMemoryUsage": 512,
      //   maximumMemoryUsage: 2000,
      //   // "dynamicScreenSpaceError": true,
      //   xbsjPosition: [
      //     2.042793850105076,
      //     0.6398969081167519,
      //     -44.292701710019195,
      //     // -50.17252211621494
      //   ],
      //   xbsjUseOriginTransform: false,
      //   xbsjClippingPlanes: {},
      //   xbsjCustomShader: {},
      // });
    },

    initThreeJsScene() {
      this.threejsScene = new FacilityModelScene({
        container: this.$refs.threejsContainer,
        helperOptions: { gridHelper: false, axesHelper: false },
      });
    },

    handleLocationClick(facilityInfo) {
      this.displayPanelShowStatus = 0;
      const selectedFacility = _.cloneDeep(facilityInfo);

      // 设置属性：POI坐标位置
      this.$set(selectedFacility, "winPos", [0, 0, 0, 0]);

      // 设置属性存放当前展示类型（position model）,用于防止重复点击
      this.$set(selectedFacility, "showStatus", 0);

      this.selectedFacility = selectedFacility;
    },

    handleModelClick(facilityInfo) {
      this.displayPanelShowStatus = 1;

      const selectedFacility = _.cloneDeep(facilityInfo);
      // 设置属性存放当前展示类型（position model）,用于防止重复点击
      this.$set(selectedFacility, "showStatus", 1);

      this.selectedFacility = selectedFacility;
    },

    addPOI(ref, position) {
      const rPosition = Cesium.Cartographic.fromDegrees(
        position[0],
        position[1],
        1
      );

      const cesiumCode = {
        xbsjType: "Pin",
        name: "图标点",
        position: [rPosition.longitude, rPosition.latitude, rPosition.height],
        pinBuilder: {},
        iframe: {},
        far: 1073741824,
        show: false,
      };
      const pin = this.myEarth.pushEntityToEarth(ref, cesiumCode);

      // 视角移入
      this.myEarth.flyToModel(ref);

      // 设置坐标跟踪
      let str = `selectedFacility.winPos`;
      this._poiUnbind = XE.MVVM.track(this, str, pin, "winPos");
    },

    removePOI(ref) {
      // 解绑
      this._poiUnbind && this._poiUnbind();
      this.myEarth.removeEntityFromEarth(ref);
    },

    async getModelRawData(modelUrl) {
      const { data: selectedModelJsonContent } = await this.$axios.get(
        modelUrl
      );
      this.$data._selectedModelRawJson = selectedModelJsonContent;
    },

    async showModel(facility) {
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

    toModelLoadingStatus() {
      this.modelLoaderPercentage = 0;
      this.modelLoaderStatus = 1;
    },

    toModelLoadedStatus() {
      this.modelLoaderStatus = 2;
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
  },
  watch: {
    selectedFacility(newValue, oldValue) {
      // 初始化时不做任何处理
      if (_.isUndefined(newValue)) return;

      // 防止重复点击
      if (
        newValue.id === oldValue?.id &&
        newValue.showStatus === oldValue?.showStatus
      )
        return;

      // 删除旧的poi
      if (oldValue) {
        this.removePOI("pin_" + oldValue.id);
      }

      switch (this.displayPanelShowStatus) {
        // 展示定位
        case 0:
          // 增加新的POI
          this.addPOI("pin_" + newValue.id, newValue.position);
          break;

        // 展示模型
        case 1:
          this.toModelLoadingStatus();
          Promise.all([
            this.getModelRawData(newValue.model),
            this.showModel(newValue),
          ]).then(() => {
            this.toModelLoadedStatus();
          });

          break;
      }
    },
  },

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    this.myEarth.destroyEarth();
    this.myEarth = null;
    this.threejsScene && this.threejsScene.clearScene();
    this.threejsScene = null;
  },
};
</script>

<style lang="less" scoped>
.facility_info_outer_panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  .left_panel {
    height: 100%;
    width: 800px;
    margin-right: 10px;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-direction: column;

    .search_panel {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .search_box {
        position: relative;
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        padding-left: 140px;
        padding-right: 80px;
        border-radius: 20px;
        border: 1px solid gray;
        display: flex;
        flex-direction: row;
        align-items: center;

        .icon_search {
          position: absolute;
          width: 20px;
          height: 20px;
          top: 0;
          bottom: 0;
          margin: auto;
          left: 10px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 700;
        }

        .select_panel {
          position: absolute;
          width: 90px;
          height: 100%;
          top: 0;
          bottom: 0;
          margin: auto;
          left: 40px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          .select_list {
            height: 35px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        }

        .search_input {
          width: 100%;
          height: 35px;
          background-color: transparent;
          border: none;
          margin: 0;
          padding: 0;
          color: rgba(0, 0, 0, 0.87);
          word-wrap: break-word;
          outline: none;
          font-size: 16px;
        }

        .search_button {
          position: absolute;
          width: 60px;
          height: 30px;
          top: 0;
          bottom: 0;
          margin: auto;
          right: 10px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          font-weight: 700;
          border-radius: 15px;
        }
      }
    }

    .facility_list_panel {
      width: 100%;
      flex: 1;

      .facility_id_panel {
        font-size: 13px;
      }
      .selected_facility_id {
        color: rgb(2, 77, 137);
        font-weight: 700;
      }

      .facility_img {
        width: 90%;
        height: 100%;
        object-fit: cover;
      }

      .operation_button_panel {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        .operation_icon {
          width: 40px;
          height: 40px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          margin-right: 10px;
          font-size: 25px;
          font-weight: 700;
          color: gray;

          &:hover {
            cursor: pointer;
            transform: scale(1.1);
            color: rgb(2, 77, 137);
            font-weight: 1000;
          }
        }
      }

      .position_panel {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        span {
          font-size: 13px;
          margin-bottom: 10px;
        }
      }
    }

    .pagination_panel {
      width: 100%;
      height: 50px;
      margin-top: 10px;
    }
  }

  .right_panel {
    position: relative;
    height: 100%;
    flex: 1;
    margin-left: 10px;
    overflow: hidden;

    .wrap_panel {
      position: absolute;
      left: 0;
      top: 0;
      width: 200%;
      height: 100%;
      display: flex;
      flex-direction: row;
      transition: 0.3s all ease-in-out;
      overflow: hidden;
      border-radius: 10px;

      .cesium_panel {
        position: relative;
        width: 50%;
        height: 100%;
        background: white;
        border-radius: 10px;
        overflow: hidden;
      }

      .threejs_panel {
        position: relative;
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        overflow: hidden;

        .model_panel {
          position: relative;
          width: 100%;
          flex: 1;
          background: white;
          border-radius: 10px;
          margin-bottom: 15px;

          .threejs_container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            overflow: hidden;
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

        .file_panel {
          height: 300px;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;

          .raw_data_panel {
            position: relative;
            height: 100%;
            flex: 1;
            background: white;
            border-radius: 10px;
            box-sizing: border-box;
            padding: 10px;
            padding-top: 35px;

            .title_panel {
              position: absolute;
              left: 15px;
              top: 10px;
              height: 20px;
              width: auto;
              font-size: 15px;
              font-weight: 700;
              color: rgb(2, 77, 137);
            }

            .text_content {
              height: 100%;
              width: 100%;
            }
          }

          .icon_arrow {
            width: 50px;
            height: 50px;
            margin: 0 15px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            font-size: 40px;
            font-weight: 1000;
            color: rgb(2, 77, 137);
          }

          .object_data_panel {
            position: relative;
            height: 100%;
            flex: 1;
            background: white;
            border-radius: 10px;
            box-sizing: border-box;
            padding: 10px;
            padding-top: 35px;

            .title_panel {
              position: absolute;
              left: 15px;
              top: 10px;
              height: 20px;
              width: auto;
              font-size: 15px;
              font-weight: 700;
              color: rgb(2, 77, 137);
            }

            .text_content {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .wrap_panel_left {
      .wrap_panel();
      left: 0;
    }

    .wrap_panel_right {
      .wrap_panel();
      left: -100%;
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
