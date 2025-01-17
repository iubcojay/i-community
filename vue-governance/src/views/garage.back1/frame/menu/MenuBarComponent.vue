<template>
    <div class="menu_panel">
        <TopBarComponent :top-bar-menu-item-list="topBarMenuList">
        </TopBarComponent>
        <BottomBarComponent :menu-item-list="menuItemList" :bottom-bar-menu-item="bottomBarMenuItem"
            :set-bottom-bar-menu-item="setBottomBarMenuItem"></BottomBarComponent>
    </div>
</template>

<script>


import BottomBarComponent from "@/views/garage.back1/frame/menu/bottom/BottomBarComponent";
import TopBarComponent from "@/views/garage.back1/frame/menu/top/TopBarComponent";

export default {
    name: "MenuBarComponent",
    components: { BottomBarComponent, TopBarComponent },
    props: ['menuList'],
    data() {
        return {
            menuItemList: this.menuList,
            bottomBarMenuItem: {},
        }
    },
    methods: {
        // 改变底部导航栏选中选项
        setBottomBarMenuItem(bottomBarMenuItem) {
            this.bottomBarMenuItem = bottomBarMenuItem
        },


    },
    computed: {
        topBarMenuList() {
            return this.bottomBarMenuItem.subList ? this.bottomBarMenuItem.subList : []
        },
    },

}
</script>

<style scoped>
.menu_panel {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    pointer-events: none;
    z-index: 10;
}
</style>
