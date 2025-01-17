import Vue from 'vue'


export default {
    namespaced: true,//开启命名空间
    state: {
        ifMenuShow: true,
        ifBottomMenuFold: false
    },

    actions: {


    },

    mutations: {
        setIfMenuShow(state, val) {
            state.ifMenuShow = val
        },

        setIfBottomMenuFold(state, val) {
            state.ifBottomMenuFold = val;
        }
    },
}