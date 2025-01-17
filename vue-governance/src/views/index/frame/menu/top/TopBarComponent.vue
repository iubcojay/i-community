<template>
  <div class="top_bar_panel">
    <div class="top_bar_left_panel">
      <div class="top_bar_title_panel">
        <el-image
            :src="$StaticResourceAddress + '/img/icon/earth.png'"
            style="width: 40px;"
        ></el-image>
        <span style="margin-left: 10px;" class="title_text">{{ title }}</span>
        <i class="iconfont icon-address user_icon"></i>
        <span style="color: white;">{{ position }}</span>
        <i class="iconfont icon-user user_icon"></i>
        <span style="color: white;">{{ username }}</span>
      </div>
      <div class="slash_panel"></div>
    </div>
    <div class="top_bar_right_panel">
      <!--      搜索框-->
      <div class="input-wrapper">

        <el-select v-model="selectedType" @change="handleSelectChange(selectedType)" placeholder="请选择">
          <el-option
              v-for="item in optionsType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>

        <el-autocomplete
            :fetch-suggestions="querySearch"
            v-model="searchVal"
            @select="handleSelect"
            :debounce="0"
            clearable
            @clear="blurForBug()"
        ></el-autocomplete>

        <el-button @click="handleSearch(searchVal)">搜索</el-button>
      </div>
      <div class="menu-icon-contianer">
        <div class="top_bar_menu_icon_panel">
          <i
              class="iconfont icon-home top_bar_menu_icon hvr-grow-shadow"
              @click="handleIconClick('home')"
          ></i>
          <i
              class="iconfont icon-layers top_bar_menu_icon hvr-grow-shadow"
              @click="handleIconClick('layers')"></i>
          <i
              class="iconfont icon-full-screen top_bar_menu_icon hvr-grow-shadow"
              @click="handleIconClick('fullScreen')"
          ></i>
          <i
              class="iconfont icon-exit top_bar_menu_icon hvr-grow-shadow"
              @click="handleIconClick('exit')"
          ></i>
          <i
              class="iconfont icon-shutdown top_bar_menu_icon hvr-grow-shadow"
              @click="handleIconClick('shutDown')"
          ></i>
        </div>
        <div class="top_bar_menu_text_panel">
          <TopBarTextMenuComponent
              :menu-data="topBarMenuItemList"
              :active-group="activeGroup"
          >
          </TopBarTextMenuComponent>
        </div>
      </div>
    </div>
    <!--修改部分-->
    <div class="transport_accident_container">
      <div class="side_bar_container">
        <SideBarComponent>
          <HomeRightControllerComponent
              v-show="ifShow"
              :ifShow="this.ifShow"
              @close="handleClose"
              slot="rightPanel"
          >
          </HomeRightControllerComponent>
        </SideBarComponent>
      </div>
    </div>
    <!--修改部分-->
    <div class="transport_accident_container">
      <div class="side_bar_container">
        <SideBarComponent>
          <SwitchToGarage
              v-show="ifShowCar"
              :ifShow="this.ifShowCar"
              @close="handleCloseCar"
              slot="rightPanel"
          >
          </SwitchToGarage>
        </SideBarComponent>
      </div>
    </div>
  </div>

</template>

<script>
import {mapActions, mapState} from "vuex";

import TopBarTextMenuComponent from "@/views/index/frame/menu/top/TopBarTextMenuComponent";
import SideBarComponent from "@/views/index/community/internet/monitor/common/fireTruckSaveMe/side/SideBarComponent";
import HomeRightControllerComponent
  from "@/views/index/community/internet/monitor/common/PopUpComponent";
import SwitchToGarage from "@/views/garage.back1/components/SwitchToGarage.vue";

