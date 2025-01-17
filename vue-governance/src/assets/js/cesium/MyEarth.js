import { v1 } from "uuid";
import _ from "lodash";

export default class MyEarth {
    constructor(containerId) {

        // 容器id
        this.containerId = containerId
        // earth对象
        this.earth = null
        // cesium 原生对象
        this.viewer = null
        // earthSDK相机对象
        this.camera = null
        // Cesium原生相机对象
        this.cesiumCamera = null
        // Cesium原生场景对象
        this.scene = null
        // 初始化地球
        this.initEarth()
    }

    // 初始化地球
    initEarth() {
        this.earth = new XE.Earth(this.containerId, {
            // 开启动画
            shouldAnimate: true
        });

        // 解决报错问题
        let iframe = document.getElementsByClassName('cesium-infoBox-iframe')[0];
        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
        iframe.setAttribute('src', ''); //必须设置src为空 否则不会生效。

        this.viewer = this.earth.czm.viewer;
        this.camera = this.earth.camera;
        this.cesiumCamera = this.viewer.camera
        this.scene = this.viewer.scene
        this.earth.interaction.picking.enabled = true
        this.earth.sceneTree.root = {
            "children": []
        };
        this.addArcgisOnlineImagery()
        // // 定义初始位置，以免飞入时看见星空
        // this.camera.flyTo(
        //     [2.042793240860197, 0.6398989262457605, 38.67157438460474],
        //     400,
        //     [-30 * Math.PI / 180, -20 * Math.PI / 180, 0],
        //     0,
        // )
    }

