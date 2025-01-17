<template>
    <SideBarComponent>
        <PatrolCommonDroneLeftComponent v-show="ifSideBarShow.ifLeftPanelShow" slot="leftPanel"></PatrolCommonDroneLeftComponent>
        <PatrolCommonDroneRightComponent v-show="ifSideBarShow.ifRightPanelShow" slot="rightPanel"></PatrolCommonDroneRightComponent>
    </SideBarComponent>
</template>

<script>
    import PatrolCommonDroneLeftComponent
        from "@/views/index/community/governance/patrol/common/drone/side/PatrolCommonDroneLeftComponent";
    import PatrolCommonDroneRightComponent
        from "@/views/index/community/governance/patrol/common/drone/side/PatrolCommonDroneRightComponent";
    import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";


    export default {
        name: "PatrolCommonDroneControllerComponent",
        components: {PatrolCommonDroneRightComponent, PatrolCommonDroneLeftComponent, SideBarComponent},
        data () {
            return{
                ifSideBarShow:{
                    ifLeftPanelShow:false,
                    ifRightPanelShow:false
                },
                droneCesiumObj:undefined,
                dronePathCesiumObj:undefined,
                dronePathJson : {
                    "xbsjType": "Path",
                    "xbsjGuid": "36ba0cdf-f3f1-4ae2-a64a-349a6c0470e5",
                    "name": "无人机飞行轨迹",
                    "positions": [
                        [
                            2.0428300718889734,
                            0.6398912045433471,
                            49.57206302503678
                        ],
                        [
                            2.042828681800933,
                            0.6399217167203584,
                            53.266697847362884
                        ],
                        [
                            2.042824179284859,
                            0.6399249359308967,
                            60.88111200435661
                        ],
                        [
                            2.04281767759963,
                            0.6399264825723753,
                            65.45245483570996
                        ],
                        [
                            2.0427780664786592,
                            0.6399273241791787,
                            95.5968553396211
                        ],
                        [
                            2.042771018404041,
                            0.6399237124319104,
                            100.7575563160773
                        ],
                        [
                            2.042766408762845,
                            0.639918094244603,
                            107.58676328269178
                        ],
                        [
                            2.042772548902916,
                            0.6398740590540481,
                            120.718553188877
                        ],
                        [
                            2.042776557138687,
                            0.6398726976631737,
                            122.28699046141887
                        ],
                        [
                            2.042787595324297,
                            0.639870303852595,
                            113.73423409335841
                        ],
                        [
                            2.042813840083812,
                            0.6398735866327603,
                            89.31069184578082
                        ],
                        [
                            2.042821431783473,
                            0.6398769343970659,
                            82.79954028350807
                        ],
                        [
                            2.0428265177554783,
                            0.6398820326762568,
                            66.37059103867358
                        ],
                        [
                            2.04282871013057,
                            0.6398886779519481,
                            46.18322736951895
                        ]
                    ],
                    "rotations": [
                        [
                            6.658732438527497,
                            -0.3595632585505866,
                            0.001166003166741092
                        ],
                        [
                            5.613779498822579,
                            -0.544541701273332,
                            6.281259728743252
                        ],
                        [
                            5.2043761351187445,
                            -0.6245781273127715,
                            6.2804012868715215
                        ],
                        [
                            4.985971727495529,
                            -0.5258536192199993,
                            6.280118718723931
                        ],
                        [
                            4.311354851886947,
                            -0.5087047343066703,
                            6.280242249489789
                        ],
                        [
                            3.921330503705252,
                            -0.6604172372161679,
                            6.280949262949827
                        ],
                        [
                            3.6156865763390083,
                            -0.6038032080605318,
                            6.281728704922664
                        ],
                        [
                            2.0128954939958446,
                            -0.5995191399576191,
                            0.0028856534752135232
                        ],
                        [
                            1.9346172378034723,
                            -0.6531457201165761,
                            0.003003678556051881
                        ],
                        [
                            1.6970524102351376,
                            -0.7534784210407937,
                            0.003144932544645762
                        ],
                        [
                            7.489547824510897,
                            -0.6728930412817443,
                            0.0029938264080815458
                        ],
                        [
                            7.154707729391286,
                            -0.8674256834230771,
                            0.0023580787688102234
                        ],
                        [
                            6.626811289303731,
                            -1.0724649414009721,
                            0.000901134765498135
                        ],
                        [
                            6.668869094394712,
                            -0.6832346496379573,
                            0.0012069091796025333
                        ]
                    ],
                    "loop": true,
                    "currentSpeed": 4,
                    "loopPlay": true,
                    "show":false,
                    "cameraAttached":true,
                    "playing":true,
                    // "alwaysAlongThePath": true,
                } ,
                droneJson:{
                    "xbsjType": "Model",
                    "name": "drone",
                    "url": `${this.$StaticResourceAddress}/model/CesiumDrone.glb`,
                    "distanceDisplayCondition": [
                        0,
                        5000
                    ],
                }
            }
        },
        methods:{

            initComp(){
                this.setSideBarShowStatus(false,false)
                this.addDroneCesiumObj()
                this.addPathCesiumObj()
                this.trackModel()
            },

            setSideBarShowStatus(ifLeftPanelShow,ifRightPanelShow){
                this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow
                this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow
            },



            addDroneCesiumObj(){
                let communityPosition = window.myEarth.getEarthObjByRef('tileset_community').xbsjPosition
                this.$set(this.droneJson,'xbsjPosition',[communityPosition[0],communityPosition[1],100])
                window.myEarth.pushEntityToEarth('drone',this.droneJson)
                this.droneCesiumObj = window.myEarth.getEarthObjByRef('drone')
            },

            addPathCesiumObj(){
                window.myEarth.pushEntityToEarth('path',this.dronePathJson)
                this.dronePathCesiumObj = window.myEarth.getEarthObjByRef('path')
            },

            trackModel(){

                // 1.1.4 数据监控
                // currentPosition 当前相机位置，形式如：[0, 0, 0] 该数组中的元素分别表示经度（单位弧度）、纬度（单位弧度）、高度（单位米）。 注意该属性，为只读属性！
                this._uw1 = XE.MVVM.watch(this.dronePathCesiumObj, 'currentPosition', position => {
                    let droneCesiumObjPosition = [...position]
                    droneCesiumObjPosition[2] = droneCesiumObjPosition[2]
                    this.droneCesiumObj.xbsjPosition =droneCesiumObjPosition;

                });

                // currentRotation 当前相机姿态，形式如：[0, 0, 0] 该数组中的元素分别表示偏航角（单位弧度）、俯仰角（单位弧度）、翻转角（单位弧度）。 注意该属性，为只读属性！
                this._uw2 = XE.MVVM.watch(this.dronePathCesiumObj, 'currentRotation', rotation => {
                    let cp = [...rotation];
                    this.droneCesiumObj.xbsjRotation = [cp[0]-Math.PI*0.5, cp[1], cp[2]];
                });


                setTimeout( () => {
                    this.droneCesiumObj.nativeModel().activeAnimations.addAll({
                        loop: Cesium.ModelAnimationLoop.REPEAT
                    })
                    this.droneCesiumObj.cameraAttached = true
                    this.dronePathCesiumObj.currentShow = false
                    this.droneCesiumObj.cameraAttachedOffsetRotation = [0, -30 * Math.PI / 180, 0]
                },2000)
            }
        },
        mounted() {
            this.initComp()
        },

        beforeDestroy() {
            // vue程序销毁时，需要清理相关资源
            this._uw1 = this._uw1 && this._uw1();
            this._uw2 = this._uw2 && this._uw2();
            window.myEarth.clearEntities()

        },

    }
</script>

<style scoped>

</style>
