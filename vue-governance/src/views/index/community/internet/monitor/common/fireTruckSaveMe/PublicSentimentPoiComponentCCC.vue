<template>
  <div
    ref="poiContainer"
    class="public_sentiment_container"
    :style="{
      transform: `translateX(calc(${position.x} - 50%)) translateY(calc(${position.y} - 100% + 25px))`,
    }"
  >
    <div class="public_sentiment_content_container">
      <i class="iconfont" :class="[iconClass]"></i>
    </div>
    <div class="big_ring">
      <div class="top_right_ring"></div>
      <div class="bottom_left_ring"></div>
    </div>
    <div ref="detailPanel" class="detail_panel">
      <div class="header_panel">
        <i class="iconfont" :class="[iconClass]"></i>
        <span class="platform_panel">{{ info.platform }}</span>
      </div>
      <div class="text_panel">{{ info.text }}</div>
      <div v-if="info.img" class="img_panel">
        <img :src="$StaticResourceAddress + info.img" />
      </div>
      <div class="footer_panel"></div>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";
import ThreeJsMaterial from "@/assets/js/threejs/ThreeJsMaterial";
export default {
  name: "PublicSentimentPoiComponent",
  props: {
    position: {
      default: () => ({
        x: "500",
        y: "500",
      }),
    },

    info: {
      default: () => ({
        platform: "博客",
        text:
          "昨晚，一辆油罐车在我家附近的公路上泄露了，现场一片混乱，希望没有人受伤。",
        url: "https://baijiahao.baidu.com/s?id=1772270465286016327",
        img: "/img/accident/4.png",
      }),
    },

    centerPosition: {
      default: () => ({ lon: 0, lat: 0, height: 0 }),
    },
    degreePosition: {
      default: () => ({ lon: 0, lat: 0, height: 0 }),
    },
  },

  computed: {
    iconClass() {
      switch (this.info.platform) {
        case "博客":
          return "icon-blog";
        case "社区论坛":
          return "icon-comment";
        case "新闻评论":
          return "icon-news";
      }
      return this.data;
    },
  },

  methods: {
    initComp() {
      this.showPanel();
      this.addLine();
    },
    showPanel() {
      const tl = gsap.timeline();
      tl.fromTo(
        this.$refs.poiContainer,
        { opacity: 0, scale: 1.5 },
        { opacity: 1, scale: 1 }
      );

      tl.fromTo(
        this.$refs.detailPanel,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          ease: "elastic.out(1,0.3)",
        }
      );
    },

    addLine() {
      const degreeEndPoint = {
        lon: this.degreePosition.lon,
        lat: this.degreePosition.lat,
        height: this.degreePosition.height,
      };

      const degreeStartPoint = {
        lon: this.centerPosition.lon,
        lat: this.centerPosition.lat,
        height: this.centerPosition.height,
      };

      const degreePointList = this.getArcLineDegreePointList({
        height: 100,
        num: 100,
        startPoint: degreeStartPoint,
        endPoint: degreeEndPoint,
      });

      const completePositionList = Cesium.Cartesian3.fromDegreesArrayHeights(
        degreePointList.flatMap((degreePoint) => [
          degreePoint.lon,
          degreePoint.lat,
          degreePoint.height,
        ])
      );

      const entity = new Cesium.Entity({
        polyline: {
          positions: completePositionList,
          width: 3,
          material: ThreeJsMaterial.getFlowMaterial({
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            activeColor: "rgba(33, 194, 237,0.8)",
            duration: 2,
          }).cesiumMaterial,
        },
      });
      const showPositionList = [];
      const interval = 50;
      const duration = 500;
      const loopTimes = Math.ceil(duration / interval);
      const eachAddNumber = Math.floor(completePositionList.length / loopTimes);
      let loopIndex = 0;

      const timer = setInterval(() => {
        if (showPositionList.length >= completePositionList.length) {
          clearInterval(timer);
        }
        showPositionList.push(
          ...completePositionList.slice(
            loopIndex * eachAddNumber,
            (loopIndex + 1) * eachAddNumber
          )
        );
        loopIndex++;
      }, interval);
      entity.polyline.positions = new Cesium.CallbackProperty(
        () => showPositionList
      );

      window.myEarth.viewer.entities.add(entity);
      this._entity = entity;
    },

    getArcLineDegreePointList(options) {
      // 方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
      const h = options.height && options.height > 50 ? options.height : 50;
      const L =
        Math.abs(options.startPoint.lon - options.endPoint.lon) >
        Math.abs(options.startPoint.lat - options.endPoint.lat)
          ? Math.abs(options.startPoint.lon - options.endPoint.lon)
          : Math.abs(options.startPoint.lat - options.endPoint.lat);
      const num = options.num && options.num > 50 ? options.num : 50;
      const result = [];
      let dlt = L / num;
      if (
        Math.abs(options.startPoint.lon - options.endPoint.lon) >
        Math.abs(options.startPoint.lat - options.endPoint.lat)
      ) {
        //以 lon 为基准
        const dellat = (options.endPoint.lat - options.startPoint.lat) / num;
        if (options.startPoint.lon - options.endPoint.lon > 0) {
          dlt = -dlt;
        }
        for (let i = 0; i < num; i++) {
          const tempH =
            h -
            (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * h) /
              Math.pow(L, 2);
          const lon = options.startPoint.lon + dlt * i;
          const lat = options.startPoint.lat + dellat * i;
          result.push({ lon, lat, height: tempH });
        }
      } else {
        //以 lat 为基准
        let dellon = (options.endPoint.lon - options.startPoint.lon) / num;
        if (options.startPoint.lat - options.endPoint.lat > 0) {
          dlt = -dlt;
        }
        for (let i = 0; i < num; i++) {
          const tempH =
            h -
            (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * h) /
              Math.pow(L, 2);
          const lon = options.startPoint.lon + dellon * i;
          const lat = options.startPoint.lat + dlt * i;
          result.push({ lon, lat, height: tempH });
        }
      }
      // 落地
      result.push({
        lon: options.endPoint.lon,
        lat: options.endPoint.lat,
        height: options.endPoint.height,
      });
      return result;
    },

    removeLine() {
      if (this._entity) {
        window.myEarth.viewer.entities.remove(this._entity);
      }
    },
  },

  mounted() {
    this.initComp();
  },

  destroyed() {
    this.removeLine();
  },
};
</script>

