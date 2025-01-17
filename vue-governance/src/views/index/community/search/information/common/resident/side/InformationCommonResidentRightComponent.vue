<template>
    <div>
        <FolderPanelComponent position="right" style="width: 100%" title="居民详细信息">
            <template slot="menuIcon">
                <i class="iconfont icon-list"></i>
                <i class="iconfont icon-address"></i>
                <i class="iconfont icon-close"></i>
            </template>
            <template slot="content">
                <div class="resident_user_info_panel" v-if="supData.currentUser!==undefined">
                    <div class="user_info_profile_panel">
                        <el-image :src="$StaticResourceAddress+supData.currentUser.profileUrl" style="height: 100%;width: 100%"></el-image>
                    </div>
                    <div class="user_info_text_panel">
                        <div class="user_info_text_row">
                            <div class="user_info_text_col">
                                <span class="user_info_text_label">姓名：</span>
                                <span class="user_info_text_content">{{supData.currentUser.name}}</span>
                            </div>
                            <div class="user_info_text_col">
                                <span class="user_info_text_label">性别：</span>
                                <span class="user_info_text_content">{{supData.currentUser.sex}}</span>
                            </div>

                        </div>
                        <div class="user_info_text_row">
                            <div class="user_info_text_col">
                                <span class="user_info_text_label">身份证号：</span>
                                <span class="user_info_text_content">{{supData.currentUser.idNumber}}</span>
                            </div>
                        </div>
                        <div class="user_info_text_row">
                            <div class="user_info_text_col">
                                <span class="user_info_text_label">民族：</span>
                                <span class="user_info_text_content">{{supData.currentUser.national}}</span>
                            </div>
                            <div class="user_info_text_col">
                                <span class="user_info_text_label">婚否：</span>
                                <span class="user_info_text_content">{{supData.currentUser.ifMarry?'是':'否'}}</span>
                            </div>
                        </div>

                        <div class="user_info_text_row">
                            <div class="user_info_text_col">
                                <span class="user_info_text_label">住址：</span>
                                <span class="user_info_text_content">
                                    {{houseData?houseData.description:''}}
                                    <i class="icon_link iconfont icon-share" style="margin-left: 10px" @click="handleHouseClick(houseData)"></i>
                                    <i class="icon_link iconfont icon-path" style="margin-left: 10px;font-size: 20px" @click="handlePathClick()"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="resident_relation_graph_panel" class="resident_relation_graph_panel"></div>
            </template>
        </FolderPanelComponent>

    </div>
</template>

<script>

    import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
    import {mapActions, mapState} from "vuex";

    import HouseInfoPanel from "@/views/index/community/search/information/common/resident/HouseInfoPanel";

    export default {
        name: "InformationCommonResidentRightComponent",
        components: {HouseInfoPanel, FolderPanelComponent},
        props:['supData','supMethods'],
        data() {
            return {
            }
        },
        methods: {

            initComp() {
            },


            drawRelationGraph() {
                let relationShip = this.supData.currentUser.relationShip
                let color = ['#96526B','#D17869','#EBAD60','#F5CF66','#8BAB8D','#FFF6C9','#C8E8C7','#A4DEAB','#85CC9F','#499E8D']
                let relationGraph = this.$echarts.getInstanceByDom(
                    document.getElementById("resident_relation_graph_panel")
                );
                if (relationGraph === null || relationGraph === undefined) {
                    relationGraph = this.$echarts.init(document.getElementById("resident_relation_graph_panel"));
                }

                relationGraph.hideLoading();
                relationShip.nodes.forEach((node) => {
                    node.label = {
                        show: true
                    };
                });

                let option = {
                    title: {
                        text: '人物关系图',
                        textStyle:{
                            color:"#fff"
                        }
                    },
                    tooltip: {},
                    legend: [],
                    animationDuration: 500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',
                            animation: false,
                            data: relationShip.nodes,
                            force: {
                                initLayout: 'circular',
                                gravity: 0,
                                repulsion: 2000,
                                edgeLength: 50
                            },
                            edges: relationShip.links,
                            draggable:true,
                            symbol:'circle',
                            edgeSymbol: ['arrow', 'none'],
                            symbolSize:55,
                            edgeSymbolSize:8,
                            label:{
                                fontSize:15,
                                fontWeight: 'bold'
                            },
                            itemStyle:{
                                color:(param)=>{
                                    return color[param.dataIndex%color.length]
                                },

                            },
                            lineStyle: {
                                curveness: 0.3,
                                color:'#fff',
                                width:2
                            },

                            edgeLabel:{
                                show:true,
                                formatter: (param)=>{
                                    return param.data.label
                                },
                                color:'#fff',
                                fontWeight:'bold'
                            },


                        }
                    ]
                };
                relationGraph.setOption(option);

            },

            handleHouseClick(houseData){
                let cesiumHouseObj = window.myEarth.getEarthObjByRef('house_' + houseData.id)
                cesiumHouseObj.show = true
                window.myEarth.flyToPosition(this.$common.gridPolygonGetCenter(cesiumHouseObj), 120, [-30 * Math.PI / 180, -20 * Math.PI / 180, 0])
                this.houseData.visible = true
                this.setPathShow(false)
            },

            handlePathClick(){
                this.setPathShow(true)
                this.houseData.visible = false;
            }
        },

        computed: {
            houseData(){
                return this.supData.currentUser.houseData
            },
            setPathShow(){
                return this.supMethods.setPathShow;
            }
        },

        watch: {
            'supData.currentUser'(newVal) {
                this.setPathShow(false)
                if (newVal.id) {
                    this.$nextTick(
                        ()=>{
                            this.drawRelationGraph()
                        }
                    )
                }
            }
        },


        mounted() {
            this.initComp()
        },

        beforeDestroy() {
            this.setPathShow(false)
            // this.setShowController({ifLeftPanelShow:true,ifRightPanelShow:false})
            // window.myEarth.clearEntities()
        }

    }
</script>

<style scoped>

    .resident_user_info_panel {
        height: 200px;
        box-sizing: border-box;
        padding: 20px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .resident_relation_graph_panel {
        height: 500px;
    }

    .user_info_profile_panel {
        height: 160px;
        width: 120px;
        margin-right: 10px;
    }

    .user_info_text_panel {
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }

    .user_info_text_row {
        height: auto;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .user_info_text_col {
        flex: 1
    }

    .user_info_text_label {
        font-size: 16px;
        color: white;
        font-weight: 600;
    }

    .user_info_text_content {
        font-size: 14px;
        color: white;
    }

    .icon_link:hover{
        color: var(--lightBlue);
        cursor: pointer;
    }

</style>
