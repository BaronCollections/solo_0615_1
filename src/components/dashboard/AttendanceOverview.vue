<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../../stores/auth'
import { getAttendance } from '../../mock/attendance'

const { userRole } = useAuth()

const attendance = computed(() => {
  if (!userRole.value) return null
  return getAttendance(userRole.value)
})

const progressPercentage = computed(() => {
  if (!attendance.value) return 0
  return Number(attendance.value.rate.replace('%', ''))
})
</script>

<template>
  <el-card class="attendance-overview" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="card-title">
          <el-icon :size="18" color="#F56C6C"><Clock /></el-icon>
          考勤概览
        </span>
        <el-tag type="success" size="small">本月</el-tag>
      </div>
    </template>
    <div class="attendance-content" v-if="attendance">
      <div class="attendance-chart">
        <el-progress
          type="dashboard"
          :percentage="progressPercentage"
          :stroke-width="12"
          :width="140"
          color="#67C23A"
        >
          <div class="progress-text">
            <div class="rate">{{ attendance.rate }}</div>
            <div class="label">出勤率</div>
          </div>
        </el-progress>
      </div>
      <div class="attendance-stats">
        <div class="stat-item">
          <span class="stat-label">应到</span>
          <span class="stat-value total">{{ attendance.total }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">实到</span>
          <span class="stat-value present">{{ attendance.present }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">缺勤</span>
          <span class="stat-value absent">{{ attendance.absent }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">迟到</span>
          <span class="stat-value late">{{ attendance.late }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">请假</span>
          <span class="stat-value leave">{{ attendance.leave }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.attendance-overview {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.attendance-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.attendance-chart {
  flex-shrink: 0;
}

.progress-text {
  text-align: center;
}

.rate {
  font-size: 28px;
  font-weight: 700;
  color: #67C23A;
  line-height: 1.2;
}

.label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.attendance-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.stat-label {
  font-size: 13px;
  color: #606266;
}

.stat-value {
  font-size: 15px;
  font-weight: 600;
}

.stat-value.total {
  color: #303133;
}

.stat-value.present {
  color: #67C23A;
}

.stat-value.absent {
  color: #F56C6C;
}

.stat-value.late {
  color: #E6A23C;
}

.stat-value.leave {
  color: #909399;
}
</style>
