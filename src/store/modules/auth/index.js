export default {
    namespaced: true,
    state: {
        accessToken: '',
        isLogin: false
    },
    getters: {
        // Khai báo getters
    },
    mutations: {
        updateAccessToken(state, accessToken) {
            state.accessToken = accessToken
        },
        updateStatusLogin(state, isLogin) {
            state.isLogin = isLogin
        },
    },
}