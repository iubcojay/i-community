<template>
  <div class="scene_outer_panel">
    <ControllerComponent>
      <router-view></router-view>
    </ControllerComponent>
    <MenuBarComponent
      v-show="ifMenuShow"
      :menu-list="userMenuList"
      :title="menuTitle"
      :position="position"
      :username="username"
    ></MenuBarComponent>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ControllerComponent from "@/views/index/frame/controller/ControllerComponent";
import MenuBarComponent from "@/views/index/frame/menu/MenuBarComponent";

export default {
  name: "SceneComponent",
  components: {
    ControllerComponent,
    MenuBarComponent,
  },
  props: ["userMenuList", "menuTitle", "position", "username"],
  data() {
    return {};
  },
  computed: {
    ...mapState("menuAbout", ["ifMenuShow"]),
  },

  methods: {
    initComponent() {
      document.title = "社会治理数字孪生平台";
    },
  },

  mounted() {
    this.initComponent();
   
  },
};
</script>

<style lang="less" scoped>
.scene_outer_panel {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  cursor: default;
}
</style>
