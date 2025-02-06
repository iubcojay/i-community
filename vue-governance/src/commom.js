import axios from "axios";
import Vue from 'vue'

export default {
    packagingAxiosParam(params) {
        let uRLSearchParams = new URLSearchParams();
        for (let key in params) {
            uRLSearchParams.append(key, params[key])
        }
        return uRLSearchParams

    },

    //如果timeStr1大，返回正数，否则返回负数
    compareTimeStr(timeStr1, timeStr2) {
        return Date.parse(timeStr1) - Date.parse(timeStr2)
    },


    waitUndefinedLock(value) {
        while (true) {
            if (value !== undefined) {
                break
            }
        }
    },

    getBaiduAk() {
        return "AF1VK2vXf7vYVnFneYEGCSyv6RRWXUmU"
    },

    radiansToCartographic(viewer, radians) {

        let cartesian3 = Cesium.Cartesian3.fromRadians(radians[0], radians[1], radians[2])
        let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lon = Cesium.Math.toDegrees(cartographic.longitude);
        return {lat: lat, lon: lon}
    },

    gridPolygonGetCenter(gridPolygon) {
        let positions = gridPolygon.positions
        let pointArray = []
        for (let i = 0; i < positions.length; i += 2) {
            pointArray.push([positions[i], positions[i + 1]])
        }

        let sortedLongitudeArray = pointArray.map(item => item[1]).sort();//首先对经度进行排序，红色部分是array中经度的名称
        let sortedLatitudeArray = pointArray.map(item => item[0]).sort();//对纬度进行排序，红色部分是array中纬度的名称
        let centerLongitude = ((parseFloat(sortedLongitudeArray[0]) + parseFloat(sortedLongitudeArray[sortedLongitudeArray.length - 1])) / 2);
        const centerLatitude = ((parseFloat(sortedLatitudeArray[0]) + parseFloat(sortedLatitudeArray[sortedLatitudeArray.length - 1])) / 2);
        //如果经纬度在array中不是数字类型，需要转化为数字类型进行计算，如果是可以去掉parseFloat处理
        //console.log(centerLongitude+"kkk"+centerLatitude);

        let centerHeight = gridPolygon.height;
        if (gridPolygon.extrudedHeight !== undefined && gridPolygon.extrudedHeight !== null) {
            centerHeight = (gridPolygon.height + gridPolygon.extrudedHeight) / 2
        }

        return [centerLatitude, centerLongitude, centerHeight];
    },


    createComponent(Vue, document, Component, props) {

        const comp = new (Vue.extend(Component))({propsData: props}).$mount()

        document.body.appendChild(comp.$el)

        comp.remove = () => {

            document.body.removeChild(comp.$el)

            comp.$destroy()

        }
        return comp
    },


    getOuterTrees(originalPoints) {

        let points = originalPoints.filter(function (item, index) {
            return originalPoints.indexOf(item) === index;
        });

        let resultPointList = []

        if (points.length == 1) {
            resultPointList.push(points[0]);
            return resultPointList
        }
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                let oneSide = 0
                let anotherSide = 0
                for (let k = 0; k < points.length; k++) {
                    if (k == i || k == j)
                        continue;
                    if (this.calculateTriangle(points[i], points[j], points[k]) > 0) {
                        oneSide++;
                    }
                    if (this.calculateTriangle(points[i], points[j], points[k]) < 0) {
                        anotherSide++;
                    }
                }

                if (oneSide == 0 || anotherSide == 0 || oneSide == points.length - 2 || anotherSide == points.length - 2) {
                    resultPointList.push(points[i]);
                    resultPointList.push(points[j]);
                }
            }
        }

        resultPointList = resultPointList.filter(function (item, index) {
            return resultPointList.indexOf(item) === index;
        });


        return resultPointList;
    },


    calculateTriangle(point1, point2, point3) {
        return point1.x * point2.y + point3.x * point1.y + point2.x * point3.y
            - point3.x * point2.y - point2.x * point1.y - point1.x * point3.y;
    },

    randomColor() {
        return [Math.random(), Math.random(), Math.random(), 0.5]
    },

    clearEarth(earth) {
        //清除网格模型
        if (earth !== undefined && earth.sceneTree !== undefined) {
            let deleteList = []
            earth.sceneTree.root["children"].forEach(
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
                    earth.sceneTree.root["children"].some((item, index) => {
                        if (item.ref === ref) {
                            earth.sceneTree.root["children"].splice(index, 1)
                            return true
                        }
                    })
                }
            )
        }
    },

    urlToBlob(file_url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("get", file_url, true);
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (this.status == 200) {
                    const reader = new FileReader()
                    reader.onload = function () {
                        resolve(reader.result)
                    }
                    reader.readAsText(this.response);
                } else {
                    console.log('err');
                }
            };
            xhr.send();
        })
    },

    myClearArray(array) {
        array.splice(0, array.length)
    },

    dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            }
        }
        return fmt;
    },

    timestampToFormatString(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
        // 1. 根据时间戳创建 JS Date 对象
        const date = new Date(timestamp);

        // 2. 获取年月日、时分秒等数据
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 月份从 0 开始计数，需 +1
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();

        // 3. 定义辅助函数，补齐个位前的 0
        const padZero = (num) => (num < 10 ? '0' + num : num);

        // 4. 可根据 format 中的标记，替换为对应内容
        //   如果你需要更多自定义占位符，可以在这里自行扩展。
        //   下面只做了最常用的几个占位符的替换示例。
        let result = format
            .replace('YYYY', year)
            .replace('MM', padZero(month))
            .replace('DD', padZero(day))
            .replace('HH', padZero(hour))
            .replace('mm', padZero(minute))
            .replace('ss', padZero(second));

        return result;
    },
}

