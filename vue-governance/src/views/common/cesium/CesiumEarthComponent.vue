<template>
    <div id="earth_container" ref="earthContainer"></div>
</template>

<script>
    import MyEarth from "@/assets/js/cesium/MyEarth.js";

    export default {
        name: "CesiumEarthComponent",

        data() {
            return {
                // ifEarthShow: true
            }
        },
        methods: {
            initComponent() {
                this.initEarth()
            },

            initEarth() {
                
                window.myEarth = new MyEarth('earth_container')
                this.$emit('earthReady')
            },

            setIfEarthShow(val){
                this.ifEarthShow = val
            },

            
        },
       
        mounted() {
            this.initComponent()
        },

        beforeDestroy() {
            // window.myEarth.clearAllModels()
            window.myEarth.destroyEarth()
            this.$emit('earthDestroy')
        }
    }
</script>

<style scoped>
    #earth_container {
        width: 100%;
        height: 100%;
        z-index: -1;
    }


</style>
