<template>
    <div class="bottom_bar_panel">
        <div v-if="!isBottomMenuFolded" class="bottom_bar_fold_panel" @click="isBottomMenuFolded = true">
            <i class="icon_fold iconfont icon-down"></i>
        </div>

        <div v-if="isBottomMenuFolded" class="bottom_bar_unfold_panel" @click="isBottomMenuFolded = false">
            <i class="icon_unfold iconfont icon-down"></i>
        </div>
        <div class="bottom_bar_content_panel">
            <div class="top_border">
                <div style="width: 30px;background-color:  rgb(33, 194, 237)"></div>
                <div style="flex:1;background-color:  rgb(2, 77, 137)"></div>
                <div style="width: 30px;background-color:  rgb(33, 194, 237)"></div>
            </div>
            <div class="left_border"></div>
            <div class="right_border"></div>
            <div class="bottom_bar_item_panel">
                <div class="bottom_bar_menu_item" v-for="menuItem of menuItemList" @click="handleBottomMenuSelect(menuItem)" :class="{bottom_menu_active:menuItem=== bottomBarMenuItem}">
                    <i v-show="menuItem === bottomBarMenuItem" class="iconfont icon-right" style="margin-right: 5px;font-size: 10px;color: rgb(33, 194, 237);font-weight: 700"></i>
                    <i class="iconfont" :class="menuItem.iconClass" style="margin-right: 10px;font-size: 20px"></i>
                    {{menuItem.text}}
                    <i v-show="menuItem === bottomBarMenuItem" class="iconfont icon-left" style="margin-left: 5px;font-size: 10px;color: rgb(33, 194, 237);font-weight: 700"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BottomBarComponent",
        props: ['menuItemList', 'bottomBarMenuItem', 'setBottomBarMenuItem'],
        data(){
            return{
                isBottomMenuFolded: false
            }
        },
        methods: {
            initComp() {
                this.initActiveBottomMenu()
            },

            initActiveBottomMenu(){
                let flag = false
                this.menuItemList.forEach(
                    firstMenuItem=>{
                        firstMenuItem.subList.forEach(
                            secondMenuItem=>{
                                if(secondMenuItem.subList.length<=0){
                                    if (secondMenuItem.path === this.$route.path){
                                        this.setBottomBarMenuItem(firstMenuItem)
                                        flag = true
                                    }
                                }else {
                                    secondMenuItem.subList.forEach(
                                        thirdMenuItem=>{
                                            if (thirdMenuItem.path === this.$route.path){
                                                this.setBottomBarMenuItem(firstMenuItem)
                                                flag =true
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                )
               
                if (!flag){
                    //没有搜索到，初始为第一个
                    this.setBottomBarMenuItem(this.menuItemList[0])
                }


            },

            handleBottomMenuSelect(menuItem){
                this.setBottomBarMenuItem(menuItem)
                //防止重复路由导致报错
                if(this.$route.path!=menuItem.defaultPath){
                this.$router.replace(
                    {
                        path: menuItem.defaultPath
                    }
                ).then(() => {});}
            }
        },


        watch:{
            $route(to,from){
                this.initActiveBottomMenu()
            },

            isBottomMenuFolded(isBottomMenuFolded){
                const bottomBarPanel = document.querySelector('.bottom_bar_panel')
                if (isBottomMenuFolded) {
                    bottomBarPanel.style.bottom = -100+'px'
                } else {
                    bottomBarPanel.style.bottom = 0+'px'
                }
            }
        },
        mounted() {
            this.initComp()
        }
    }
</script>

<style scoped lang="less">
    .bottom_bar_panel {

        @lightBlue:rgb(33, 194, 237);
        @darkBlue:rgb(2, 77, 137);

        pointer-events: none;
        position: absolute;
        height: 100px;
        width: 100%;
        bottom: 0;
        left: 0;
        user-select: none;
        box-sizing: border-box;
        padding: 0 520px 20px 520px;
        transition: all 0.5s;

        .bottom_bar_fold_panel{
            position: absolute;
            width: 60px;
            height: 15px;
            background-color: rgba(255, 255, 255,0.2);
            top: 3px;
            left: 0;
            right: 0;
            margin: 0 auto;
            z-index: 999;
            pointer-events: all;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            border-radius: 0 0 12px 12px;
        
            
            &:hover{
                cursor: pointer;
                background-color: rgba(255, 255, 255,0.5);
            }


            .icon_fold{
                font-size: 20px;
                font-weight: 500;
            }

            
            &:hover .icon_fold{
                font-weight: 700;
            }
            
        }

        .bottom_bar_unfold_panel{
            position: absolute;
            width: 80px;
            height: 20px;
            background-color: @darkBlue;
            top: -25px;
            left: 0;
            right: 0;
            margin: 0 auto;
            z-index: 999;
            pointer-events: all;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            border-radius: 12px 12px 0 0;
        
            
            &:hover{
                cursor: pointer;
                transform: translateY(-5px)
            }


            .icon_unfold{
                font-size: 20px;
                font-weight: 500;
                transform: rotate(180deg);
            }
            
            &:hover .icon_unfold{
                font-weight: 700;
            }
        }

        .bottom_bar_content_panel {
            pointer-events: all;
            display: block;
            position: relative;
            top: 0;
            left: 0;
            height: 100%;
            background: linear-gradient(180deg,  rgba(24, 49, 85, 0.7), rgba(24, 49, 85, 0.3),rgba(24, 49, 85, 0.4));
            clip-path: polygon(
                    0 80px,
                    120px 0,
                    calc(100% - 120px) 0,
                    100% 80px
            );

            .top_border {
                position: absolute;
                left: 120px;
                width: calc(100% - 240px);
                height: 3px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;

            }

            .left_border {
                position: absolute;
                left: 0px;
                top: 0;
                background: linear-gradient(50deg, @darkBlue 80%, @lightBlue 20%);
                width: 120px;
                height: 100%;
                clip-path: polygon(
                        0 80px,
                        2px 80px,
                        120px 3px,
                        120px 0
                );
            }

            .right_border {
                position: absolute;
                right: 0;
                top: 0;
                width: 120px;
                height: 100%;
                background: linear-gradient(310deg, @darkBlue 80%, @lightBlue 20%);
                clip-path: polygon(
                        120px 80px,
                        118px 80px,
                        0 3px,
                        0 0
                );
            }

            .bottom_bar_item_panel{
                position: absolute;
                left: 120px;
                width: calc(100% - 240px);
                height: 100%;
                box-sizing: border-box;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;

                .bottom_bar_menu_item{
                    width: 160px;
                    height: 50px;
                    margin: 0 25px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    font-size: 18px;
                    text-shadow: 0 0 10px #478de0,0 0 20px #478de0,0 0 30px #478de0;
                    color: white;
                    &:hover{
                        cursor: pointer;
                    }
                }

                .bottom_menu_active{
                    color:  @lightBlue;
                }
            }
        }
    }

</style>
