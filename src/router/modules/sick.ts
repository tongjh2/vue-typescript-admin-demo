import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const sickRoutes: RouteConfig = {
  path: '/sick',
  component: Layout,
  redirect: '/sick/index',
  name: 'sick',
  meta: {
    title: '客户管理',
    icon: 'table'
  },
  children: [
    {
      path: 'index',
      component: () => import(/* webpackChunkName: "dynamic-table" */ '@/views/sick/index.vue'),
      name: 'sick.index',
      meta: { title: '客户列表' }
    },
    {
      path: 'dynamic-table',
      component: () => import(/* webpackChunkName: "dynamic-table" */ '@/views/table/dynamic-table/index.vue'),
      name: 'DynamicTable',
      meta: { title: 'dynamicTable' }
    },
    {
      path: 'draggable-table',
      component: () => import(/* webpackChunkName: "draggable-table" */ '@/views/table/draggable-table.vue'),
      name: 'DraggableTable',
      meta: { title: 'draggableTable' }
    },
    {
      path: 'inline-edit-table',
      component: () => import(/* webpackChunkName: "inline-edit-table" */ '@/views/table/inline-edit-table.vue'),
      name: 'InlineEditTable',
      meta: { title: 'inlineEditTable' }
    },
    {
      path: 'complex-table',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/table/complex-table.vue'),
      name: 'ComplexTable',
      meta: { title: 'complexTable' }
    }
  ]
}

export default sickRoutes
