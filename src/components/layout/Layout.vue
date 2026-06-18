<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import Dashboard from '../../views/Dashboard.vue'
import Scheduling from '../../views/Scheduling.vue'
import { useAuth } from '../../stores/auth'

const activeMenu = ref('dashboard')
const { logout } = useAuth()

const currentView = computed(() => {
  if (activeMenu.value === 'dashboard') return Dashboard
  if (activeMenu.value === 'course-schedule') return Scheduling
  if (activeMenu.value === 'course-scheduling') return Scheduling
  return Dashboard
})

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    dashboard: '工作台',
    'course-list': '课程列表',
    'course-schedule': '课程表',
    'course-scheduling': '课程排课',
    'student-list': '学生列表',
    'student-score': '成绩管理',
    'teacher-list': '教师列表',
    'teacher-evaluate': '教师评价',
    attendance: '考勤管理',
    notice: '校园公告',
    'system-user': '用户管理',
    'system-role': '角色权限',
    'system-log': '操作日志'
  }
  return titles[activeMenu.value] || '工作台'
})

watch(activeMenu, () => {
  // 可以在这里做路由切换逻辑
})
</script>

<template>
  <div class="layout">
    <Sidebar v-model:active-menu="activeMenu" />
    <div class="main-wrapper">
      <Header :page-title="pageTitle" />
      <main class="main-content">
        <component :is="currentView" @logout="logout" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.main-wrapper {
  margin-left: 220px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 24px;
  margin-top: 60px;
}
</style>
