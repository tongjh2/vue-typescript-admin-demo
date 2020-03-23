import request from '@/utils/request'
import { UserData } from './types'

export const defaultUserData: UserData = {
    id: 0,
    username: '',
    name: '',
    role: 0,
    phone: '',
    age: 0,
    sex: 0,
}

export const userList = (params: any) => request({
    url: '/user/list',
    method: 'get',
    params
})

export const userAdd = (data:UserData) => request({
    url: '/user/add',
    method: data.id?'PUT': 'POST',
    data
})


export const userUpdateStatus = (data:{id:number,status:number}) => request({
    url: '/user/update_status',
    method: 'PUT',
    data
})

export const userUpdatePassword = (data:{id:number}) => request({
    url: '/user/update_password',
    method: 'PUT',
    data
})

export const userUpdateRole = (data:{id:number,role:number}) => request({
    url: '/user/update_role',
    method: 'PUT',
    data
})




export const getUserInfo = (data: any) =>
  request({
    url: '/users/info',
    method: 'post',
    data
  })

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get'
  })

export const updateUser = (username: string, data: any) =>
  request({
    url: `/users/${username}`,
    method: 'put',
    data
  })

export const deleteUser = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'delete'
  })

export const login = (data: any) =>
  request({
    url: '/users/login',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: '/users/logout',
    method: 'post'
  })

export const register = (data: any) =>
  request({
    url: '/users/register',
    method: 'post',
    data
  })
