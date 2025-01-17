import Vue from 'vue'


export default {
    namespaced: true,//开启命名空间
    state: {
        garageReady: false,
        cars: [],
        lifters: [],
        lights: [],
        detects: [],
        carBaseInfoVisibleMap: {},
        lightMode: false
    },

    actions: {
        updateGarageInfo({state, commit}, {cars, lifters, lights, detects}) {
            const originCarBaseInfoVisibleMap = state.carBaseInfoVisibleMap;
            const newCarBaseInfoVisibleMap = {}
            cars.forEach(car => {
                if (originCarBaseInfoVisibleMap[car.id] === undefined) {
                    newCarBaseInfoVisibleMap[car.id] = false;
                } else {
                    newCarBaseInfoVisibleMap[car.id] = originCarBaseInfoVisibleMap[car.id]
                }
            })
            commit("setCarBaseInfoVisibleMap", newCarBaseInfoVisibleMap)
            commit("setCar", cars)
            commit("setLifters", lifters)
            commit("setLights", lights)
            commit("setDetects", detects)
        },

        setCarBaseInfoShow({state, commit}, {id, option}) {
            const map = {...state.carBaseInfoVisibleMap, [id]: option};
            commit("setCarBaseInfoVisibleMap", map)
        },

        setGarageReady({commit}, value) {
            commit("setGarageReady", value)
        },

        setLightMode({commit}, value) {
            commit("setLightMode", value)
        }
    },

    mutations: {
        setCar(state, value) {
            state.cars = value;
        },

        setLifters(state, value) {
            state.lifters = value;
        },

        setLights(state, value) {
            state.lights = value;
        },

        setDetects(state, value) {
            state.detects = value;
        },

        setGarageReady(state, value) {
            state.garageReady = value;
        },

        setCarBaseInfoVisibleMap(state, value) {
            state.carBaseInfoVisibleMap = value;
        },

        setLightMode(state, value) {
            state.lightMode = value
        },
    }
}
