<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增角色</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" link :icon="Key" @click="handleAssignMenu(row)">
              分配权限
            </el-button>
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="menuDialogVisible" title="分配权限" width="600px">
      <el-tree
        ref="menuTreeRef"
        :data="menuTreeData"
        :props="treeProps"
        node-key="id"
        :default-checked-keys="selectedMenuIds"
        show-checkbox
        check-strictly
      />
      <template #footer>
        <el-button @click="menuDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleMenuSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { ElTree } from 'element-plus'
import { Plus, Edit, Delete, Key } from '@element-plus/icons-vue'
import { getRoleListAPI, addRoleAPI, updateRoleAPI, deleteRoleAPI, getMenuListAPI } from '../../api'
import type { Role, Menu } from '../types'

const loading = ref(false)
const tableData = ref<Role[]>([])
const dialogVisible = ref(false)
const menuDialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const menuTreeData = ref<Menu[]>([])
const selectedMenuIds = ref<number[]>([])
const currentRoleId = ref<number>()

const form = reactive<Partial<Role>>({
  id: undefined,
  name: '',
  code: '',
  description: '',
  status: 1,
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
}

const treeProps = {
  children: 'children',
  label: 'name',
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getRoleListAPI()
    tableData.value = res.list
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const loadMenus = async () => {
  try {
    const menus = await getMenuListAPI()
    if (Array.isArray(menus)) {
      menuTreeData.value = menus
    }
  } catch (error) {
    console.error(error)
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增角色'
  dialogVisible.value = true
}

const handleEdit = (row: Role) => {
  dialogTitle.value = '编辑角色'
  Object.assign(form, {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description,
    status: row.status,
  })
  dialogVisible.value = true
}

const handleDelete = async (row: Role) => {
  try {
    await ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
      type: 'warning',
    })
    await deleteRoleAPI(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const handleAssignMenu = (row: Role) => {
  currentRoleId.value = row.id
  selectedMenuIds.value = row.menuIds || []
  menuDialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          await updateRoleAPI(form.id, form)
        } else {
          await addRoleAPI(form)
        }
        ElMessage.success(form.id ? '更新成功' : '添加成功')
        dialogVisible.value = false
        loadData()
      } catch (error) {
        console.error(error)
      }
    }
  })
}

const handleMenuSubmit = async () => {
  if (!currentRoleId.value) return

  const checkedKeys = menuTreeRef.value?.getCheckedKeys() || []
  try {
    await updateRoleAPI(currentRoleId.value, {
      menuIds: checkedKeys as number[],
    })
    ElMessage.success('分配权限成功')
    menuDialogVisible.value = false
    loadData()
  } catch (error) {
    console.error(error)
  }
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(form, {
    id: undefined,
    name: '',
    code: '',
    description: '',
    status: 1,
  })
}

onMounted(() => {
  loadData()
  loadMenus()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
