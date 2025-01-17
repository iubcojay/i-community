import Vue from 'vue'


export default {
    namespaced:true,//开启命名空间
    state:{
        areaInfo:{},
        userInfo:{
            id:'',
            username:'',
            phoneNumber:'',
            createTime:'',
            profile:'',
            token:'',
            power: -1
        }
    },

    actions:{

        // 设置、获取vuex中的值
        //region
        setValue(context,value){
            switch (value.prop) {
                case 'userInfo':
                    context.commit("setUserInfo",value.val)
                    break
            }
        }


    },

    mutations: {
        //设置userInfo值
        setUserInfo(state,userObj){
            state.userInfo.id = userObj.id
            state.userInfo.username = userObj.username
            state.userInfo.phoneNumber = userObj.phoneNumber
            state.userInfo.createTime = userObj.createTime
            state.userInfo.profile = userObj.profile
            state.userInfo.token = userObj.token
            state.userInfo.power = userObj.power
        },

        setAreaInfo(state,areaObj){
            state.areaInfo = areaObj
        }

    },

    getters: {

    }


}