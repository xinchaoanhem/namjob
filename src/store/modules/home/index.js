export default {
    namespaced: true,
    state: {
        idBoard: '',
        boardUserId: '',
        isDirectoryRouter: false,
        backgroundImageBoardData: '',
        titleBoard: ''
    },
    getters: {
        // Khai báo getters
    },
    mutations: {
        setIdBoard(state, id) {
            state.idBoard = id
        },
        setBoardUserId(state, id) {
            state.boardUserId = id
        },
        setDirectoryRouter(state, bool) {
            state.isDirectoryRouter = bool
        },
        setBackgroundImageBoardData(state, data) {
            state.backgroundImageBoardData = data
        },
        setTitleBoard(state, data) {
            state.titleBoard = data
        },
    },
}