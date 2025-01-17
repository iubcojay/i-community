<template>
  <div>
    <FolderPanelComponent title="下达任务" position="left">
      <template slot="menuIcon">
        <i class="iconfont icon-list"></i>
        <i class="iconfont icon-address" :style="{color:ifInfoPanelShow?'#21c2ed':'white'}"></i>
        <i class="iconfont icon-close"></i>
      </template>
      <template slot="content">
        <el-form :model="taskPostData" label-width="100px" :rules="rules" ref="taskPostForm">
          <el-form-item label="任务标题" prop="title">
            <el-input
              type="text"
              :maxlength="50"
              placeholder="请输入任务标题"
              v-model="taskPostData.title"
            ></el-input>
          </el-form-item>
          <el-form-item label="任务描述" prop="description">
            <el-input
              type="textarea"
              :maxlength="200"
              :rows="5"
              placeholder="请输入任务描述"
              v-model="taskPostData.description"
            ></el-input>
          </el-form-item>
          <el-form-item label="截止时间" prop="scheduledTime">
            <el-date-picker
              v-model="taskPostData.scheduledTime"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
          <div
            class="appoint_button"
            :class="[(taskPostData.title!==''&&taskPostData.description!==''&&taskPostData.scheduledTime)?'appoint_button_active':'appoint_button_disabled',
            supData.selectedParticipantList.length>0?'appoint_button_success':''
            ]"
            @click="handleAppointButtonClick"
          >
            <i class="iconfont icon-progress icon_progress"></i>
            <span>任 务 委 派</span>
          </div>
          <div class="submit_button_group_panel">
            <el-button type="primary" @click="handleTaskPostClick('taskPostForm')">下达任务</el-button>
            <el-button @click="handleResetClick('taskPostForm')">重置</el-button>
          </div>
        </el-form>
      </template>
    </FolderPanelComponent>
  </div>
</template>

<script>
import { mapState } from "vuex";

import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
import AreaInfoComponent from "@/views/common/cesium/pinDiv/AreaInfoComponent";

export default {
  name: "ProcessStreetTaskAddLeftComponent",
  components: { FolderPanelComponent, AreaInfoComponent },
  props: ["supData", "supMethods"],
  data() {
    return {
      ifInfoPanelShow: false,

      rules: {
        title: [{ required: true, message: "请输入任务标题", trigger: "blur" }],
        description: [
          { required: true, message: "请输入任务介绍", trigger: "blur" }
        ],
        committeeId: [
          {
            required: true,
            message: "请选择执行任务的居委会",
            trigger: "change"
          }
        ],
        scheduledTime: [
          { required: true, message: "请设置任务截止时间", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
    taskPostData() {
      return this.supData.taskData;
    }
  },

  methods: {
    handleTaskPostClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.supData.selectedParticipantList.length === 0) {
            this.$message.error("请选择要下发的社区！");
          } else {
            let param = this.$common.packagingAxiosParam({
              ...this.taskPostData,
              streetIdList: JSON.stringify([this.areaInfo.id]),
              streetUserIdList: JSON.stringify([this.userInfo.id]),
              committeeIdList: JSON.stringify(
                this.supData.selectedParticipantList.map(
                  participant => participant.areaId
                )
              ),
              committeeUserIdList: JSON.stringify(
                this.supData.selectedParticipantList.map(
                  participant => participant.userId
                )
              )
            });
            this.$axios.post("/task/street/postTask", param).then(({ data }) => {
              this.$message.success("任务下达成功！");
              this.handleResetClick(formName);
            });
          }
        } else {
          return false;
        }
      });
    },

    handleResetClick(formName) {
      this.$refs[formName].resetFields();
      this.supData.selectedParticipantList.splice(0,this.supData.selectedParticipantList.length)
      
    },

    handleAppointButtonClick() {
      if (
        this.taskPostData.title !== "" &&
        this.taskPostData.description !== ""
      ) {
        this.supMethods.setOrganizationChartShow(true);
      } else {
        this.$message({
          message: "委派前请填写任务信息！",
          type: "warning"
        });
      }
    }
  }
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

.appoint_button {
  width: 300px;
  height: 35px;
  margin: 0 0px 20px 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 700;

  .icon_progress {
    font-size: 20px;
    margin-right: 10px;
  }
}

.appoint_button_active {
  background: rgba(33, 194, 237, 0.1);
  color: rgb(33, 194, 237);
  border: 2px solid rgb(33, 194, 237);
  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }
}

.appoint_button_success {
  background: rgba(103,194,58, 0.1);
  color: rgb(103,194,58);
  border: 2px solid rgb(103,194,58, 237);
}

.appoint_button_disabled {
  background: rgba(128, 128, 128, 0.3);
  color: gray;
  border: 2px solid gray;

  &:hover {
    cursor: not-allowed;
  }
}

.submit_button_group_panel {
  margin: 0 0px 20px 20px;
  display: flex;
  flex-direction: row;
}
</style>