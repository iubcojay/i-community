<template>
  <div
    ref="poiContainer"
    class="public_sentiment_container"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
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
export default {
  name: "PublicSentimentPoiComponent",
  props: {
    position: {
      default: () => ({
        x: "500",
        y: "500",
      }),
    },
    show: {
      default: () => {
        false;
      },
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
    showComp() {
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

    hindComp() {
      const tl = gsap.timeline();
      tl.fromTo(
        this.$refs.detailPanel,
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0 }
      );
      tl.fromTo(
        this.$refs.poiContainer,
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0 }
      );
    },
  },
  watch: {
    show(value) {
      if (value) {
        this.showComp();
      } else {
        this.hindComp();
      }
    },
  },

  // mounted() {
  //   this.showComp();
  // },
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
      background-image: linear-gradient(rgba(2, 77, 137, 0.9), rgba(2, 77, 137, 1));
      left: 50%;
      bottom: 0;
      transform: translateX(-50%) translateY(100%);
      clip-path: polygon(0px 0px, 50% 100%, 100% 0);
    }
  }
}
</style>
