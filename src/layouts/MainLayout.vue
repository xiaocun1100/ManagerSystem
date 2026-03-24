<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <span v-show="!isCollapse" class="logo-text">管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :router="true"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <template v-for="menu in menus" :key="menu.id">
          <el-sub-menu v-if="menu.children?.length" :index="menu.path">
            <template #title>
              <el-icon><component :is="menu.icon" /></el-icon>
              <span>{{ menu.name }}</span>
            </template>
            <el-menu-item v-for="child in menu.children" :key="child.id" :index="child.path">
              <el-icon><component :is="child.icon" /></el-icon>
              <span>{{ child.name }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.path">
            <el-icon><component :is="menu.icon" /></el-icon>
            <span>{{ menu.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.breadcrumb">
              {{ route.meta.breadcrumb }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar
                :size="32"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              />
              <span class="username">{{ userStore.userInfo?.nickname }}</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { Fold, Expand, ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)
const menus = computed(() => {
  const staticMenuManagement = {
    id: 999,
    name: '菜单管理',
    path: '/system/menus',
    icon: 'Menu',
    parentId: null,
    orderNum: 999,
    type: 1 as const,
    status: 1 as const,
  }

  if (userStore.menus.length > 0) {
    // 复制菜单数据
    const menusCopy = JSON.parse(JSON.stringify(userStore.menus)) as typeof userStore.menus

    // 在返回的菜单中查找"系统管理"目录
    const systemMenu = menusCopy.find((m) => m.name === '系统管理' || m.path === '/system')

    if (systemMenu) {
      // 如果有"系统管理"，确保里面包含"菜单管理"
      if (!systemMenu.children) {
        systemMenu.children = []
      }
      const hasMenuManagement = systemMenu.children.some((c) => c.path === '/system/menus')
      if (!hasMenuManagement) {
        systemMenu.children.push({
          ...staticMenuManagement,
          parentId: systemMenu.id,
        })
      }
    } else {
      // 如果没有"系统管理"，直接添加"菜单管理"到顶级
      menusCopy.push(staticMenuManagement)
    }

    return menusCopy
  }

  // 接口未返回菜单时，显示默认菜单
  return [
    {
      id: 1,
      name: '首页',
      path: '/dashboard',
      icon: 'HomeFilled',
      parentId: null,
      orderNum: 1,
      type: 1,
      status: 1,
    },
    {
      id: 2,
      name: '系统管理',
      path: '/system',
      icon: 'Setting',
      parentId: null,
      orderNum: 2,
      type: 0,
      status: 1,
      children: [
        {
          id: 3,
          name: '用户管理',
          path: '/system/users',
          icon: 'User',
          parentId: 2,
          orderNum: 1,
          type: 1,
          status: 1,
        },
        {
          id: 4,
          name: '角色管理',
          path: '/system/roles',
          icon: 'Key',
          parentId: 2,
          orderNum: 2,
          type: 1,
          status: 1,
        },
        {
          id: 5,
          name: '菜单管理',
          path: '/system/menus',
          icon: 'Menu',
          parentId: 2,
          orderNum: 3,
          type: 1,
          status: 1,
        },
      ],
    },
  ]
})
const activeMenu = computed(() => route.path)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}

onMounted(() => {
  userStore.getMenus()
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #2b3a4d;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
}

.header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #606266;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
