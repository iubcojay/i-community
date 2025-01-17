<template>
    <div>
        <ArchPanelComponent position="left" style="bottom: 0;width: 60%">
            <template slot="content">
                <div class="show_class_item_panel">
                    <div class="show_class_item" style="color: #409EFF" :class="{'show_class_item_active':supData.showStatus===-1}" @click="supMethods.handleShowClassClick(-1)">全部</div>
                    <div class="show_class_item" style="color:#67C23A" :class="{'show_class_item_active':supData.showStatus===1}" @click="supMethods.handleShowClassClick(1)">正常</div>
                    <div class="show_class_item" style="color: #F56C6C" :class="{'show_class_item_active':supData.showStatus===0}" @click="supMethods.handleShowClassClick(0)">异常</div>
                </div>
                <el-checkbox-group v-model="supData.selectedSampleArray">
                    <div v-for="sample of supData.sampleList" class="sample_row"
                         :key="sample.type"
                         :class="{sample_row_active:supData.selectedSampleArray.indexOf(sample.type)!==-1}"
                         @click.prevent="supMethods.handleSampleRowClick(sample.type)">
                        <div class="sample_check_box">
                            <el-checkbox :label="sample.type"><br/></el-checkbox>
                        </div>
                        <div class="sample_icon_panel">
                            <i class="iconfont sample_icon" :class="[sample.iconClass]"
                               :style="{color: sample.color}"></i>
                        </div>
                        <div class="sample_text" :style="{color: sample.color}">
                            {{sample.text}}
                        </div>
                    </div>
                </el-checkbox-group>
            </template>
        </ArchPanelComponent>
    </div>
</template>

<script>
    import ArchPanelComponent from "@/views/common/InfoPanel/sidepanel/ArchPanelComponent";
    import IconPinComponent from "@/views/common/cesium/pinDiv/IconPinComponent";

    export default {
        name: "FacilityCommonLeftComponent",
        components: {IconPinComponent, ArchPanelComponent},
        props:['supMethods','supData'],
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
    .show_class_item_panel{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 40px;

    }

    .show_class_item{
        flex: 1;
        height: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border: solid 2px var(--darkBlue);
    }

    .show_class_item:nth-child(1){
       border-radius: 15px 0 0 15px;
    }


    .show_class_item:nth-child(3){
        border-radius: 0px 15px 15px 0;
    }

    .show_class_item_active{
        border: solid 2px var(--lightBlue);
    }

    .show_class_item:hover{
        cursor: pointer;
        border: solid 2px var(--lightBlue);
    }

    .sample_row {
        height: 50px;
        box-sizing: border-box;
        border-radius: 15px;
        border: solid 3px var(--darkBlue);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 10px 0;
    }

    .sample_row:hover {
        cursor: pointer;
    }

    .sample_row_active {
        border: solid 3px var(--lightBlue);
    }

    .sample_check_box {
        width: 40px;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: right;
    }

    .sample_icon_panel {
        width: 40px;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 10px;
        color: white;
    }

    .sample_icon {
        font-size: 25px;
    }

    .sample_text {
        flex: 1;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        color: white;
        font-size: 18px;
    }

</style>