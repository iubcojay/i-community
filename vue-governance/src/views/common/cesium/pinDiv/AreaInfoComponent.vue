<template>
    <div class="area_info_panel" v-show="area.visible" :style="positionStyle">
        <div class="panel_header">
            <div class="panel_title">{{title}}</div>
            <div class="icon_panel">
                <i class="iconfont icon-list area_info_panel_icon" :style="{color:status===0?'rgb(33, 193, 236)':'white'}" @click="status=0"></i>
                <i class="iconfont icon-user area_info_panel_icon" :style="{color:status===1?'rgb(33, 193, 236)':'white'}" @click="status=1"></i>
            </div>
        </div>
        <div  class="panel_body" style="color: white">
            <div v-show="status===0" class="area_info">
                <table class="area_info_table">
                    <tr>
                        <td>片区名称</td>
                        <td class="area_info_table_content">{{area.name}}</td>
                    </tr>
                    <tr>
                        <td>片区类型</td>
                        <td class="area_info_table_content">
                            {{level}}
                        </td>
                    </tr>
                    <tr>
                        <td>总面积</td>
                        <td class="area_info_table_content">
                           6000㎡
                        </td>
                    </tr>
                    <tr>
                        <td>总户数</td>
                        <td class="area_info_table_content">
                            400户
                        </td>
                    </tr>
                </table>
            </div>
            <div v-show="status===1" class="admin_user_info">
                <div class="profile_panel">
                    <el-image :src="$StaticResourceAddress+area.adminUser.profile" style="height: 100%;width: 100%"></el-image>
                </div>
                <table class="admin_user_info_table">
                    <tr >
                        <td v-if="this.area.type===4">负责人</td>
                        <td v-if="this.area.type!==4">负责机构</td>
                        <td class="area_info_table_content">{{area.adminUser.username}}</td>
                    </tr>
                    <tr>
                        <td>职权等级</td>
                        <td class="area_info_table_content" v-if="area.adminUser.power===1">
                            街道办
                        </td>
                        <td class="area_info_table_content" v-if="area.adminUser.power===2">
                            居委会
                        </td>
                        <td class="area_info_table_content" v-if="area.adminUser.power===3">
                            网格管理员
                        </td>
                        <td class="area_info_table_content" v-if="area.adminUser.power===4">
                            网格员
                        </td>
                    </tr>
                    <tr>
                        <td>联系电话</td>
                        <td class="area_info_table_content">{{area.adminUser.phoneNumber}}</td>
                    </tr>

                </table>
            </div>
        </div>
        <div class="panel_footer">
            <div class="triangle"></div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "AreaInfoComponent",
        props:{
            area: {
                type: Object,
                default: () => {}
            },


        },

        computed:{
            title(){
                switch (this.status) {
                    case 0:
                        return '片区信息'

                    case 1:
                        return '负责单位'

                    default:

                        return '片区信息'
                }
            },
            positionStyle(){
                return {left:this.area.winPos[0]-170 + 'px', bottom: this.area.winPos[3] + 'px' }
            },

            level(){
                switch (this.area.type) {
                    case 1:
                        return '街道'
                    case 2:
                        return '社区'
                    case 3:
                        return '小区'
                    case 4:
                        return '网格'
                }
            }

        },



        data(){
            return{
               status:0
            }
        },

    }
</script>

<style scoped>
    .area_info_panel{
        position: absolute;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        width: 370px;
        height: 200px;
        z-index: -1;
        user-select: none;
        pointer-events: visible;
    }
    .panel_header{
        height: 30px;
        background-color: rgba(24, 49, 85, 0.9);
        border-bottom: 2px white solid;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .panel_title{
        color: white;
        line-height: 30px;
        font-size: 15px;
        padding-left: 10px;
    }

    .icon_panel{
        line-height: 30px;
        color: white;
    }

    .area_info_panel_icon{
        margin-right: 10px;
        margin-left: 10px;
        font-size: 15px;
    }

    .area_info_panel_icon:hover{
        color: var(--lightBlue);
        cursor: pointer;
    }

    .panel_body{
        background-color: rgba(24, 49, 85, 0.9);
        flex: 1;
        color: white;
    }

    .btn_exit{
        margin-right: 10px;
        margin-left: 10px;
        font-size: 15px;
    }

    .btn_exit:hover{
        color: red;
        cursor: pointer;
    }

    .area_info{
        width: 100%;
        height: 100%;
    }

    .admin_user_info{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;

    }

    .admin_user_info_table{
        flex: 1;
        height: 100%;
    }

    .area_info_table{
        width: 100%;
        height: 100%;
    }

    .area_info_table_content{
        text-align: center;
    }

    .profile_panel{
        width: 120px;
        height: 100%;
        padding: 5px 10px;
        box-sizing: border-box;
    }

    tr:nth-child(even) {
        background: rgba(241, 241, 241, 0.1);
    }

    .panel_footer{
        height: 20px;
        background-color: rgba(0,0,0,0);
    }


    .triangle{
        width: 0px;
        height: 0px;
        margin: auto;
        border-top: 20px solid rgba(30,36,44, 0.8);
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;

    }

</style>
