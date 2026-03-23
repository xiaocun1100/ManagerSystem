<template>
  <div style="padding: 20px">
    <h1>测试页面</h1>
    <el-button type="primary">Element Plus 按钮</el-button>
    <el-input v-model="test" placeholder="测试输入" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const test = ref('')
</script>
