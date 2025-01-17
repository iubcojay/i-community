<template>
    <div>

        <FolderPanelComponent title="摄像头列表" position="left">
            <template slot="menuIcon">
                <i class="iconfont icon-list"></i>
                <i class="iconfont icon-address"></i>
                <i class="iconfont icon-close"></i>
            </template>
            <template slot="content">
                <div class="monitor_list_panel">

                    <div v-for="monitorInfo of supData.monitorList" :key="monitorInfo.id" class="monitor_item_panel">
                        <div class="monitor_item_start_panel">
                            <div class="monitor_item_info_panel">
                                <div class="monitor_item_name_icon">
                                    <el-tooltip effect="light" :content="monitorInfo.status===1?'设备运转正常':'设备故障'"
                                                placement="top-start">
                                        <i class="iconfont icon-monitor" style="font-size: 25px;"
                                           :style="{color:monitorInfo.status===1?'#67C23A':'#F56C6C'}"></i>
                                    </el-tooltip>
                                </div>
                                <div class="monitor_item_name">{{monitorInfo.number}}</div>

                            </div>
                            <div class="monitor_item_control_panel">
                                <el-tooltip :content="monitorInfo.videoVisible?'关闭实时监控画面':'实时监控画面'" placement="top">
                                    <el-switch
                                            style="display: block"
                                            v-model="monitorInfo.videoVisible"
                                            active-color="rgb(33,190,232)"
                                            :inactive-color="monitorInfo.status===1?'rgb(3,78,137)':'gray'"
                                            :disabled="monitorInfo.status===0"
                                            @change="supMethods.handleSwitchChange(monitorInfo)">
                                    </el-switch>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="monitor_item_end_panel">
                            <div class="monitor_item_position_icon">
                                <i class="iconfont icon-address" style="font-size: 15px;"
                                   @click="supMethods.handleAddressClick(monitorInfo)"></i>
                            </div>
                            <div class="monitor_item_position">{{monitorInfo.position}}</div>
                        </div>

                    </div>
                </div>
            </template>
        </FolderPanelComponent>

    </div>
</template>

<script>
    import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
    import IconPinComponent from "@/views/common/cesium/pinDiv/IconPinComponent";
    import MonitorVideoComponent from "@/views/common/cesium/pinDiv/MonitorVideoComponent";



    export default {
        name: "MonitorCommonBroadcastLeftComponent",
        components: {FolderPanelComponent, IconPinComponent, MonitorVideoComponent},
        props:['supData','supMethods'],
        data() {
            return {

            }
        },
        methods: {

            initComp() {

            },
        },
        mounted() {
            this.initComp()

        },

    }
</script>

<style scoped>

    .monitor_list_panel {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

    }

    .monitor_item_panel {
        height: 70px;
        width: calc(100% - 5px);
        margin: 5px 0;
        border-radius: 5px;
        border: 2px solid var(--lightBlue);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

    }

    .monitor_item_start_panel {
        height: 40px;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .monitor_item_end_panel {
        height: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }

    .monitor_item_info_panel {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;
    }

    .monitor_item_name_icon {
        margin: 0 10px;
    }

    .monitor_item_name {
        font-size: 18px;
        color: white;
        font-weight: 500;
    }

    .monitor_item_position_icon {
        color: white;
        margin: 0 10px;
    }

    .monitor_item_position_icon:hover {
        cursor: pointer;
        color: var(--lightBlue);
    }

    .monitor_item_position {
        font-size: 14px;
        color: whitesmoke;
    }

    .monitor_item_control_panel {
        padding-right: 15px;
    }

    .monitor_icon_close:hover{
        color: var(--lightBlue);
        cursor: pointer;
    }


</style>