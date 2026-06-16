<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../../stores/auth'
import { getTasks } from '../../mock/tasks'

const { userRole } = useAuth()

const tasks = computed(() => {
  if (!userRole.value) return []
  return getTasks(userRole.value)
})

const pendingCount = computed(() => tasks.value.filter((t) => t.status === 'pending').length)

const getPriorityType = (priority: string) => {
  if (priority === 'high') return 'danger'
  if (priority === 'medium') return 'warning'
  return 'info'
}

const getStatusType = (status: string) => {
  if (status === 'done') return 'success'
  if (status === 'processing') return 'primary'
  return 'info'
}

const getStatusText = (status: string) => {
  if (status === 'done') return '已完成'
  if (status === 'processing') return '进行中'
  return '待处理'
}
</script>

<template>
  <el-card class="pending-tasks" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="card-title">
          <el-icon :size="18" color="#E6A23C"><List /></el-icon>
          待处理事项
        </span>
        <el-badge :value="pendingCount" class="badge">
          <el-tag size="small" type="warning">待处理 {{ pendingCount }} 项</el-tag>
        </el-badge>
      </div>
    </template>
    <div class="task-list">
      <div
        v-for="task in tasks.slice(0, 5)"
        :key="task.id"
        class="task-item"
      >
        <div class="task-left">
          <el-tag :type="getPriorityType(task.priority)" size="small" effect="light">
            {{ task.type }}
          </el-tag>
          <span class="task-title">{{ task.title }}</span>
        </div>
        <div class="task-right">
          <span class="deadline">
            <el-icon :size="13"><Clock /></el-icon>
            {{ task.deadline }}
          </span>
          <el-tag :type="getStatusType(task.status)" size="small">
            {{ getStatusText(task.status) }}
          </el-tag>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.pending-tasks {
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

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 320px;
  overflow-y: auto;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  transition: background 0.3s;
}

.task-item:hover {
  background: #ecf5ff;
}

.task-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 14px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.deadline {
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
