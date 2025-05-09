<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="WMS Logo" class="logo">
        <h2>WMS仓库管理系统</h2>
      </div>
      
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin">
        
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User">
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password>
          </el-input>
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <el-link type="primary" class="forget-pwd">忘记密码？</el-link>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-button"
            @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  loading.value = true
  try {
    // TODO: 实现登录逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    ElMessage.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.login-header h2 {
  color: #303133;
  margin: 0;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
}

.forget-pwd {
  float: right;
}
</style> 