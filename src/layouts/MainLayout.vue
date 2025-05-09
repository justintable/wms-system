<template>
  <el-container class="layout-container">
    <!-- 头部 -->
    <el-header height="60px">
      <div class="header-left">
        <img src="@/assets/logo.png" alt="WMS Logo" class="logo">
        <h1>WMS仓库管理系统</h1>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user-info">
            <el-avatar :size="32" :src="userAvatar"></el-avatar>
            <span class="username">{{ username }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          :collapse="isCollapse"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF">
          
          <!-- 基础数据管理 -->
          <el-sub-menu index="1">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>基础数据管理</span>
            </template>
            <el-menu-item index="1-1">仓库信息管理</el-menu-item>
            <el-menu-item index="1-2">商品信息管理</el-menu-item>
            <el-menu-item index="1-3">供应商管理</el-menu-item>
          </el-sub-menu>

          <!-- 入库管理 -->
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Box /></el-icon>
              <span>入库管理</span>
            </template>
            <el-menu-item index="2-1">采购入库</el-menu-item>
            <el-menu-item index="2-2">退货入库</el-menu-item>
          </el-sub-menu>

          <!-- 出库管理 -->
          <el-sub-menu index="3">
            <template #title>
              <el-icon><Van /></el-icon>
              <span>出库管理</span>
            </template>
            <el-menu-item index="3-1">销售出库</el-menu-item>
            <el-menu-item index="3-2">退货出库</el-menu-item>
          </el-sub-menu>

          <!-- 库存管理 -->
          <el-sub-menu index="4">
            <template #title>
              <el-icon><Goods /></el-icon>
              <span>库存管理</span>
            </template>
            <el-menu-item index="4-1">库存查询</el-menu-item>
            <el-menu-item index="4-2">库存盘点</el-menu-item>
            <el-menu-item index="4-3">库存调拨</el-menu-item>
          </el-sub-menu>

          <!-- 系统管理 -->
          <el-sub-menu index="5">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="5-1">用户管理</el-menu-item>
            <el-menu-item index="5-2">角色管理</el-menu-item>
            <el-menu-item index="5-3">权限管理</el-menu-item>
            <el-menu-item index="5-4">系统配置</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主要内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Document, Box, Van, Goods, Setting } from '@element-plus/icons-vue'

const isCollapse = ref(false)
const activeMenu = ref('1')
const username = ref('管理员')
const userAvatar = ref('')
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.header-left h1 {
  font-size: 20px;
  color: #303133;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  color: #606266;
}

.el-aside {
  background-color: #304156;
  transition: width 0.3s;
}

.el-menu {
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style> 