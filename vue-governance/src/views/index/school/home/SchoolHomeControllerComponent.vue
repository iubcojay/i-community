<template>
    <SideBarComponent>
        <SchoolLeftComponent v-show="ifSideBarShow.ifLeftPanelShow" slot="leftPanel"></SchoolLeftComponent>
        <SchoolRightComponent v-show="ifSideBarShow.ifRightPanelShow" slot="rightPanel"></SchoolRightComponent>
    </SideBarComponent>
</template>

<script>
import SchoolLeftComponent from './side/SchoolLeftComponent.vue'
import SchoolRightComponent from './side/SchoolRightComponent.vue';
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";

import {mapState} from "vuex"

    export default {
    name: "SchoolHomeControllerComponent",
    components: { SchoolLeftComponent, SchoolRightComponent,SideBarComponent },
    data() {
        return {
            ifSideBarShow: {
                ifLeftPanelShow: false,
                ifRightPanelShow: false
            }
        };
    },
    methods: {
        initComp() {
            this.setSideBarShowStatus(false, false);
            window.myEarth.initPosition("school");
        },
        setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
            this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow;
            this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow;
        },
    },
    computed: {
        ...mapState("userAbout", ["areaInfo"]),
    },

    mounted() {
        this.initComp();
    },
    beforeDestroy() {
        window.myEarth.clearEntities();
    },

}
</script>

<style lang="less" scoped>

</style>
