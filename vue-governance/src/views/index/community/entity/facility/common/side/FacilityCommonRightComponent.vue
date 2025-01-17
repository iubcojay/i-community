<template>
    <div>
        <ArchPanelComponent v-if="supData.currentFacility" position="right">
            <template slot="content">
                <div class="facility_information_panel">
                    <div class="facility_img_panel">
                        <el-image style="height: 100%;width: 100%" :src="$StaticResourceAddress+supData.currentFacility.imgUrl"></el-image>
                    </div>
                    <div class="facility_text_panel">
                        <div class="facility_text_row">
                            <div class="facility_text_col">
                                <div class="facility_text_label">设 施 名 称</div>
                                <div class="facility_text_content">{{supData.currentFacility.name}}</div>
                            </div>

                            <div class="facility_text_col">
                                <div class="facility_text_label">设 施 编号</div>
                                <div class="facility_text_content">{{supData.currentFacility.number}}</div>
                            </div>
                        </div>
                    </div>

                    <div class="facility_text_panel">
                        <div class="facility_text_row">
                            <div class="facility_text_col">
                                <div class="facility_text_label">设 施 类 型</div>
                                <div class="facility_text_content">{{supData.currentFacility.type | typeIntToStr}}</div>
                            </div>
                            <div class="facility_text_col">
                                <div class="facility_text_label">设 施 状 态</div>
                                <div class="facility_text_content" :style="{color:supData.currentFacility.status===1?'#67C23A':'#F56C6C'}">{{supData.currentFacility.status | statusIntToStr}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="facility_text_panel">
                        <div class="facility_text_row">
                            <div class="facility_text_col">
                                <div class="facility_text_label">设 施 描 述</div>
                                <div class="facility_text_content">{{supData.currentFacility.description}}</div>
                            </div>

                        </div>

                    </div>


                </div>
            </template>
        </ArchPanelComponent>
    </div>
</template>

<script>
    import ArchPanelComponent from "@/views/common/InfoPanel/sidepanel/ArchPanelComponent";
    import {mapState} from "vuex";

    export default {
        name: "FacilityCommonRightComponent",
        components:{ArchPanelComponent},
        props:['supMethods','supData'],
        filters:{
            typeIntToStr(type){
                switch (type) {
                    case 1:
                        return '摄像头'
                    case 2:
                        return '消防栓'
                    case 3:
                        return '井盖'
                    case 4:
                        return '垃圾桶'
                }
            },

            statusIntToStr(type){
                switch (type) {
                    case 0:
                        return '异常'
                    case 1:
                        return '正常'
                }
            }
        }

    }
</script>

<style scoped>
    .facility_img_panel{
        width: 100%;
        height: 200px;
        margin-bottom: 20px;

    }



    .bounce-in-right {
        -webkit-animation: bounce-in-right 1.1s both;
        animation: bounce-in-right 1.1s both;
    }

    .facility_text_row{
        height: 45px;
        margin: 10px 0px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;
    }

    .facility_text_col{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        margin: 20px;
        /*background-color: pink;*/
    }

    .facility_text_label{
        width: 100px;
        color: white;
        font-weight: 900;
    }

    .facility_text_content{
        color: var(--lightBlue);
        font-weight: 700;
    }

    @-webkit-keyframes bounce-in-right {
        0% {
            -webkit-transform: translateX(600px);
            transform: translateX(600px);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
            opacity: 0;
        }
        38% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
            opacity: 1;
        }
        55% {
            -webkit-transform: translateX(68px);
            transform: translateX(68px);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }
        72% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
        }
        81% {
            -webkit-transform: translateX(32px);
            transform: translateX(32px);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }
        90% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
        }
        95% {
            -webkit-transform: translateX(8px);
            transform: translateX(8px);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }
        100% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
        }
    }
    @keyframes bounce-in-right {
        0% {
            -webkit-transform: translateX(600px);
            transform: translateX(600px);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
            opacity: 0;
        }
        38% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
            opacity: 1;
        }
        55% {
            -webkit-transform: translateX(68px);
            transform: translateX(68px);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }
        72% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
        }
        81% {
            -webkit-transform: translateX(32px);
            transform: translateX(32px);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }
        90% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
        }
        95% {
            -webkit-transform: translateX(8px);
            transform: translateX(8px);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }
        100% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
        }
    }


</style>