    // 添加初始卫星影像
    addArcgisOnlineImagery() {
        let imageryObject = {
            "xbsjType": "Imagery",
            "name": "全球影像",
            "xbsjImageryProvider": {
                "XbsjImageryProvider": {
                    "url": "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                    "rectangle": [
                        -3.141592653589793,
                        -1.5707963267948966,
                        3.141592653589793,
                        1.5707963267948966
                    ]
                },
                "UrlTemplateImageryProvider": {},
                "WebMapServiceImageryProvider": {},
                "WebMapTileServiceImageryProvider": {},
                "ArcGisMapServerImageryProvider": {},
                "GoogleEarthEnterpriseImageryProvider": {},
                "createTileMapServiceImageryProvider": {},
                "TileMapServiceImageryProvider": {}
            }
        }
        this.pushEntityToEarth('imagery_global_img', imageryObject)
    }

    addBaiduOnlineImagery() {
        let imageryObject = {
            "xbsjType": "Imagery",
            "name": "高德地图",
            "xbsjImageryProvider": {
                "XbsjImageryProvider": {
                    "url": "http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
                    "srcCoordType": "GCJ02"
                },
                "UrlTemplateImageryProvider": {},
                "WebMapServiceImageryProvider": {},
                "WebMapTileServiceImageryProvider": {},
                "ArcGisMapServerImageryProvider": {},
                "GoogleEarthEnterpriseImageryProvider": {},
                "createTileMapServiceImageryProvider": {},
                "TileMapServiceImageryProvider": {}
            }
        }
        this.pushEntityToEarth('imagery_baidu_img', imageryObject)
    }

    addTianDiOnlineImagery() {
        let imageryObject = {
            "name": "tiandi",
            "xbsjType": "Imagery",
            "xbsjImageryProvider": {
                "XbsjImageryProvider": {
                    "url": "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=5c1e6c707f70fd69721f0e3afb4e710d"
                },
            }
        }

        this.pushEntityToEarth('imagery_tiandi_img', imageryObject)
    }

    addTianDiOnlineAnnotationy() {
        let imageryObject = {
            "name": "tiandi",
            "xbsjType": "Imagery",
            "xbsjImageryProvider": {
                "XbsjImageryProvider": {
                    "url": "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=5c1e6c707f70fd69721f0e3afb4e710d"
                },
            }
        }

        this.pushEntityToEarth('imagery_tiandi_annotationy', imageryObject)
    }

    // 将模型放入地球
    pushEntityToEarth(ref, czmObject) {
        this.earth.sceneTree.root["children"].push({ "ref": ref, "czmObject": czmObject })
        return this.getEarthObjByRef(ref)
    }

    // 飞入模型位置
    flyToModel(modelRef) {
        let model = this.earth.sceneTree.$refs[modelRef].czmObject
        model.flyTo()
    }

    // 自定义飞入模型位置
    flyToModelCustom(modelRef, viewDistance = 200, rotation = [-30 * Math.PI / 180, -20 * Math.PI / 180, 0], duringTime = 2) {
        let model = this.earth.sceneTree.$refs[modelRef].czmObject
        const position = model.position
        this.flyToPosition(position, viewDistance, rotation, duringTime)
    }

    // 获取某个模型
    getEarthObjByRef(ref) {
        let item = this.earth.sceneTree.$refs[ref]
        if (item) {
            return this.earth.sceneTree.$refs[ref].czmObject
        } else {
            return undefined
        }
    }

    // 从地球中删除模型
    removeEntityFromEarth(ref) {
        this.earth.sceneTree.root["children"].some((item, index) => {
            if (item.ref === ref) {
                this.earth.sceneTree.root["children"].splice(index, 1)
                return true
            }
        })
    }

    // 清除Image和Tileset外的所有内容
    clearEntities() {
        if (this.earth !== undefined && this.earth.sceneTree !== undefined) {
            //清除网格模型
            let deleteList = []
            this.earth.sceneTree.root["children"].forEach(
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
                    this.earth.sceneTree.root["children"].some((item, index) => {
                        if (item.ref === ref) {
                            this.earth.sceneTree.root["children"].splice(index, 1)
                            return true
                        }
                    })
                }
            )
        }

    }

    // 清除image外的所有内容
    restoreEarth() {
        if (this.earth !== undefined && this.earth.sceneTree !== undefined) {
            //清除网格模型
            let deleteList = []
            this.earth.sceneTree.root["children"].forEach(
                item => {
                    let type = item.czmObject.xbsjType
                    let ref = item.ref
                    if (type !== 'Imagery') {
                        deleteList.push(ref)
                    }
                }
            )
            deleteList.forEach(
                ref => {
                    this.earth.sceneTree.root["children"].some((item, index) => {
                        if (item.ref === ref) {
                            this.earth.sceneTree.root["children"].splice(index, 1)
                            return true
                        }
                    })
                }
            )
        }
        this.viewer.entities.removeAll();

    }

    // 清除所有内容
    clearAllModels() {
        if (window._earth !== undefined && window._earth.sceneTree !== undefined) {

            window._earth.sceneTree.root["children"] = []
        }
    }

    // 销毁地球
    destroyEarth() {
        this.earth = this.earth && this.earth.destroy();
        console.log('地球已经销毁');

    }

    // 初始化地球场景位置
    initPosition(sceneName = 'community') {
        switch (sceneName) {
            case "community":
                this.camera.flyTo(
                    [2.042793240860197, 0.6398989262457605, 38.67157438460474],
                    400,
                    [-30 * Math.PI / 180, -20 * Math.PI / 180, 0],
                    2,
                )
                break
            case "school":
                this.camera.flyTo(
                    [2.044358680076563, 0.6399596843968951, 25.52822703395884],
                    400,
                    [60 * Math.PI / 180, -20 * Math.PI / 180, 0],
                    2,
                )
                break
        }
    }

    // 获取已添加的对象
    getEarthModelList() {
        return this.earth.sceneTree.root["children"]
    }

    // 视角飞入某个位置
    flyToPosition(positionArray, viewDistance = 200, rotation = [-30 * Math.PI / 180, -20 * Math.PI / 180, 0], duringTime = 2) {
        this.earth.camera.flyTo(
            positionArray,
            viewDistance,
            rotation,
            duringTime
        )
    }

    // 初始化网格视角
    initCommunityPosition(areaInfo) {
        // this.flyToPosition([2.042793850105076, 0.6398969081167519, 0], 700, [0 * Math.PI / 180, -45 * Math.PI / 180, 0])

        let areaCesiumObj = this.getEarthObjByRef('area_' + areaInfo.id)

        //不存在
        if (!areaCesiumObj) {
            this.pushEntityToEarth('area_' + areaInfo.id, JSON.parse(areaInfo.cesiumCode))
            areaCesiumObj = this.getEarthObjByRef('area_' + areaInfo.id)
            areaCesiumObj.color[3] = 0.3
            areaCesiumObj.show = false
            this.flyToModel('area_' + areaInfo.id)
            this.removeEntityFromEarth('area_' + areaInfo.id)
        } else {
            this.flyToModel('area_' + areaInfo.id)
        }
    }

    setMinMaxZoomDistance(minZoomDistance, maxZoomDistance) {
        this.scene.screenSpaceCameraController.minimumZoomDistance = minZoomDistance;
        this.scene.screenSpaceCameraController.maximumZoomDistance = maxZoomDistance;

    }

    trackPosition(radianPosition, screenPosition) {
        const pinId = v1();
        const pinCode = {
            "xbsjType": "Pin",
            "position": [],
            "pinBuilder": {},
            "iframe": {},
            "show": false,
        }
        pinCode.position = radianPosition;
        let pin = this.pushEntityToEarth(`position_bind_pin_${pinId}`, pinCode);
        let unBindFun = XE.MVVM.watch(pin.winPos, () => {
            if (!_.isEqual(pin.winPos, screenPosition)) {
                screenPosition.splice(0, screenPosition.length);
                screenPosition.push(...pin.winPos);
            }
        });
        return { pinId, unBindFun };
    }

    unbindPosition(option) {
        option.unBindFun();
        this.removeEntityFromEarth(`position_bind_pin_${option.pinId}`)
    }

    angle2Radian(angle) {
        return Math.PI / 180 * angle;
    }

    radian2Angle(radian) {
        return 180 / Math.PI * radian;
    }

    linearUniformInterpolation(radianPositionList, length) {
        const cartographicList = radianPositionList.map(
            (position) =>
                new Cesium.Cartographic(position[0], position[1], position[2])
        );
        const cartesianPositions = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(cartographicList);
        const currentDistanceList = [];
        const sumDistance = cartesianPositions.reduce((prev, _, index) => {
            let result = 0;
            if (prev !== undefined) {
                result = prev + Cesium.Cartesian3.distance(cartesianPositions[index - 1], cartesianPositions[index])
            }
            currentDistanceList.push(result);
            return result;
        }, undefined)

        // 距离归一化
        const times = currentDistanceList.map(distance => distance / sumDistance);

        const spline = new Cesium.LinearSpline({
            times: times,
            points: cartesianPositions,
        });

        const newPositionArray = [];
        for (let i = 0; i < length; i++) {
            const cartographicPosition = Cesium.Cartographic.fromCartesian(spline.evaluate(i / length))
            newPositionArray.push([cartographicPosition.longitude, cartographicPosition.latitude, cartographicPosition.height]);
        }

        return newPositionArray;
    }
}