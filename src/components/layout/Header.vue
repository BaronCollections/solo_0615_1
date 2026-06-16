<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../../stores/auth'
import { ElMessageBox } from 'element-plus'

const props = defineProps<{
  pageTitle?: string
}>()

const { currentUser, logout } = useAuth()

const roleTagType = computed(() => {
  const role = currentUser.value?.role
  if (role === 'admin') return 'danger'
  if (role === 'teacher') return 'warning'
  return 'success'
})

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    logout()
  } catch {
    // 用户取消
  }
}
</script>

<template>
  <div class="header">
    <div class="header-left">
      <span class="page-title">{{ props.pageTitle || '工作台' }}</span>
    </div>
    <div class="header-right">
      <el-icon class="header-icon" :size="20">
        <Bell />
      </el-icon>
      <el-icon class="header-icon" :size="20">
        <Message />
      </el-icon>
      <el-divider direction="vertical" />
      <div class="user-info">
        <el-avatar :size="32" style="background: #409EFF">
          {{ currentUser?.name?.charAt(0) }}
        </el-avatar>
        <span class="user-name">{{ currentUser?.name }}</span>
        <el-tag :type="roleTagType" size="small" effect="light">
          {{ currentUser?.roleLabel }}
        </el-tag>
      </div>
      <el-dropdown>
        <el-icon class="header-icon more-icon" :size="20">
          <CaretBottom />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon><Setting /></el-icon>
              账户设置
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 220px;
  right: 0;
  z-index: 99;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  color: #606266;
  cursor: pointer;
  transition: color 0.3s;
}

.header-icon:hover {
  color: #409EFF;
}

.more-icon {
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}
</style>