export default {
  name: "TopBarComponent",
  components: {SwitchToGarage, TopBarTextMenuComponent, SideBarComponent, HomeRightControllerComponent},
  props: {
    topBarMenuItemList: {
      default: [],
    },
    title: {
      default: "智慧社区综合治理系统",
    },
    position: {
      default: "",
    },
    username: {
      default: "",
    },
  },
  data() {
    return {
      activeGroup: {
        activeSubItem: undefined,
        activeMenuItem: undefined,
      },
      ifShow: false,
      ifShowCar: false,
      searchVal: '',
      // search: '',
      // list: [
      //   '选项1',
      //   '选项2',
      //   '选项3',
      //   '选项4',
      //   // 你可以根据需要添加更多的选项
      // ],
      selectedType: null,
      optionsType: [
        {value: 'type1', label: '功能'},
        {value: 'type2', label: '人员'},
      ],
      options: [],
      functionOptions: [
        {value: '社区概况'},
        {value: '巡查记录'},
        {value: '监控查看'},
        {value: '设备管理'},
        {value: '地下车库'},
        {value: '事故回放'},
        {value: '任务派发'},
        {value: '任务列表'},
        {value: '人员信息'},
        // ... 其他固定选项
      ],
      peopleOptions: [
        {
          "value": "张吉惟"
        },
        {
          "value": "林国瑞"
        },
        {
          "value": "林玫书"
        },
        {
          "value": "林雅南"
        },
        {
          "value": "江奕云"
        },
        {
          "value": "刘柏宏"
        },
        {
          "value": "阮建安"
        },
        {
          "value": "林子帆"
        },
        {
          "value": "夏志豪"
        },
        {
          "value": "吉茹定"
        },
        {
          "value": "李中冰"
        },
        {
          "value": "黄文隆"
        },
        {
          "value": "谢彦文"
        },
        {
          "value": "傅智翔"
        },
        {
          "value": "洪振霞"
        },
        {
          "value": "刘姿婷"
        },
        {
          "value": "荣姿康"
        },
        {
          "value": "目致盈"
        },
        {
          "value": "方一强"
        },
        {
          "value": "黎芸贵"
        },
        {
          "value": "郑伊雯"
        },
        {
          "value": "雷进宝"
        },
        {
          "value": "吴美隆"
        },
        {
          "value": "吴心真"
        },
        {
          "value": "王美珠"
        },
        {
          "value": "郭芳天"
        },
        {
          "value": "李雅惠"
        },
        {
          "value": "陈文婷"
        },
        {
          "value": "曹敏侑"
        },
        {
          "value": "王依婷"
        },
        {
          "value": "陈婉璇"
        },
        {
          "value": "吴美玉"
        },
        {
          "value": "蔡依婷"
        },
        {
          "value": "郑昌梦"
        },
        {
          "value": "林家纶"
        },
        {
          "value": "黄丽昆"
        },
        {
          "value": "李育泉"
        },
        {
          "value": "黄芸欢"
        },
        {
          "value": "吴韵如"
        },
        {
          "value": "李肇芬"
        },
        {
          "value": "卢木仲"
        },
        {
          "value": "李成白"
        },
        {
          "value": "方兆玉"
        },
        {
          "value": "刘翊惠"
        },
        {
          "value": "丁汉臻"
        },
        {
          "value": "吴佳瑞"
        },
        {
          "value": "舒绿珮"
        },
        {
          "value": "周白芷"
        },
        {
          "value": "张姿妤"
        },
        {
          "value": "张虹伦"
        },
        {
          "value": "周琼玫"
        },
        {
          "value": "倪怡芳"
        },
        {
          "value": "郭贵妃"
        },
        {
          "value": "杨佩芳"
        },
        {
          "value": "黄文旺"
        },
        {
          "value": "黄盛玫"
        },
        {
          "value": "郑丽青"
        },
        {
          "value": "许智云"
        },
        {
          "value": "张孟涵"
        },
        {
          "value": "李小爱"
        },
        {
          "value": "王恩龙"
        },
        {
          "value": "朱政廷"
        },
        {
          "value": "邓诗涵"
        },
        {
          "value": "陈政倩"
        },
        {
          "value": "吴俊伯"
        },
        {
          "value": "阮馨学"
        },
        {
          "value": "翁惠珠"
        },
        {
          "value": "吴思翰"
        },
        {
          "value": "林佩玲"
        },
        {
          "value": "邓海来"
        },
        {
          "value": "陈翊依"
        },
        {
          "value": "李建智"
        },
        {
          "value": "武淑芬"
        },
        {
          "value": "金雅琪"
        },
        {
          "value": "赖怡宜"
        },
        {
          "value": "黄育霖"
        },
        {
          "value": "张仪湖"
        },
        {
          "value": "王俊民"
        },
        {
          "value": "张诗刚"
        },
        {
          "value": "林慧颖"
        },
        {
          "value": "沈俊君"
        },
        {
          "value": "陈淑妤"
        },
        {
          "value": "李姿伶"
        },
        {
          "value": "高咏钰"
        },
        {
          "value": "黄彦宜"
        },
        {
          "value": "周孟儒"
        },
        {
          "value": "潘欣臻"
        },
        {
          "value": "李祯韵"
        },
        {
          "value": "叶洁启"
        },
        {
          "value": "梁哲宇"
        },
        {
          "value": "黄晓萍"
        },
        {
          "value": "杨雅萍"
        },
        {
          "value": "卢志铭"
        },
        {
          "value": "张茂以"
        },
        {
          "value": "林婉婷"
        },
        {
          "value": "蔡宜芸"
        },
        {
          "value": "林珮瑜"
        },
        {
          "value": "黄柏仪"
        },
        {
          "value": "周逸珮"
        },
        {
          "value": "夏雅惠"
        },
        {
          "value": "王采珮"
        },
        {
          "value": "林孟霖"
        },
        {
          "value": "林竹水"
        },
        {
          "value": "王怡乐"
        },
        {
          "value": "王爱乐"
        },
        {
          "value": "金佳蓉"
        },
        {
          "value": "韩健毓"
        },
        {
          "value": "李士杰"
        },
        {
          "value": "陈置珍"
        },
        {
          "value": "苏姿婷"
        },
        {
          "value": "张政霖"
        },
        {
          "value": "李志宏"
        },
        {
          "value": "陈素达"
        },
        {
          "value": "陈虹荣"
        },
        {
          "value": "何美玲"
        },
        {
          "value": "李仪琳"
        },
        {
          "value": "张俞幸"
        },
        {
          "value": "黄秋萍"
        },
        {
          "value": "潘吉维"
        },
        {
          "value": "陈智筠"
        },
        {
          "value": "蔡书玮"
        },
        {
          "value": "陈信峰"
        },
        {
          "value": "林培伦"
        },
        {
          "value": "查瑜舜"
        },
        {
          "value": "黎慧置"
        },
        {
          "value": "郑士易"
        },
        {
          "value": "陈建豪"
        },
        {
          "value": "吴怡婷"
        },
        {
          "value": "徐紫富"
        },
        {
          "value": "张博海"
        },
        {
          "value": "黎宏儒"
        },
        {
          "value": "柯乔喜"
        },
        {
          "value": "胡睿纯"
        },
        {
          "value": "王淑月"
        },
        {
          "value": "陈百菁"
        },
        {
          "value": "王雅娥"
        },
        {
          "value": "黄佩珊"
        },
        {
          "value": "李必辰"
        },
        {
          "value": "吴耀华"
        },
        {
          "value": "彭郁婷"
        },
        {
          "value": "王秀玲"
        },
        {
          "value": "谢佳儒"
        },
        {
          "value": "罗静藁"
        },
        {
          "value": "杨舒南"
        },
        {
          "value": "蔡政琳"
        },
        {
          "value": "杨绍瑜"
        },
        {
          "value": "金育木"
        },
        {
          "value": "杨韦成"
        },
        {
          "value": "韩宁政"
        },
        {
          "value": "蒋廷湖"
        },
        {
          "value": "毛展霞"
        },
        {
          "value": "廖婉宏"
        },
        {
          "value": "黄怡强"
        },
        {
          "value": "郭冰宇"
        },
        {
          "value": "黄伟依"
        },
        {
          "value": "叶元映"
        },
        {
          "value": "林智超"
        },
        {
          "value": "李姿婷"
        },
        {
          "value": "李莉火"
        },
        {
          "value": "邱雅雯"
        },
        {
          "value": "王淑芳"
        },
        {
          "value": "陈枝盈"
        },
        {
          "value": "高成彦"
        },
        {
          "value": "徐采伶"
        },
        {
          "value": "杨大雪"
        },
        {
          "value": "林彦韦"
        },
        {
          "value": "李升毓"
        },
        {
          "value": "邱宜瑶"
        },
        {
          "value": "陈政文"
        },
        {
          "value": "李宜豪"
        },
        {
          "value": "陈宜宁"
        },
        {
          "value": "陈志宏"
        },
        {
          "value": "阮柔治"
        },
        {
          "value": "林乐妹"
        },
        {
          "value": "简健昀"
        },
        {
          "value": "廖雅君"
        },
        {
          "value": "梁佩芬"
        },
        {
          "value": "苏玮伦"
        },
        {
          "value": "秦娇真"
        },
        {
          "value": "谢佳雯"
        },
        {
          "value": "李仁杰"
        },
        {
          "value": "李佳和"
        },
        {
          "value": "郭贤青"
        },
        {
          "value": "吴怡伶"
        },
        {
          "value": "陈怡婷"
        },
        {
          "value": "阮晴桦"
        },
        {
          "value": "辛翔坤"
        },
        {
          "value": "林孟富"
        },
        {
          "value": "刘美玲"
        },
        {
          "value": "涂昀瑰"
        },
        {
          "value": "白凯修"
        },
        {
          "value": "黄蓉芳"
        },
        {
          "value": "赵吟琪"
        },
        {
          "value": "张裕忠"
        },
        {
          "value": "石春紫"
        },
        {
          "value": "方美君"
        },
        {
          "value": "潘右博"
        },
        {
          "value": "俞星如"
        },
        {
          "value": "张冠杰"
        },
        {
          "value": "钟庭玮"
        },
        {
          "value": "叶茜彦"
        },
        {
          "value": "陈伯薇"
        },
        {
          "value": "陈昭祥"
        },
        {
          "value": "陈伟伦"
        },
        {
          "value": "黄雅慧"
        },
        {
          "value": "郭子豪"
        },
        {
          "value": "黄彦霖"
        },
        {
          "value": "宋合"
        },
        {
          "value": "许雅婷"
        },
        {
          "value": "王圣如"
        },
        {
          "value": "何伶元"
        },
        {
          "value": "钟伦军"
        },
        {
          "value": "蔡佳蓉"
        },
        {
          "value": "溥康柔"
        },
        {
          "value": "冯成轩"
        },
        {
          "value": "陈嘉惠"
        },
        {
          "value": "吴惠劭"
        },
        {
          "value": "谢健铭"
        },
        {
          "value": "林怡婷"
        },
        {
          "value": "廖佳蓉"
        },
        {
          "value": "李佩伯"
        },
        {
          "value": "何珮甄"
        },
        {
          "value": "谢晓玲"
        },
        {
          "value": "许彦霖"
        },
        {
          "value": "林威强"
        },
        {
          "value": "周佳勋"
        },
        {
          "value": "林静怡"
        },
        {
          "value": "周筠亚"
        },
        {
          "value": "陈仲宜"
        },
        {
          "value": "胡东贵"
        },
        {
          "value": "陈绍翰"
        },
        {
          "value": "梁娴来"
        },
        {
          "value": "陈雅吉"
        },
        {
          "value": "张莉雯"
        },
        {
          "value": "陈韦荣"
        },
        {
          "value": "林素伦"
        },
        {
          "value": "李菁芷"
        },
        {
          "value": "蔡玉婷"
        },
        {
          "value": "郑智钧"
        },
        {
          "value": "吴孟钰"
        },
        {
          "value": "蔡国伟"
        },
        {
          "value": "连俊达"
        },
        {
          "value": "李雅婷"
        },
        {
          "value": "李礼娇"
        },
        {
          "value": "李忆孝"
        },
        {
          "value": "黄静雯"
        },
        {
          "value": "陈淳宝"
        },
        {
          "value": "李文育"
        },
        {
          "value": "林佳蓉"
        },
        {
          "value": "罗依茂"
        },
        {
          "value": "李淑佩"
        },
        {
          "value": "谢怡君"
        },
        {
          "value": "王美玲"
        },
        {
          "value": "黄慧学"
        },
        {
          "value": "邓幸韵"
        },
        {
          "value": "陈秀瑰"
        },
        {
          "value": "许岳平"
        },
        {
          "value": "许爱礼"
        },
        {
          "value": "谢一忠"
        },
        {
          "value": "简志雪"
        },
        {
          "value": "赵若喜"
        },
        {
          "value": "许承翰"
        },
        {
          "value": "姚哲维"
        },
        {
          "value": "苏俊安"
        },
        {
          "value": "郭礼钰"
        },
        {
          "value": "姜佩珊"
        },
        {
          "value": "张鸿信"
        },
        {
          "value": "秦欣瑜"
        },
        {
          "value": "李旺劭"
        },
        {
          "value": "陈怡爱"
        },
        {
          "value": "陈秀德"
        },
        {
          "value": "张佳伶"
        },
        {
          "value": "郑凯婷"
        },
        {
          "value": "郑雅任"
        },
        {
          "value": "黄国妹"
        },
        {
          "value": "林芳江"
        },
        {
          "value": "江骏生"
        },
        {
          "value": "黄儒纯"
        },
        {
          "value": "王培伦"
        },
        {
          "value": "陈蕙侑"
        },
        {
          "value": "蔡宜慧"
        },
        {
          "value": "陈信意"
        },
        {
          "value": "陈惠雯"
        },
        {
          "value": "张透纶"
        },
        {
          "value": "黄碧仪"
        },
        {
          "value": "陈志文"
        },
        {
          "value": "谢懿富"
        },
        {
          "value": "杨凡靖"
        },
        {
          "value": "蔡秀琴"
        },
        {
          "value": "温惠玲"
        },
        {
          "value": "林宗其"
        },
        {
          "value": "林绍泰"
        },
        {
          "value": "何佳慧"
        },
        {
          "value": "蔡辰纶"
        },
        {
          "value": "王雅雯"
        },
        {
          "value": "叶怡财"
        },
        {
          "value": "冯雅筑"
        },
        {
          "value": "李伦圣"
        },
        {
          "value": "彭正仁"
        },
        {
          "value": "刘小紫"
        },
        {
          "value": "温燕达"
        },
        {
          "value": "刘佳雨"
        },
        {
          "value": "吴婷婷"
        },
        {
          "value": "杨怡君"
        },
        {
          "value": "黄康刚"
        },
        {
          "value": "林辰和"
        },
        {
          "value": "陈世人"
        },
        {
          "value": "吴佩霖"
        },
        {
          "value": "张伟杰"
        },
        {
          "value": "刘友淳"
        },
        {
          "value": "张瑞群"
        },
        {
          "value": "洪紫芬"
        },
        {
          "value": "邓家伟"
        },
        {
          "value": "谢佩任"
        },
        {
          "value": "戎郁文"
        },
        {
          "value": "李治火"
        },
        {
          "value": "林石美"
        },
        {
          "value": "郑雅茜"
        },
        {
          "value": "胡台泰"
        },
        {
          "value": "陈怡盈"
        },
        {
          "value": "李伟"
        }
      ],
    };
  },

  methods: {
    handleIconClick(icon) {
      switch (icon) {
        case "home":
          this.$router
              .replace({
                path: "/index/community/home",
              })
              .then(() => {
                this.activeGroup.activeSubItem = undefined;
                this.activeGroup.activeMenuItem = undefined;
              })
              .catch(() => {
              });
          break;
        case "exit":
          this.$router.replace({
            path: "/index/land",
          });
          break;
        case "shutDown":
          this.$router
              .replace({
                path: "/login",
              })
              .then(() => {
                if (window.myEarth.earth !== undefined) {
                  window.myEarth.earth.destroy();
                }
                window.location.reload();
              });
          break;
        case "fullScreen":
          this.ifShow = !this.ifShow;
          // console.log(this.ifShow);
          // this.$router
          //     .replace({
          //       path: "/index/community/internet/monitor/common/fireTruckSaveCar",
          //     })
          //
          break;
        case "layers":
          this.ifShowCar = !this.ifShowCar;
          break;
      }
    },
    handleClose() {
      this.ifShow = false;  // 将 ifShow 设为 false，隐藏弹窗
    },
    handleCloseCar() {
      this.ifShowCar = false;  // 将 ifShow 设为 false，隐藏弹窗
    },
    handleSearch(selectValue) {
      if (selectValue === null || selectValue === "") {
        console.log("emptySearch")
      }
      if (this.selectedType === "type1") {
        if (selectValue === "社区治理") {
          this.$router
              .replace({
                path: "/index/community/governance/process/street/taskAdd",
              })
        } else if (selectValue === "社区监控") {
          this.$router
              .replace({
                path: "/index/community/entity/facility/common",
              })
        } else if (selectValue === "巡查记录") {
          this.$router
              .replace({
                path: "/index/community/governance/patrol/common/gridMan",
              })
        } else if (selectValue === "社区概况") {
          this.$router
              .replace({
                path: "/index/community/home",
              })
        } else if (selectValue === "监控查看") {
          this.$router
              .replace({
                path: "/index/community/internet/monitor/common/fireDetection",
              })
        } else if (selectValue === "设备管理") {
          this.$router
              .replace({
                path: "/index/community/entity/facility/common",
              })
        } else if (selectValue === "地下车库") {
          this.$router
              .replace({
                path: "/garage/home",
              })
        } else if (selectValue === "事故回放") {
          this.$router
              .replace({
                path: "/index/community/internet/monitor/common/fireTruckSaveMe",
              })
        } else if (selectValue === "任务列表") {
          this.$router
              .replace({
                path: "/index/community/governance/process/street/progress",
              })
        } else if (selectValue === "任务派发") {
          this.$router
              .replace({
                path: "/index/community/governance/process/street/taskAdd",
              })
        } else if (selectValue === "人员信息") {
          this.$router
              .replace({
                path: "/index/community/search/information/common/resident",
              })
        }
      } else if (this.selectedType === "type2") {
        //获取人员id
        let id = 0
        for (let i = 0; i < this.options.length; i++) {
          if (selectValue === this.options[i].value) {
            id = i + 1;
          }
        }
        this.$router
            .replace({
              path: "/index/community/search/information/common/resident",
              query: {id: id} // 假设 currentUser 是你要传递的对象
            })
      }
    },
    handleSelectChange(selectedType) {
      console.log(selectedType)
      if (selectedType === "type1") {
        this.options = this.functionOptions;
      } else if (selectedType === "type2") {
        this.options = this.peopleOptions;
      }
    },
    showOptions() {
      this.$nextTick(() => {
        this.$refs.select.blur(); // 先触发一次失焦事件，确保可以再次聚焦显示下拉框
        this.$refs.select.focus(); // 聚焦到选择框，显示下拉框
      });
    },
    handleFocus() {
      this.$refs.select.focus();
      this.$refs.select.visible = true; // 手动显示下拉菜单
    },
    fliterOption(queryString) {
      let filteredArray = []
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].value.includes(queryString)) {
          filteredArray.push(this.options[i]);
        }
      }
      return filteredArray;
    },
    querySearch(queryString, cb) { // queryString是用户输入的想要查询的内容，cb是回调函数（可以发请求获取数据）
      console.log("如何触发", queryString, cb);

      let apiResult = this.fliterOption(queryString);
      setTimeout(() => {
        // cb([])    cb函数如果返回一个空数组的话，那个模糊搜索输入建议的下拉选项因为length为0就会消失了
        cb(apiResult);
      }, 500);
    },
    // 选中输入框推荐的值的时候触发
    handleSelect(item) { // 参数
      console.log("拿到数据", item);
      this.handleSearch(item.value)
    },
    // 点击clearable清空小图标按钮以后，继续重新在输入框中输入数据，querySearch会触发，但是cb函数不会触发
    // 这样的话就会出现发请求了，也获取数据了，但是input框的输入建议下拉框不呈现在页面上的问题，所以解决方法就是
    // 只要用户点击了
    blurForBug() {
      document.activeElement.blur()
    }


  },
  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
    powerName() {
      // 有get和set方法

      switch (this.userInfo.power) {
          //权限错误
        case -1:
          this.$router
              .replace({
                path: "/login",
              })
              .then(() => {
              });
          break;
          //管理员
        case 0:
          return "管理员";
          //街道
        case 1:
          return "街道";
          //居委会
        case 2:
          return "居委会";
          //网格管理员
        case 3:
          return "网格管理员";
          //网格员
        case 4:
          return "网格员";
      }
    },
  },

};
</script>

