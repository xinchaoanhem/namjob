import axios from 'axios'
import store from "../store";
import router from "../router";

const baseUrl = 'http://127.0.0.1:8000';

export const apiAxios = axios.create({
    baseURL:`${baseUrl}/api/`,
    headers: {
        post: {
            'Content-Type': 'application/json'
        }
    }
})

apiAxios.interceptors.request.use(config => {
    let token = store.state.auth.accessToken
    if (token) {
        config.headers.common['Authorization'] = `Bearer ${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

apiAxios.interceptors.response.use(undefined, (error) => {
    if (error) {
        const originalRequest = error.config;
        if (error.code === 'ERR_NETWORK' && router.currentRoute.name !== 'Login') {
            alert('Không kết nối được với máy chủ!')
        }
        if (error.response.status === 401 && !originalRequest._retry && router.currentRoute.name !== 'Login') {
            store.commit('auth/updateStatusLogin', false)
            store.commit('auth/updateAccessToken', '')
            return router.push({name: 'Login'})
        }
    }
    return Promise.reject(error);
})

apiAxios.defaults.withCredentials = true;

export default {
    login (data) {
        // apiAxios.get(`${baseUrl}/api/csrf-cookie`)
        return apiAxios({
            method: 'post',
            url: '/auth/login',
            data: data
        })
    },
    logout() {
        return apiAxios({
            method: 'post',
            url: '/auth/logout',
        })
    },
    register(data) {
        // apiAxios.get(`${baseUrl}/api/csrf-cookie`)
        return apiAxios({
            method: 'post',
            url: '/auth/register',
            data: data
        })
    },
    getUser() {
        return apiAxios({
            method: 'get',
            url: '/user',
        })
    },
    getAddUser(id, data) {
        return apiAxios({
            method: 'get',
            url: '/user/'+id+'/get-all?q='+data,
        })
    },
    updateUser(data){
        return apiAxios({
            method: 'post',
            url: '/user',
            data
        })
    },
    updatePassword(data){
        return apiAxios({
            method: 'put',
            url: '/user/password',
            data
        })
    },
    attachUserBoard(id, data) {
        return apiAxios({
            method: 'post',
            url: '/boards/'+id+'/attach',
            data
        })
    },
    detachUserBoard(id, data) {
        return apiAxios({
            method: 'delete',
            url: '/boards/'+id+'/detach',
            data
        })
    },
    getUserBoard(id, data) {
        return apiAxios({
            method: 'get',
            url: '/boards/'+id+'/user?q='+data,
        })
    },
    getBoard() {
        return apiAxios({
            method: 'get',
            url: '/boards',
        })
    },
    addBoard(data){
        return apiAxios({
            method: 'post',
            url: '/boards',
            data
        })
    },
    updateBoard(id, data){
        return apiAxios({
            method: 'post',
            url: '/boards/'+id,
            data
        })
    },
    deleteBoard(id){
        return apiAxios({
            method: 'delete',
            url: '/boards/'+id,
        })
    },
    getDirectory(id) {
        return apiAxios({
            method: 'get',
            url: '/directories/'+id,
        })
    },
    addDirectory(id, data){
        return apiAxios({
            method: 'post',
            url: '/directories/'+id,
            data
        })
    },
    updateDirectory(id, data){
        return apiAxios({
            method: 'put',
            url: '/directories/'+id,
            data
        })
    },
    updateDirectoryIndex(id, data){
        return apiAxios({
            method: 'put',
            url: '/directories/'+id+'/index',
            data
        })
    },
    deleteDirectory(id, data){
        return apiAxios({
            method: 'delete',
            url: '/directories/'+id,
            data
        })
    },
    addCard(id, data){
        return apiAxios({
            method: 'post',
            url: '/cards/'+id,
            data
        })
    },
    getCard(id) {
        return apiAxios({
            method: 'get',
            url: '/cards/'+id,
        })
    },
    getLabel(data) {
        return apiAxios({
            method: 'get',
            url: '/labels?q='+data,
        })
    },
    getLabelInCard(id) {
        return apiAxios({
            method: 'get',
            url: '/labels/'+id,
        })
    },
    addLabel(id, data){
        return apiAxios({
            method: 'post',
            url: '/cards/'+id+'/label',
            data
        })
    },
    updateLabel(id, data){
        return apiAxios({
            method: 'put',
            url: '/labels/'+id,
            data
        })
    },
    deleteLabel(id){
        return apiAxios({
            method: 'delete',
            url: '/labels/'+id,
        })
    },
    getUserBoardInCards(id) {
        return apiAxios({
            method: 'get',
            url: '/user/'+id,
        })
    },
    attachUser(id, data){
        return apiAxios({
            method: 'post',
            url: '/cards/'+id+'/attach-users',
            data
        })
    },
    detachUser(id, data){
        return apiAxios({
            method: 'delete',
            url: '/cards/'+id+'/detach-users',
            data
        })
    },
    attachLabel(id, data){
        return apiAxios({
            method: 'post',
            url: '/cards/'+id+'/attach-labels',
            data
        })
    },
    detachLabel(id, data){
        return apiAxios({
            method: 'delete',
            url: '/cards/'+id+'/detach-labels',
            data
        })
    },
    updateCard(id, data){
        return apiAxios({
            method: 'put',
            url: '/cards/'+id,
            data
        })
    },
    updateCardIndex(id, data){
        return apiAxios({
            method: 'put',
            url: '/cards/'+id+'/index',
            data
        })
    },
    updateCardIndexDirectory(id, data){
        return apiAxios({
            method: 'put',
            url: '/cards/'+id+'/directory',
            data
        })
    },
    updateCardDeadline(id, data){
        return apiAxios({
            method: 'put',
            url: '/cards/'+id+'/change-status-deadline',
            data
        })
    },
    updateCardStatus(id, data){
        return apiAxios({
            method: 'put',
            url: '/cards/'+id+'/change-status',
            data
        })
    },
    getJobList(id) {
        return apiAxios({
            method: 'get',
            url: '/job-lists/'+id,
        })
    },
    addJobList(data){
        return apiAxios({
            method: 'post',
            url: '/job-lists/',
            data
        })
    },
    updateJobList(id, data){
        return apiAxios({
            method: 'put',
            url: '/job-lists/'+id,
            data
        })
    },
    deleteJobList(id){
        return apiAxios({
            method: 'delete',
            url: '/job-lists/'+id,
        })
    },
    getJobListChild(id) {
        return apiAxios({
            method: 'get',
            url: '/job-list-child/'+id,
        })
    },
    addJobListChild(data){
        return apiAxios({
            method: 'post',
            url: '/job-list-child/',
            data
        })
    },
    updateJobListChild(id, data){
        return apiAxios({
            method: 'put',
            url: '/job-list-child/'+id,
            data
        })
    },
    updateJobListChildStatus(id, data){
        return apiAxios({
            method: 'put',
            url: '/job-list-child/'+id+'/change-status',
            data
        })
    },
    deleteJobListChild(id){
        return apiAxios({
            method: 'delete',
            url: '/job-list-child/'+id,
        })
    },
    getFile(id) {
        return apiAxios({
            method: 'get',
            url: '/files/'+id,
        })
    },
    addFile(id, data){
        return apiAxios({
            method: 'post',
            url: '/cards/'+id+'/upload-file',
            data
        })
    },
    updateFile(id, data){
        return apiAxios({
            method: 'put',
            url: '/files/'+id,
            data
        })
    },
    deleteFile(id){
        return apiAxios({
            method: 'delete',
            url: '/files/'+id,
        })
    },
    deleteCard(id){
        return apiAxios({
            method: 'delete',
            url: '/cards/'+id,
        })
    },
}