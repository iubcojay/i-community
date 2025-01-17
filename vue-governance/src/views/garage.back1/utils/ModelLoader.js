import { ObjectLoader, AnimationClip } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import yuxStorage from 'yux-storage';

const objectLoader = new ObjectLoader()
const gltfLoader = new GLTFLoader()

const dracoGltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/static/draco/gltf');
dracoGltfLoader.setDRACOLoader(dracoLoader);

const garageUrl = window.PLATFORM_CONFIG.StaticResourceAddress + "/model/garage/garage.gltf";
const carUrlList = [
    { type: "sedan", name: "小轿车", url: window.PLATFORM_CONFIG.StaticResourceAddress + '/model/garage/car/sedan.gltf' },
    { type: "sport", name: "跑车", url: window.PLATFORM_CONFIG.StaticResourceAddress + '/model/garage/car/sport.gltf' },
    { type: "pickUp", name: "皮卡车", url: window.PLATFORM_CONFIG.StaticResourceAddress + '/model/garage/car/pick_up.gltf' },
    { type: "suv", name: "越野车", url: window.PLATFORM_CONFIG.StaticResourceAddress + '/model/garage/car/suv.gltf' },
    { type: "van", name: "厢式货车", url: window.PLATFORM_CONFIG.StaticResourceAddress + '/model/garage/car/van.gltf' }
]

export async function getModelPool() {
    const pool = {};
    const garage = new Garage(garageUrl, true)
    const cars = carUrlList.map(({ type, name, url }) => {
        return new Car(url, type, name, true)
    })
    const loadPromises = [garage.init(), ...cars.map(car => car.init())];
    await Promise.all(loadPromises);
    pool["garage"] = garage;
    pool["car"] = {}
    cars.forEach(car => {
        pool["car"][car.type] = car;
    })
    return pool;
}


export class Garage {
    constructor(url, draco = false) {
        this.url = url;
        this.modelObj = undefined;
        this.animations = []
        this.draco = draco;
    }

    async init() {
        const loader = this.draco ? gltfLoader : dracoGltfLoader
        // Load a glTF resource
        const gltf = await loader.loadAsync(this.url)
        this.modelObj = gltf.scene.children[0];
        this.animations = gltf.animations;

        // const jsonStr = await yuxStorage.getItem(this.url)
        // if (jsonStr) {
        //     console.log("走缓存");
        //     const { modelObj, animations } = JSON.parse(jsonStr)
        //     this.modelObj = objectLoader.parse(modelObj)
        //     this.animations = animations.map(animation => AnimationClip.parse(animation))

        // } else {
        //     const loader = this.draco ? gltfLoader : dracoGltfLoader
        //     // Load a glTF resource
        //     const gltf = await loader.loadAsync(this.url)
        //     this.modelObj = gltf.scene.children[0];
        //     this.animations = gltf.animations;
        //     await yuxStorage.setItem(this.url, JSON.stringify({ modelObj: this.modelObj.toJSON(), animations: this.animations.map(animation => animation.toJSON()) }))
        // }
    }
}

export class Car {
    constructor(url, type, name, draco = false) {
        this.type = type;
        this.name = name;
        this.url = url;
        this.modelObj = undefined;
        this.animations = []
        this.draco = draco;
    }

    async init() {
        const loader = this.draco ? gltfLoader : dracoGltfLoader
        // Load a glTF resource
        const gltf = await loader.loadAsync(this.url)
        this.modelObj = gltf.scene.children[0];
        this.animations = gltf.animations;
    }
}
