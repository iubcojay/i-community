<template>
    <div id="dependent_earth_container"></div>
</template>

<script>
    const uuid = require('uuid')

    export default {
        name: "DependentModelSceneComponent",

        data() {
            return {
                _earth: undefined,
                _viewer: undefined,
            }
        },

        props:{
          modelList:{
              default:()=>[]
          }
        },

        methods: {
            //解决报错"Blocked script execution in 'about:blank' because the document's frame is sandboxed and the 'allow-scripts' permission is not set."
            handleInfoBoxError() {
                let iframe = document.getElementsByClassName('cesium-infoBox-iframe')[0];
                iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
                iframe.setAttribute('src', ''); //必须设置src为空 否则不会生效。
            },

            initComp() {
                this.initEarth()
                this.initModelList()
            },

            initEarth() {
                let _earth = new XE.Earth('dependent_earth_container',{
                    sceneModePicker:false,
                });

                //解决报错问题
                this.handleInfoBoxError()

                this._viewer = _earth.czm.viewer
                this._earth = _earth;
                // this._earth.interaction.picking.enabled = true;

                this._earth.sceneTree.root = {
                    "children": []
                };

                this.hindEarth()

                // this._viewer.scene.screenSpaceCameraController.maximumZoomDistance = 500;
                // this._viewer.scene.screenSpaceCameraController.minimumZoomDistance = 10;
                this.$emit('getCommonProps', {
                    _earth: this._earth,
                    _viewer: this._viewer,
                    pushEntityToEarth: this.pushEntityToEarth,
                    flyToModel: this.flyToModel,
                    getEarthObjByRef: this.getEarthObjByRef,
                    removeEntityFromEarth: this.removeEntityFromEarth,
                    clearModels: this.clearModels,
                    clearAllModels: this.clearAllModels,
                    destroyEarth: this.destroyEarth,
                    getEarthModelList: this.getEarthModelList,
                    flyToPosition: this.flyToPosition,
                    cameraAttach: this.cameraAttach,
                })

            },

            hindEarth(){
                this._viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#183155');//设置场景背景色 只有在没有天空框时才可见，即，场景#skyBox未定义。
                this._viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#183155');;//在没有可用图像时获取或设置全局的颜色


                this._earth.weather.sun.enabled = false
                this._earth.weather.moon.enabled = false

                this._earth.weather.skyBox.enabled = false

                this._viewer.scene.globe.showGroundAtmosphere = false;
                this._viewer.scene.skyAtmosphere.show = false;
            },

            initModelList(){
                this.modelList.forEach(model=>{
                    this.$set(model,'ref',uuid.v1())
                    this.pushEntityToEarth(model.ref,model.cesiumCode)
                })
            },

            pushEntityToEarth(ref, czmObject) {
                this._earth.sceneTree.root["children"].push({"ref": ref, "czmObject": czmObject})
            },

            flyToModel(modelRef) {
                let model = this._earth.sceneTree.$refs[modelRef].czmObject
                this._earth.camera.flyAround(
                    model.xbsjPosition,
                    20,
                    [-30 * Math.PI / 180, -45 * Math.PI / 180, 0],
                    0,
                    0.2
                )
            },

            getEarthObjByRef(ref){
                return this._earth.sceneTree.$refs[ref].czmObject
            },

            removeEntityFromEarth(ref) {
                this._earth.sceneTree.root["children"].some((item, index) => {
                    if (item.ref === ref) {
                        this._earth.sceneTree.root["children"].splice(index, 1)
                        return true
                    }
                })
            },

            clearModels(){
                if (this._earth!==undefined&&this._earth.sceneTree!==undefined){
                    //清除网格模型
                    let deleteList = []
                    this._earth.sceneTree.root["children"].forEach(
                        item => {
                            let type = item.czmObject.xbsjType
                            let ref = item.ref
                            if (type !== 'Imagery' && type !== 'Tileset') {
                                deleteList.push(ref)
                            }
                        }
                    )
                    deleteList.forEach(
                        ref => {
                            this._earth.sceneTree.root["children"].some((item, index) => {
                                if (item.ref === ref) {
                                    this._earth.sceneTree.root["children"].splice(index, 1)
                                    return true
                                }
                            })
                        }
                    )
                }
            },

            clearAllModels(){
                if (this._earth!==undefined&&this._earth.sceneTree!==undefined){
                    //清除网格模型
                    this._earth.sceneTree.root["children"]= []
                }
            },

            cameraAttach(ref){
                let cesiumObj = this.getEarthObjByRef(ref)
                cesiumObj.cameraAttached = true
            },


            destroyEarth(){
                this._earth = this._earth && this._earth.destroy();
                this._viewer = undefined
            },


            getEarthModelList(){
                return this._earth.sceneTree.root["children"]
            },

            flyToPosition(positionArray,viewDistance=200,rotation=[-30 * Math.PI / 180, -20 * Math.PI / 180, 0],duringTime=2) {
                this._earth.camera.flyTo(
                    positionArray,
                    viewDistance,
                    rotation,
                    duringTime
                )
            }
        },

        mounted() {
            this.initComp()
        },

        beforeDestroy() {
            this.clearModels()
            this._earth = this._earth && this._earth.destroy();
        }
    }
</script>

<style scoped>
    #dependent_earth_container {
        width: 100%;
        height: 100%;
        z-index: 1;
    }


</style>