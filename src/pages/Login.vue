<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">管理系统</h3>
      </div>

      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          prefix-icon="User"
          size="large"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          placeholder="密码"
          name="password"
          type="password"
          tabindex="2"
          autocomplete="on"
          prefix-icon="Lock"
          size="large"
          show-password
          @keyup.enter="handleLogin"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        size="large"
        style="width: 100%; margin-bottom: 30px"
        @click="handleLogin"
      >
        登录
      </el-button>

      <div class="tips">
        <span>测试账号: admin / admin123</span>
        <span>或 editor / 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '../stores/user'
import type { LoginForm } from '../types'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
})

const loginRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const success = await userStore.login(loginForm)
        if (success) {
          ElMessage.success('登录成功')
          router.push('/')
        }
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  position: relative;
  width: 520px;
  max-width: 100%;
  padding: 60px 35px 0;
  margin: 0 auto;
  overflow: hidden;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.title-container {
  position: relative;
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 26px;
  color: #333;
  margin: 0 auto 40px;
  font-weight: bold;
}

.tips {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

:deep(.el-form-item) {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  color: #454545;
}

:deep(.el-input) {
  height: 47px;
}

:deep(.el-input__inner) {
  border: none;
  padding-left: 45px;
}

:deep(.el-input__prefix) {
  left: 15px;
}
</style>
