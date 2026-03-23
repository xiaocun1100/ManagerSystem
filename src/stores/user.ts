import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI, getUserInfoAPI, getMenuListAPI } from '../api'
import { storage } from '../utils/storage'
import type { User, Menu, LoginForm } from '../types'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(storage.getToken() || '')
  const userInfo = ref<User | null>(storage.getUser() as User | null)
  const menus = ref<Menu[]>([])

  const login = async (data: LoginForm) => {
    try {
      const res = await loginAPI(data)
      // res 结构: { token: "...", user: {...} }
      const { token: userToken, user } = res

      // 转换用户数据格式（兼容后端返回的 roles 转为 roleIds）
      const userData: User = {
        ...user,
        roleIds: user.roles?.map((r) => r.id) || [],
      }

      token.value = userToken
      userInfo.value = userData
      storage.setToken(userToken)
      storage.setUser(userData)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    menus.value = []
    storage.clear()
  }

  const getUserInfo = async () => {
    try {
      const user = await getUserInfoAPI()
      userInfo.value = user
      storage.setUser(user)
    } catch (error) {
      console.error('获取用户信息失败', error)
    }
  }

  const getMenus = async () => {
    try {
      const menusData = await getMenuListAPI()
      if (Array.isArray(menusData)) {
        menus.value = menusData
      }
    } catch (error) {
      console.error('获取菜单失败', error)
    }
  }

  const isLoggedIn = () => {
    return !!token.value
  }

  return {
    token,
    userInfo,
    menus,
    login,
    logout,
    getUserInfo,
    getMenus,
    isLoggedIn,
  }
})
