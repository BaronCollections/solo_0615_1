<script setup lang="ts">
import { computed } from 'vue'
import type { Schedule } from '../../mock/scheduling'
import {
  DAY_LABELS,
  PERIOD_LABELS,
  getCourseName,
  getTeacherName,
  getClassGroupName,
  getClassroomName,
} from '../../mock/scheduling'
import { store } from '../../store/scheduling'
import type { Conflict } from '../../utils/conflict'

const props = defineProps<{
  schedules: Schedule[]
  filterWeek: number | null
  filterBuilding: string | null
  filterTeacher: string | null
  conflicts: Conflict[]
}>()

const emit = defineEmits<{
  edit: [schedule: Schedule]
  delete: [id: string]
  addCell: [dayOfWeek: number, periodStart: number]
}>()

const PERIOD_STARTS = [1, 3, 5, 7]

const filteredSchedules = computed(() => {
  return props.schedules.filter(s => {
    if (props.filterWeek && (s.weekStart > props.filterWeek || s.weekEnd < props.filterWeek)) return false
    if (props.filterBuilding) {
      const room = store.classrooms.find(r => r.id === s.classroomId)
      if (!room || room.building !== props.filterBuilding) return false
    }
    if (props.filterTeacher && s.teacherId !== props.filterTeacher) return false
    return true
  })
})

const conflictIds = computed(() => {
  const ids = new Set<string>()
  for (const c of props.conflicts) {
    ids.add(c.existingSchedule.id)
    ids.add(c.newSchedule.id)
  }
  return ids
})

const getCellSchedules = (dayOfWeek: number, periodStart: number) => {
  const periodEnd = periodStart + 1
  return filteredSchedules.value.filter(
    s => s.dayOfWeek === dayOfWeek && s.periodStart <= periodEnd && s.periodEnd >= periodStart
  )
}

const isConflicted = (id: string) => conflictIds.value.has(id)
</script>

<template>
  <div class="schedule-table-wrapper">
    <table class="schedule-table">
      <thead>
        <tr>
          <th class="period-header">节次</th>
          <th v-for="(day, di) in DAY_LABELS" :key="di">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(label, pi) in PERIOD_LABELS" :key="pi">
          <td class="period-cell">{{ label }}</td>
          <td
            v-for="(_, di) in DAY_LABELS"
            :key="di"
            class="schedule-cell"
            @dblclick="emit('addCell', di + 1, PERIOD_STARTS[pi])"
          >
            <div
              v-for="s in getCellSchedules(di + 1, PERIOD_STARTS[pi])"
              :key="s.id"
              class="schedule-item"
              :class="{ conflicted: isConflicted(s.id) }"
            >
              <div class="course-name">{{ getCourseName(s.courseId) }}</div>
              <div class="course-info">
                <span>{{ getClassroomName(s.classroomId) }}</span>
                <span>{{ getTeacherName(s.teacherId) }}</span>
              </div>
              <div class="course-class">{{ getClassGroupName(s.classId) }}</div>
              <div class="course-actions">
                <el-button link size="small" type="primary" @click.stop="emit('edit', s)">编辑</el-button>
                <el-button link size="small" type="danger" @click.stop="emit('delete', s.id)">删除</el-button>
              </div>
            </div>
            <div v-if="getCellSchedules(di + 1, PERIOD_STARTS[pi]).length === 0" class="empty-cell">
              <span class="add-hint" @click="emit('addCell', di + 1, PERIOD_STARTS[pi])">+ 排课</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.schedule-table-wrapper {
  overflow-x: auto;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.schedule-table th,
.schedule-table td {
  border: 1px solid #ebeef5;
  padding: 8px;
  vertical-align: top;
}

.period-header,
.period-cell {
  width: 80px;
  text-align: center;
  background: #f5f7fa;
  font-weight: 500;
  color: #606266;
}

.schedule-table th {
  background: #409eff;
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  padding: 10px 4px;
}

.schedule-cell {
  min-height: 100px;
  vertical-align: top;
  cursor: pointer;
  transition: background 0.2s;
}

.schedule-cell:hover {
  background: #ecf5ff;
}

.schedule-item {
  background: #e8f4fd;
  border-radius: 6px;
  padding: 6px 8px;
  margin-bottom: 6px;
  font-size: 12px;
  border-left: 3px solid #409eff;
  transition: all 0.2s;
}

.schedule-item.conflicted {
  background: #fef0f0;
  border-left-color: #f56c6c;
}

.course-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.course-info {
  display: flex;
  gap: 8px;
  color: #909399;
  font-size: 11px;
}

.course-class {
  color: #606266;
  font-size: 11px;
  margin-top: 2px;
}

.course-actions {
  display: flex;
  gap: 4px;
  margin-top: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.schedule-item:hover .course-actions {
  opacity: 1;
}

.empty-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
}

.add-hint {
  color: #c0c4cc;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;
}

.add-hint:hover {
  color: #409eff;
}
</style>
