<template>
  <div class="camera_outer_container"></div>
</template>

<script>
import * as THREE from "three";
export default {
  name: "CameraComponent",
  data() {
    return {
      cameraModelUrl: "/model/gate/camera.glb",
    };
  },

  methods: {
    async initComp() {
      await this.addCamera();
    },
    destroyComp() {
      this.removeCamera();
    },

    async addCamera() {
      const cameraPosition = [7.4, 2.55, -1.1];
      const cameraRotation = [0.3, -0.3, 0];
      return new Promise((resolve) => {
        // 摄像头模型
        const loader = window.gateScene.gltfLoader;
        loader.load(
          this.$StaticResourceAddress + this.cameraModelUrl,
          ({ scene }) => {
            // 创建组
            const cameraModelGroup = new THREE.Group();
            window.gateScene.add(cameraModelGroup);
            cameraModelGroup.name = "cameraModelGroup";
            const cameraMeshAxesHelper = new THREE.AxesHelper(3);
            cameraMeshAxesHelper.visible = false;
            cameraModelGroup.add(cameraMeshAxesHelper);
            this._cameraMeshAxesHelper = cameraMeshAxesHelper;
            this._cameraModelGroup = cameraModelGroup;

            // 模型添加进组
            scene.traverse(function (child) {
              if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({
                  map: child.material.map,
                  color: child.material.color,
                });
              }
            });
            cameraModelGroup.add(scene);
            cameraModelGroup.position.set(...cameraPosition);
            cameraModelGroup.rotation.set(...cameraRotation);

            // 添加摄像头视角
            const localCamera = new THREE.PerspectiveCamera();
            localCamera.position.set(0, 0, 0.5);
            localCamera.rotation.set(0, Math.PI, 0);
            cameraModelGroup.add(localCamera);
            this._localCamera = localCamera;

            resolve({ cameraModelGroup });
          }
        );
      });
    },

    removeCamera() {
      window.gateScene.removeObject(this._cameraModelGroup);
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
.camera_outer_container {
  width: 100%;
  height: 100%;
}
</style>
