<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../../stores/auth'
import { getMenusByRole } from '../../mock/menus'
import type { MenuItem } from '../../types'
import * as Icons from '@element-plus/icons-vue'

const { userRole } = useAuth()

const activeMenu = defineModel<string>('activeMenu', { default: 'dashboard' })

const menus = computed(() => {
  if (!userRole.value) return []
  return getMenusByRole(userRole.value)
})

const getIcon = (iconName: string) => {
  return (Icons as Record<string, any>)[iconName]
}

const hasChildren = (item: MenuItem) => {
  return item.children && item.children.length > 0
}
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <el-icon :size="32" color="#409EFF">
        <School />
      </el-icon>
      <span class="logo-text">智慧校园</span>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      background-color="#001529"
      text-color="#b9bbbd"
      active-text-color="#ffffff"
      @select="(key: string) => (activeMenu = key)"
    >
      <template v-for="item in menus" :key="item.key">
        <el-sub-menu v-if="hasChildren(item)" :index="item.key">
          <template #title>
            <el-icon><component :is="getIcon(item.icon)" /></el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.key"
            :index="child.key"
          >
            <el-icon><component :is="getIcon(child.icon)" /></el-icon>
            <span>{{ child.title }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.key">
          <el-icon><component :is="getIcon(item.icon)" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar {
  width: 220px;
  height: 100vh;
  background: #001529;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid #1f3a5f;
  flex-shrink: 0;
}

.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-sub-menu__title:hover),
:deep(.el-menu-item:hover) {
  background-color: #1890ff20 !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #1890ff !important;
}
</style>
