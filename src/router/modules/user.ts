import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const userRoutes: RouteConfig = {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'user',
    meta: {
        title: '用户管理',
        icon: 'table'
    },
    children: [
        {
            path: 'index',
            component: () => import(/* webpackChunkName: "dynamic-table" */ '@/views/user/index.vue'),
            name: 'user.index',
            meta: { title: '用户列表' }
        },{
            path: 'rabc_role',
            component: () => import(/* webpackChunkName: "dynamic-table" */ '@/views/user/rabc_role.vue'),
            name: 'user.rabc_role',
            meta: { title: '角色管理' }
        },{
            path: 'rabc_route',
            component: () => import(/* webpackChunkName: "dynamic-table" */ '@/views/user/rabc_route.vue'),
            name: 'user.rabc_route',
            meta: { title: '权限管理' }
        },
    ]
}

export default userRoutes
