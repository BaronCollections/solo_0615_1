<script setup lang="ts">
import { ref } from 'vue'
import { systemStatus } from '../../mock/system'

const status = ref(systemStatus)

const statusColor = (val: string) => {
  const num = Number(val.replace('%', ''))
  if (num > 80) return '#F56C6C'
  if (num > 60) return '#E6A23C'
  return '#67C23A'
}

const statusText = status.value.status === 'normal' ? '运行正常' : status.value.status === 'warning' ? '异常' : '故障'
const statusType = status.value.status === 'normal' ? 'success' : status.value.status === 'warning' ? 'warning' : 'danger'
</script>

<template>
  <el-card class="system-status" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="card-title">
          <el-icon :size="18" color="#909399"><Monitor /></el-icon>
          系统状态
        </span>
        <el-tag :type="statusType" size="small" effect="light">
          <span class="status-dot"></span>
          {{ statusText }}
        </el-tag>
      </div>
    </template>
    <div class="status-content">
      <div class="status-item">
        <div class="status-label">
          <el-icon :size="16" color="#409EFF"><Cpu /></el-icon>
          CPU
        </div>
        <div class="status-bar">
          <div class="bar-bg">
            <div class="bar-fill" :style="{ width: status.cpu, background: statusColor(status.cpu) }"></div>
          </div>
          <span class="bar-value">{{ status.cpu }}</span>
        </div>
      </div>
      <div class="status-item">
        <div class="status-label">
          <el-icon :size="16" color="#67C23A"><Coin /></el-icon>
          内存
        </div>
        <div class="status-bar">
          <div class="bar-bg">
            <div class="bar-fill" :style="{ width: status.memory, background: statusColor(status.memory) }"></div>
          </div>
          <span class="bar-value">{{ status.memory }}</span>
        </div>
      </div>
      <div class="status-item">
        <div class="status-label">
          <el-icon :size="16" color="#E6A23C"><Files /></el-icon>
          磁盘
        </div>
        <div class="status-bar">
          <div class="bar-bg">
            <div class="bar-fill" :style="{ width: status.disk, background: statusColor(status.disk) }"></div>
          </div>
          <span class="bar-value">{{ status.disk }}</span>
        </div>
      </div>
      <div class="status-info">
        <div class="info-item">
          <span class="info-label">运行时间</span>
          <span class="info-value">{{ status.uptime }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">在线用户</span>
          <span class="info-value highlight">{{ status.onlineUsers }} 人</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.system-status {
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

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  margin-right: 4px;
  vertical-align: middle;
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-label {
  font-size: 13px;
  color: #606266;
  min-width: 50px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-bg {
  flex: 1;
  height: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.bar-value {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
  min-width: 40px;
  text-align: right;
}

.status-info {
  display: flex;
  justify-content: space-around;
  padding-top: 10px;
  border-top: 1px solid #f0f2f5;
}

.info-item {
  text-align: center;
}

.info-label {
  font-size: 12px;
  color: #909399;
  display: block;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.info-value.highlight {
  color: #409EFF;
}
</style>
