<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { Course, Teacher, ClassGroup, Classroom } from '../../mock/scheduling'
import { store, getStudentsByClassId, getStudentCountByClassId } from '../../store/scheduling'

const activeTab = ref('course')

const emit = defineEmits<{
  dataChanged: []
}>()

const courseDialogVisible = ref(false)
const teacherDialogVisible = ref(false)
const classDialogVisible = ref(false)
const classroomDialogVisible = ref(false)
const studentDrawerVisible = ref(false)
const selectedClass = ref<ClassGroup | null>(null)
const studentSearchKeyword = ref('')

const editingCourse = ref<Course | null>(null)
const editingTeacher = ref<Teacher | null>(null)
const editingClass = ref<ClassGroup | null>(null)
const editingClassroom = ref<Classroom | null>(null)

const courseForm = reactive({ name: '', credit: 3, hours: 48, enabled: true })
const teacherForm = reactive({ name: '', department: '' })
const classForm = reactive({ name: '', grade: '', department: '' })
const classroomForm = reactive({ name: '', building: '', capacity: 60, floor: 1 })

const resetCourseForm = () => { courseForm.name = ''; courseForm.credit = 3; courseForm.hours = 48; courseForm.enabled = true }
const resetTeacherForm = () => { teacherForm.name = ''; teacherForm.department = '' }
const resetClassForm = () => { classForm.name = ''; classForm.grade = ''; classForm.department = '' }
const resetClassroomForm = () => { classroomForm.name = ''; classroomForm.building = ''; classroomForm.capacity = 60; classroomForm.floor = 1 }

const openCourseDialog = (item?: Course) => {
  if (item) { editingCourse.value = item; Object.assign(courseForm, item) }
  else { editingCourse.value = null; resetCourseForm() }
  courseDialogVisible.value = true
}

const saveCourse = () => {
  if (!courseForm.name.trim()) return
  if (editingCourse.value) {
    Object.assign(editingCourse.value, courseForm)
  } else {
    store.courses.push({ id: `c_${Date.now()}`, ...courseForm })
  }
  courseDialogVisible.value = false
  emit('dataChanged')
}

const toggleCourseEnabled = (course: Course) => {
  course.enabled = !course.enabled
  emit('dataChanged')
}

const deleteCourse = (id: string) => {
  store.courses = store.courses.filter(c => c.id !== id)
  emit('dataChanged')
}

const openTeacherDialog = (item?: Teacher) => {
  if (item) { editingTeacher.value = item; Object.assign(teacherForm, item) }
  else { editingTeacher.value = null; resetTeacherForm() }
  teacherDialogVisible.value = true
}

const saveTeacher = () => {
  if (!teacherForm.name.trim()) return
  if (editingTeacher.value) {
    Object.assign(editingTeacher.value, teacherForm)
  } else {
    store.teachers.push({ id: `t_${Date.now()}`, ...teacherForm })
  }
  teacherDialogVisible.value = false
  emit('dataChanged')
}

const deleteTeacher = (id: string) => {
  store.teachers = store.teachers.filter(t => t.id !== id)
  emit('dataChanged')
}

const openClassDialog = (item?: ClassGroup) => {
  if (item) { editingClass.value = item; Object.assign(classForm, item) }
  else { editingClass.value = null; resetClassForm() }
  classDialogVisible.value = true
}

const saveClass = () => {
  if (!classForm.name.trim()) return
  if (editingClass.value) {
    Object.assign(editingClass.value, classForm)
  } else {
    store.classGroups.push({ id: `cls_${Date.now()}`, ...classForm })
  }
  classDialogVisible.value = false
  emit('dataChanged')
}

const deleteClass = (id: string) => {
  store.classGroups = store.classGroups.filter(c => c.id !== id)
  emit('dataChanged')
}

const openClassroomDialog = (item?: Classroom) => {
  if (item) { editingClassroom.value = item; Object.assign(classroomForm, item) }
  else { editingClassroom.value = null; resetClassroomForm() }
  classroomDialogVisible.value = true
}

const saveClassroom = () => {
  if (!classroomForm.name.trim()) return
  if (editingClassroom.value) {
    Object.assign(editingClassroom.value, classroomForm)
  } else {
    store.classrooms.push({ id: `r_${Date.now()}`, ...classroomForm })
  }
  classroomDialogVisible.value = false
  emit('dataChanged')
}

const deleteClassroom = (id: string) => {
  store.classrooms = store.classrooms.filter(r => r.id !== id)
  emit('dataChanged')
}

const classStudents = computed(() => {
  if (!selectedClass.value) return []
  return getStudentsByClassId(selectedClass.value.id)
})

const filteredStudents = computed(() => {
  if (!studentSearchKeyword.value.trim()) return classStudents.value
  const keyword = studentSearchKeyword.value.trim().toLowerCase()
  return classStudents.value.filter(s => s.name.toLowerCase().includes(keyword))
})

const openStudentDrawer = (cls: ClassGroup) => {
  selectedClass.value = cls
  studentSearchKeyword.value = ''
  studentDrawerVisible.value = true
}

const getStudentCount = (classId: string) => {
  return getStudentCountByClassId(classId)
}
</script>

