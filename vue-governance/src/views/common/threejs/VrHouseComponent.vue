<template>
    <div class="container" ref="container"></div>

</template>

<script>
    import * as THREE from "three";
    import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
    import {VRButton} from "three/examples/jsm/webxr/VRButton";
    import {XRControllerModelFactory} from "three/examples/jsm/webxr/XRControllerModelFactory";
    import {HTMLMesh} from "three/examples/jsm/interactive/HTMLMesh";
    import {InteractiveGroup} from "three/examples/jsm/interactive/InteractiveGroup";

    const ROOMWIDTH = 3

    export default {
        name: "VrHouseComponent",
        data() {
            return {
                playerPoint:new THREE.Vector3(0,-ROOMWIDTH/2,-1.5*ROOMWIDTH),
                scene: undefined,
                camera: undefined,
                renderer: undefined,
                cssRenderer: undefined,
                controllers: undefined,
                axesHelper: undefined,
                container: undefined,
                cube: undefined,
                clock: undefined,
                width: 0,
                height: 0,
                spotLight: undefined,
                textureLoader: undefined,
                raycaster: new THREE.Raycaster(),
                roomList: [
                    {
                        name: 'hallWay',
                        positionList: [0, 0, 0],
                        mesh:undefined,
                        textureImgUrlList: [
                            this.$StaticResourceAddress+'/img/vrhouse/kitchen/0_l.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/kitchen/0_r.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/kitchen/0_u.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/kitchen/0_d.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/kitchen/0_f.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/kitchen/0_b.jpg',
                        ],
                        geometryOptionList: [ROOMWIDTH, ROOMWIDTH, ROOMWIDTH, 50, 50, 50],
                        btnList: [
                            {
                                name: '客厅',
                                positionList: [1/6*ROOMWIDTH, ROOMWIDTH/8, ROOMWIDTH/2],
                                btnMesh: undefined,
                                targetRoomName: 'livingRoom'
                            },

                            {
                                name: '厨房',
                                positionList: [-ROOMWIDTH/2, ROOMWIDTH/8, 0],
                                btnMesh: undefined,
                                targetRoomName: 'kitchen'
                            }
                        ],
                    },
                    {
                        name: 'livingRoom',
                        positionList: [0, 0, 0],
                        mesh:undefined,
                        textureImgUrlList: [
                            this.$StaticResourceAddress+'/img/vrhouse/living/4_l.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/living/4_r.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/living/4_u.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/living/4_d.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/living/4_f.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/living/4_b.jpg',
                        ],
                        geometryOptionList: [ROOMWIDTH, ROOMWIDTH, ROOMWIDTH, 50, 50, 50],
                        btnList: [
                            {
                                name: '卧室',
                                positionList: [ROOMWIDTH / 2, ROOMWIDTH/8, -1/5*ROOMWIDTH],
                                btnMesh: undefined,
                                targetRoomName: ''
                            },

                            {
                                name: '玄关',
                                positionList: [-ROOMWIDTH / 2, ROOMWIDTH/8, -1/5*ROOMWIDTH],
                                btnMesh: undefined,
                                targetRoomName: 'hallWay'
                            }
                        ],
                    },
                    {
                        name: 'kitchen',
                        positionList: [0, 0, 0],
                        mesh:undefined,
                        textureImgUrlList: [
                            this.$StaticResourceAddress+'/img/vrhouse/kitchen/2_l.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/kitchen/2_r.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/kitchen/2_u.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/kitchen/2_d.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/kitchen/2_f.jpg',
                            this.$StaticResourceAddress+'/img/vrhouse/kitchen/2_b.jpg',
                        ],
                        geometryOptionList: [ROOMWIDTH, ROOMWIDTH, ROOMWIDTH, 50, 50, 50],
                        btnList: [

                            {
                                name: '玄关',
                                positionList: [ROOMWIDTH/2, ROOMWIDTH/8, 0],
                                btnMesh: undefined,
                                targetRoomName: 'hallWay'
                            }
                        ],
                    },




                ],
                buttonMeshList: [],
                highLightButtonMeshList: [],
                currentRoom: undefined,
                mouseVector: new THREE.Vector2(0,0),
                vrButtonElement: undefined
            }
        },

        methods: {

            initPage() {
                this.textureLoader = new THREE.TextureLoader()
                this.initScene()
                this.initCamera()
                this.initRenderer()
                this.setWindowListener()
                this.initController()
                this.initAxesHelper()
                this.initRooms()
                this.initVr()
                this.render()
            },

            initRooms() {
                this.group = new InteractiveGroup( this.renderer, this.camera );
                this.add( this.group );
                this.roomList.forEach(
                    (roomInfo) => {
                        roomInfo.btnList.forEach(
                            btnInfo => {
                                this.addChangeButton(btnInfo)
                            }
                        )

                        //顺序为 左右上下前后
                        let materialList = []
                        roomInfo.textureImgUrlList.forEach(
                            url => {
                                let texture = this.textureLoader.load(url)
                                let material = new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide});
                                materialList.push(material)
                            }
                        )

                        let geometry = new THREE.BoxGeometry(...roomInfo.geometryOptionList)
                        let room = new THREE.Mesh(geometry, materialList)
                        room.position.x = roomInfo.positionList[0] + this.playerPoint.x
                        room.position.y = roomInfo.positionList[1] + this.playerPoint.y
                        room.position.z = roomInfo.positionList[2] + this.playerPoint.z
                        console.log(room.position)
                        room.name = roomInfo.name
                        room.visible = false
                        roomInfo.mesh = room
                        this.add(room)
                    }
                )
                this.currentRoom = this.roomList[0]
            },


            addChangeButton(btnInfo) {
                // 创建按钮
                const btnElement = document.createElement('div')
                btnElement.className = 'changeBtn'
                btnElement.textContent = btnInfo.name

                btnElement.style.visibility = 'hidden'
                btnElement.style.position = 'absolute'
                this.container.appendChild(btnElement);

                // 根据按钮创建HTMLMesh网格，添加到Scene中
                const btnMesh = new HTMLMesh(btnElement)
                btnInfo.btnMesh = btnMesh
                btnMesh.scale.setScalar(3);

                // 初始设置按钮Mesh不可见
                btnMesh.visible = false

                // 使按钮Mesh不被立方体Mesh面遮挡
                let ox = btnInfo.positionList[0]
                let oy = btnInfo.positionList[1]
                let oz = btnInfo.positionList[2]
                btnMesh.position.x = ox> this.playerPoint.x ? ox+this.playerPoint.x-0.2 : ox+this.playerPoint.x +0.2
                btnMesh.position.y = oy> this.playerPoint.y ? oy+this.playerPoint.y-0.2 : oy+this.playerPoint.y +0.2
                btnMesh.position.z = oz> this.playerPoint.z ? oz+this.playerPoint.z-0.2 : oz+this.playerPoint.z +0.2

                // 转动按钮Mesh的朝向为原点
                btnMesh.lookAt(this.playerPoint)

                // 将按钮对象放入按钮Mesh对象中存储
                btnMesh.userData.btnElement = btnElement

                // 将按钮Mesh加入buttonMeshList中
                this.buttonMeshList.push(btnMesh)

                // 设置点击移入移除等事件
                btnMesh.addEventListener('click',()=>{
                    this.roomList.forEach(
                        roomInfo => {
                            if (roomInfo.name === btnInfo.targetRoomName) {
                                this.currentRoom = roomInfo
                            }
                        }
                    )
                })

                btnMesh.addEventListener('mouseenter',()=>{
                    btnMesh.scale.setScalar(4);
                    document.querySelector("body").style.cursor = "pointer"

                })

                btnMesh.addEventListener('mouseleave',()=>{
                    btnMesh.scale.setScalar(3);
                    document.querySelector("body").style.cursor = "default"
                })

                this.add(btnMesh)

            },



            initVr() {
                //this.renderer.xr是xr设备对象

                //设置允许使用
                this.renderer.xr.enabled = true;
                this.renderer.xr.setReferenceSpaceType( 'local' );
                //添加开启vr按钮
                const buttonElement =  VRButton.createButton(this.renderer)
                this.vrButtonElement = buttonElement
                buttonElement.style['z-index'] = '10000'
                document.body.appendChild(buttonElement);


                //给Vr控制器添加事件
                this.controller1 = this.renderer.xr.getController(0);
                // this.controller1.addEventListener('selectstart', this.onSelectStart);
                this.controller1.addEventListener('selectend', this.onSelectEnd);
                this.add(this.controller1);

                this.controller2 = this.renderer.xr.getController(1);
                // this.controller2.addEventListener('selectstart', this.onSelectStart);
                this.controller2.addEventListener('selectend', this.onSelectEnd);
                this.add(this.controller2);


                //让手里握着VR控制器
                const controllerModelFactory = new XRControllerModelFactory();

                const controllerGrip1 = this.renderer.xr.getControllerGrip(0);
                controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
                this.add(controllerGrip1);

                const controllerGrip2 = this.renderer.xr.getControllerGrip(1);
                controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
                this.add(controllerGrip2);


                // 控制器添加两条射线
                const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);
                const lineMaterial = new THREE.LineBasicMaterial()
                lineMaterial.color = new THREE.Color('white')
                const line = new THREE.Line(geometry, lineMaterial);

                //设置射线名为"line",方便后续取出使用
                line.name = 'line';

                // 射线默认为5m, 当指向物品时会延长（详情见后续代码）
                line.scale.z = 5;

                //将射线对象克隆加入到两个控制器对象的组中
                this.controller1.add(line.clone());
                this.controller2.add(line.clone());

            },

            //控制器选择按钮按下事件
            onSelectStart(event) {
                // 获取控制器对象
                const controller = event.target;

                // 获取与控制器射线相交的按钮
                const intersections = this.getIntersections(controller);

                //如果物体存在
                if (intersections.length > 0) {
                    //获取最近的物体
                    const buttonMesh = intersections[0].object

                    // 触发按钮Mesh click 事件
                    buttonMesh.dispatchEvent({
                        type: "click"
                    })

                }
            },

            onSelectEnd(event) {
                // 获取控制器对象
                const controller = event.target;

                // 获取与控制器射线相交的按钮
                const intersections = this.getIntersections(controller);

                //如果物体存在
                if (intersections.length > 0) {
                    //获取最近的物体
                    const buttonMesh = intersections[0].object

                    // 触发按钮Mesh click 事件
                    buttonMesh.dispatchEvent({
                        type: "click"
                    })

                }

            },

            //获取与Vr控制器射出射线相交的物体列表
            getIntersections(controller) {
                const tempMatrix = new THREE.Matrix4();
                tempMatrix.identity().extractRotation(controller.matrixWorld);
                this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
                this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
                return this.raycaster.intersectObjects(this.buttonMeshList, true);

            },

            highLightControllerScanButton(controller) {

                // 获取控制器组中的射线对象
                const line = controller.getObjectByName('line');

                //获取与Vr控制器射出射线相交的物体列表
                const intersections = this.getIntersections(controller);

                if (intersections.length > 0) {
                    // 若有物体被控制器指向,则取第一个最近的物品
                    const btnMesh = intersections[0].object



                    // 让射线延伸到物体上
                    line.scale.z = intersections[0].distance;

                    // 选中物体hover效果
                    btnMesh.scale.setScalar(4);

                    // 将被选中的物品放入列表中记录
                    this.highLightButtonMeshList.push(btnMesh);
                } else {
                    // 没有物体被控制器指向，射线长度重新设为5m
                    line.scale.z = 2;
                }

            },

            cleanIntersected() {
                //循环将高亮物品清除
                while (this.highLightButtonMeshList.length) {
                    // 获取物品
                    const btnMesh = this.highLightButtonMeshList.pop();

                    // 清除物体hover效果
                    btnMesh.scale.setScalar(3)
                }
            },

            initScene() {
                this.clock = new THREE.Clock()
                this.container = this.$refs.container;
                this.width = this.container.clientWidth;
                this.height = this.container.clientHeight;
                this.scene = new THREE.Scene()

            },

            initAxesHelper() {
                this.axesHelper = new THREE.AxesHelper(10)
                this.add(this.axesHelper)
            },

            initCamera() {
                // 相机
                this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
                this.camera.position.set(this.playerPoint.x, this.playerPoint.y ,this.playerPoint.z+0.1);
                // this.camera.lookAt(0,0,-9)
                // this.camera.position.set(10, 10, 10);
                this.add(this.camera)
            },

            initRenderer() {
                // 渲染器
                this.renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    logarithmicDepthBuffer: true
                })

                this.renderer.setSize(this.width, this.height)
                this.container.appendChild(this.renderer.domElement)
                this.renderer.shadowMap.enabled = true;
            },


            initController() {
                this.controllers = new OrbitControls(this.camera, this.renderer.domElement)
                this.controllers.target = this.playerPoint
                // this.controllers.enableDamping = true
                // this.controllers.enablePan = false
                // this.controllers.enableZoom = false
            },

            setWindowListener(){
                this.setWindowsSizeListener()
                this.setMouseMoveListener()
                this.setMouseClickListener()
            },

            setWindowsSizeListener() {
                window.addEventListener('resize', () => {
                    this.width = this.container.clientWidth
                    this.height = this.container.clientHeight
                    this.camera.aspect = this.width / this.height
                    this.camera.updateProjectionMatrix()
                    this.renderer.setSize(this.width, this.height)
                    this.renderer.setPixelRatio(window.devicePixelRatio)
                })
            },

            setMouseMoveListener() {
                let cache3DObject = null
                this.renderer.domElement.addEventListener("mousemove", (event) => {
                    let x = event.offsetX
                    let y = event.offsetY
                    this.mouseVector.x = x / this.width * 2 - 1
                    this.mouseVector.y = -y / this.height * 2 + 1

                    this.raycaster.setFromCamera(this.mouseVector, this.camera)
                    const intersection = this.raycaster.intersectObjects(this.buttonMeshList)

                    if (intersection.length) {
                        let targetMesh = intersection[0].object
                        if (cache3DObject !== targetMesh){
                            if (cache3DObject){
                                cache3DObject.dispatchEvent({
                                    type: "mouseleave"
                                })
                            }
                            cache3DObject = targetMesh
                            targetMesh.dispatchEvent({
                                type: "mouseenter"
                            })
                        }else if(cache3DObject === targetMesh){
                            targetMesh.dispatchEvent({
                                type: "mousemove"
                            })
                        }
                    }else {
                        if (cache3DObject){
                            cache3DObject.dispatchEvent({
                                type: "mouseleave"
                            })
                            cache3DObject = null
                        }
                    }
                })

            },

            setMouseClickListener() {
                this.renderer.domElement.addEventListener("click", () => {
                    this.raycaster.setFromCamera(this.mouseVector, this.camera)
                    const intersection = this.raycaster.intersectObjects(this.buttonMeshList)
                    if (intersection.length) {
                        let targetMesh = intersection[0].object
                        targetMesh.dispatchEvent({
                            type: "click"
                        })
                    }
                })


            },

            add(obj) {
                this.scene.add(obj);
            },

            render() {
                this.renderer.setAnimationLoop(()=>{
                    if (this.controllers) {
                        this.controllers.update()
                    }
                    if (this.renderer) {
                        this.renderer.render(this.scene, this.camera)
                    }
                    // //由于每帧都要渲染，所以需要先清空所有高亮的物体，然后重新识别，高亮
                    this.cleanIntersected();
                    this.highLightControllerScanButton(this.controller1);
                    this.highLightControllerScanButton(this.controller2);

                });

            },
        },

        watch: {
            currentRoom(toRoom, fromRoom) {
                if (fromRoom){
                    fromRoom.mesh.visible = false
                    fromRoom.btnList.forEach(
                        btnInfo=>{
                            btnInfo.btnMesh.visible = false
                        }
                    )
                }
                if (toRoom){
                    toRoom.mesh.visible = true
                    toRoom.btnList.forEach(
                        btnInfo=>{
                            btnInfo.btnMesh.visible = true
                        }
                    )
                }

            },
        },
        mounted() {
            this.initPage()

        },

        beforeDestroy() {
            this.vrButtonElement.parentNode.removeChild(this.vrButtonElement)
        }
    }
</script>

<style scoped>
    .container {
        position: relative;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }



    .begin_btn {
        position: absolute;
        left: 0;
        top: 0;
    }

    .move_btn {
        position: absolute;
    }

    /deep/ .changeBtn {
        width: 100px;
        height: 50px;
        border-radius: 20px;
        background: rgba(64, 158, 255, 0.7);
        color: white;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        pointer-events: all;
        font-size: 20px;
        box-sizing: border-box;
    }



</style>
