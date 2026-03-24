import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'test',
        name: 'Test',
        component: () => import('../Test.vue'),
        meta: { title: '测试' },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../pages/Dashboard.vue'),
        meta: { title: '首页', breadcrumb: '首页' },
      },
      {
        path: 'system/users',
        name: 'User',
        component: () => import('../pages/system/User.vue'),
        meta: { title: '用户管理', breadcrumb: '系统管理 / 用户管理' },
      },
      {
        path: 'system/roles',
        name: 'Role',
        component: () => import('../pages/system/Role.vue'),
        meta: { title: '角色管理', breadcrumb: '系统管理 / 角色管理' },
      },
      {
        path: 'system/menus',
        name: 'Menu',
        component: () => import('../pages/system/Menu.vue'),
        meta: { title: '菜单管理', breadcrumb: '系统管理 / 菜单管理' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  // 临时禁用路由守卫，方便调试
  // const token = storage.getToken()
  // if (to.path === '/login') {
  //   next()
  // } else {
  //   if (token) {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // }
  next()
})

export default router
