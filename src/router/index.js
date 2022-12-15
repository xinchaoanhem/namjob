import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginLayout from '../layouts/LoginLayout'
import AdminLayout from '../layouts/AdminLayout'
import store from "../store";

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        component: LoginLayout,
        children: [
            {
                path: '/',
                name: 'Login',
                component: () => import('../views/Login')
            }
        ]
    },
    {
        path: '/register',
        component: LoginLayout,
        children: [
            {
                path: '/',
                name: 'Register',
                component: () => import('../views/Register')
            }
        ]
    },
    {
        path: '/',
        component: AdminLayout,
        children: [
            {
                path: '/',
                name: 'Home',
                component: () => import('../views/Home')
            },
            {
                path: 'user',
                name: 'User',
                component: () => import('../views/User')
            },
            {
                path: 'directories',
                name: 'Directories',
                component: () => import('../views/Directory')
            },
            {
                path: 'change-password',
                name: 'ChangePassword',
                component: () => import('../views/ChangePassword')
            },
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !store.state.auth.isLogin) {
        next({ name:['Login','Register'] })
    }
    else if ((to.name === 'Login' || to.name === 'Register') && store.state.auth.isLogin) {
        next({ name: 'Home' })
    }
    else {
        next()
        if (to.name === 'Directories') {
            store.state.home.isDirectoryRouter = true
        } else {
            store.state.home.isDirectoryRouter = false
            store.state.home.backgroundImageBoardData = ''
            store.state.home.titleBoard = ''
        }
    }
})

export default router
