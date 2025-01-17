<template>
    <div class="controller_panel">
        <SideBarComponent>
            <GarageHomeLeftComponent v-show="ifSideBarShow.ifLeftPanelShow" :sup-methods="leftMethods" :sup-data="leftData"
                slot="leftPanel"></GarageHomeLeftComponent>
            <GarageHomeRightComponent v-show="ifSideBarShow.ifRightPanelShow" :sup-methods="rightMethods"
                :sup-data="rightData" slot="rightPanel"></GarageHomeRightComponent>
        </SideBarComponent>
    </div>
</template>

<script>
import SideBarComponent from '@/views/garage.back1/frame/controller/side/SideBarComponent'
import GarageHomeLeftComponent from '@/views/garage.back1/home/side/GarageHomeLeftComponent'
import GarageHomeRightComponent from '@/views/garage.back1/home/side/GarageHomeRightComponent'

export default {
    name: "GarageHomeControllerComponent",
    components: { SideBarComponent, GarageHomeLeftComponent, GarageHomeRightComponent },
    data() {
        return {
            ifSideBarShow: {
                ifLeftPanelShow: false,
                ifRightPanelShow: false,
            },
        }
    },

    methods: {
        initComp() {
            this.setSideBarShowStatus(true, true)
            // this.setSideBarShowStatus(false, false)
            window.garageScene.resetCamera()
            // setTimeout(() => { window.garage.toggleCeilingRaise(true) }, 1000)

        },

        setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
            this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow
            this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow
        },
    },


    computed: {

        leftData() {
            return {

            }
        },
        leftMethods() {
            return {
                setSideBarShowStatus: this.setSideBarShowStatus,

            }
        },



        rightData() {
            return {

            }
        },

        rightMethods() {
            return {
                setSideBarShowStatus: this.setSideBarShowStatus
            }
        },
    },

    mounted() {
        this.initComp();
    },

}
</script>

<style lang="less" scoped>
.controller_panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>
