<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增菜单</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" row-key="id" default-expand-all>
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="path" label="路由路径" />
        <el-table-column prop="icon" label="图标" width="120">
          <template #default="{ row }">
            <el-icon v-if="row.icon"><component :is="row.icon" /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.type === 0" type="info">目录</el-tag>
            <el-tag v-else-if="row.type === 1" type="">菜单</el-tag>
            <el-tag v-else type="success">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item v-if="form.type !== 0" label="路由路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标名称，如：User">
            <template #append>
              <el-icon><component :is="form.icon" v-if="form.icon" /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择父级菜单" clearable>
            <el-option label="顶级菜单" :value="null" />
            <el-option
              v-for="menu in flatMenuOptions"
              :key="menu.id"
              :label="menu.name"
              :value="menu.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type === 2" label="权限标识" prop="permission">
          <el-input v-model="form.permission" placeholder="请输入权限标识，如：user:add" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getMenuListAPI, addMenuAPI, updateMenuAPI, deleteMenuAPI } from '../../api'
import type { Menu } from '../../types'

const loading = ref(false)
const tableData = ref<Menu[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

const form = reactive<Partial<Menu>>({
  id: undefined,
  name: '',
  path: '',
  icon: '',
  parentId: null,
  orderNum: 0,
  type: 1,
  permission: '',
  status: 1,
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
}

const flatMenuOptions = computed(() => {
  const result: Menu[] = []
  const flatten = (menus: Menu[]) => {
    for (const menu of menus) {
      if (menu.type !== 2) {
        result.push(menu)
      }
      if (menu.children?.length) {
        flatten(menu.children)
      }
    }
  }
  flatten(tableData.value)
  return result
})

const loadData = async () => {
  loading.value = true
  try {
    const menus = await getMenuListAPI()
    if (Array.isArray(menus)) {
      tableData.value = menus
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增菜单'
  dialogVisible.value = true
}

const handleEdit = (row: Menu) => {
  dialogTitle.value = '编辑菜单'
  Object.assign(form, {
    id: row.id,
    name: row.name,
    path: row.path || '',
    icon: row.icon || '',
    parentId: row.parentId,
    orderNum: row.orderNum,
    type: row.type,
    permission: row.permission || '',
    status: row.status,
  })
  dialogVisible.value = true
}

const handleDelete = async (row: Menu) => {
  try {
    await ElMessageBox.confirm('确定要删除该菜单吗？', '提示', {
      type: 'warning',
    })
    await deleteMenuAPI(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          await updateMenuAPI(form.id, form)
          ElMessage.success('更新成功')
        } else {
          await addMenuAPI(form)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadData()
      } catch (error) {
        console.error(error)
      }
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(form, {
    id: undefined,
    name: '',
    path: '',
    icon: '',
    parentId: null,
    orderNum: 0,
    type: 1,
    permission: '',
    status: 1,
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
