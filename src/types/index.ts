export interface User {
  id: number
  username: string
  nickname: string
  email?: string | null
  phone?: string | null
  avatar?: string | null
  status: 0 | 1
  roleIds?: number[]
  roles?: Role[]
  createTime?: string
}

export interface Role {
  id: number
  name: string
  code: string
  description?: string
  status: 0 | 1
  menuIds: number[]
  createTime: string
}

export interface Menu {
  id: number
  name: string
  path: string
  icon?: string
  parentId: number | null
  orderNum: number
  type: 0 | 1 | 2
  permission?: string
  status: 0 | 1
  children?: Menu[]
}

export interface LoginForm {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageResult<T = unknown> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface PageParams {
  page?: number
  pageSize?: number
  keyword?: string
}
