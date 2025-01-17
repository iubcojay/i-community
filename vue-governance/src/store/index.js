import Vue from 'vue'
import Vuex from 'vuex'
import userAbout from "@/store/userAbout";
import menuAbout from "@/store/menuAbout";
import cesiumAbout from "@/store/cesiumAbout";
import regionAbout from '@/store/regionAbout';
import tipAbout from '@/store/tipAbout.js';
import factoryAbout from '@/store/factoryAbout';
import garageAbout from '@/store/garageAbout';
import fireTimeAbout from '@/store/fireTimeAbout';

Vue.use(Vuex)



export default new Vuex.Store({
    modules: {
        userAbout,
        menuAbout,
        cesiumAbout,
        regionAbout,
        tipAbout,
        factoryAbout,
        garageAbout,
        fireTimeAbout,
    }
})