export interface UserData {
  id: number
  username: string
  name: string
  role: number
  phone: string
  age: number
  sex: number
}

export interface RabcRoleData {
  id: number
  username: string
}

export interface SickData {
  id: number
  name: string
  age: number
  sex: number
  phone: string
  qq: string
  weixin: string
  address: string 
  order_time: string
  department: number
}

export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IRoleData {
  key: string
  name: string
  description: string
  routes: any
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface IUserData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
}
