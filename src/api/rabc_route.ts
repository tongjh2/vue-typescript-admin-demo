import request from '@/utils/request'

export const rabcRouteList = (params:any) => request({
    url: '/rabc_route/list',
    method: 'get',
    params
})