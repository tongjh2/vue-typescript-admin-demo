import request from '@/utils/request'
import { RabcRoleData } from './types'

export const defaultRabcRoleData: RabcRoleData = {
    id: 0,
    name: '',
    route_ids:''
}

export const rabcRoleList = (params:any) => request({
    url: '/rabc_role/list',
    method: 'get',
    params
})

export const RabcRoleAdd = (params:any) => request({
    url: '/rabc_role/add',
    method: params.id?'PUT':'POST',
    params
})

