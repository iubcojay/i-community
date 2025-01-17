<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  mounted() {
    document.title = "智慧社区综合治理系统";
  },
};
</script>

<style lang="less">
@import "~hover.css/css/hover.css";

html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  --lightBlue: rgb(33, 194, 237);
  --darkBlue: rgb(2, 77, 137);
  cursor: default;
}

* {
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  height: 100%;
}

/*设置滚动条样式*/
.pretty_scrollbar {
  overflow: auto;
}

.pretty_scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 10px;
  background: transparent;
  border-radius: 4px;
}

.pretty_scrollbar::-webkit-scrollbar-thumb {
  background-color: #c7c9cc;
  border-radius: 3px;
}

.el-table__body-wrapper::-webkit-scrollbar {
  width: 5px;
  height: 10px;
  background: transparent;
  border-radius: 4px;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #c7c9cc;
  border-radius: 3px;
}

a {
  text-decoration: none;
}
</style>
