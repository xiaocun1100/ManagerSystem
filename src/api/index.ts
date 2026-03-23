import request from '../utils/request'
import type { User, Role, Menu, LoginForm, PageResult, PageParams } from '../types'

export const loginAPI = (data: LoginForm) => {
  return request.post<{ token: string; user: User }>('/login', data).then((res) => res.data)
}

export const getUserInfoAPI = () => {
  return request.get<User>('/user/info').then((res) => res.data)
}

export const getUserListAPI = (params: PageParams) => {
  return request.get<PageResult<User>>('/users', { params }).then((res) => res.data)
}

export const addUserAPI = (data: Partial<User>) => {
  return request.post<User>('/users', data).then((res) => res.data)
}

export const updateUserAPI = (id: number, data: Partial<User>) => {
  return request.put<User>(`/users/${id}`, data).then((res) => res.data)
}

export const deleteUserAPI = (id: number) => {
  return request.delete(`/users/${id}`).then((res) => res.data)
}

export const getRoleListAPI = (params?: PageParams) => {
  return request.get<PageResult<Role>>('/roles', { params }).then((res) => res.data)
}

export const getAllRolesAPI = () => {
  return request.get<Role[]>('/roles/all').then((res) => res.data)
}

export const addRoleAPI = (data: Partial<Role>) => {
  return request.post<Role>('/roles', data).then((res) => res.data)
}

export const updateRoleAPI = (id: number, data: Partial<Role>) => {
  return request.put<Role>(`/roles/${id}`, data).then((res) => res.data)
}

export const deleteRoleAPI = (id: number) => {
  return request.delete(`/roles/${id}`).then((res) => res.data)
}

export const getMenuListAPI = () => {
  return request.get<Menu[]>('/menus').then((res) => res.data)
}

export const getAllMenusAPI = () => {
  return request.get<Menu[]>('/menus/all').then((res) => res.data)
}

export const addMenuAPI = (data: Partial<Menu>) => {
  return request.post<Menu>('/menus', data).then((res) => res.data)
}

export const updateMenuAPI = (id: number, data: Partial<Menu>) => {
  return request.put<Menu>(`/menus/${id}`, data).then((res) => res.data)
}

export const deleteMenuAPI = (id: number) => {
  return request.delete(`/menus/${id}`).then((res) => res.data)
}
