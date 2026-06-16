<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Schedule } from '../../mock/scheduling'
import { DAY_LABELS } from '../../mock/scheduling'
import { store } from '../../store/scheduling'
import { detectConflicts, type Conflict } from '../../utils/conflict'

const props = defineProps<{
  visible: boolean
  editingSchedule: Schedule | null
  existingSchedules: Schedule[]
  prefillDay?: number
  prefillPeriod?: number
}>()

const emit = defineEmits<{
  'update:visible': [val: boolean]
  save: [schedule: Schedule]
}>()

const formRef = ref<FormInstance>()
const conflicts = ref<Conflict[]>([])

const form = reactive({
  courseId: '',
  teacherId: '',
  classId: '',
  classroomId: '',
  weekStart: 1,
  weekEnd: 16,
  dayOfWeek: 1,
  periodStart: 1,
  periodEnd: 2,
})

const courseOptions = computed(() => store.courses.map(c => ({ label: c.name, value: c.id })))
const teacherOptions = computed(() => store.teachers.map(t => ({ label: `${t.name}（${t.department}）`, value: t.id })))
const classOptions = computed(() => store.classGroups.map(c => ({ label: c.name, value: c.id })))
const classroomOptions = computed(() => store.classrooms.map(r => ({ label: `${r.name}（${r.building}，容纳${r.capacity}人）`, value: r.id })))
const dayOptions = DAY_LABELS.map((l, i) => ({ label: l, value: i + 1 }))

const periodOptions = [
  { label: '第1-2节', value: 1 },
  { label: '第3-4节', value: 3 },
  { label: '第5-6节', value: 5 },
  { label: '第7-8节', value: 7 },
]

const periodEndOptions = computed(() => {
  const map: Record<number, number> = { 1: 2, 3: 4, 5: 6, 7: 8 }
  return [{ label: `第${map[form.periodStart]}节`, value: map[form.periodStart] }]
})

const formRules: FormRules = {
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  teacherId: [{ required: true, message: '请选择教师', trigger: 'change' }],
  classId: [{ required: true, message: '请选择班级', trigger: 'change' }],
  classroomId: [{ required: true, message: '请选择教室', trigger: 'change' }],
  dayOfWeek: [{ required: true, message: '请选择星期', trigger: 'change' }],
  periodStart: [{ required: true, message: '请选择开始节次', trigger: 'change' }],
}

const title = computed(() => props.editingSchedule ? '编辑排课' : '新建排课')

watch(() => props.visible, (val) => {
  if (val) {
    conflicts.value = []
    if (props.editingSchedule) {
      Object.assign(form, {
        courseId: props.editingSchedule.courseId,
        teacherId: props.editingSchedule.teacherId,
        classId: props.editingSchedule.classId,
        classroomId: props.editingSchedule.classroomId,
        weekStart: props.editingSchedule.weekStart,
        weekEnd: props.editingSchedule.weekEnd,
        dayOfWeek: props.editingSchedule.dayOfWeek,
        periodStart: props.editingSchedule.periodStart,
        periodEnd: props.editingSchedule.periodEnd,
      })
    } else {
      Object.assign(form, {
        courseId: '', teacherId: '', classId: '', classroomId: '',
        weekStart: 1, weekEnd: 16,
        dayOfWeek: props.prefillDay ?? 1,
        periodStart: props.prefillPeriod ?? 1,
        periodEnd: (props.prefillPeriod ?? 1) + 1,
      })
    }
  }
})

watch(() => form.periodStart, (val) => {
  const map: Record<number, number> = { 1: 2, 3: 4, 5: 6, 7: 8 }
  form.periodEnd = map[val] ?? 2
})

const runConflictDetection = () => {
  if (!form.courseId || !form.teacherId || !form.classId || !form.classroomId) {
    conflicts.value = []
    return
  }
  const newSchedule: Schedule = {
    id: props.editingSchedule?.id ?? '',
    courseId: form.courseId,
    teacherId: form.teacherId,
    classId: form.classId,
    classroomId: form.classroomId,
    weekStart: form.weekStart,
    weekEnd: form.weekEnd,
    dayOfWeek: form.dayOfWeek,
    periodStart: form.periodStart,
    periodEnd: form.periodEnd,
  }
  conflicts.value = detectConflicts(newSchedule, props.existingSchedules, props.editingSchedule?.id)
}

watch(
  () => [form.courseId, form.teacherId, form.classId, form.classroomId, form.dayOfWeek, form.periodStart, form.weekStart, form.weekEnd],
  () => { runConflictDetection() }
)

const handleSave = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  if (conflicts.value.length > 0) return

  const schedule: Schedule = {
    id: props.editingSchedule?.id ?? `s_${Date.now()}`,
    courseId: form.courseId,
    teacherId: form.teacherId,
    classId: form.classId,
    classroomId: form.classroomId,
    weekStart: form.weekStart,
    weekEnd: form.weekEnd,
    dayOfWeek: form.dayOfWeek,
    periodStart: form.periodStart,
    periodEnd: form.periodEnd,
  }
  emit('save', schedule)
  emit('update:visible', false)
}

const handleClose = () => {
  emit('update:visible', false)
}

const conflictTypeLabel = (type: string) => {
  const map: Record<string, string> = { classroom: '教室冲突', teacher: '教师冲突', class: '班级冲突' }
  return map[type] ?? type
}

const conflictTypeTag = (type: string) => {
  const map: Record<string, string> = { classroom: 'danger', teacher: 'warning', class: '' }
  return map[type] ?? ''
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="600px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
      <el-form-item label="课程" prop="courseId">
        <el-select v-model="form.courseId" placeholder="请选择课程" filterable style="width: 100%">
          <el-option v-for="opt in courseOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="教师" prop="teacherId">
        <el-select v-model="form.teacherId" placeholder="请选择教师" filterable style="width: 100%">
          <el-option v-for="opt in teacherOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="班级" prop="classId">
        <el-select v-model="form.classId" placeholder="请选择班级" filterable style="width: 100%">
          <el-option v-for="opt in classOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="教室" prop="classroomId">
        <el-select v-model="form.classroomId" placeholder="请选择教室" filterable style="width: 100%">
          <el-option v-for="opt in classroomOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="起始周" prop="weekStart">
            <el-input-number v-model="form.weekStart" :min="1" :max="20" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束周" prop="weekEnd">
            <el-input-number v-model="form.weekEnd" :min="form.weekStart" :max="20" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="星期" prop="dayOfWeek">
        <el-select v-model="form.dayOfWeek" style="width: 100%">
          <el-option v-for="opt in dayOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="开始节次" prop="periodStart">
            <el-select v-model="form.periodStart" style="width: 100%">
              <el-option v-for="opt in periodOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束节次">
            <el-select v-model="form.periodEnd" disabled style="width: 100%">
              <el-option v-for="opt in periodEndOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div v-if="conflicts.length > 0" class="conflict-warning">
      <el-alert title="检测到以下冲突，请修改后重试" type="error" :closable="false" show-icon>
        <template #default>
          <div class="conflict-list">
            <div v-for="(c, i) in conflicts" :key="i" class="conflict-item">
              <el-tag :type="conflictTypeTag(c.type)" size="small">{{ conflictTypeLabel(c.type) }}</el-tag>
              <span class="conflict-reason">{{ c.reason }}</span>
            </div>
          </div>
        </template>
      </el-alert>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :disabled="conflicts.length > 0" @click="handleSave">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.conflict-warning {
  margin-top: 16px;
}

.conflict-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.conflict-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.6;
}

.conflict-reason {
  color: #303133;
}
</style>
