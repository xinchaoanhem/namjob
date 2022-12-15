export default {
    namespaced: true,
    state: {
        myUser: []
    },
    getters: {
        // Khai báo getters
    },
    mutations: {
        setUser(state,data){
            state.myUser =  data
        },
    },
}