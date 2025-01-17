<template>
    <div class="controller_panel">
        <SideBarComponent>
            <InformationCommonResidentLeftComponent v-show="ifSideBarShow.ifLeftPanelShow" :sup-methods="leftMethods"
                                         :sup-data="leftData" slot="leftPanel"></InformationCommonResidentLeftComponent>
            <InformationCommonResidentRightComponent v-show="ifSideBarShow.ifRightPanelShow" :sup-methods="rightMethods"
                                          :sup-data="rightData" slot="rightPanel"></InformationCommonResidentRightComponent>
        </SideBarComponent>
        <HouseInfoPanel v-if="ifHouseDataPrepare" :house-data="currentUser.houseData"></HouseInfoPanel>
        <ResidentPath v-if="pathShow" :resident="currentUser"/>
    </div>
</template>

<script>
    import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";

    import {mapState} from "vuex";
    import InformationCommonResidentLeftComponent
        from "@/views/index/community/search/information/common/resident/side/InformationCommonResidentLeftComponent";
    import InformationCommonResidentRightComponent
        from "@/views/index/community/search/information/common/resident/side/InformationCommonResidentRightComponent";
    import HouseInfoPanel from "@/views/index/community/search/information/common/resident/HouseInfoPanel";
    import ResidentPath from "./path/ResidentPath.vue";


    export default {
        name: "InformationCommonResidentControllerComponent",
        components: {
            ResidentPath,
            InformationCommonResidentRightComponent,
            InformationCommonResidentLeftComponent,
            SideBarComponent,
            HouseInfoPanel
        },
        data() {
            return {
                ifSideBarShow: {
                    ifLeftPanelShow: false,
                    ifRightPanelShow: false
                },

                residentList: [],
                ifHouseDataPrepare:false,
                currentUser:{},
                pathShow:false
            }
        },

        methods: {
            initComp() {
                this.setSideBarShowStatus(true, false)
                window.myEarth.initPosition()
                this.setResidentList()
            },

            setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
                this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow
                this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow
            },

            setResidentList() {
                let res = `
                张吉惟、林国瑞、林玫书、林雅南、江奕云、刘柏宏、阮建安、林子帆、夏志豪、吉茹定、李中冰、黄文隆、谢彦文、傅智翔、洪振霞、刘姿婷、荣姿康、目致盈、方一强、黎芸贵、郑伊雯、雷进宝、吴美隆、吴心真、王美珠、郭芳天、李雅惠、陈文婷、曹敏侑、王依婷、陈婉璇、吴美玉、蔡依婷、郑昌梦、林家纶、黄丽昆、李育泉、黄芸欢、吴韵如、李肇芬、卢木仲、李成白、方兆玉、刘翊惠、丁汉臻、吴佳瑞、舒绿珮、周白芷、张姿妤、张虹伦、周琼玫、倪怡芳、郭贵妃、杨佩芳、黄文旺、黄盛玫、郑丽青、许智云、张孟涵、李小爱、王恩龙、朱政廷、邓诗涵、陈政倩、吴俊伯、阮馨学、翁惠珠、吴思翰、林佩玲、邓海来、陈翊依、李建智、武淑芬、金雅琪、赖怡宜、黄育霖、张仪湖、王俊民、张诗刚、林慧颖、沈俊君、陈淑妤、李姿伶、高咏钰、黄彦宜、周孟儒、潘欣臻、李祯韵、叶洁启、梁哲宇、黄晓萍、杨雅萍、卢志铭、张茂以、林婉婷、蔡宜芸、林珮瑜、黄柏仪、周逸珮、夏雅惠、王采珮、林孟霖、林竹水、王怡乐、王爱乐、金佳蓉、韩健毓、李士杰、陈置珍、苏姿婷、张政霖、李志宏、陈素达、陈虹荣、何美玲、李仪琳、张俞幸、黄秋萍、潘吉维、陈智筠、蔡书玮、陈信峰、林培伦、查瑜舜、黎慧置、郑士易、陈建豪、吴怡婷、徐紫富、张博海、黎宏儒、柯乔喜、胡睿纯、王淑月、陈百菁、王雅娥、黄佩珊、李必辰、吴耀华、彭郁婷、王秀玲、谢佳儒、罗静藁、杨舒南、蔡政琳、杨绍瑜、金育木、杨韦成、韩宁政、蒋廷湖、毛展霞、廖婉宏、黄怡强、郭冰宇、黄伟依、叶元映、林智超、李姿婷、李莉火、邱雅雯、王淑芳、陈枝盈、高成彦、徐采伶、杨大雪、林彦韦、李升毓、邱宜瑶、陈政文、李宜豪、陈宜宁、陈志宏、阮柔治、林乐妹、简健昀、廖雅君、梁佩芬、苏玮伦、秦娇真、谢佳雯、李仁杰、李佳和、郭贤青、吴怡伶、陈怡婷、阮晴桦、辛翔坤、林孟富、刘美玲、涂昀瑰、白凯修、黄蓉芳、赵吟琪、张裕忠、石春紫、方美君、潘右博、俞星如、张冠杰、钟庭玮、叶茜彦、陈伯薇、陈昭祥、陈伟伦、黄雅慧、郭子豪、黄彦霖、宋合、许雅婷、王圣如、何伶元、钟伦军、蔡佳蓉、溥康柔、冯成轩、陈嘉惠、吴惠劭、谢健铭、林怡婷、廖佳蓉、李佩伯、何珮甄、谢晓玲、许彦霖、林威强、周佳勋、林静怡、周筠亚、陈仲宜、胡东贵、陈绍翰、梁娴来、陈雅吉、张莉雯、陈韦荣、林素伦、李菁芷、蔡玉婷、郑智钧、吴孟钰、蔡国伟、连俊达、李雅婷、李礼娇、李忆孝、黄静雯、陈淳宝、李文育、林佳蓉、罗依茂、李淑佩、谢怡君、王美玲、黄慧学、邓幸韵、陈秀瑰、许岳平、许爱礼、谢一忠、简志雪、赵若喜、许承翰、姚哲维、苏俊安、郭礼钰、姜佩珊、张鸿信、秦欣瑜、李旺劭、陈怡爱、陈秀德、张佳伶、郑凯婷、郑雅任、黄国妹、林芳江、江骏生、黄儒纯、王培伦、陈蕙侑、蔡宜慧、陈信意、陈惠雯、张透纶、黄碧仪、陈志文、谢懿富、杨凡靖、蔡秀琴、温惠玲、林宗其、林绍泰、何佳慧、蔡辰纶、王雅雯、叶怡财、冯雅筑、李伦圣、彭正仁、刘小紫、温燕达、刘佳雨、吴婷婷、杨怡君、黄康刚、林辰和、陈世人、吴佩霖、张伟杰、刘友淳、张瑞群、洪紫芬、邓家伟、谢佩任、戎郁文、李治火、林石美、郑雅茜、胡台泰、陈怡盈、李伟
                `
                const nameList = []
                nameList.push(
                    ...res.split('、')
                )
                const initIdNumber = 362561198511010034
                nameList.forEach((name, index) => {
                        this.residentList.push({
                            id: index + 1,
                            idNumber: (initIdNumber + index).toString(),
                            name: name,
                            sex: name==='李伟'||Math.random() < '0.5' ? '男' : '女',
                            profileUrl: '/img/profile/test.png',
                            ifMarry: true,
                            national: '汉',
                            age:32,
                            relationShip: {
                                'nodes': [
                                    {
                                        "id": 0,
                                        "name": "李伟",
                                    },
                                    {
                                        "id": 1,
                                        "name": "李国瑞",
                                    },
                                    {
                                        "id": 2,
                                        "name": "夏雅慧",
                                    },
                                    {
                                        "id": 3,
                                        "name": "林慧颖",
                                    },
                                    {
                                        "id": 4,
                                        "name": "李中冰",
                                    },
                                    {
                                        "id": 5,
                                        "name": "李淑芬",
                                    },
                                    {
                                        "id": 6,
                                        "name": "李政文",
                                    },
                                ],
                                'links':[
                                    {
                                        "source": 0,
                                        "target": 1,
                                        "label":"父亲"
                                    },
                                    {
                                        "source": 6,
                                        "target": 1,
                                        "label":"父亲"
                                    },
                                    {
                                        "source": 0,
                                        "target": 2,
                                        "label":"母亲"
                                    },
                                    {
                                        "source": 6,
                                        "target": 2,
                                        "label":"母亲"
                                    },
                                    {
                                        "source": 0,
                                        "target": 3,
                                        "label":"妻子"
                                    },
                                    {
                                        "source": 0,
                                        "target": 4,
                                        "label":"儿子"
                                    },
                                    {
                                        "source": 0,
                                        "target": 5,
                                        "label":"女儿"
                                    },
                                    {
                                        "source": 0,
                                        "target": 6,
                                        "label":"哥哥"
                                    },
                                ],
                            },
                            houseData:{
                                id: 1,
                                description: '十亩园小区-五号楼-1单元-402',
                                cesiumCode: {
                                    "xbsjType": "ClassificationPolygon",
                                    "name": "单体化",
                                    "positions": [
                                        2.042806368894309,
                                        0.6398818230796554,
                                        2.0428077996836964,
                                        0.6398819427391329,
                                        2.0428075315542342,
                                        0.6398840633732296,
                                        2.0428060917786777,
                                        0.6398839571485767
                                    ],
                                    "height": 19.6589469097832,
                                    "extrudedHeight": 15.979153577907674,
                                    "color": [
                                        0,
                                        0.49411764705882355,
                                        1,
                                        0.74
                                    ],
                                    "outline": {}
                                },

                                houseModelCesiumCode: {
                                    "xbsjType": "Tileset",
                                    "name": "fbx",
                                    "url": this.$StaticResourceAddress+"/model/apartment2/tileset.json",
                                    "xbsjPosition": [
                                        2.031410183945999,
                                        0.6965069737968359,
                                        -1.0000054459239582
                                    ],
                                    "xbsjClippingPlanes": {},
                                    "xbsjCustomShader": {}
                                },
                                memberList:[
                                    {
                                        id: 2,
                                        name: "李伟",
                                        idNumber: 362331197512110065,
                                        sex: '男',
                                        profileUrl: '/img/profile/test.png',
                                        national: '汉',
                                        age:32,
                                        identity:'户主'
                                    },
                                    {
                                        id: 3,
                                        name: "林慧颖",
                                        idNumber: 362331197512110065,
                                        sex: '女',
                                        profileUrl: '/img/profile/test.png',
                                        national: '汉',
                                        age:32,
                                        identity:'妻子'
                                    },
                                    {
                                        id: 4,
                                        name: "李中冰",
                                        idNumber: 362331200505070035,
                                        sex: '男',
                                        profileUrl: '/img/profile/test.png',
                                        national: '汉',
                                        age:17,
                                        identity:'儿子'
                                    },
                                    {
                                        id: 5,
                                        name: "李淑芬",
                                        idNumber: 362331201005070021,
                                        sex: '女',
                                        profileUrl: '/img/profile/test.png',
                                        national: '汉',
                                        age:12,
                                        identity:'女儿'
                                    },
                                ]
                            },
                        },)
                    })

            },

            setCurrentUser(newVal){
              this.currentUser = newVal
            },

            handleUserItemClick(currentUser) {
                this.ifHouseDataPrepare = false
                window.myEarth.clearEntities()
                if (this.currentUser.id === currentUser.id) {
                    this.setCurrentUser({})
                    this.setSideBarShowStatus(true,false)
                } else {
                    let currentUserCopy = JSON.parse(JSON.stringify(currentUser))
                    window.myEarth.pushEntityToEarth('house_' + currentUserCopy.houseData.id, currentUserCopy.houseData.cesiumCode)
                    let houseCesiumObj = window.myEarth.getEarthObjByRef('house_' + currentUserCopy.houseData.id)
                    houseCesiumObj.show = false
                    window.myEarth.pushEntityToEarth('house_'+ currentUserCopy.houseData.id + '_pin', {
                        "xbsjType": "Pin",
                        "position": this.$common.gridPolygonGetCenter(houseCesiumObj),
                        "show": false
                    })

                    this.$set(currentUserCopy.houseData,'visible',false)
                    this.$set(currentUserCopy.houseData,'winPos',[0,0,0,0])
                    this.setCurrentUser(currentUserCopy)

                    let pin = window.myEarth.earth.sceneTree.$refs['house_'+ currentUserCopy.houseData.id + '_pin'].czmObject
                    this.setSideBarShowStatus(true,true)
                    this.$nextTick(
                        ()=>{
                            XE.MVVM.track(this, 'currentUser.houseData.winPos', pin, 'winPos')
                            XE.MVVM.bind(this, 'currentUser.houseData.visible', houseCesiumObj, 'show')
                            this.ifHouseDataPrepare = true
                        }
                    )
                }


            },

            setPathShow(value){
                this.pathShow = value
            }
        },

        computed: {
            ...mapState("userAbout", ['areaInfo']),
            leftData() {
                return{
                    residentList:this.residentList,
                    currentUser:this.currentUser
                }
            },
            leftMethods() {
                return {
                    setSideBarShowStatus: this.setSideBarShowStatus,
                    handleUserItemClick:this.handleUserItemClick
                }
            },



            rightData(){
                return{
                    currentUser:this.currentUser
                }
            },

            rightMethods() {
                return {
                    setSideBarShowStatus: this.setSideBarShowStatus,
                    setPathShow: this.setPathShow
                }
            },
        },

        watch:{

        },

        mounted() {
            this.initComp()
        },

        beforeDestroy() {
            window.myEarth.clearEntities()
        }
    }
</script>

<style scoped>

    .controller_panel {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

</style>
