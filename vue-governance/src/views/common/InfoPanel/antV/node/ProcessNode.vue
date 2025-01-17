<template>
    <div class="node_container">
        <div class="left_panel" :class="{'current_user_shadow':status===1}">
            <div class="profile_panel">
                <el-image
                        style="width: 100%; height: 100%"
                        :src="$StaticResourceAddress+imgUrl"
                        fit="fit"></el-image>
            </div>
            <div class="text_panel">
                <div class="area_name_panel" >
                    {{areaName}}
                </div>
                <div class="username_panel">
                    {{username}}
                </div>
            </div>
        </div>
        <div class="right_panel">
            <i v-if="status===1" class="el-icon-loading" style="color: white"></i>
            <i v-if="status===2" class="el-icon-success" style="color: green;font-size: 20px"></i>
        </div>
    </div>

<!--    <div class="node_container">-->
<!--        -->
<!--        -->
<!--        -->
<!--        <div class="left_panel">-->
<!--            <el-image-->
<!--                    style="width: 50px; height: 100%"-->
<!--                    :src="imgUrl"-->
<!--                    fit="fit"></el-image>-->
<!--            <div class="text_panel">-->
<!--                <span style="font-size: 20px">{{areaName}}</span>-->
<!--                <span style="font-size: 15px">{{username}}</span>-->
<!--            </div>-->
<!--        </div>-->

<!--        <div class="right_panel">-->
<!--            <i v-if="status===1" class="el-icon-loading" style="color: white"></i>-->
<!--            <i v-if="status===2" class="el-icon-success" style="color: green;font-size: 20px"></i>-->
<!--        </div>-->
<!--    </div>-->



</template>

<script>
    export default {
        name: "ProcessNode",
        inject: ["getGraph", "getNode"],
        data(){
            return{
                // areaName:'',
                // imgUrl:'',
                // username:'',
                // status:-1
            }
        },

        computed:{
            areaName(){
                return this.getNode().getData()['areaName']
            },
            imgUrl(){
                return this.getNode().getData()['imgUrl']
            },
            username(){
                return this.getNode().getData()['username']
            },
            status(){
                return this.getNode().getData()['status']
            }
        },

        mounted() {
        }
    }
</script>

<style scoped>
    .node_container{
        display: flex;
        flex-direction: row;
        height: 75px;
    }

    .left_panel{
        flex: 1;
        box-sizing: border-box;
        border: 2px solid white;
        border-radius:  5px;
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow: hidden;
        box-sizing: border-box;
    }

    .profile_panel{
        height: 100%;
        width: 60px;
        border-right: 2px solid white;
    }

    .text_panel{
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .area_name_panel{
        width: 100%;
        display: flex;
        flex: 1;
        border-bottom: 2px solid white;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: white;
        text-align: center;
    }

    .username_panel{
        width: 100%;
        flex: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        color: white;
        text-align: center;
    }

    .right_panel{
        width: 20px;
        box-sizing: border-box;
        padding-left: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }






</style>
