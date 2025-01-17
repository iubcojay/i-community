<template>
  <div class="test_outer_panel">
    <test-data-component :list="list"></test-data-component>
  </div>
</template>

<script>

import TestDataComponent from '@/views/test/TestDataComponent'
export default {
  name: "TestPanelPage",
  components: {TestDataComponent },
  data() {
    return {
      list: undefined
    }
  },

  mounted () {
    console.log(document.querySelector('.test_outer_panel'));;
  },
};
</script>

<style lang="less" scoped>
.test_outer_panel {
  width: 100%;
  height: 100%;
}
</style>