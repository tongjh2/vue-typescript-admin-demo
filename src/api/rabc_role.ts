import request from '@/utils/request'
// import { RabcRoleData } from './types'

// export const defaultRabcRoleData: RabcRoleData = {
//     id: 0,
//     username: ''
// }

export const rabcRoleList = (params:any) => request({
    url: '/rabc_role/list',
    method: 'get',
    params
})