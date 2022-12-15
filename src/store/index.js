import Vue from 'vue'
import Vuex from 'vuex'
import home from './modules/home'
// import login from './modules/login'
import user from './modules/user'
import createPersistedState from "vuex-persistedstate";
import auth from './modules/auth'
// import api from '@/api'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        // directories:[]
    },
    getters: {},
    mutations: {
        // getDirectories(state, idBoard){
        //     api.getDirectory(idBoard)
        //         .then(async(res) => {
        //             // res.data.data.map((n) => {
        //             //     Object.assign(n,{status:true})
        //             // })
        //             // state.directories = res.data.data
        //             let result = res.data;
        //             // for (const data of result) {
        //             //     Object.assign(data, {status: true});
        //             //     await Promise.all(data.cards.map(async (value) => {
        //             //         await api.getTag(value)
        //             //             .then((res) => {
        //             //                 Object.assign(value, {files: res.data.data.files, check_lists: res.data.data.check_lists});
        //             //             })
        //             //     }))
        //             // }
        //             state.directories = result;
        //             console.log(state.directories)
        //         })
        //         .catch(err => {
        //             console.log(err)
        //         })
        // },
    },
    modules: {
        home,
        user,
        auth
    },
    plugins: [createPersistedState()]
})

export default store