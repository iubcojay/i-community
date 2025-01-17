<template>
    <div class="text_menu_panel">
        <div class="text_menu_item" v-for="menuItem of menuData" :key="menuItem.text">
            <div class="text_menu_text" @click="handleMenuItemClick(menuItem)">
                <span style="font-size: 20px" :class="{ active_item: activeGroup.activeMenuItem === menuItem }">{{
                    menuItem.text }}</span>
                <i v-if="menuItem.subList.length > 0" class="iconfont icon-down" style="font-size: 30px"></i>
            </div>
            <div class="text_menu_sub_item_panel">
                <div class="text_menu_sub_item" v-for="subItem of menuItem.subList" :key="subItem.text"
                    @click="handleSubItemClick(menuItem, subItem)">
                    <div style="white-space:nowrap;" :class="{ active_item: activeGroup.activeSubItem === subItem }">
                        {{ subItem.text }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TopBarTextMenuComponent",
    props: ['menuData', 'activeGroup'],
    methods: {
        initActiveItemMenu() {

            this.activeGroup.activeMenuItem = undefined
            this.activeGroup.activeSubItem = undefined
            this.menuData.forEach(
                menuItem => {

                    if (menuItem.path === this.$route.path) {
                        this.activeGroup.activeMenuItem = menuItem
                        this.activeGroup.activeSubItem = undefined
                    }

                    menuItem.subList.forEach(
                        subItem => {
                            if (subItem.path === this.$route.path) {
                                this.activeGroup.activeMenuItem = menuItem
                                this.activeGroup.activeSubItem = subItem
                            }
                        }
                    )

                }
            )


        },

        handleSubItemClick(menuItem, subItem) {
            menuItem.subLeave = true
            menuItem.itemLeave = true
            this.activeGroup.activeMenuItem = menuItem
            this.activeGroup.activeSubItem = subItem

        },

        handleMenuItemClick(memuItem) {
            if (memuItem.subList.length <= 0) {
                this.activeGroup.activeMenuItem = memuItem
                this.activeGroup.activeSubItem = undefined
                this.$router.replace(
                    {
                        path: memuItem.path
                    }
                )
            }
        }
    },

    watch: {
        'activeGroup.activeSubItem': function (newSubItem, oldSubItem) {
            if (newSubItem !== undefined && (oldSubItem === undefined || newSubItem.path !== oldSubItem.path)) {
                if (newSubItem.path !== this.$route.path) {
                    this.$router.replace(
                        {
                            path: newSubItem.path
                        }
                    )
                }
            }
        },


        $route(to, from) {
            this.initActiveItemMenu()
        },


        menuData() {
            this.initActiveItemMenu()
        }
    },


    mounted() {
        this.initActiveItemMenu()
    },
}
</script>

<style scoped lang="less">
.text_menu_panel {
    display: flex;
    flex-direction: row;
    justify-content: right;

    .text_menu_item {
        height: 100%;
        margin-right: 30px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;

        &:hover {
            cursor: pointer;

            .text_menu_sub_item_panel {
                visibility: visible;
                -webkit-animation: menu_down 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                animation: menu_down 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
            }

            @-webkit-keyframes menu_down {
                0% {
                    -webkit-transform: scaleY(0);
                    transform: scaleY(0);
                    -webkit-transform-origin: 100% 0%;
                    transform-origin: 100% 0%;
                    opacity: 1;
                }

                100% {
                    -webkit-transform: scaleY(1);
                    transform: scaleY(1);
                    -webkit-transform-origin: 100% 0%;
                    transform-origin: 100% 0%;
                    opacity: 1;
                }
            }

            @keyframes menu_down {
                0% {
                    -webkit-transform: scaleY(0);
                    transform: scaleY(0);
                    -webkit-transform-origin: 100% 0%;
                    transform-origin: 100% 0%;
                    opacity: 1;
                }

                100% {
                    -webkit-transform: scaleY(1);
                    transform: scaleY(1);
                    -webkit-transform-origin: 100% 0%;
                    transform-origin: 100% 0%;
                    opacity: 1;
                }
            }

        }

        .text_menu_text {
            color: white;
            display: flex;
            flex-direction: row;
            align-items: center;
            text-shadow: 0 0 10px #478de0, 0 0 20px #478de0, 0 0 30px #478de0;
            font-style: italic;

            .rotate180 {
                animation: rotate180 .5s ease-out 0s;
                animation-fill-mode: both;
            }

            .rotate0 {
                animation: rotate0 .5s ease-out 0s;
                animation-fill-mode: both;
            }

            @keyframes rotate180 {
                0% {
                    transform: rotate(0deg);
                }

                100% {
                    transform: rotate(180deg);
                }
            }

            @keyframes rotate0 {
                0% {
                    transform: rotate(180deg);
                }

                100% {
                    transform: rotate(0deg);
                }
            }
        }

        .text_menu_sub_item_panel {
            position: absolute;
            top: 100%;
            padding-top: 10px;
            right: 0;
            visibility: hidden;

            .text_menu_sub_item {
                height: 35px;
                box-sizing: border-box;
                font-size: 18px;
                line-height: 30px;
                padding-left: 10px;
                padding-right: 100px;
                color: white;
                background-color: rgb(24, 49, 85);

                &:hover {
                    background-color: rgb(65, 89, 124);
                }

            }
        }
    }


    .active_item {
        color: var(--lightBlue);
    }
}
</style>
