<template>
  <div v-show="cesiumObj.iconPinShow"  class="icon_pin_panel" :class="{'infinite_rotation':ifRotation}" :style="pinStyle" @click="handleClickFunction(cesiumObj)">
    <div class="icon_pin_content">
      <i class="icon_pin_icon iconfont" :class="[cesiumObj.iconClass]"></i>
    </div>
    <span class="icon_pin_name">{{ fireDepartment.name }}</span>
  </div>
</template>

<script>
export default {
  name: "IconFireDepartment",
  props:['cesiumObj','handleClickFunction','ifRotation','fireDepartment'],
  data(){
    return{
      winPos:this.cesiumObj.winPos
    }
  },
  mounted() {

  },
  computed:{
    pinStyle(){

      return{
        color: this.cesiumObj.color,
        left: `${this.cesiumObj.winPos[0]-20}px`,
        bottom: `${this.cesiumObj.winPos[3]}px`,
      }
    },
  },
}
</script>

<style scoped>
.icon_pin_name {
  color: white; /* 设置字体颜色为白色 */
  display: inline-block; /* 横向展示 */
  margin-left: 5px; /* 可根据需要调整间距 */
}
.icon_pin_panel {
  color: #333;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border: double 5px currentColor;
  border-radius: 20px 20px 20px 0;
  /*-webkit-transform: rotate(-45deg);*/
  /*-moz-transform: rotate(-45deg);*/
  transform: rotateZ(-45deg);
  position: fixed;
  box-shadow: 0px 0px 10px white;
  pointer-events: all;
  /*z-index: 1;*/
}

.icon_pin_panel:hover{
  cursor: pointer;
  transform: translate(0,-10px) rotate(-45deg) scale(1.2);
}

.icon_pin_icon {
  font-size: 20px;
}

.icon_pin_content {
  width: 100%;
  height: 100%;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  transform: rotate(45deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

.infinite_rotation{
  animation: infinite_rotation 3s infinite linear;
}

@keyframes infinite_rotation{
  0%{
    transform:rotateY(0deg) rotateZ(-45deg);
  }

  100%{
    transform:rotateY(360deg) rotateZ(-45deg);
  }
}

</style>
