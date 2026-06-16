<script setup lang="ts">
import { ref } from 'vue'
import { noticeList } from '../../mock/notices'

const notices = ref(noticeList.slice(0, 5))

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '重要通知': '#F56C6C',
    '系统通知': '#409EFF',
    '服务通知': '#67C23A',
    '活动通知': '#E6A23C'
  }
  return colors[type] || '#909399'
}
</script>

<template>
  <el-card class="campus-notice" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="card-title">
          <el-icon :size="18" color="#67C23A"><Bell /></el-icon>
          校园公告
        </span>
        <el-button type="primary" text size="small">查看更多</el-button>
      </div>
    </template>
    <div class="notice-list">
      <div
        v-for="notice in notices"
        :key="notice.id"
        class="notice-item"
      >
        <div class="notice-type" :style="{ background: getTypeColor(notice.type) }">
          {{ notice.type }}
        </div>
        <div class="notice-content">
          <div class="notice-title">{{ notice.title }}</div>
          <div class="notice-meta">
            <span>{{ notice.publisher }}</span>
            <span class="dot">·</span>
            <span>{{ notice.publishTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.campus-notice {
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

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: background 0.3s;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-item:hover {
  background: #f5f7fa;
  margin: 0 -12px;
  padding: 12px;
  border-radius: 6px;
}

.notice-type {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  margin-top: 2px;
}

.notice-content {
  flex: 1;
  min-width: 0;
}

.notice-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-meta {
  font-size: 12px;
  color: #909399;
  display: flex;
  gap: 6px;
}

.dot {
  color: #c0c4cc;
}
</style>
