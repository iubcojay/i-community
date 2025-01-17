<template>
  <div class="admin_page_panel">
    <div class="wrap_panel">
      <div class="top_panel">
        <top-bar-component
          :sup-methods="topBarMethods"
          :sup-data="topBarData"
        ></top-bar-component>
      </div>

      <div class="bottom_panel">
        <div class="side_menu_panel">
          <side-bar-component
            ref="sideBarComponent"
            :sup-methods="sideBarMethods"
            :sup-data="sideBarData"
          ></side-bar-component>
        </div>
        <div class="content_panel">
          <div class="top_content_panel">
            <breadcrumb-component
              :sup-data="breadBarData"
              :sup-methods="breadBarMethods"
            ></breadcrumb-component>
          </div>
          <div class="main_content_panel">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopBarComponent from "@/views/admin/frame/top/TopBarComponent";
import SideBarComponent from "@/views/admin/frame/side/SideBarComponent";
import BreadcrumbComponent from "@/views/admin/frame/top/BreadcrumbComponent";
import { v1 as uuidv1 } from "uuid";

export default {
  name: "AdminPage",
  components: { TopBarComponent, SideBarComponent, BreadcrumbComponent },

  data() {
    return {
      // menuOptions: [
      //   {
      //     iconClass: "icon-community",
      //     title: "社区综治",
      //     children: [
      //       {
      //         iconClass: "icon-model",
      //         title: "模型数据",
      //         children: [
      //           {
      //             title: "GLTF模型",
      //             path: "",
      //             id: "1_1_1",
      //             path: "/admin/community/model/gltf",
      //           },
      //           {
      //             title: "倾斜摄影",
      //             path: "",
      //             id: "1_1_2",
      //           },
      //           {
      //             title: "瓦片模型",
      //             path: "",
      //             id: "1_1_3",
      //           },
      //         ],
      //         id: "1_1",
      //       },
      //       {
      //         iconClass: "icon-text",
      //         title: "文本数据",
      //         children: [
      //           {
      //             title: "社交媒体文本",
      //             path: "",
      //             id: "1_2_1",
      //           },
      //           {
      //             title: "政府文件",
      //             path: "/admin/community/text/government",
      //             id: "1_2_2",
      //           },
      //           {
      //             title: "新闻报道",
      //             path: "",
      //             id: "1_2_3",
      //           },
      //         ],
      //         id: "1_2",
      //       },
      //       {
      //         iconClass: "icon-image",
      //         title: "图像数据",
      //         children: [
      //           {
      //             title: "违规照片",
      //             path: "",
      //             id: "1_3_1",
      //           },
      //           {
      //             title: "卫星图像",
      //             path: "",
      //             id: "1_3_2",
      //           },
      //           {
      //             title: "社交媒体照片",
      //             path: "",
      //             id: "1_3_3",
      //           },
      //         ],
      //         id: "1_3",
      //       },
      //       {
      //         iconClass: "icon-video",
      //         title: "视频数据",
      //         children: [
      //           {
      //             title: "监控摄像",
      //             path: "",
      //             id: "1_4_1",
      //           },
      //           {
      //             title: "卫星影像",
      //             path: "",
      //             id: "1_4_2",
      //           },
      //           {
      //             title: "社交媒体视频",
      //             path: "",
      //             id: "1_4_3",
      //           },
      //         ],
      //         id: "1_4",
      //       },
      //       {
      //         iconClass: "icon-music",
      //         title: "音频数据",
      //         children: [
      //           {
      //             title: "电话录音数据",
      //             path: "",
      //             id: "1_5_1",
      //           },
      //           {
      //             title: "社交媒体音频数据",
      //             path: "",
      //             id: "1_5_2",
      //           },
      //           {
      //             title: "城市环境声音数据",
      //             path: "",
      //             id: "1_5_3",
      //           },
      //           {
      //             title: "政府会议音频数据",
      //             path: "",
      //             id: "1_5_4",
      //           },
      //         ],
      //         id: "1_5",
      //       },
      //       {
      //         iconClass: "icon-database",
      //         title: "数据库数据",
      //         children: [
      //           {
      //             title: "人口统计数据",
      //             path: "",
      //             id: "1_6_1",
      //           },
      //           {
      //             title: "经济指标数据",
      //             path: "",
      //             id: "1_6_2",
      //           },
      //           {
      //             title: "犯罪数据",
      //             path: "",
      //             id: "1_6_3",
      //           },
      //           {
      //             title: "医疗健康数据",
      //             path: "",
      //             id: "1_6_4",
      //           },
      //           {
      //             title: "交通运输数据",
      //             path: "",
      //             id: "1_6_5",
      //           },
      //           {
      //             title: "教育数据",
      //             path: "",
      //             id: "1_6_6",
      //           },
      //         ],
      //         id: "1_6",
      //       },
      //       {
      //         iconClass: "icon-geography",
      //         title: "地理信息数据",
      //         children: [
      //           {
      //             title: "栅格数据",
      //             path: "",
      //             id: "1_7_1",
      //           },
      //           {
      //             title: "二维矢量",
      //             path: "",
      //             id: "1_7_2",
      //           },
      //         ],
      //         id: "1_7",
      //       },
      //       {
      //         iconClass: "icon-line-chart",
      //         title: "时间序列数据",
      //         children: [
      //           {
      //             title: "经济指标时间序列数据",
      //             path: "",
      //             id: "1_8_1",
      //           },
      //           {
      //             title: "气象数据",
      //             path: "",
      //             id: "1_8_2",
      //           },
      //           {
      //             title: "交通流量数据",
      //             path: "",
      //             id: "1_8_3",
      //           },
      //           {
      //             title: "疫情统计数据",
      //             path: "",
      //             id: "1_8_4",
      //           },
      //         ],
      //         id: "1_8",
      //       },
      //       {
      //         iconClass: "icon-web",
      //         title: "社交媒体数据",
      //         children: [
      //           {
      //             title: "用户个人资料数据",
      //             path: "",
      //             id: "1_9_1",
      //           },
      //           {
      //             title: "用户社交网络数据",
      //             path: "",
      //             id: "1_9_2",
      //           },
      //           {
      //             title: "用户发布内容数据",
      //             path: "",
      //             id: "1_9_3",
      //           },
      //           {
      //             title: "用户行为数据",
      //             path: "",
      //             id: "1_9_4",
      //           },
      //         ],
      //         id: "1_9",
      //       },
      //       {
      //         iconClass: "icon-user",
      //         title: "人口统计数据",
      //         children: [
      //           {
      //             title: "年龄分布数据",
      //             path: "",
      //             id: "1_10_1",
      //           },
      //           {
      //             title: "性别分布数据",
      //             path: "",
      //             id: "1_10_2",
      //           },
      //           {
      //             title: "教育水平数据",
      //             path: "",
      //             id: "1_10_3",
      //           },
      //           {
      //             title: "就业状况数据",
      //             path: "",
      //             id: "1_10_4",
      //           },
      //           {
      //             title: "家庭结构数据",
      //             path: "",
      //             id: "1_10_5",
      //           },
      //         ],
      //         id: "1_10",
      //       },
      //     ],
      //     id: "1",
      //   },
      //   {
      //     iconClass: "icon-balance",
      //     title: "矛盾调处",
      //     children: [],
      //     id: "2",
      //   },
      //   {
      //     iconClass: "icon-talk",
      //     title: "舆情分析",
      //     children: [],
      //     id: "3",
      //   },
      // ],
      menuOptions: [
        {
          id: uuidv1(),
          iconClass: "icon-community",
          title: "社区综治",
          children: [
            {
              id: uuidv1(),
              title: "地理数据",
              iconClass: "icon-geography",
              children: [
                {
                  id: uuidv1(),
                  title: "瓦片影像",
                  path: "/admin/community/geometry/imagery",
                },
                {
                  id: uuidv1(),
                  title: "二维矢量",
                  path: "",
                },
                {
                  id: uuidv1(),
                  title: "倾斜模型",
                  path: "",
                },
              ],
            },
            {
              id: uuidv1(),
              title: "公共设施",
              iconClass: "icon-fix",
              children: [
                {
                  id: uuidv1(),
                  title: "设施搜索",
                  path: "/admin/community/facility/info",
                },
                {
                  id: uuidv1(),
                  title: "设施监控",
                  path: "",
                },
              ],
            },
            {
              id: uuidv1(),
              title: "网格划分",
              iconClass: "icon-progress",
              children: [
                {
                  id: uuidv1(),
                  title: "组织架构",
                  path: "",
                },
                {
                  id: uuidv1(),
                  title: "职工名单",
                  path: "",
                },
              ],
            },
            {
              id: uuidv1(),
              title: "居民信息",
              iconClass: "icon-user",
              children: [
                {
                  id: uuidv1(),
                  title: "人员查找",
                  path: "",
                },
                {
                  id: uuidv1(),
                  title: "特殊人群",
                  path: "",
                },
              ],
            },
            {
              id: uuidv1(),
              title: "企业信息",
              iconClass: "icon-city",
              children: [
                {
                  id: uuidv1(),
                  title: "企业查找",
                  path: "",
                },
              ],
            },
            {
              id: uuidv1(),
              title: "监控画面",
              iconClass: "icon-monitor",
              children: [
                {
                  id: uuidv1(),
                  title: "实时监控",
                  path: "",
                },
                {
                  id: uuidv1(),
                  title: "历史监控",
                  path: "",
                },
                {
                  id: uuidv1(),
                  title: "识别检测",
                  path: "",
                },
              ],
            },
          ],
        },
        {
          id: "2",
          iconClass: "icon-balance",
          title: "矛盾调处",
          children: [],
        },
        {
          id: "3",
          iconClass: "icon-talk",
          title: "舆情分析",
          children: [],
        },
      ],

      activeMenuIdList: [],
    };
  },

  watch: {
    "$route.path": {
      immediate: true,
      handler(path) {
        for (const firstLevelMenu of this.menuOptions) {
          for (const secondLevelMenu of firstLevelMenu.children) {
            for (const thirdLevelMenu of secondLevelMenu.children) {
              if (thirdLevelMenu.path === path) {
                this.activeMenuIdList.splice(0, 1, firstLevelMenu.id);
                this.activeMenuIdList.splice(1, 1, secondLevelMenu.id);
                this.activeMenuIdList.splice(2, 1, thirdLevelMenu.id);
                break;
              }
            }
          }
        }
      },
    },
  },

  computed: {
    topBarMethods() {
      return {
        toggleMenuStatus: () => {
          this.$refs["sideBarComponent"].toggleMenuStatus();
        },
        setActiveMenu: this.setActiveMenu,
        changeFirstLevelMenu: this.changeFirstLevelMenu,
      };
    },

    topBarData() {
      return {
        menuOptions: this.topBarMenuOptions,
        activeMenuIdList: this.activeMenuIdList,
      };
    },

    sideBarMethods() {
      return {
        setActiveMenu: this.setActiveMenu,
      };
    },

    sideBarData() {
      return {
        menuOptions: this.sideBarMenuOptions,
        activeMenuIdList: this.activeMenuIdList,
      };
    },

    breadBarData() {
      return { menuOptions: this.menuOptions };
    },

    breadBarMethods() {
      return {};
    },

    topBarMenuOptions() {
      return this.menuOptions.map((menu) => {
        return {
          id: menu.id,
          title: menu.title,
          iconClass: menu.iconClass,
        };
      });
    },

    sideBarMenuOptions() {
      return this.menuOptions.find(
        (menu) => menu.id === this.activeMenuIdList[0]
      ).children;
    },
  },
  methods: {
    initPage() {
      document.title = "社会治理多源数据管理";
    },
    setActiveMenu(menuLevel, menuId) {
      this.activeMenuIdList[menuLevel] = menuId;
    },
    changeFirstLevelMenu(firstLevelMenuId) {
      this.$router.push(
        this.menuOptions.find(
          (firstLevelMenu) => firstLevelMenu.id === firstLevelMenuId
        ).children[0].children[0].path
      );
    },
  },

  mounted() {
    this.initPage();
  },
};
</script>

<style lang="less" scoped>
.admin_page_panel {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .wrap_panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .top_panel {
    width: 100%;
    height: 50px;
    position: relative;
    z-index: 2;
    box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.1);
  }

  .bottom_panel {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;

    .side_menu_panel {
      position: relative;
      z-index: 1;
      width: auto;
      height: 100%;
      background: white;
      box-shadow: 2px 0px 1px rgba(0, 0, 0, 0.1);
    }

    .content_panel {
      flex: 1;
      background: rgb(243, 245, 246);
      display: flex;
      flex-direction: column;

      .top_content_panel {
        height: 45px;
        margin: 15px;
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        background: white;
        border-radius: 7px;
        box-sizing: border-box;
        padding: 0 15px;
      }
    }

    .main_content_panel {
      width: 100%;
      flex: 1;
      box-sizing: border-box;
      padding: 15px;
      padding-top: 0;
    }
  }
}
</style>
