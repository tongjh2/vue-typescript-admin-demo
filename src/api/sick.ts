import request from '@/utils/request'
import { SickData } from './types'

export const defaultArticleData: SickData = {
  id: 0,
  name: 'draft',
  age: 0,
  sex: 0,
  phone: '',
  qq: '',
  weixin: '',
  address: '', 
  order_time: '',
  department: 0,
}

export const getSickList = (params: any) =>
  request({
    url: '/sick/list',
    method: 'get',
    params
  })

export const getArticle = (id: number, params: any) =>
  request({
    url: `/articles/${id}`,
    method: 'get',
    params
  })

export const createArticle = (data: any) =>
  request({
    url: '/articles',
    method: 'post',
    data
  })

export const updateArticle = (id: number, data: any) =>
  request({
    url: `/articles/${id}`,
    method: 'put',
    data
  })

export const deleteArticle = (id: number) =>
  request({
    url: `/articles/${id}`,
    method: 'delete'
  })

export const getPageviews = (params: any) =>
  request({
    url: '/pageviews',
    method: 'get',
    params
  })
