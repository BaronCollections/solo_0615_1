<script setup lang="ts">
import { reactive } from 'vue'
import { store, getBuildingList } from '../../store/scheduling'

const TOTAL_WEEKS = 20

const weekOptions = Array.from({ length: TOTAL_WEEKS }, (_, i) => ({
  label: `第${i + 1}周`,
  value: i + 1
}))

const buildingOptions = getBuildingList().map(b => ({ label: b, value: b }))
const teacherOptions = store.teachers.map(t => ({ label: t.name, value: t.id }))

const filters = reactive({
  week: null as number | null,
  building: null as string | null,
  teacher: null as string | null
})

const emit = defineEmits<{
  filter: [filters: { week: number | null; building: string | null; teacher: string | null }]
  clear: []
}>()

const handleFilter = () => {
  emit('filter', { ...filters })
}

const handleClear = () => {
  filters.week = null
  filters.building = null
  filters.teacher = null
  emit('clear')
}
</script>

<template>
  <div class="schedule-filter">
    <div class="filter-items">
      <el-select
        v-model="filters.week"
        placeholder="选择周次"
        clearable
        style="width: 140px"
        @change="handleFilter"
      >
        <el-option
          v-for="opt in weekOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>

      <el-select
        v-model="filters.building"
        placeholder="选择教学楼"
        clearable
        style="width: 160px"
        @change="handleFilter"
      >
        <el-option
          v-for="opt in buildingOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>

      <el-select
        v-model="filters.teacher"
        placeholder="选择教师"
        clearable
        filterable
        style="width: 140px"
        @change="handleFilter"
      >
        <el-option
          v-for="opt in teacherOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
    </div>

    <el-button @click="handleClear">清除筛选</el-button>
  </div>
</template>

<style scoped>
.schedule-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-items {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
