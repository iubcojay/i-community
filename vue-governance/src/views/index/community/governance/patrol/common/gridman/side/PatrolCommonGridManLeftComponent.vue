<template>
    <div>
        <FolderPanelComponent title="巡检列表" position="left">
            <template slot="menuIcon">
                <i class="iconfont icon-list"></i>
                <i class="iconfont icon-address"></i>
                <i class="iconfont icon-close"></i>
            </template>
            <template slot="content">
                <el-table
                        ref="patrolTable"
                        :data="supData.patrolList"
                        highlight-current-row
                        style="width: 100%"
                        @row-click="handleRowClick">
                    <el-table-column type="expand">
                        <template slot-scope="{row}">
                            <div class="detail_panel">
                                <div class="detail_item">
                                    <div class="detail_label">任务描述</div>
                                    <div class="detail_text">{{row.description}}</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="巡检编号"
                            min-width="100" >
                    </el-table-column>

                    <el-table-column
                            prop="date"
                            label="执行日期"
                            min-width="100" >
                    </el-table-column>
                </el-table>
            </template>
        </FolderPanelComponent>
    </div>
</template>

<script>


    import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";

    export default {
        name: 'PatrolCommonGridManLeftComponent',
        components:{FolderPanelComponent},
        props:['supData','supMethods'],

        methods:{
            handleRowClick(row){
                this.supMethods.setCurrentPatrol(row)
            }
        },
        watch:{
            "supData.currentPatrol":{
                handler(val){
                    if (!val){
                        this.$refs.patrolTable.setCurrentRow(undefined);
                    }
                }
            }
        }

    }
</script>

<style scoped>
    /deep/ .el-table{
        background-color: rgba(0,0,0,0);
    }

    /deep/ .el-table tr{
        background-color: rgba(0,0,0,0);
        color: white;
    }

    /deep/ .el-table th.el-table__cell{
        background-color: rgba(0,0,0,0);
        font-size: 15px;
    }

    /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
        background-color: rgba(255,255,255,0.1);
        cursor: pointer;
    }

    /deep/ .el-table__expanded-cell{
        background-color: rgba(0,0,0,0)
    }

    /deep/ .el-table__expand-icon{
        color: white;
    }

    ::v-deep .el-table__body tr.current-row>td {
        background: rgba(255,255,255,0.3)!important;
    }

    .detail_panel{
        width: 100%;
    }

    .detail_item{
        color: white;
        display: flex;
        flex-direction: row;
        margin-bottom: 15px;
    }

    .detail_label{
        width: 80px;
        font-size: 15px;
    }

    .detail_text{
        font-size: 15px;
        color: rgba(255,255,255,0.8);
        flex: 1;
        white-space:normal;
        word-break:break-all;
        word-wrap:break-word;

    }




</style>