<style scoped lang="less">
@font-face {
  font-family: top_title;
  src: url("/src/assets/font/title.ttf");
}

//  修改
.transport_accident_container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  user-select: none;

  .side_bar_container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
}


.top_bar_panel {
  position: absolute;
  background-color: rgba(24, 49, 85, 0.7);
  height: 80px;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  pointer-events: all;

  .top_bar_left_panel {
    display: flex;
    height: 100%;
    flex-direction: row;
    justify-content: left;
    align-items: center;

    .top_bar_title_panel {
      height: 100%;
      width: auto;
      text-shadow: 0 0 10px #478de0, 0 0 20px #478de0, 0 0 30px #478de0;
      letter-spacing: 5px;
      padding-left: 20px;
      display: flex;
      flex-direction: row;
      justify-content: left;
      align-items: center;
      border-bottom: var(--lightBlue) 4px solid;
      box-sizing: border-box;

      .title_text {
        font-family: top_title;
        font-size: 25px;
        color: white;
      }

      .user_icon {
        font-size: 20px;
        color: var(--lightBlue);
        font-weight: 700;
        margin-right: 10px;
        margin-left: 20px;
      }
    }

    .slash_panel {
      width: 60px;
      background-color: var(--lightBlue);
      height: 100%;
      clip-path: polygon(0 calc(100% - 4px),
      0 100%,
      4px 100%,
      100% 4px,
      100% 0,
      calc(100% - 4px) 0);
    }
  }

  .top_bar_right_panel {
    height: 100%;
    display: flex;
    flex-direction: row;
    flex: 1;
    border-top: var(--lightBlue) 4px solid;
    box-sizing: border-box;
    align-items: center;

    .input-wrapper {
      width: 30%;
      color: white;

      .el-input {
        /* 确保输入框的高度足以容纳可能的边框或内边距变化 */
        width: 70%;
        float: left;
      }

      .el-select {
        /* 确保输入框的高度足以容纳可能的边框或内边距变化 */
        width: 30%;
        float: left;
      }

      .el-autocomplete {
        width: 40%;
        float: left;
      }

      .el-button {
        /* 确保输入框的高度足以容纳可能的边框或内边距变化 */
        width: 20%;
        float: left;
      }
    }

    .menu-icon-contianer {
      display: flex;
      flex-direction: column;
      flex: 1;
      box-sizing: border-box;

      .top_bar_menu_icon_panel {
        display: flex;
        flex-direction: row;
        flex: 1;
        justify-content: right;
        align-items: center;
        z-index: 2;

        .top_bar_menu_icon {
          font-size: 25px;
          color: var(--lightBlue);
          font-weight: 700;
          margin: 0 10px;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .top_bar_menu_text_panel {
        display: flex;
        flex-direction: row;
        flex: 1;
        justify-content: right;
        align-items: center;
        z-index: 1;
      }
    }
  }
}

</style>
