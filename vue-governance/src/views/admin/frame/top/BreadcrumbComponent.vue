<template>
  <div class="bread_outer_panel">
    <div v-for="crumb of breadCrumbList" :key="crumb" class="crumb_item_panel">
        <span> {{ crumb }}</span>
        <i class="iconfont icon-right"></i>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "BreadcrumbComponent",
  props: ["supData", "supMethods"],
  data() {
    return {
        breadCrumbList: []
    }
  },
  computed: {
    menuOptions() {
      return this.supData.menuOptions;
    },
  },
  watch: {
    "$route.path": {
      immediate: true,
      handler(path) {
        const crumbList = [];
        for (const firstLevelMenu of this.menuOptions) {
          for (const secondLevelMenu of firstLevelMenu.children) {
            for (const thirdLevelMenu of secondLevelMenu.children) {
              if (thirdLevelMenu.path === path) {
                crumbList.push(firstLevelMenu.title)
                crumbList.push(secondLevelMenu.title)
                crumbList.push(thirdLevelMenu.title)
                break;
              }
            }
          }
        }
        this.breadCrumbList = crumbList
        
      },
    },
  },
};
</script>

<style lang="less" scoped>
    .bread_outer_panel{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .crumb_item_panel{
            font-size: 16px;

            span{
                font-weight: 500;
                margin: 0 5px;
            }

            i{
                color: gray;
            }


            &:last-child{
                span{
                    color: rgb(2, 77, 137);
                    font-weight: 600;
                }

                i{
                    display: none;
                }
                
            }
        }
       
    }
</style>
