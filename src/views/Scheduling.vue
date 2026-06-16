<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { Schedule } from '../mock/scheduling'
import { store } from '../store/scheduling'
import { detectAllConflicts } from '../utils/conflict'
import ScheduleFilter from '../components/scheduling/ScheduleFilter.vue'
import ScheduleTable from '../components/scheduling/ScheduleTable.vue'
import ScheduleForm from '../components/scheduling/ScheduleForm.vue'
import ConflictPanel from '../components/scheduling/ConflictPanel.vue'
import ResourceManage from '../components/scheduling/ResourceManage.vue'

const filterWeek = ref<number | null>(null)
const filterBuilding = ref<string | null>(null)
const filterTeacher = ref<string | null>(null)

const formVisible = ref(false)
const editingSchedule = ref<Schedule | null>(null)
const prefillDay = ref<number | undefined>(undefined)
const prefillPeriod = ref<number | undefined>(undefined)
const showConflictPanel = ref(true)
const showResourceDrawer = ref(false)

const conflicts = computed(() => detectAllConflicts(store.schedules))

const handleFilter = (filters: { week: number | null; building: string | null; teacher: string | null }) => {
  filterWeek.value = filters.week
  filterBuilding.value = filters.building
  filterTeacher.value = filters.teacher
}

const handleClearFilter = () => {
  filterWeek.value = null
  filterBuilding.value = null
  filterTeacher.value = null
}

const handleAddSchedule = () => {
  editingSchedule.value = null
  prefillDay.value = undefined
  prefillPeriod.value = undefined
  formVisible.value = true
}

const handleAddCell = (dayOfWeek: number, periodStart: number) => {
  editingSchedule.value = null
  prefillDay.value = dayOfWeek
  prefillPeriod.value = periodStart
  formVisible.value = true
}

const handleEditSchedule = (schedule: Schedule) => {
  editingSchedule.value = { ...schedule }
  formVisible.value = true
}

const handleDeleteSchedule = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定删除该排课记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    store.schedules = store.schedules.filter(s => s.id !== id)
    ElMessage.success('删除成功')
  } catch {}
}

const handleSaveSchedule = (schedule: Schedule) => {
  const idx = store.schedules.findIndex(s => s.id === schedule.id)
  if (idx >= 0) {
    store.schedules[idx] = schedule
    ElMessage.success('排课更新成功')
  } else {
    store.schedules.push(schedule)
    ElMessage.success('排课创建成功')
  }
}

const handleLogout = () => {
  emit('logout')
}

const emit = defineEmits<{
  logout: []
}>()
</script>

<template>
  <div class="scheduling-page">
    <div class="top-bar">
      <div class="top-bar-left">
        <h1 class="page-title">课程排课与教室资源冲突检测</h1>
        <el-tag v-if="conflicts.length > 0" type="danger" size="small" effect="dark">
          {{ conflicts.length }} 条冲突
        </el-tag>
        <el-tag v-else type="success" size="small" effect="dark">
          无冲突
        </el-tag>
      </div>
      <div class="top-bar-right">
        <el-button @click="showResourceDrawer = true">资源管理</el-button>
        <el-button @click="handleLogout">退出登录</el-button>
      </div>
    </div>

    <div class="toolbar">
      <ScheduleFilter @filter="handleFilter" @clear="handleClearFilter" />
      <div class="toolbar-actions">
        <el-button type="primary" @click="handleAddSchedule">新建排课</el-button>
        <el-button
          :type="showConflictPanel ? 'default' : 'primary'"
          @click="showConflictPanel = !showConflictPanel"
        >
          {{ showConflictPanel ? '隐藏冲突面板' : '显示冲突面板' }}
        </el-button>
      </div>
    </div>

    <div class="main-content">
      <div class="table-area" :class="{ 'full-width': !showConflictPanel }">
        <ScheduleTable
          :schedules="store.schedules"
          :filter-week="filterWeek"
          :filter-building="filterBuilding"
          :filter-teacher="filterTeacher"
          :conflicts="conflicts"
          @edit="handleEditSchedule"
          @delete="handleDeleteSchedule"
          @add-cell="handleAddCell"
        />
      </div>

      <div v-if="showConflictPanel" class="conflict-area">
        <ConflictPanel :conflicts="conflicts" />
      </div>
    </div>

    <ScheduleForm
      v-model:visible="formVisible"
      :editing-schedule="editingSchedule"
      :existing-schedules="store.schedules"
      :prefill-day="prefillDay"
      :prefill-period="prefillPeriod"
      @save="handleSaveSchedule"
    />

    <el-drawer
      v-model="showResourceDrawer"
      title="资源管理"
      size="520px"
      direction="ltr"
    >
      <ResourceManage @data-changed="() => {}" />
    </el-drawer>
  </div>
</template>

<style scoped>
.scheduling-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.top-bar-right {
  display: flex;
  gap: 8px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.main-content {
  flex: 1;
  display: flex;
  gap: 0;
  padding: 16px 24px;
  overflow: hidden;
}

.table-area {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
  min-width: 0;
}

.table-area.full-width {
  flex: 1;
}

.conflict-area {
  width: 320px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  margin-left: 16px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
}
</style>
