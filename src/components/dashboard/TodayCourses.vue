<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../../stores/auth'
import { getTodayCourses } from '../../mock/courses'

const { userRole } = useAuth()

const courses = computed(() => {
  if (!userRole.value) return []
  return getTodayCourses(userRole.value)
})

const today = new Date()
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 星期${weekDays[today.getDay()]}`
</script>

<template>
  <el-card class="today-courses" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="card-title">
          <el-icon :size="18" color="#409EFF"><Reading /></el-icon>
          今日课程
        </span>
        <span class="card-subtitle">{{ dateStr }}</span>
      </div>
    </template>
    <div class="course-list" v-if="courses.length > 0">
      <div
        v-for="course in courses"
        :key="course.id"
        class="course-item"
      >
        <div class="course-time" :style="{ color: course.color }">
          {{ course.time }}
        </div>
        <div class="course-line" :style="{ background: course.color }"></div>
        <div class="course-info">
          <div class="course-name">{{ course.name }}</div>
          <div class="course-detail">
            <span class="detail-item">
              <el-icon :size="14"><User /></el-icon>
              {{ course.teacher }}
            </span>
            <span class="detail-item">
              <el-icon :size="14"><Location /></el-icon>
              {{ course.classroom }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-courses">
      <el-empty description="今日暂无课程" :image-size="60" />
    </div>
  </el-card>
</template>

<style scoped>
.today-courses {
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

.card-subtitle {
  font-size: 13px;
  color: #909399;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 320px;
  overflow-y: auto;
}

.course-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.course-time {
  font-size: 13px;
  font-weight: 600;
  min-width: 100px;
  padding-top: 2px;
}

.course-line {
  width: 4px;
  border-radius: 2px;
  min-height: 50px;
  flex-shrink: 0;
}

.course-info {
  flex: 1;
}

.course-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.course-detail {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #909399;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-courses {
  padding: 20px 0;
}
</style>
