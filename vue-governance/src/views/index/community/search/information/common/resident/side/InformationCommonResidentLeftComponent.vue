<template>
    <div>
        <FolderPanelComponent position="left" style="width: 100%;" title="居民信息查询">
            <template slot="menuIcon">
                <i class="iconfont icon-list"></i>
                <i class="iconfont icon-address"></i>
                <i class="iconfont icon-close"></i>
            </template>
            <template slot="content">
                <div class="resident_search_panel">
                    <el-input v-model="keyword" placeholder="输入姓名或身份证号进行查询">
                        <i slot="suffix" class="el-input__icon iconfont icon-search"
                           style="font-size: 20px;margin: 0 10px"></i>
                    </el-input>
                </div>
                <div class="resident_info_panel">
                    <div v-for="resident of residentListToShow" class="resident_info_item_panel"
                         :key="'resident_'+ resident.id" @click="supMethods.handleUserItemClick(resident)"
                         :class="{'resident_info_item_panel_active':resident.id === supData.currentUser.id}">
                        <div class="resident_profile_panel">
                            <el-image :src="$StaticResourceAddress+resident.profileUrl" style="height: 100%;width: 100%"></el-image>
                        </div>
                        <div class="resident_text_info_panel">
                            <div class="resident_name_panel">{{resident.name}}</div>
                            <div class="resident_id_panel">{{resident.idNumber}}</div>
                        </div>
                    </div>
                </div>
                <div class="resident_pagination_panel">
                    <el-pagination
                            hide-on-single-page
                            background
                            layout="prev, pager, next"
                            :total="totalPageNum"
                            :page-size="pageSize"
                            :current-page="currentPage"
                            @current-change="(current)=>{currentPage = current}">
                    </el-pagination>
                </div>
            </template>
        </FolderPanelComponent>

    </div>
</template>

<script>
    
    import ArchPanelComponent from "@/views/common/InfoPanel/sidepanel/ArchPanelComponent";
    import {mapActions, mapMutations, mapState} from "vuex";
    import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
    import HouseInfoPanel from "@/views/index/community/search/information/common/resident/HouseInfoPanel";

    export default {
        name: "InformationCommonResidentLeftComponent",
        components: {FolderPanelComponent, ArchPanelComponent,HouseInfoPanel},
        props:['supData','supMethods'],
        data() {
            return {
                currentPage: 1,
                pageSize: 18,
                keyword: '',

            }
        },
        methods: {
            initComp() {
            },
        },

        computed: {

            //包含关键词
            residentListKeyword() {
                return this.supData.residentList.filter((resident) => {
                    if (resident.idNumber.includes(this.keyword) || resident.name.includes(this.keyword))
                        return true
                    else
                        return false
                })
            },

            //分页后
            residentListToShow() {
                //当前页
                return this.residentListKeyword.filter((resident, index) => {
                    if (index < this.currentPage * this.pageSize && index >= (this.currentPage - 1) * this.pageSize)
                        return true
                    else
                        return false
                })
            },

            totalPageNum() {
                return this.residentListKeyword.length
            },
        },

        filters: {
            keywordDraw(str, keyword) {
                return str
            }
        },

        watch: {
            keyword() {
                this.currentPage = 1
            }
        },

        mounted() {
            this.initComp()
        },

    }
</script>

<style scoped>

    /deep/ .el-form-item__label {
        color: white;
        font-size: 15px;
    }

    /deep/ .el-textarea__inner {
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
    }

    /deep/ .el-input__inner {
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
    }

    .resident_search_panel {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 50px;
    }

    .resident_btn_search {
        width: 120px;
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: rgba(64, 158, 255, 0.4);
        color: white;
        font-size: 18px;
        border-radius: 5px;
        margin-left: 10px;
    }

    .resident_btn_search:hover {
        background-color: rgba(64, 158, 255, 0.7);
        cursor: pointer;
    }

    .resident_info_panel {
        height: 420px;
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-start;
        align-content: flex-start;
    }


    .resident_info_item_panel {
        width: 30%;
        margin: 7px 1%;
        height: 50px;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 5px;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border: solid var(--darkBlue) 3px;
    }

    .resident_info_item_panel_active {
        border: solid red 3px;
    }

    .resident_info_item_panel:hover {
        transform: scale(1.1);
        cursor: pointer;
    }

    .resident_text_info_panel {
        width: 60%;
        height: 100%;
        box-sizing: border-box;
        padding-left: 5px;
        padding-right: 5px;
    }

    .resident_pagination_panel {
        margin-bottom: 10px;
    }

    .resident_profile_panel {
        width: 40%;
        height: 100%;
    }

    .resident_name_panel {
        font-size: 15px;
        height: 40%;
        font-weight: 600;
        color: var(--darkBlue);
    }

    .resident_id_panel {
        font-size: 11px;
        word-wrap: break-word;
        height: 60%;
        font-weight: 600;
    }



</style>
