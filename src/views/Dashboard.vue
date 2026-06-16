<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../stores/auth'
import TodayCourses from '../components/dashboard/TodayCourses.vue'
import PendingTasks from '../components/dashboard/PendingTasks.vue'
import CampusNotice from '../components/dashboard/CampusNotice.vue'
import AttendanceOverview from '../components/dashboard/AttendanceOverview.vue'
import SystemStatus from '../components/dashboard/SystemStatus.vue'

const { currentUser } = useAuth()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 22) return '晚上好'
  return '夜深了'
})
</script>

<template>
  <div class="dashboard">
    <div class="welcome-card">
      <div class="welcome-info">
        <h2 class="welcome-title">
          {{ greeting }}，{{ currentUser?.name }}
          <span class="welcome-role">{{ currentUser?.roleLabel }}</span>
        </h2>
        <p class="welcome-desc">欢迎回到智慧校园管理系统，今天也要加油哦！</p>
      </div>
      <div class="welcome-stats">
        <div class="stat-card">
          <el-icon :size="28" color="#409EFF"><Reading /></el-icon>
          <div class="stat-info">
            <span class="stat-num">12</span>
            <span class="stat-label">本学期课程</span>
          </div>
        </div>
        <div class="stat-card">
          <el-icon :size="28" color="#67C23A"><Trophy /></el-icon>
          <div class="stat-info">
            <span class="stat-num">87.5</span>
            <span class="stat-label">平均成绩</span>
          </div>
        </div>
        <div class="stat-card">
          <el-icon :size="28" color="#E6A23C"><Bell /></el-icon>
          <div class="stat-info">
            <span class="stat-num">5</span>
            <span class="stat-label">未读通知</span>
          </div>
        </div>
        <div class="stat-card">
          <el-icon :size="28" color="#F56C6C"><Clock /></el-icon>
          <div class="stat-info">
            <span class="stat-num">3</span>
            <span class="stat-label">待办事项</span>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="grid-item grid-item-2">
        <TodayCourses />
      </div>
      <div class="grid-item grid-item-2">
        <PendingTasks />
      </div>
      <div class="grid-item">
        <AttendanceOverview />
      </div>
      <div class="grid-item">
        <SystemStatus />
      </div>
      <div class="grid-item grid-item-2">
        <CampusNotice />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 28px 32px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.welcome-info {
  flex: 1;
  min-width: 280px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome-role {
  font-size: 14px;
  font-weight: 400;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
}

.welcome-desc {
  margin: 0;
  font-size: 14px;
  opacity: 0.85;
}

.welcome-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  opacity: 0.85;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.grid-item {
  min-height: 200px;
}

.grid-item-2 {
  grid-column: span 1;
}

@media (min-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .grid-item-2 {
    grid-column: span 2;
  }
}

@media (max-width: 992px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid-item-2 {
    grid-column: span 2;
  }
}

@media (max-width: 576px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .grid-item-2 {
    grid-column: span 1;
  }
}
</style>