<style lang="less" scoped>
.public_sentiment_container {
  position: absolute;
  width: 50px;
  aspect-ratio: 1;
  pointer-events: none;
  transform: translateX(-50%) translateY(-50%);
  opacity: 0;

  .public_sentiment_content_container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 40px;
    aspect-ratio: 1;
    border-radius: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: rgb(45, 233, 253);
    border: 2px double white;
    z-index: 1;
    box-sizing: border-box;

    i {
      font-size: 25px;
      font-weight: 500;
      color: white;
    }
  }

  .big_ring {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 50px;
    aspect-ratio: 1;

    z-index: 1;

    animation: rotation 15s linear infinite;
    @keyframes rotation {
      0% {
        transform: rotateZ(0);
      }
      100% {
        transform: rotateZ(360deg);
      }
    }

    .top_right_ring {
      position: absolute;
      right: 0;
      top: 0;
      width: 50%;
      height: 50%;
      border-top-right-radius: 100%;
      border-top: 2px solid rgba(255, 255, 255, 0.5);
      border-right: 2px solid rgba(255, 255, 255, 0.5);
    }
    .bottom_left_ring {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 50%;
      height: 50%;
      border-bottom-left-radius: 100%;
      border-bottom: 2px solid rgba(255, 255, 255, 0.5);
      border-left: 2px solid rgba(255, 255, 255, 0.5);
    }
  }

  .detail_panel {
    position: absolute;
    width: 200px;
    height: auto;
    left: 50%;
    top: 0;
    transform-origin: bottom;
    transform: translateX(-50%) translateY(calc(-100% - 15px));
    z-index: 1;
    background: rgba(2, 77, 137, 0.9);
    border-radius: 20px;
    border-top-left-radius: 0px;
    padding: 10px 10px;
    padding-top: 20px;
    z-index: 2;

    .text_panel {
      width: 100%;
      min-height: 50px;
      color: white;
      font-size: 14px;
    }

    .img_panel {
      width: 100%;
      height: auto;
      margin-top: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .header_panel {
      position: absolute;
      left: 5px;
      top: -10px;
      height: 20px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      color: white;

      i {
        font-size: 30px;
      }

      span {
        font-size: 18px;
        font-weight: 700;
        margin-left: 5px;
      }
    }

    .footer_panel {
      position: absolute;
      width: 30px;
      height: 15px;
      background-image: linear-gradient(
        rgba(2, 77, 137, 0.9),
        rgba(2, 77, 137, 1)
      );
      left: 50%;
      bottom: 0;
      transform: translateX(-50%) translateY(100%);
      clip-path: polygon(0px 0px, 50% 100%, 100% 0);
    }
  }
}
</style>
