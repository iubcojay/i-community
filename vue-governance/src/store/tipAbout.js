import Vue from 'vue'


export default {
    namespaced: true,//开启命名空间
    state: {
        loading: {
            show: false,
            message: ""
        }

    },

    actions: {


    },

    mutations: {
        setIfLoadingTip(state, { show, message }) {
            state.loading.show = show
            state.loading.message = message
        }
    },
}