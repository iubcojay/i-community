import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
    namespaced: true,//开启命名空间
    state: {
        currentTime: null,
        fireTaskCreatedTime: null,
        fireAccidentTime: null,
        lastProcessTimestamp: null,
        fireTruckBackTimestamp: null
    },
    actions: {

    },
    mutations: {
        updateCurrentTime(state, timeStamp) {
            state.currentTime = timeStamp;
        },
        updateFireTaskCreatedTime(state, fireTaskCreatedTime) {
            state.fireTaskCreatedTime = fireTaskCreatedTime;
        },
        updateFireAccidentTime(state, fireAccidentTime) {
            state.fireAccidentTime = fireAccidentTime;
        },
        updateLastProcessTimestamp(state, lastProcessTimestamp) {
            state.lastProcessTimestamp = lastProcessTimestamp;
        },
        updateFireTruckBackTimestamp(state, fireTruckBackTimestamp) {
            state.fireTruckBackTimestamp = fireTruckBackTimestamp;
        },
    },
};
