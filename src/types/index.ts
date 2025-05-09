// 用户相关类型
export interface User {
  id: number
  username: string
  nickname: string
  avatar: string
  roles: string[]
  permissions: string[]
}

// 商品相关类型
export interface Product {
  id: number
  code: string
  name: string
  category: string
  specification: string
  unit: string
  price: number
  stock: number
  status: '在售' | '停售'
}

// 分页相关类型
export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

// 响应相关类型
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

// 分页响应类型
export interface PageResponse<T> {
  list: T[]
  total: number
  pageSize: number
  currentPage: number
} 