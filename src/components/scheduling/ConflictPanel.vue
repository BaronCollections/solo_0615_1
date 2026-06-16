<script setup lang="ts">
import { computed } from 'vue'
import type { Conflict } from '../../utils/conflict'

const props = defineProps<{
  conflicts: Conflict[]
}>()

const classroomConflicts = computed(() => props.conflicts.filter(c => c.type === 'classroom'))
const teacherConflicts = computed(() => props.conflicts.filter(c => c.type === 'teacher'))
const classConflicts = computed(() => props.conflicts.filter(c => c.type === 'class'))

</script>

<template>
  <div class="conflict-panel">
    <div class="panel-header">
      <el-badge :value="conflicts.length" :max="99" type="danger">
        <span class="panel-title">冲突记录</span>
      </el-badge>
    </div>

    <div v-if="conflicts.length === 0" class="no-conflict">
      <el-icon :size="32" color="#67c23a"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.336-54.336L456.192 600.384z"/></svg></el-icon>
      <p>暂无冲突</p>
    </div>

    <div v-else class="conflict-sections">
      <div v-if="classroomConflicts.length" class="conflict-section">
        <div class="section-title">
          <el-tag type="danger" size="small">教室冲突</el-tag>
          <span class="section-count">{{ classroomConflicts.length }}</span>
        </div>
        <div v-for="(c, i) in classroomConflicts" :key="i" class="conflict-card classroom">
          <div class="conflict-reason">{{ c.reason }}</div>
        </div>
      </div>

      <div v-if="teacherConflicts.length" class="conflict-section">
        <div class="section-title">
          <el-tag type="warning" size="small">教师冲突</el-tag>
          <span class="section-count">{{ teacherConflicts.length }}</span>
        </div>
        <div v-for="(c, i) in teacherConflicts" :key="i" class="conflict-card teacher">
          <div class="conflict-reason">{{ c.reason }}</div>
        </div>
      </div>

      <div v-if="classConflicts.length" class="conflict-section">
        <div class="section-title">
          <el-tag size="small">班级冲突</el-tag>
          <span class="section-count">{{ classConflicts.length }}</span>
        </div>
        <div v-for="(c, i) in classConflicts" :key="i" class="conflict-card class-c">
          <div class="conflict-reason">{{ c.reason }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.conflict-panel {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}

.panel-header {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.no-conflict {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}

.no-conflict p {
  margin-top: 8px;
  font-size: 14px;
}

.conflict-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.conflict-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-count {
  font-size: 13px;
  color: #909399;
}

.conflict-card {
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.6;
  color: #303133;
}

.conflict-card.classroom {
  background: #fef0f0;
  border-left: 3px solid #f56c6c;
}

.conflict-card.teacher {
  background: #fdf6ec;
  border-left: 3px solid #e6a23c;
}

.conflict-card.class-c {
  background: #f0f9eb;
  border-left: 3px solid #67c23a;
}

.conflict-reason {
  word-break: break-all;
}
</style>
