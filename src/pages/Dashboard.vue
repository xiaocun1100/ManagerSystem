<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">用户总数</div>
              <div class="stat-value">{{ stats.userCount }}</div>
            </div>
            <el-icon class="stat-icon" color="#409EFF"><User /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">角色总数</div>
              <div class="stat-value">{{ stats.roleCount }}</div>
            </div>
            <el-icon class="stat-icon" color="#67C23A"><Key /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">菜单总数</div>
              <div class="stat-value">{{ stats.menuCount }}</div>
            </div>
            <el-icon class="stat-icon" color="#E6A23C"><MenuIcon /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">在线用户</div>
              <div class="stat-value">{{ stats.onlineCount }}</div>
            </div>
            <el-icon class="stat-icon" color="#F56C6C"><Monitor /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统信息</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="系统版本">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="Vue 版本">3.5.30</el-descriptions-item>
            <el-descriptions-item label="Element Plus 版本">latest</el-descriptions-item>
            <el-descriptions-item label="系统作者">Admin</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="goTo('/system/user')">用户管理</el-button>
            <el-button type="success" @click="goTo('/system/role')">角色管理</el-button>
            <el-button type="warning" @click="goTo('/system/menu')">菜单管理</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Key, Menu as MenuIcon, Monitor } from '@element-plus/icons-vue'
import { getUserListAPI, getRoleListAPI, getMenuListAPI } from '../api'
import type { Menu } from '../types'

const router = useRouter()

const stats = ref({
  userCount: 0,
  roleCount: 0,
  menuCount: 0,
  onlineCount: 1,
})

const goTo = (path: string) => {
  router.push(path)
}

const loadStats = async () => {
  try {
    const [users, roles, menus] = await Promise.all([
      getUserListAPI({ page: 1, pageSize: 1 }),
      getRoleListAPI(),
      getMenuListAPI(),
    ])

    stats.value.userCount = users.total || 0
    stats.value.roleCount = roles.total || 0
    if (Array.isArray(menus)) {
      stats.value.menuCount = countMenus(menus) || 0
    }
  } catch (error) {
    console.error('加载统计数据失败', error)
  }
}

const countMenus = (menus: Menu[]): number => {
  let count = 0
  for (const menu of menus) {
    count++
    if (menu.children?.length) {
      count += countMenus(menu.children)
    }
  }
  return count
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-icon {
  font-size: 50px;
}

.card-header {
  font-weight: bold;
}

.quick-actions {
  display: flex;
  gap: 10px;
}
</style>