<template>
  <div class="resource-manage">
    <el-tabs v-model="activeTab" class="resource-tabs">
      <el-tab-pane label="课程" name="course">
        <div class="tab-header">
          <el-button type="primary" size="small" @click="openCourseDialog()">新增课程</el-button>
        </div>
        <el-table :data="store.courses" size="small" max-height="400">
          <el-table-column prop="name" label="课程名称" />
          <el-table-column prop="credit" label="学分" width="70" />
          <el-table-column prop="hours" label="学时" width="70" />
          <el-table-column label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.enabled ? 'success' : 'info'" size="small">{{ row.enabled ? '启用' : '停用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="{ row }">
              <el-button link size="small" type="primary" @click="openCourseDialog(row)">编辑</el-button>
              <el-button link size="small" :type="row.enabled ? 'warning' : 'success'" @click="toggleCourseEnabled(row)">
                {{ row.enabled ? '停用' : '启用' }}
              </el-button>
              <el-button link size="small" type="danger" @click="deleteCourse(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="教师" name="teacher">
        <div class="tab-header">
          <el-button type="primary" size="small" @click="openTeacherDialog()">新增教师</el-button>
        </div>
        <el-table :data="store.teachers" size="small" max-height="400">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="department" label="院系" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button link size="small" type="primary" @click="openTeacherDialog(row)">编辑</el-button>
              <el-button link size="small" type="danger" @click="deleteTeacher(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="班级" name="class">
        <div class="tab-header">
          <el-button type="primary" size="small" @click="openClassDialog()">新增班级</el-button>
        </div>
        <el-table :data="store.classGroups" size="small" max-height="400">
          <el-table-column prop="name" label="班级名称" />
          <el-table-column prop="grade" label="年级" width="70" />
          <el-table-column prop="department" label="院系" />
          <el-table-column label="学生人数" width="80">
            <template #default="{ row }">
              <span>{{ getStudentCount(row.id) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button link size="small" type="primary" @click="openStudentDrawer(row)">查看学生</el-button>
              <el-button link size="small" type="primary" @click="openClassDialog(row)">编辑</el-button>
              <el-button link size="small" type="danger" @click="deleteClass(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="教室" name="classroom">
        <div class="tab-header">
          <el-button type="primary" size="small" @click="openClassroomDialog()">新增教室</el-button>
        </div>
        <el-table :data="store.classrooms" size="small" max-height="400">
          <el-table-column prop="name" label="教室名称" />
          <el-table-column prop="building" label="教学楼" />
          <el-table-column prop="capacity" label="容量" width="70" />
          <el-table-column prop="floor" label="楼层" width="70" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button link size="small" type="primary" @click="openClassroomDialog(row)">编辑</el-button>
              <el-button link size="small" type="danger" @click="deleteClassroom(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="courseDialogVisible" title="课程" width="400px">
      <el-form label-width="60px">
        <el-form-item label="名称"><el-input v-model="courseForm.name" /></el-form-item>
        <el-form-item label="学分"><el-input-number v-model="courseForm.credit" :min="1" :max="10" /></el-form-item>
        <el-form-item label="学时"><el-input-number v-model="courseForm.hours" :min="8" :max="120" /></el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="courseForm.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="courseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCourse">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="teacherDialogVisible" title="教师" width="400px">
      <el-form label-width="60px">
        <el-form-item label="姓名"><el-input v-model="teacherForm.name" /></el-form-item>
        <el-form-item label="院系"><el-input v-model="teacherForm.department" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="teacherDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTeacher">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="classDialogVisible" title="班级" width="400px">
      <el-form label-width="60px">
        <el-form-item label="名称"><el-input v-model="classForm.name" /></el-form-item>
        <el-form-item label="年级"><el-input v-model="classForm.grade" /></el-form-item>
        <el-form-item label="院系"><el-input v-model="classForm.department" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="classDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveClass">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="classroomDialogVisible" title="教室" width="400px">
      <el-form label-width="60px">
        <el-form-item label="名称"><el-input v-model="classroomForm.name" /></el-form-item>
        <el-form-item label="教学楼"><el-input v-model="classroomForm.building" /></el-form-item>
        <el-form-item label="容量"><el-input-number v-model="classroomForm.capacity" :min="10" /></el-form-item>
        <el-form-item label="楼层"><el-input-number v-model="classroomForm.floor" :min="1" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="classroomDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveClassroom">保存</el-button>
      </template>
    </el-dialog>

    <el-drawer
      v-model="studentDrawerVisible"
      :title="selectedClass ? selectedClass.name + ' - 学生名单' : '学生名单'"
      direction="rtl"
      size="560px"
    >
      <div class="student-drawer">
        <div class="drawer-header">
          <el-input
            v-model="studentSearchKeyword"
            placeholder="请输入学生姓名搜索"
            clearable
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <span class="student-count">共 {{ filteredStudents.length }} 名学生</span>
        </div>

        <div v-if="classStudents.length === 0" class="empty-state">
          <el-empty description="暂无学生数据" />
        </div>

        <div v-else-if="filteredStudents.length === 0" class="empty-state">
          <el-empty description="未找到匹配的学生" />
        </div>

        <el-table
          v-else
          :data="filteredStudents"
          size="small"
          style="width: 100%"
        >
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="studentId" label="学号" width="120" />
          <el-table-column prop="phone" label="联系电话" width="140" />
          <el-table-column prop="accommodation" label="住宿信息" />
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.resource-manage {
  height: 100%;
}

.resource-tabs {
  height: 100%;
}

.tab-header {
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-end;
}

.student-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
}

.student-count {
  color: #909399;
  font-size: 14px;
  white-space: nowrap;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
