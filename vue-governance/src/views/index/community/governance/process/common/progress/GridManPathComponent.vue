<template>
    <div class="container_panel">
        <div class="time_line_header" :style="{width:itemRealWidth * itemPageSize + 60 + 'px'}">
            <div class="time_line_menu_panel">
                <i class="iconfont icon-restart menu_icon" @click="handleAutoPlay('restart')"></i>
                <i class="iconfont icon-play menu_icon" v-show="!autoPlayData.isPlaying" @click="handleAutoPlay('play')"></i>
                <i class="iconfont icon-pause menu_icon" v-show="autoPlayData.isPlaying" @click="handleAutoPlay('pause')"></i>
                <i class="iconfont icon-close menu_icon"  @click="handleAutoPlay('close')"></i>
            </div>

        </div>
        <div class="time_line_panel">
            <div v-show="itemPageSize<pathInfo.length" class="left_arrow_icon arrow_icon"
                 @click="handleArrowIconClick('left')">
                <i class="iconfont icon-left" style="font-size: 20px"></i>
            </div>
            <div class="content_outer_panel" :style="outerPanelStyle">
                <div class="time_line" :style="lineStyle"></div>
                <div class="content_inner_panel" :style="innerPanelStyle">
                    <div v-for="point of pathInfo" :key="point.id" class="item_panel" :style="itemStyle"
                         @click="handelItemClick(point)">
                        <div class="panel_border border_lb"
                             :style="{'border-color':currentPoint&&currentPoint.id === point.id ? 'rgb(33, 194, 237)':'white'}"></div>
                        <div class="panel_border border_rb"
                             :style="{'border-color':currentPoint&&currentPoint.id === point.id ? 'rgb(33, 194, 237)':'white'}"></div>
                        <div class="panel_border border_rt"
                             :style="{'border-color':currentPoint&&currentPoint.id === point.id ? 'rgb(33, 194, 237)':'white'}"></div>
                        <div class="panel_border border_lt"
                             :style="{'border-color':currentPoint&&currentPoint.id === point.id ? 'rgb(33, 194, 237)':'white'}"></div>
                        <div class="date_panel"
                             :style="{'color':currentPoint&&currentPoint.id === point.id ? 'rgb(33, 194, 237)':'white'}">
                            {{point.date.split(" ")[0]}}
                        </div>
                        <div class="time_panel"
                             :style="{'color':currentPoint&&currentPoint.id === point.id ? 'rgb(33, 194, 237)':'white'}">
                            {{point.date.split(' ')[1]}}
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="itemPageSize<pathInfo.length" class="right_arrow_icon arrow_icon"
                 @click="handleArrowIconClick('right')">
                <i class="iconfont icon-right " style="font-size: 20px"></i>
            </div>
        </div>

        <IconPinComponent v-for="building of buildingList" :if-rotation="true" :cesium-obj="{color:'#409EFF',winPos:building.winPos,iconPinShow:building.visible,iconClass:'icon-user'}" :handle-click-function="()=>{}" :key="building.id"></IconPinComponent>
    </div>

</template>

