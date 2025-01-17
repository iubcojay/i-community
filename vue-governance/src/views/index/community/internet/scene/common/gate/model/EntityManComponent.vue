<template>
  <div></div>
</template>

<script>
import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { gsap } from "gsap";
export default {
  name: "EntityManComponent",
  props: ["entityInfo"],
  data() {
    return {
      // modelHeightOffset: 0,
      actionDict: {
        idle: { weight: 0, _action: undefined },
        walk: { weight: 1, _action: undefined },
      },
      lastTimestamp: undefined,
      duration: 0.5,

      manModelUrl: "/model/gate/man.glb",
    };
  },
  methods: {
    async initComp() {
      if (!window.entityModelPool[this.entityInfo.type]) {
        await this.addModel2Pool();
      }
      const { model, animations } = window.entityModelPool[
        this.entityInfo.type
      ];

      const modelObject = SkeletonUtils.clone(model);
      window.gateScene.add(modelObject);
      modelObject.position.set(
        this.entityInfo.position[0],
        0,
        this.entityInfo.position[2]
      );
      this._model = modelObject;

      const mixer = new THREE.AnimationMixer(modelObject);
      window.gateScene.addMixer(mixer);
      this._mixer = mixer;

      animations.forEach((clip) => {
        const setting = this.actionDict[clip.name];
        if (setting) {
          const action = mixer.clipAction(clip.clone());
          setting._action = action;
          action.enabled = true;
          action.setEffectiveTimeScale(1);
          action.setEffectiveWeight(setting.weight);
          action.play();
        }
      });
    },

    destroyComp() {
      window.gateScene.removeObject(this._model);
      window.gateScene.removeMixer(this._mixer);
    },

    updateModel() {
      this.updateDuration();
      this.updatePosition();
      this.updateRotation();
    },

    updateDuration() {
      this.duration = this.lastTimestamp
        ? (this.entityInfo.timestamp - this.lastTimestamp) / 1000
        : 0.5;
      this.lastTimestamp = this.entityInfo.timestamp;
    },

    updatePosition() {
      if (!this._model) {
        return;
      }
      const distance = this.getPositionDistant(
        {
          x: this.entityInfo.position[0],
          y: this.entityInfo.position[1],
          z: this.entityInfo.position[2],
        },
        this._model.position
      );

      if (distance >= 0.6) {
        clearTimeout(this._stopTimer);
        this.actionDict["walk"]._action.setEffectiveWeight(1);
        this.actionDict["idle"]._action.setEffectiveWeight(0);
        if (this._lastPositionTween) {
          this._lastPositionTween.kill();
        }

        this._lastPositionTween = gsap.to(this._model.position, {
          x: this.entityInfo.position[0],
          y: 0,
          z: this.entityInfo.position[2],
          duration: this.duration,
        });
        this._lastPositionTween.then(() => {
          this._stopTimer = setTimeout(() => {
            this.actionDict["walk"]._action.setEffectiveWeight(0);
            this.actionDict["idle"]._action.setEffectiveWeight(1);
          }, 500);
        });
      }
    },

    updateRotation() {
      if (this._model) {
        const originRotation = this._model.rotation.clone();
        this._model.lookAt(
          this.entityInfo.position[0],
          0,
          this.entityInfo.position[2]
        );
        const newRotation = this._model.rotation.clone();

        if (this._lastRotationTween) {
          this._lastRotationTween.kill();
        }

        this._lastRotationTween = gsap.fromTo(
          this._model.rotation,
          {
            y: originRotation.y,
          },
          {
            y: newRotation.y,
            duration: this.duration,
          }
        );
      }
    },

    getPositionDistant(position1, position2) {
      return Math.sqrt(
        (position1.x - position2.x) ** 2 + (position1.z - position2.z) ** 2
      );
    },

    async addModel2Pool() {
      return new Promise((resolve) => {
        window.gateScene.gltfLoader.load(
          this.$StaticResourceAddress + this.manModelUrl,
          function ({ scene: model, animations }) {
            model.traverse(function (object) {
              if (object.isMesh) object.castShadow = true;
            });
            window.entityModelPool["man"] = { model, animations };
            resolve();
          }
        );
      });
    },
  },

  mounted() {
    this.initComp();
  },

  destroyed() {
    this.destroyComp();
  },

  watch: {
    entityInfo() {
      this.updateModel();
    },
  },
};
</script>

<style lang="less" scoped></style>
