<template>
    <div id="container" style="width: 100%;height: 100%"></div>
</template>

<script>
    import {Graph} from "@antv/x6";
    import {DagreLayout} from "@antv/layout";
    import '@antv/x6-vue-shape'
    import dagre from 'dagre'
    import {mapState} from "vuex";

    export default {
        name: "AreaArchitectureComponent",
        data() {
            return {
                graph: undefined,
                // layout: undefined,
                cells: {
                    nodes: [],
                    edges: [],
                }
            }
        },
        props: ['areaArchitectureList','currentAreaList','dir','selectType'],
        computed:{
          ...mapState('userAbout',["userInfo",'areaInfo'])
        },
        methods: {
            //初始化组件
            initComp() {
                this.initCanvas()
            },

            //第一次加载时初始化画布
            initCanvas() {
                this.initGraph()
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

            layout() {
                const nodes = this.graph.getNodes()
                const edges = this.graph.getEdges()
                const g = new dagre.graphlib.Graph()
                g.setGraph({rankdir: this.dir, nodesep: 10, ranksep:10,})
                g.setDefaultEdgeLabel(() => ({}))

                let width = 300
                let height = 100
                switch (this.dir) {
                    case 'LR':
                        width = 300
                        height = 100
                        break
                    case 'TB':
                        width = 200
                        height = 100
                        break
                    default:
                        width = 300
                        height = 100
                }


                nodes.forEach((node) => {
                    g.setNode(node.id, {width, height})
                })

                edges.forEach((edge) => {
                    const source = edge.getSource()
                    const target = edge.getTarget()
                    g.setEdge(source.cell, target.cell)
                })

                dagre.layout(g)


                this.graph.freeze()

                g.nodes().forEach((id) => {
                    const node = this.graph.getCell(id)
                    if (node) {
                        const pos = g.node(id)
                        node.position(pos.x, pos.y)
                    }
                })

                edges.forEach((edge) => {
                    const source = edge.getSourceNode()
                    const target = edge.getTargetNode()
                    const sourceBBox = source.getBBox()
                    const targetBBox = target.getBBox()
                    if ((this.dir === 'LR' || this.dir === 'RL') && sourceBBox.y !== targetBBox.y) {
                        const gap =
                            this.dir === 'LR'
                                ? targetBBox.x - sourceBBox.x - sourceBBox.width
                                : -sourceBBox.x + targetBBox.x + targetBBox.width
                        const fix = this.dir === 'LR' ? sourceBBox.width : 0
                        const x = sourceBBox.x + fix + gap / 2
                        edge.setVertices([
                            {x, y: sourceBBox.center.y},
                            {x, y: targetBBox.center.y},
                        ])
                    } else if (
                        (this.dir === 'TB' || this.dir === 'BT') &&
                        sourceBBox.x !== targetBBox.x
                    ) {
                        const gap =
                            this.dir === 'TB'
                                ? targetBBox.y - sourceBBox.y - sourceBBox.height
                                : -sourceBBox.y + targetBBox.y + targetBBox.height
                        const fix = this.dir === 'TB' ? sourceBBox.height : 0
                        const y = sourceBBox.y + fix + gap / 2
                        edge.setVertices([
                            {x: sourceBBox.center.x, y},
                            {x: targetBBox.center.x, y},
                        ])
                    } else {
                        edge.setVertices([])
                    }
                })

                this.graph.unfreeze()
            },


            refreshGraph() {
                this.graph.fromJSON(this.cells)
                this.layout()
                this.graph.centerContent()
            },


            //添加完node要刷新
            addNode(area, status, sources) {
                this.cells.nodes.push({
                    id: area.id,
                    shape: 'area-architecture-node',
                    data: {
                        area:area,
                        status:status,
                        handleNodeClick:this.handleNodeClick,

                        //用于演示
                        supAreaType:this.areaInfo.type

                    }
                })
                for (let item of sources) {
                    this.cells.edges.push({
                        source: item,
                        target: area.id,
                        // connector: {name: 'smooth'},
                        // attrs: {
                        //     line: {
                        //         stroke: "gray",
                        //         targetMarker: 'classic',
                        //     },
                        // },
                        shape: 'org-edge',
                    })
                }
            },

            initNodes() {
                //清空已添加的节点和边
                this.cells.nodes = []
                this.cells.edges = []
                this.areaArchitectureList.forEach(
                    area => {
                        let status = 0
                        if (this.currentAreaList.findIndex(item=>area.id === item.id)!==-1){
                            status = 1
                        }

                        if (area.type !== 1) {
                            this.addNode(area, status,[area.superArea.id])
                        } else {
                            this.addNode(area,status, [])
                        }
                    }
                )
                this.refreshGraph()
            },

            handleNodeClick(area){
                if (this.currentAreaList.findIndex(currentArea=>currentArea.id===area.id)===-1){
                    if (this.selectType === area.type){
                        this.currentAreaList.push(area)
                    }
                }else {
                    this.currentAreaList.splice(this.currentAreaList.findIndex(currentArea=> currentArea.id === area.id),1)
                }
            },
        },
        watch:{
            areaArchitectureList(){
                this.initNodes()
            },
            currentAreaList(){
                const nodes = this.graph.getNodes()
                nodes.forEach(
                    node=>{

                    }
                )
                this.initNodes()
            },
            // dir(){
            //     this.initComp()
            // }

        },

        mounted() {
            this.initComp()
        }


    }
</script>

<style scoped>
    /deep/ .el-drawer__body {
        width: 100%;
    }


</style>