<script>

    
    import BuildingInfoComponent from "@/views/common/cesium/pinDiv/BuildingInfoComponent";
    import IconPinComponent from "@/views/common/cesium/pinDiv/IconPinComponent";

    export default {
        name: "GridManPathComponent",
        components: {BuildingInfoComponent,IconPinComponent},
        props: ['participant',"closeTimeLine"],
        data() {
            return {
                itemWidth: 120,
                itemMargin: 20,
                itemPageSize: 5,
                slideData: {
                    left: 0
                },
                buildingList: [],
                floorList: [],
                currentPoint: undefined,

                autoPlayData:{
                    isPlaying:false,
                    intervalName:undefined
                }

            }
        },

        computed: {
            //实际的宽度（包括width和margin）
            itemRealWidth(){
                return this.itemWidth + 2 * this.itemMargin
            },

            //pathInfo 数组的大小
            itemListSize(){
              return this.pathInfo.length
            },

            //正在展示的item的index
            showingItemIndexList(){
                let firstItemIndex = -this.slideData.left / (this.itemRealWidth)
                let resultList = []
                for (let i = firstItemIndex;i<this.itemListSize&&i-firstItemIndex<=this.itemPageSize-1;i++){
                    resultList.push(i)
                }
                return resultList
            },

            //被选中Point的index，支持get和set
            currentItemIndex:{
                get(){
                    return this.pathInfo.indexOf(this.currentPoint)
                },

                set(index){
                    if (0<=index<this.itemListSize){
                        this.currentPoint = this.pathInfo[index]
                    }else {
                        this.currentPoint = undefined
                    }
                }

            },

            outerPanelStyle() {
                return {
                    width: (this.itemRealWidth) * this.itemPageSize + 'px',
                }
            },

            innerPanelStyle() {
                return {
                    left: this.slideData.left + 'px'
                }
            },

            itemStyle() {
                return {
                    width: this.itemWidth + 'px',
                    margin: `0 ${this.itemMargin}px`
                }
            },

            lineStyle() {

                let left = 0
                let right = 0
                let width = this.outerPanelStyle.width

                if (this.slideData.left >= 0) {
                    left = this.itemMargin
                    width -= this.itemMargin
                }


                if (this.showingItemIndexList[this.showingItemIndexList.length-1] >= this.itemListSize-1) {
                    right = this.itemMargin
                    width -= this.itemMargin
                }


                return {
                    left: left + 'px',
                    right: right + 'px',
                    width: width + 'px'
                }

            },

            pathInfo() {
                return this.participant.interviewPath
            }

        },


        methods: {
            initComp() {
                this.setBuildingList()
                this.setFloorList()

            },

            setBuildingList() {
                this.pathInfo.forEach(
                    point => {
                        if (this.buildingList.findIndex(builidng => builidng.id === point.currentBuilding.id) === -1) {
                            this.buildingList.push(point.currentBuilding)
                        }

                    }
                )
                this.addBuildingListToEarth(this.buildingList)
            },

            addBuildingListToEarth(buildingList) {
                buildingList.forEach(
                    (building, index) => {
                        this.$set(building, 'winPos', [0, 0, 0, 0])
                        this.$set(building, 'visible', false)
                        let buildingCesiumObject = JSON.parse(building.cesiumCode);
                        buildingCesiumObject.show = false
                        buildingCesiumObject.color = this.$common.randomColor()
                        buildingCesiumObject.color[3] = 0.3
                        window.myEarth.pushEntityToEarth('building_' + building.id, buildingCesiumObject)
                        window.myEarth.pushEntityToEarth('building_' + building.id + '_pin', {
                            "xbsjType": "Pin",
                            "position": this.$common.gridPolygonGetCenter(buildingCesiumObject),
                            "show": false
                        })
                        let pin = window.myEarth.getEarthObjByRef('building_' + building.id + '_pin')
                        this.$nextTick(
                            () => {
                                let str = `buildingList.${index}.winPos`
                                XE.MVVM.track(this, str, pin, 'winPos')
                            }
                        )
                    }
                )
            },

            setFloorList() {
                this.pathInfo.forEach(
                    point => {
                        if (this.floorList.findIndex(floor => floor.id === point.currentFloor.id) === -1) {
                            this.floorList.push(point.currentFloor)
                        }

                    }
                )
                this.addFloorListToEarth(this.floorList)
            },

            addFloorListToEarth(floorList) {
                floorList.forEach(
                    (floor, index) => {
                        this.$set(floor, 'visible', false)
                        let floorCesiumObject = JSON.parse(floor.cesiumCode);
                        floorCesiumObject.show = false
                        floorCesiumObject.color = [
                            0,
                            0.6901960784313725,
                            1,
                            0.7
                        ]
                        floorCesiumObject.color[3] = 0.7
                        window.myEarth.pushEntityToEarth('floor_' + floor.id, floorCesiumObject)
                        floorCesiumObject = window.myEarth.getEarthObjByRef('floor_' + floor.id)
                        this.$nextTick(
                            () => {
                                let str = `floorList.${index}.visible`
                                XE.MVVM.bind(this, str, floorCesiumObject, 'show')
                            }
                        )
                    }
                )
            },


            handleArrowIconClick(dir) {
                if (dir === 'left') {
                    if (this.slideData.left < 0) {
                        this.slideData.left += this.itemRealWidth
                    }
                } else {
                    if (this.showingItemIndexList[this.showingItemIndexList.length-1] < this.itemListSize-1) {
                        this.slideData.left -= this.itemRealWidth
                    }
                }
            },

            handelItemClick(point) {
                this.currentPoint = point
            },

            handleAutoPlay(iconName){
                switch (iconName) {
                    case 'restart':
                        this.handleAutoPlay('pause')
                        this.currentItemIndex = 0
                        this.handleAutoPlay('play')
                        break
                    case 'play':
                        if (this.autoPlayData.intervalName === undefined){
                            this.autoPlayData.isPlaying = true
                            if (this.currentItemIndex === -1){
                                this.currentItemIndex = 0
                            }
                            this.autoPlayData.intervalName = setInterval(()=>{
                                if (this.currentItemIndex<this.itemListSize-1){
                                    this.currentItemIndex ++
                                }else {
                                    this.handleAutoPlay('pause')
                                }

                            },1000)
                        }
                        break
                    case 'pause':
                        this.autoPlayData.isPlaying = false
                        clearInterval(this.autoPlayData.intervalName)
                        this.autoPlayData.intervalName = undefined
                        break
                    case 'close':
                        this.closeTimeLine()
                        break
                }
            }


        },

        watch: {
            currentPoint(currentPoint) {
                this.buildingList.forEach(
                    building=>{
                        if (building.id === currentPoint.currentBuilding.id)
                            building.visible = true
                        else
                            building.visible = false
                    }
                )

                this.floorList.forEach(
                    floor=>{

                        if (floor.id === currentPoint.currentFloor.id){
                            floor.visible = true
                        } else
                            floor.visible = false
                    }
                )

                if (this.currentItemIndex < this.showingItemIndexList[0]){
                    this.slideData.left = - this.itemRealWidth * this.currentItemIndex
                }

                if (this.currentItemIndex > this.showingItemIndexList[this.showingItemIndexList.length-1]){
                    this.slideData.left = - this.itemRealWidth * (this.currentItemIndex-this.itemPageSize+1)
                }
            }
        },

        mounted() {
            this.initComp()
        },

        beforeDestroy() {
            window.myEarth.clearEntities()
            clearInterval(this.autoPlayData.intervalName)
        }
    }
