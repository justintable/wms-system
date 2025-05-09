<template>
  <div class="product-management">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="商品编码">
          <el-input v-model="searchForm.code" placeholder="请输入商品编码" clearable />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="searchForm.category" placeholder="请选择商品分类" clearable>
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">新增商品</el-button>
      <el-button type="danger" :disabled="!selectedProducts.length" @click="handleBatchDelete">
        批量删除
      </el-button>
      <el-button type="success" @click="handleExport">导出数据</el-button>
    </div>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="code" label="商品编码" width="120" />
        <el-table-column prop="name" label="商品名称" min-width="150" />
        <el-table-column prop="category" label="商品分类" width="120" />
        <el-table-column prop="specification" label="规格" width="120" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '在售' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增商品' : '编辑商品'"
      width="600px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择商品分类">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="form.specification" placeholder="请输入规格" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number
            v-model="form.price"
            :precision="2"
            :step="0.1"
            :min="0"
            placeholder="请输入价格"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="在售">在售</el-radio>
            <el-radio label="停售">停售</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  code: '',
  name: '',
  category: ''
})

// 分类选项
const categoryOptions = [
  { value: '1', label: '电子产品' },
  { value: '2', label: '服装' },
  { value: '3', label: '食品' },
  { value: '4', label: '日用品' }
]

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    id: 1,
    code: 'P001',
    name: '示例商品1',
    category: '电子产品',
    specification: '标准版',
    unit: '个',
    price: 99.99,
    stock: 100,
    status: '在售'
  }
  // 更多数据...
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 选中的商品
const selectedProducts = ref([])

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = reactive({
  code: '',
  name: '',
  category: '',
  specification: '',
  unit: '',
  price: 0,
  status: '在售'
})

// 表单验证规则
const rules = {
  code: [
    { required: true, message: '请输入商品编码', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  unit: [
    { required: true, message: '请输入单位', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ]
}

// 搜索
const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('搜索条件：', searchForm)
}

// 重置搜索
const resetSearch = () => {
  searchForm.code = ''
  searchForm.name = ''
  searchForm.category = ''
  handleSearch()
}

// 新增商品
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  // 重置表单
  Object.assign(form, {
    code: '',
    name: '',
    category: '',
    specification: '',
    unit: '',
    price: 0,
    status: '在售'
  })
}

// 编辑商品
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  // 填充表单
  Object.assign(form, row)
}

// 查看商品
const handleView = (row: any) => {
  // TODO: 实现查看逻辑
  console.log('查看商品：', row)
}

// 删除商品
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该商品吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedProducts.value.length === 0) {
    ElMessage.warning('请选择要删除的商品')
    return
  }
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedProducts.value.length} 个商品吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现批量删除逻辑
    ElMessage.success('批量删除成功')
  })
}

// 导出数据
const handleExport = () => {
  // TODO: 实现导出逻辑
  ElMessage.success('导出成功')
}

// 表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedProducts.value = selection
}

// 分页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

// 当前页变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 实现提交逻辑
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.product-management {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.operation-bar {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 