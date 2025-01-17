<template>
  <div class="gate_container">
    <camera-component></camera-component>
    <div class="entity_container">
      <entity-component
        v-for="entityInfo of currentEntityInfoList"
        :key="entityInfo.id"
        :entityInfo="entityInfo"
      ></entity-component>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import CameraComponent from "./CameraComponent";
import EntityComponent from "./EntityComponent";

export default {
  name: "GateComponent",
  components: { CameraComponent, EntityComponent },
  data() {
    return {
      gateModelUrl: "/model/gate/gate.gltf",
      currentEntityInfoList: [],
      lightPositionList: [[10, 10, 10]],
    };
  },
  computed: {},
  methods: {
    async initComp() {
      await this.addGateModel();
      this.initModelPool();
      // this.wsConnect();
      this.fakeWsConnect();
    },
    destroyComp() {
      this.removeGateModel();
      this.wsClose();
    },

    async addGateModel() {
      return new Promise((resolve) => {
        const loader = window.gateScene.gltfLoader;
        loader.load(
          this.$StaticResourceAddress + this.gateModelUrl,
          ({ scene }) => {
            this._gateModel = scene;
            window.gateScene.add(scene);
            scene.position.y = -0.55;
            resolve(scene);
          }
        );
      });
    },

    removeGateModel() {
      window.gateScene.removeObject(this._gateModel);
    },

    //#region 初始化模型池
    initModelPool() {
      const pool = {};
      window.entityModelPool = pool;
    },

    //# websocket
    wsConnect() {
      this.$socket.open();
      //接收服务端的信息
      this.sockets.subscribe("detect_message", (dataStr) => {
        this.handleSocketMessage(dataStr);
      });
    },

    wsClose() {
      this._fakeWsInterval && clearInterval(this._fakeWsInterval);
    },

    handleSocketMessage(dataStr) {
      const detectEntityList = JSON.parse(dataStr);
      // detectEntityList.forEach(({ position }) => {
      //   position[0] = position[0] * 1.5;
      //   position[1] = position[1] * 1.5;
      //   position[2] = position[2] * 1.5;
      // });

      // 局部坐标转为世界坐标

      if (detectEntityList.length === 0) {
        this._detectChangeTimer = setTimeout(() => {
          this.currentEntityInfoList = [];
        }, 500);
      } else {
        clearTimeout(this._detectChangeTimer);
        this.currentEntityInfoList = detectEntityList.map((entityInfo) => {
          return {
            ...entityInfo,
            position: this.cameraPosition2WorldPosition(entityInfo.position),
          };
        });
      }
    },

    fakeWsConnect() {
      let index = 0;
      const fakeDataList = [
        {
          id: "15161616516515135",
          type: "man",
          position: [0.17, -0.68, 1.89],
        },
        {
          id: "15161616516515135",
          type: "man",
          position: [0.44, -0.94, 2.6],
        },
        {
          id: "15161616516515135",
          type: "man",
          position: [0.7, -0.9, 2.82],
        },
        {
          id: "15161616516515135",
          type: "man",
          position: [0.95, -0.86, 3.42],
        },
        {
          id: "15161616516515135",
          type: "man",
          position: [1.48, -1.01, 5.05],
        },
        {
          id: "15161616516515135",
          type: "man",
          position: [1.97, -0.89, 6.55],
        },
        {
          id: "15161616516515135",
          type: "man",
          position: [2.51, -0.73, 8.45],
        },

        {
          id: "15161616516515135",
          type: "man",
          position: [1.97, -0.89, 6.55],
        },
        {
          id: "15161616516515135",
          type: "man",
          position: [1.48, -1.01, 5.05],
        },
        {
          id: "15161616516515135",
          type: "man",
          position: [0.95, -0.86, 3.42],
        },
        {
          id: "15161616516515135",
          type: "man",
          position: [0.7, -0.9, 2.82],
        },
        {
          id: "15161616516515135",
          type: "man",
          position: [0.44, -0.94, 2.6],
        },
        {
          id: "15161616516515135",
          type: "man",
          position: [0.17, -0.68, 1.89],
        },
      ];
      this._fakeWsInterval = setInterval(() => {
        const dataStr = JSON.stringify([
          { ...fakeDataList[index], timeStamp: new Date().getTime() },
        ]);
        this.handleSocketMessage(dataStr);
        index = (index + 1) % fakeDataList.length;
      }, 500);
    },

    // 将局部坐标转为世界坐标
    cameraPosition2WorldPosition(cameraPosition) {
      const cameraModelGroup = window.gateScene.scene.getObjectByName(
        "cameraModelGroup"
      );
      if (cameraModelGroup) {
        const worldPosition = cameraModelGroup.localToWorld(
          new THREE.Vector3(...cameraPosition)
        );
        return [worldPosition.x, worldPosition.y, worldPosition.z];
      } else {
        return [...cameraPosition];
      }
    },
  },
  mounted() {
    this.initComp();
  },

  destroyed() {
    this.destroyComp();
  },
};
</script>

<style lang="less" scoped>
.room_container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .entity_container {
    width: 100%;
    height: 100%;
  }
}
</style>
