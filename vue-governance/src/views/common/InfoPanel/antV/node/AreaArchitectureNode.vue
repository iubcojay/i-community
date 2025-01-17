<template>
  <div class="node_container" :class="{'current_user_shadow':status===1}" @click="handleNodeClick">
    <div class="profile_panel">
      <el-image
        :src="$StaticResourceAddress+profileUrl"
        fit="fill"
        style="height: 100%;width: 100%"
      ></el-image>
    </div>
    <div class="text_panel">
      <div class="area_name_panel">{{areaName}}</div>
      <div class="admin_username_list_panel">
        <span
          v-for="adminUser of adminUserList"
          :key="adminUser.username"
          class="admin_username_panel"
        >{{adminUser.username}}</span>
        <!-- {{username}} -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AreaArchitectureNode",
  inject: ["getGraph", "getNode"],

  computed: {
    areaId() {
      return this.getNode().getData()["area"].id;
    },

    areaName() {
      return this.getNode().getData()["area"].name;
    },

    areaType() {
      return this.getNode().getData()["area"].type;
    },

    adminUserList() {
      return this.getNode().getData()["area"].adminUser;
    },

    profileUrl() {
      return this.getNode().getData()["area"].profile;
    },

    status() {
      return this.getNode().getData()["status"];
    }
  },

  methods: {
    handleNodeClick() {
      this.getNode()
        .getData()
        ["handleNodeClick"](this.getNode().getData()["area"]);
      console.log(this.getNode().getData()["area"]);
    }
  }
};
</script>

<style scoped lang="less">
.node_container {
  width: 200px;
  height: 80px;
  border: 2px solid white;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;

  &:hover {
    cursor: pointer;
  }

  .profile_panel {
    height: 100%;
    width: 60px;
    border-right: 2px solid white;
  }

  .text_panel {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .area_name_panel {
      width: 100%;
      display: flex;
      flex: 1;
      border-bottom: 2px solid white;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: white;
      text-align: center;
    }

    .admin_username_list_panel {
      width: 100%;
      flex: 2;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      color: white;
      text-align: center;

      .admin_username_panel {
        margin: 0 5px;
      }
    }
  }
}

.current_user_shadow {
  border: var(--lightBlue) solid 2px;
  box-shadow: 0 0 4px var(--lightBlue), 0 0 5px var(--lightBlue),
    0 0 6px var(--lightBlue);
}
</style>