</script>

<style scoped>
    .container_panel {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        box-sizing: border-box;
        padding-bottom: 120px;
        opacity: 0.8;
    }

    .time_line_panel {
        height: 60px;
        width: auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        pointer-events: all;
    }

    .arrow_icon {
        width: 30px;
        height: 100%;
        font-size: 20px;
        color: white;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: var(--darkBlue);
        border-radius: 10px;
        border: 2px solid rgba(255, 255, 255, 0.8);

    }

    .arrow_icon:hover {
        cursor: pointer;
        color: var(--lightBlue);
        border: 2px solid var(--lightBlue);
    }


    .content_outer_panel {
        position: relative;
        height: 100%;
        overflow: hidden;
    }

    .time_line_header{
        height: 25px;
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        pointer-events: all;
    }

    .time_line_menu_panel{
        width: auto;
        height: 100%;
        border-radius: 10px;
        background-color: var(--darkBlue);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .menu_icon{
        color: white;
        margin: 5px;
        font-size: 18px;
    }

    .menu_icon:hover{
        cursor: pointer;
        color: var(--lightBlue);
    }

    .content_inner_panel {
        position: absolute;
        height: 60px;
        min-width: 100%;
        left: 0;
        bottom: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        transition: left 0.7s;
    }

    .item_panel {
        position: relative;
        height: 100%;
        background-color: var(--darkBlue);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        border-radius: 10px;
        box-sizing: border-box;
    }

    .item_panel:hover {
        cursor: pointer;
        color: var(--lightBlue);
    }


    .panel_border {
        position: absolute;
        width: 30px;
        height: 30px;
        pointer-events: none;
    }

    .border_rt {
        right: 0;
        top: 0;
        border-radius: 0px 10px 0px 0px;
        border-right: 3px var(--lightBlue) solid;
        border-top: 3px var(--lightBlue) solid;
    }

    .border_rb {
        right: 0;
        bottom: 0;
        border-radius: 0px 0px 10px 0px;
        border-right: 3px var(--lightBlue) solid;
        border-bottom: 3px var(--lightBlue) solid;
    }

    .border_lt {
        left: 0;
        top: 0;
        border-radius: 10px 0px 0px 0px;
        border-left: 3px var(--lightBlue) solid;
        border-top: 3px var(--lightBlue) solid;
    }

    .border_lb {
        left: 0;
        bottom: 0;
        border-radius: 0px 0px 0px 10px;
        border-left: 3px var(--lightBlue) solid;
        border-bottom: 3px var(--lightBlue) solid;
    }

    .date_panel {
        font-size: 14px;
    }

    .time_panel {
        font-size: 18px;
        font-weight: 500;
    }

    .time_line {
        position: absolute;
        height: 4px;
        background-color: var(--darkBlue);
        border-top: 1px white solid;
        border-bottom: 1px white solid;
        top: calc(50% - 3px);
    }

</style>