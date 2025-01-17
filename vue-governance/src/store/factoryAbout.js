import Vue from 'vue'


export default {
    namespaced: true,//开启命名空间
    state: {
        ws: {
            connectInstance: undefined,
            delaySecond: 3.5
        }
    },

    actions: {


    },

    mutations: {
        setWsConnectInstance(state, { instance }) {
            state.ws.connectInstance = instance;
        },
        setDelaySecond(state, value) {
            state.ws.delaySecond = value;
        }

    },
}