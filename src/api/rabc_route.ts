import request from '@/utils/request'
import { RabcRouteFormData } from './types'

export const rabcRouteFormData: RabcRouteFormData = {
    id: 0,
    pid:0,
    name:'', 
    content1:'', 
    content2:'', 
    content3:'', 
    sort:0
}

export const rabcRouteList = (params:any) => request({
    url: '/rabc_route/list',
    method: 'get',
    params
})

export const rabcRouteAdd = (params:any) => request({
    url: '/rabc_route/add',
    method: params.id?'PUT':'POST',
    params
})

export const rabcRouteDelete = (id:number) => request({
    url: '/rabc_route/delete/'+id,
    method: 'DELETE'
})

