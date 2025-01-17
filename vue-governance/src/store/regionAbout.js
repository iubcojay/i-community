import Vue from 'vue'


export default {
    namespaced: true,//开启命名空间
    state: {
        currentRegion: {
            name: "jinan"
        }
    },

    mutations: {
        setCurrentRegion(state, val) {
            state.currentRegion = val;
        }
    },
}