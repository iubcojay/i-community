import Vue from 'vue'


export default {
    namespaced:true,//开启命名空间
    state:{
        ifEarthInit: false
    },

    mutations: {
        setIfEarthInit(state,val){
            state.ifEarthInit = val 
       }
    },
}