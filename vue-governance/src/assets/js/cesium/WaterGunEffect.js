export default class WaterGunEffect {
    constructor(viewer, position, targetPosition, options = {}) {
        this.viewer = viewer
        this.viewModel = {
            emissionRate: 5,
            gravity: 0.0,//设置重力参数
            minimumParticleLife: 1,
            maximumParticleLife: 3,
            minimumSpeed: 1.0,//粒子发射的最小速度
            maximumSpeed: 4.0,//粒子发射的最大速度
            startScale: 0.0,
            endScale: 10.0,
            particleSize: 25.0,
            ...options
        }
        this.emitterModelMatrix = new Cesium.Matrix4()
        this.translation = new Cesium.Cartesian3()
        this.rotation = new Cesium.Quaternion()
        this.hpr = new Cesium.HeadingPitchRoll()
        this.trs = new Cesium.TranslationRotationScale()
        this.scene = this.viewer.scene
        this.particleSystem = ''
        this.entity = this.viewer.entities.add({
            //选择粒子放置的坐标
            position,
        });
        this.init();
    }

    init() {
        const _this = this
        this.viewer.scene.globe.depthTestAgainstTerrain = false;
        var particleSystem = this.scene.primitives.add(
            new Cesium.ParticleSystem({
                image: '/static/img/particle/water.png',//生成所需粒子的图片路径
                //粒子在生命周期开始时的颜色
                startColor: new Cesium.Color(1, 1, 1, 0.6),
                endColor: new Cesium.Color(0.80, 0.86, 1, 0.4),
                //粒子在生命周期开始时初始比例
                startScale: 1,
                endScale: 2,
                minimumParticleLife: 1.5,
                maximumParticleLife: 2,
                minimumSpeed: 10,
                maximumSpeed: 11,
                //以像素为单位缩放粒子图像尺寸
                imageSize: new Cesium.Cartesian2(1, 1),
                emissionRate: 200,
                //粒子系统发射粒子的时间（秒）
                lifetime: 1.0,
                //设置粒子的大小是否以米或像素为单位
                sizeInMeters: true,
                //系统的粒子发射器
                emitter: new Cesium.CircleEmitter(0.1),//BoxEmitter 盒形发射器，ConeEmitter 锥形发射器，SphereEmitter 球形发射器，CircleEmitter圆形发射器
                //回调函数，实现各种喷泉、烟雾效果
                updateCallback: (p, dt) => {
                    return this.applyGravity(p, dt);
                },
            })
        );
        this.particleSystem = particleSystem;
        this.preUpdateEvent()
    }

    //场景渲染事件
    preUpdateEvent() {
        let _this = this;
        this.viewer.scene.preUpdate.addEventListener(function (scene, time) {
            //发射器地理位置
            _this.particleSystem.modelMatrix = _this.computeModelMatrix(_this.entity, time);
            //发射器局部位置
            _this.particleSystem.emitterModelMatrix = _this.computeEmitterModelMatrix();
            // 将发射器旋转
            if (_this.viewModel.spin) {
                _this.viewModel.heading += 1.0;
                _this.viewModel.pitch += 1.0;
                _this.viewModel.roll += 1.0;
            }
        });
    }

    computeModelMatrix(entity, time) {
        return entity.computeModelMatrix(time, new Cesium.Matrix4());
    }

    computeEmitterModelMatrix() {
        this.hpr = Cesium.HeadingPitchRoll.fromDegrees(90.0, 30.0, 0.0, this.hpr); // 倾斜角度
        this.trs.translation = Cesium.Cartesian3.fromElements(0, 0, 1, this.translation); // 发射高度
        this.trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(this.hpr, this.rotation);
        return Cesium.Matrix4.fromTranslationRotationScale(
            this.trs,
            this.emitterModelMatrix
        );
    }

    applyGravity(p, dt) {
        var gravityScratch = new Cesium.Cartesian3()
        var position = p.position;
        Cesium.Cartesian3.normalize(position, gravityScratch);
        Cesium.Cartesian3.multiplyByScalar(gravityScratch, -15 * dt, gravityScratch);
        p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity);
    }

    removeEvent() {
        this.viewer.scene.preUpdate.removeEventListener(this.preUpdateEvent, this);
        this.emitterModelMatrix = undefined;
        this.translation = undefined;
        this.rotation = undefined;
        this.hpr = undefined;
        this.trs = undefined;
    }

    //移除粒子特效
    remove() {
        () => { return this.removeEvent() }; //清除事件
        this.viewer.scene.primitives.remove(this.particleSystem); //删除粒子对象
        this.viewer.entities.remove(this.entity); //删除entity
    }

}
