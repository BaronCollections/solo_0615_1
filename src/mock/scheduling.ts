export interface Course {
  id: string
  name: string
  credit: number
  hours: number
}

export interface Teacher {
  id: string
  name: string
  department: string
}

export interface ClassGroup {
  id: string
  name: string
  grade: string
  department: string
}

export interface Classroom {
  id: string
  name: string
  building: string
  capacity: number
  floor: number
}

export interface Schedule {
  id: string
  courseId: string
  teacherId: string
  classId: string
  classroomId: string
  weekStart: number
  weekEnd: number
  dayOfWeek: number
  periodStart: number
  periodEnd: number
}

export const mockCourses: Course[] = [
  { id: 'c1', name: '高等数学', credit: 4, hours: 64 },
  { id: 'c2', name: '大学英语', credit: 3, hours: 48 },
  { id: 'c3', name: '数据结构', credit: 3, hours: 48 },
  { id: 'c4', name: '操作系统', credit: 3, hours: 48 },
  { id: 'c5', name: '计算机网络', credit: 3, hours: 48 },
  { id: 'c6', name: '线性代数', credit: 3, hours: 48 },
  { id: 'c7', name: '概率论与数理统计', credit: 3, hours: 48 },
  { id: 'c8', name: '离散数学', credit: 3, hours: 48 },
  { id: 'c9', name: '数据库原理', credit: 3, hours: 48 },
  { id: 'c10', name: '软件工程', credit: 2, hours: 32 },
]

export const mockTeachers: Teacher[] = [
  { id: 't1', name: '王建国', department: '数学学院' },
  { id: 't2', name: '李秀英', department: '外语学院' },
  { id: 't3', name: '张伟明', department: '计算机学院' },
  { id: 't4', name: '陈志强', department: '计算机学院' },
  { id: 't5', name: '刘美华', department: '数学学院' },
  { id: 't6', name: '赵文博', department: '计算机学院' },
  { id: 't7', name: '孙丽萍', department: '数学学院' },
  { id: 't8', name: '周明远', department: '外语学院' },
]

export const mockClassGroups: ClassGroup[] = [
  { id: 'cls1', name: '计科2301班', grade: '2023', department: '计算机学院' },
  { id: 'cls2', name: '计科2302班', grade: '2023', department: '计算机学院' },
  { id: 'cls3', name: '软工2301班', grade: '2023', department: '计算机学院' },
  { id: 'cls4', name: '数学2301班', grade: '2023', department: '数学学院' },
  { id: 'cls5', name: '数学2302班', grade: '2023', department: '数学学院' },
  { id: 'cls6', name: '计科2401班', grade: '2024', department: '计算机学院' },
]

export const mockClassrooms: Classroom[] = [
  { id: 'r1', name: 'A101', building: 'A栋教学楼', capacity: 60, floor: 1 },
  { id: 'r2', name: 'A102', building: 'A栋教学楼', capacity: 60, floor: 1 },
  { id: 'r3', name: 'A201', building: 'A栋教学楼', capacity: 80, floor: 2 },
  { id: 'r4', name: 'A202', building: 'A栋教学楼', capacity: 80, floor: 2 },
  { id: 'r5', name: 'A301', building: 'A栋教学楼', capacity: 120, floor: 3 },
  { id: 'r6', name: 'B101', building: 'B栋教学楼', capacity: 60, floor: 1 },
  { id: 'r7', name: 'B102', building: 'B栋教学楼', capacity: 60, floor: 1 },
  { id: 'r8', name: 'B201', building: 'B栋教学楼', capacity: 100, floor: 2 },
  { id: 'r9', name: 'B202', building: 'B栋教学楼', capacity: 100, floor: 2 },
  { id: 'r10', name: 'B301', building: 'B栋教学楼', capacity: 150, floor: 3 },
]

export const mockSchedules: Schedule[] = [
  { id: 's1', courseId: 'c1', teacherId: 't1', classId: 'cls1', classroomId: 'r1', weekStart: 1, weekEnd: 16, dayOfWeek: 1, periodStart: 1, periodEnd: 2 },
  { id: 's2', courseId: 'c2', teacherId: 't2', classId: 'cls1', classroomId: 'r6', weekStart: 1, weekEnd: 16, dayOfWeek: 2, periodStart: 1, periodEnd: 2 },
  { id: 's3', courseId: 'c3', teacherId: 't3', classId: 'cls1', classroomId: 'r3', weekStart: 1, weekEnd: 16, dayOfWeek: 3, periodStart: 3, periodEnd: 4 },
  { id: 's4', courseId: 'c4', teacherId: 't4', classId: 'cls2', classroomId: 'r2', weekStart: 1, weekEnd: 16, dayOfWeek: 1, periodStart: 1, periodEnd: 2 },
  { id: 's5', courseId: 'c5', teacherId: 't6', classId: 'cls2', classroomId: 'r7', weekStart: 1, weekEnd: 16, dayOfWeek: 2, periodStart: 3, periodEnd: 4 },
  { id: 's6', courseId: 'c6', teacherId: 't5', classId: 'cls4', classroomId: 'r1', weekStart: 1, weekEnd: 16, dayOfWeek: 3, periodStart: 1, periodEnd: 2 },
  { id: 's7', courseId: 'c7', teacherId: 't7', classId: 'cls5', classroomId: 'r6', weekStart: 1, weekEnd: 16, dayOfWeek: 4, periodStart: 1, periodEnd: 2 },
  { id: 's8', courseId: 'c8', teacherId: 't3', classId: 'cls3', classroomId: 'r8', weekStart: 1, weekEnd: 16, dayOfWeek: 1, periodStart: 3, periodEnd: 4 },
  { id: 's9', courseId: 'c9', teacherId: 't4', classId: 'cls6', classroomId: 'r9', weekStart: 1, weekEnd: 16, dayOfWeek: 5, periodStart: 1, periodEnd: 2 },
  { id: 's10', courseId: 'c10', teacherId: 't6', classId: 'cls3', classroomId: 'r4', weekStart: 1, weekEnd: 16, dayOfWeek: 4, periodStart: 3, periodEnd: 4 },
  { id: 's11', courseId: 'c5', teacherId: 't3', classId: 'cls2', classroomId: 'r1', weekStart: 1, weekEnd: 16, dayOfWeek: 1, periodStart: 1, periodEnd: 2 },
  { id: 's12', courseId: 'c6', teacherId: 't5', classId: 'cls4', classroomId: 'r8', weekStart: 1, weekEnd: 16, dayOfWeek: 3, periodStart: 1, periodEnd: 2 },
]

export const DAY_LABELS = ['周一', '周二', '周三', '周四', '周五']
export const PERIOD_LABELS = [
  '第1-2节',
  '第3-4节',
  '第5-6节',
  '第7-8节',
]

export function getCourseName(id: string): string {
  return mockCourses.find(c => c.id === id)?.name ?? ''
}

export function getTeacherName(id: string): string {
  return mockTeachers.find(t => t.id === id)?.name ?? ''
}

export function getClassGroupName(id: string): string {
  return mockClassGroups.find(c => c.id === id)?.name ?? ''
}

export function getClassroomName(id: string): string {
  return mockClassrooms.find(r => r.id === id)?.name ?? ''
}

export const BUILDINGS = [...new Set(mockClassrooms.map(r => r.building))]
