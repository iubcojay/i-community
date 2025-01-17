<template>
  <div class="imagery_outer_panel">
    <div class="table_panel">
      <el-table :data="imageryList" style="width: 100%;">
        <el-table-column label="缩略图" width="180">
          <template slot-scope="scope">
            <div class="thumbnail_panel">
              <img :src="$StaticResourceAddress + scope.row.thumbnailUrl" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="名称" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="瓦片类型" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.tileType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="瓦片格式" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.fileExtension }}</span>
          </template>
        </el-table-column>
        <el-table-column label="坐标投影方式" width="200">
          <template slot-scope="scope">
            <div
              v-show="scope.row.tilingScheme === 'WebMercatorTilingScheme'"
              style="margin-right: 25px;"
            >
              <p style="margin: 5px 0;">WGS84坐标系</p>
              <p style="margin: 5px 0;">Web墨卡托投影</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="瓦片级别" width="100">
          <template slot-scope="scope">
            <span
              >( {{ scope.row.minimumLevel }} ,
              {{ scope.row.maximumLevel }} )</span
            >
          </template>
        </el-table-column>
        <el-table-column label="边界范围" min-width="250">
          <template slot-scope="scope">
            <div>
              <p style="margin: 5px 0;">
                {{ getBoundaryStr(scope.row.rectangle)[0] }}
              </p>
              <p style="margin: 5px 0;">
                {{ getBoundaryStr(scope.row.rectangle)[1] }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" width="250">
          <template slot-scope="scope">
            <p>
              {{
                $common.dateFormat(
                  "YYYY-mm-dd HH:MM:SS",
                  new Date(scope.row.createTime)
                )
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column width="250">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="keywords"
              size="mini"
              placeholder="输入关键字搜索"
              @input="searchImageryList"
            />
          </template>
          <template slot-scope="scope">
            <el-button type="primary" @click="showImagery(scope.row)"
              >查看影像</el-button
            >
            <el-button type="primary" @click="showTile(scope.row)"
              >查看瓦片</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_panel">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalImageryNumber"
        :page-size="pageSize"
        :current-page.sync="currentPageNumber"
        @current-change="searchImageryList"
      >
      </el-pagination>
    </div>

    <el-dialog
      class="imagery_dialog_panel"
      width="700px"
      :title="selectedImagery ? selectedImagery.name : ''"
      :visible="dialogShowStatus === 1"
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
    >
      <div id="cesium_imagery_container"></div>
    </el-dialog>

    <el-dialog
      class="tile_dialog_panel"
      width="500px"
      :title="selectedImagery ? selectedImagery.name + '瓦片' : ''"
      :visible="dialogShowStatus === 2"
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
    >
      <div class="tile_dialog_content_panel">
        <div class="title_panel">
          <i
            v-if="selectedImagery && selectedImagery.url !== fileInfo.path"
            class="iconfont icon-arrow-right icon_back"
            @click="intoBackDirectory"
          ></i>
          <div class="url_panel">
            <i class="iconfont icon-lock icon_lock"></i>
            <span class="url_text">{{ fileInfo.path }}</span>
          </div>
        </div>
        <div class="file_list_panel">
          <div class="file_list_content_panel pretty_scrollbar">
            <div class="file_list_wrap_panel">
              <div
                v-for="file of fileInfo.subList"
                class="file_item_panel"
                :key="file.path"
              >
                <div
                  v-if="file.type === 'directory'"
                  class="directory_panel"
                  @click="intoDirectory(file)"
                >
                  <i class="iconfont icon-folder icon_folder"></i>
                  <span class="directory_name_span">{{ file.name }}</span>
                </div>
                <div v-if="file.type === 'file'" class="file_panel">
                  <i class="iconfont icon-image icon_image"></i>
                  <span class="file_name_span">{{ file.name }}</span>
                  <el-image
                    class="hidden_image_panel"
                    fit="cover"
                    :src="$StaticResourceAddress + file.path"
                    :preview-src-list="fileInfo.subList.map(file=> $StaticResourceAddress + file.path)"
                  >
                  </el-image>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MyEarth from "@/assets/js/cesium/MyEarth";
export default {
  name: "AdminCommunityGeometryImageryComponent",
  data() {
    return {
      imageryList: [],
      keywords: "",
      pageSize: 6,
      currentPageNumber: 1,
      totalImageryNumber: 0,
      selectedImagery: undefined,
      dialogShowStatus: 0,
      fileInfo: {
        lastPath: [],
        path: "",
        subList: [],
      },
    };
  },
  methods: {
    async initComp() {
      await this.searchImageryList();
    },

    async searchImageryList() {
      const { totalNum: totalImageryNumber, list: imageryList } = (
        await this.$axios.post(
          "/admin/imagery/search/page",
          this.$common.packagingAxiosParam({
            keywords: this.keywords,
            pageNum: this.currentPageNumber,
            pageSize: this.pageSize,
          })
        )
      ).data;
      this.totalImageryNumber = totalImageryNumber;
      this.imageryList = imageryList;
    },

    getBoundaryStr(rectangle) {
      const lonMin = rectangle[0];
      const lonMax = rectangle[2];
      const latMin = rectangle[1];
      const latMax = rectangle[3];

      const lonMinStr =
        (lonMin >= 0 ? "东经 " : "西经 ") + lonMin.toFixed(4) + "°";
      const lonMaxStr =
        (lonMax >= 0 ? "东经 " : "西经 ") + lonMax.toFixed(4) + "°";
      const latMinStr =
        (latMin >= 0 ? "北纬 " : "南纬 ") + latMin.toFixed(4) + "°";
      const latMaxStr =
        (latMax >= 0 ? "北纬 " : "南纬 ") + latMax.toFixed(4) + "°";
      return [lonMinStr + " - " + lonMaxStr, latMinStr + " - " + latMaxStr];
    },

    showImagery(imagery) {
      this.selectedImagery = imagery;
      this.dialogShowStatus = 1;

      this.$nextTick(() => {
        // 初始化地球
        this.myEarth = new MyEarth("cesium_imagery_container");
        this.myEarth.getEarthObjByRef("imagery_global_img").show = false;
        this.myEarth.scene.screenSpaceCameraController.maximumZoomDistance = 9999999999;
        this.myEarth.scene.screenSpaceCameraController.minimumZoomDistance = 10;

        // 添加白色底图
        this.myEarth.viewer.imageryLayers.addImageryProvider(
          new Cesium.SingleTileImageryProvider({
            url: this.$StaticResourceAddress + "/imagery/global.png",
          })
        );

        // 添加影像
        let baseLayer = new Cesium.TileMapServiceImageryProvider({
          url: this.$StaticResourceAddress + imagery.url, //tms服务路径
          fileExtension: imagery.fileExtension, //切片图片格式
          minimumLevel: imagery.minimumLevel, //起始级别
          maximumLevel: imagery.maximumLevel, //起始级别
          //根据下载的切片投影类型，经纬度的用GeographicTilingScheme，默认是web墨卡托的 WebMercatorTilingScheme()
          tilingScheme:
            imagery.tilingScheme === "WebMercatorTilingScheme"
              ? new Cesium.WebMercatorTilingScheme()
              : new Cesium.GeographicTilingScheme(),
          rectangle: Cesium.Rectangle.fromDegrees(...imagery.rectangle),
        });

        // 相机飞入
        this.myEarth.camera.flyTo(
          [
            Cesium.Math.toRadians(
              (imagery.rectangle[0] + imagery.rectangle[2]) * 0.5
            ),
            Cesium.Math.toRadians(
              (imagery.rectangle[1] + imagery.rectangle[3]) * 0.5
            ),
            imagery.initialHeight,
          ],
          0,
          [(0, Math.PI) / 180, (-90 * Math.PI) / 180, 0],
          0
        );

        this.myEarth.viewer.imageryLayers.addImageryProvider(baseLayer);
      });
    },

    showTile(imagery) {
      this.selectedImagery = imagery;
      this.dialogShowStatus = 2;
      this.$nextTick(async () => {
        const { list: fileList } = (
          await this.$axios.post(
            "/admin/imagery/sub/list",
            this.$common.packagingAxiosParam({
              url: imagery.url,
            })
          )
        ).data;

        this.fileInfo.path = this.selectedImagery.url;
        this.fileInfo.subList = fileList;
       
      });
    },

    handleDialogClose() {
      this.selectedImagery = undefined;
      this.$nextTick(() => {
        this.dialogShowStatus = 0;
        this.myEarth && this.myEarth.destroyEarth();
        this.myEarth = null;
        this.fileInfo.lastPath = [];
        this.fileInfo.path = "";
        this.fileInfo.subList = [];
      });
    },

    async intoDirectory(directoryInfo) {
      const { list: fileList } = (
        await this.$axios.post(
          "/admin/imagery/sub/list",
          this.$common.packagingAxiosParam({
            url: directoryInfo.path,
          })
        )
      ).data;
      this.fileInfo.lastPath.push(this.fileInfo.path);
      this.fileInfo.path = directoryInfo.path;
      this.fileInfo.subList = fileList;
      console.log(fileList);
    },

    async intoBackDirectory() {
      this.fileInfo.path = this.fileInfo.lastPath.pop();

      const { list: fileList } = (
        await this.$axios.post(
          "/admin/imagery/sub/list",
          this.$common.packagingAxiosParam({
            url: this.fileInfo.path,
          })
        )
      ).data;

      this.fileInfo.subList = fileList;
    },

    test() {
      this.showTile(this.imageryList[0]);
      this.selectedImagery = this.imageryList[0];
    },
  },
  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    this.myEarth && this.myEarth.destroyEarth();
    this.myEarth = null;
  },
};
</script>

<style lang="less" scoped>
.imagery_outer_panel {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 15px;

  .table_panel {
    width: 100%;
    flex: 1;

    .thumbnail_panel {
      width: 90px;
      height: 90px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .pagination_panel {
    width: 100%;
    height: 50px;
  }

  .imagery_dialog_panel {
    #cesium_imagery_container {
      position: relative;
      width: 100%;
      height: 600px;
    }
  }

  .tile_dialog_panel {
    .tile_dialog_content_panel {
      width: 100%;
      height: 600px;
      display: flex;
      flex-direction: column;

      .title_panel {
        height: 40px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 0 5px;

        .icon_back {
          font-size: 25px;
          font-weight: 700;
          color: gray;
          transform: rotate(180deg);
          transition: 0.1s ease-in-out all;
          margin-right: 10px;

          &:hover {
            cursor: pointer;
            color: rgb(2, 77, 137);
            transform: rotate(180deg) translateX(5px);
          }
        }

        .url_panel {
          height: 30px;
          flex: 1;
          border: gray 1px solid;
          border-radius: 15px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          .icon_lock {
            color: gray;
            font-size: 14px;
            margin: 0 10px;
          }

          .url_text {
            font-size: 14px;
          }
        }
      }

      .file_list_panel {
        position: relative;
        width: 100%;
        flex: 1;
        .file_list_content_panel {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;

          .file_list_wrap_panel {
            width: 100%;
            height: auto;
            box-sizing: border-box;
            padding: 0 5px;

            .file_item_panel {
              widows: 100%;
              height: 50px;
              margin: 5px 0;
              display: flex;
              flex-direction: row;
              border-radius: 5px;
              color: gray;

              &:hover {
                cursor: pointer;
                background: rgba(2, 77, 137, 0.2);
                color: rgb(2, 77, 137);
              }

              .directory_panel {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                box-sizing: border-box;
                padding: 0 5px;

                .icon_folder {
                  font-size: 25px;
                  font-weight: 700;
                  margin-right: 15px;
                }

                .directory_name_span {
                  font-size: 18px;
                }
              }

              .file_panel {
                height: 100%;
                width: 100%;
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                box-sizing: border-box;
                padding: 0 5px;

                .icon_image {
                  font-size: 25px;
                  font-weight: 700;
                  margin-right: 15px;
                }

                .file_name_span {
                  font-size: 18px;
                }

                .hidden_image_panel{
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  opacity: 0;
                  
                  
                }
              }
            }
          }
        }
      }
    }
  }
}

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
