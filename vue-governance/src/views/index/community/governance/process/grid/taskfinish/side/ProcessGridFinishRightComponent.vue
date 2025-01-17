<template>
    <div>
      <FolderPanelComponent title="任务总结" position="right">
        <template slot="menuIcon">
          <i class="iconfont icon-list"></i>
          <i class="iconfont icon-address"></i>
          <i class="iconfont icon-close"></i>
        </template>
        <template slot="content">
          <div class="content_panel">
            <div class="panel_title_text">
              任务完成情况
            </div>
            <el-input
              type="textarea"
              :maxlength="200"
              :rows="8"
              placeholder="请填写任务完成情况"
              v-model="resultInformation"
              style="font-size: 18px;"
            ></el-input>
            <div class="button_panel">
              <el-button type="primary" plain @click="handleSubmitTaskBtnClick">提交任务</el-button>
            </div>
          </div>
        </template>
      </FolderPanelComponent>
    </div>
  </template>
  
  <script>
  import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
  import { mapState } from "vuex";
  
  export default {
    name: "ProcessGridFinishRightComponent",
    components: { FolderPanelComponent },
    props: ["supData", "supMethods"],
    data() {
      return {
        resultInformation: "",
      };
    },
    computed: {
      ...mapState("userAbout", ["userInfo", "areaInfo"]),
      selectedTask() {
        return this.supData.selectedTask;
      },
    },
    methods: {
      handleSubmitTaskBtnClick() {
        if (this.resultInformation===""){
            this.$message.error("提交任务前请先填写任务完成情况")
        }else {
            this.supMethods.submitTask(this.selectedTask.id,this.userInfo.id,this.resultInformation)
            this.resultInformation = ""
        }
      },
  
      async setFakePositionInformation(taskId) {
        let param = this.$common.packagingAxiosParam({
          gridAreaId: this.areaInfo.id,
        });
  
        let positionInformation = await this.$axios
          .post("/indexProcessGrid/getBuildingListByGridAreaId", param)
          .then(({ data }) => {
            let list = data;
            let positionInformation = [];
            list.forEach((building) => {
              let floorNum = 14;
              let houseNum = 2;
              let apartmentNum = 3;
  
              let buildingPosition = {
                name: building.name,
                id: building.id,
                progress: [],
              };
              for (let apartment = 1; apartment <= 1; apartment++) {
                let apartmentList = [];
                for (let floor = 1; floor <= floorNum; floor++) {
                  let floorList = [];
                  for (let house = 1; house <= houseNum; house++) {
                    let status = 2;
                    let remark = "";
                    switch (status) {
                      case 0:
                        break;
                      case 1:
                        remark = "走访时住户不在家";
                        break;
                      case 2:
                        remark = "住户积极配合网格员的走访，如实回答了相关问题";
                        break;
                    }
                    floorList.push({
                      houseNumber: `${floor}0${house}`,
                      status: status,
                      remark: remark,
                    });
                  }
                  apartmentList.push(floorList);
                }
                buildingPosition.progress.push(apartmentList);
              }
  
              for (let apartment = 2; apartment <= apartmentNum; apartment++) {
                let apartmentList = [];
                for (let floor = 1; floor <= floorNum; floor++) {
                  let floorList = [];
                  for (let house = 1; house <= houseNum; house++) {
                    let status = Math.floor(Math.random() * 3);
                    let remark = "";
                    switch (status) {
                      case 0:
                        break;
                      case 1:
                        remark = "走访时住户不在家";
                        break;
                      case 2:
                        remark = "住户积极配合网格员的走访，如实回答了相关问题";
                        break;
                    }
                    floorList.push({
                      houseNumber: `${floor}0${house}`,
                      status: status,
                      remark: remark,
                    });
                  }
                  apartmentList.push(floorList);
                }
                buildingPosition.progress.push(apartmentList);
              }
  
              positionInformation.push(buildingPosition);
            });
            return positionInformation;
          });
  
        param = this.$common.packagingAxiosParam({
          taskId: taskId,
          gridAreaId: this.areaInfo.id,
          progressInformation: JSON.stringify(positionInformation),
        });
        await this.$axios.post("/indexProcessGrid/setTaskProgress", param);
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  /deep/ .el-form-item__label {
    color: white;
    font-size: 15px;
  }
  
  /deep/ .el-textarea__inner {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  /deep/ .el-input__inner {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  /deep/ .el-textarea__inner::-webkit-scrollbar {
    width: 5px;
    height: 10px;
    background: transparent;
    border-radius: 4px;
  }
  
  /deep/ .el-textarea__inner::-webkit-scrollbar-thumb {
    background-color: #c7c9cc;
    border-radius: 3px;
  }
  
  .button_panel {
    margin-top: 10px;
    text-align: right;
  }
  
  .panel_title_text {
    font-size: 20px;
    color: white;
    margin-bottom: 10px;
  }
  </style>
  