<template>
    <div id="container" style="width: 100%;height: 700px"></div>
</template>

<script>
    import {Graph} from "@antv/x6";
    import {DagreLayout} from "@antv/layout";
    import '@antv/x6-vue-shape'
    import {mapState} from "vuex";

    export default {
        name: "ProgressComponent",
        data() {
            return {
                graph: undefined,
                layout: undefined,
                cells: {
                    nodes: [],
                    edges: [],
                }
            }
        },
        props: ['currentTask'],
        methods: {
            //初始化组件
            initComp() {
                this.initCanvas()
            },

            //第一次加载时初始化画布
            initCanvas() {
                this.initGraph()
                this.initLayout()
                this.initNodes()
            },


            //初始化graph
            initGraph() {
                this.graph = new Graph({
                    container: document.getElementById('container'),
                    panning: {
                        enabled: true,
                    },
                    interacting: false,
                })

                this.graph.enableMouseWheel()
            },

            initLayout() {
                this.layout = new DagreLayout({
                    type: 'dagre',
                    rankdir: 'TB',
                    align: 'UL',
                    controlPoints: false,
                    nodesep: 50,
                    ranksep: 30

                })
            },

            refreshGraph() {
                const newModel = this.layout.layout(this.cells)
                this.graph.fromJSON(newModel)
                this.graph.centerContent()

            },


            //添加完node要刷新
            addNode(id, areaName, username, status, imgUrl, sources) {
                this.cells.nodes.push({
                    id: id,
                    shape: 'process-node',
                    data: {
                        areaName: areaName,
                        imgUrl: imgUrl,
                        username: username,
                        status: status
                    }
                })
                for (let item of sources) {
                    this.cells.edges.push({
                        source: item,
                        target: id,
                        connector: {name: 'smooth'},
                        attrs: {
                            line: {
                                stroke: "white",
                                targetMarker: 'classic',
                                strokeDasharray: 5,
                            },
                        },
                    })
                }
            },


            initNodes() {
                if (this.currentTask !== undefined) {
                    //清空已添加的节点和边
                    this.cells.nodes = []
                    this.cells.edges = []
                    let status = this.currentTask.status
                    let committeePendingUrl = '/img/profile/committee.png'
                    let cellPendingUrl = '/img/profile/cell.png'
                    let gridPendingUrl = '/img/profile/grid_man.png'


                    if (this.areaInfo.type <= 2) {
                        this.addNode("street", this.currentTask.streetArea.name, this.currentTask.streetArea.adminUser.username, 0, this.currentTask.streetArea.adminUser.profile, [])

                        if (this.currentTask.taskCommitteeArea !== null) {
                            this.addNode("committee", this.currentTask.taskCommitteeArea.area.name, this.currentTask.taskCommitteeArea.area.adminUser.username, 0, this.currentTask.taskCommitteeArea.area.adminUser.profile, ["street"])
                        } else {
                            this.addNode("committee", "社区", "居委会", 0, committeePendingUrl, ["street"])
                        }


                        if (this.currentTask.taskCellArea !== null) {
                            this.addNode("cell", this.currentTask.taskCellArea.area.name, this.currentTask.taskCellArea.area.adminUser.username, 0, this.currentTask.taskCellArea.area.adminUser.profile, ["committee"])
                        } else {
                            this.addNode("cell", '小区', '网格管理员', 0, cellPendingUrl, ['committee'])
                        }
                    }else if (this.areaInfo.type === 3){
                        if (this.currentTask.taskCommitteeArea !== null) {
                            this.addNode("committee", this.currentTask.taskCommitteeArea.area.name, this.currentTask.taskCommitteeArea.area.adminUser.username, 0, this.currentTask.taskCommitteeArea.area.adminUser.profile, [])
                        } else {
                            this.addNode("committee", "社区", "居委会", 0, committeePendingUrl, [])
                        }

                        if (this.currentTask.taskCellArea !== null) {
                            this.addNode("cell", this.currentTask.taskCellArea.area.name, this.currentTask.taskCellArea.area.adminUser.username, 0, this.currentTask.taskCellArea.area.adminUser.profile, ["committee"])
                        } else {
                            this.addNode("cell", '小区', '网格管理员', 0, cellPendingUrl, ['committee'])
                        }
                    }else{
                        if (this.currentTask.taskCellArea !== null) {
                            this.addNode("cell", this.currentTask.taskCellArea.area.name, this.currentTask.taskCellArea.area.adminUser.username, 0, this.currentTask.taskCellArea.area.adminUser.profile, [])
                        } else {
                            this.addNode("cell", '小区', '网格管理员', 0, cellPendingUrl, [])
                        }

                    }

                    if (this.currentTask.taskGridAreaList.length !== 0) {
                        this.currentTask.taskGridAreaList.forEach(
                            ({area}) => {
                                this.addNode("grid" + area.id, area.name, area.adminUser.username, 0, area.adminUser.profile, ['cell'])
                            }
                        )
                    } else {
                        this.addNode("grid", '网格', '网格员', 0, gridPendingUrl, ['cell'])
                    }

                    this.refreshGraph()
                    this.refreshStatus()
                }
            },

            //展示任务进行状态
            refreshStatus() {
                for (let i = 1; i <= this.currentTask.status; i++) {
                    switch (i) {
                        //1-街道下达任务，居委会未接受
                        case 1:
                            this.finishNode('street')
                            break
                        // 2-居委会接受任务，未安排任务
                        case 2:
                            this.waitNode('committee')
                            break
                        // 3-居委会安排任务，网格管理员未接受
                        case 3:
                            this.finishNode('committee')
                            break
                        // 4-网格管理员接受，未分配网格员
                        case 4:
                            this.waitNode('cell')
                            break
                        //5-网格管理员分配，网格员未接受
                        case 5:
                            this.finishNode('cell')
                            break
                        default:
                            break

                    }

                    //检查部分网格员接受情况
                    this.currentTask.taskGridAreaList.forEach(
                        taskGridArea => {
                            switch (taskGridArea.status) {
                                case 0:
                                    break
                                case 1:

                                    this.waitNode("grid" + taskGridArea.area.id);
                                    break
                                case 2:
                                    this.waitNode("grid" + taskGridArea.area.id);
                                    this.finishNode("grid" + taskGridArea.area.id)
                                    break
                            }
                        }
                    )
                    this.refreshGraph()
                }
            },


            finishNode(id) {
                let node = this.cells.nodes.find(node => node.id === id)
                if (node !== undefined) {
                    node.data.status = 2
                    for (let edge of this.cells.edges) {
                        if (edge.source === id) {
                            edge["attrs"] = {
                                line: {
                                    stroke: '#1890ff',
                                    strokeDasharray: 5,
                                    targetMarker: 'classic',
                                    style: {
                                        animation: 'test 30s infinite linear'
                                    },
                                }
                            }
                        }
                    }
                }

            },

            waitNode(id) {
                let node = this.cells.nodes.find(node => node.id === id)

                if (node !== undefined) {
                    node.data.status = 1
                    for (let edge of this.cells.edges) {
                        if (edge.target === id) {
                            edge["attrs"] = {
                                line: {
                                    stroke: 'green',
                                    targetMarker: 'classic',
                                },
                            }
                        }
                    }
                }
            },
        },

        watch: {
            currentTask() {
                this.$nextTick(
                    ()=>{
                        this.initComp()
                    }
                )
            }
        },

        computed: {
            ...mapState('userAbout', ['userInfo', 'areaInfo']),
        },


        mounted() {
            this.initComp()
        }


    }
</script>

<style>
    @keyframes test {
        to {
            stroke-dashoffset: -1000
        }
    }

</style>