<template>
  <div class="test_image_outer_panel">
    <div id="cesium_container"></div>
  </div>
</template>

<script>
import MyEarth from "@/assets/js/cesium/MyEarth";
export default {
  name: "TestImagePage",
  methods: {
    initComp() {
      this.initEarth();
      this.addMyImage();
    },

    initEarth() {
      this.myEarth = new MyEarth("cesium_container");
      this.myEarth.getEarthObjByRef("imagery_global_img").show = false;
      this.myEarth.scene.screenSpaceCameraController.maximumZoomDistance = 9999999999;
      this.myEarth.scene.screenSpaceCameraController.minimumZoomDistance = 10;

      this.myEarth.camera.flyTo(
        [
          Cesium.Math.toRadians(116.99722),
          Cesium.Math.toRadians(36.66833),
          1000,
        ],
        0,
        [(0, Math.PI) / 180, (-90 * Math.PI) / 180, 0],
        0
      );
    },

    addMyImage() {
      // 添加一个图层
      //   let layers = this.myEarth.viewer.scene.imageryLayers;
      //   layers.addImageryProvider(
      //     new Cesium.UrlTemplateImageryProvider({
      //       url: this.$StaticResourceAddress + "/tile_image/jinan/{z}/{x}/{y}.jpg",
      //       minimumLevel: 1,
      //       maximumLevel: 13,
      //       // 设置边界
      //       rectangle: new Cesium.Rectangle(
      //         Cesium.Math.toRadians(116.217278569), // west
      //         Cesium.Math.toRadians(36.029282172), // south
      //         Cesium.Math.toRadians(117.740033335), // east
      //         Cesium.Math.toRadians(37.538265075) // north
      //       ),
      //     })
      //   );
      //   const imageObject = {
      //     xbsjType: "Imagery",
      //     name: "离线影像",
      //     show: true,
      //     xbsjImageryProvider: {
      //       createTileMapServiceImageryProvider: {
      //         url: this.$StaticResourceAddress + "/tile_image/jinan",
      //         fileExtension: "jpg",
      //       },
      //       type: "createTileMapServiceImageryProvider",
      //       maximumLevel: 13,
      //       minimumLevel: 1,
      //       rectangle: [
      //         Cesium.Math.toRadians(116.217278569), // west
      //         Cesium.Math.toRadians(36.029282172), // south
      //         Cesium.Math.toRadians(117.740033335), // east
      //         Cesium.Math.toRadians(37.538265075), // north]
      //       ],
      //     },
      //   };
      // this.myEarth.pushEntityToEarth("imagery_my_image", imageObject);

      this.myEarth.viewer.imageryLayers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
          url: this.$StaticResourceAddress + "/imagery/global.png",
        })
      );

      let baseLayer = new Cesium.TileMapServiceImageryProvider({
        url: this.$StaticResourceAddress + "/imagery/jinan_road", //tms服务路径
        fileExtension: "png", //切片图片格式
        minimumLevel: 1, //起始级别
        maximumLevel: 16, //起始级别
        tilingScheme: new Cesium.WebMercatorTilingScheme(), //这个参数要根据下载的切片投影类型，经纬度的用GeographicTilingScheme，默认是web墨卡托的 WebMercatorTilingScheme()
        rectangle: Cesium.Rectangle.fromDegrees(
          116.217278569,
          36.029282172,
          117.740033335,
          37.538265075
        ),
      });
      this.myEarth.viewer.imageryLayers.addImageryProvider(baseLayer);
    },
  },
  mounted() {
    this.initComp();
  },
};
</script>

<style lang="less" scoped>
.test_image_outer_panel {
  position: relative;
  width: 100%;
  height: 100%;

  #cesium_container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
