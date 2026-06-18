export interface Course {
  id: string
  name: string
  credit: number
  hours: number
  enabled: boolean
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

export interface Student {
  id: string
  name: string
  studentId: string
  phone: string
  accommodation: string
  classId: string
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
  { id: 'c1', name: '高等数学', credit: 4, hours: 64, enabled: true },
  { id: 'c2', name: '大学英语', credit: 3, hours: 48, enabled: true },
  { id: 'c3', name: '数据结构', credit: 3, hours: 48, enabled: true },
  { id: 'c4', name: '操作系统', credit: 3, hours: 48, enabled: true },
  { id: 'c5', name: '计算机网络', credit: 3, hours: 48, enabled: true },
  { id: 'c6', name: '线性代数', credit: 3, hours: 48, enabled: true },
  { id: 'c7', name: '概率论与数理统计', credit: 3, hours: 48, enabled: true },
  { id: 'c8', name: '离散数学', credit: 3, hours: 48, enabled: true },
  { id: 'c9', name: '数据库原理', credit: 3, hours: 48, enabled: true },
  { id: 'c10', name: '软件工程', credit: 2, hours: 32, enabled: true },
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

export const mockStudents: Student[] = [
  { id: 'stu1', name: '张三', studentId: '20230101', phone: '13800138001', accommodation: '1号楼101室', classId: 'cls1' },
  { id: 'stu2', name: '李四', studentId: '20230102', phone: '13800138002', accommodation: '1号楼101室', classId: 'cls1' },
  { id: 'stu3', name: '王五', studentId: '20230103', phone: '13800138003', accommodation: '1号楼102室', classId: 'cls1' },
  { id: 'stu4', name: '赵六', studentId: '20230104', phone: '13800138004', accommodation: '1号楼102室', classId: 'cls1' },
  { id: 'stu5', name: '钱七', studentId: '20230105', phone: '13800138005', accommodation: '1号楼103室', classId: 'cls1' },
  { id: 'stu6', name: '孙八', studentId: '20230106', phone: '13800138006', accommodation: '1号楼103室', classId: 'cls1' },
  { id: 'stu7', name: '周九', studentId: '20230107', phone: '13800138007', accommodation: '1号楼104室', classId: 'cls1' },
  { id: 'stu8', name: '吴十', studentId: '20230108', phone: '13800138008', accommodation: '1号楼104室', classId: 'cls1' },
  { id: 'stu9', name: '郑一', studentId: '20230109', phone: '13800138009', accommodation: '1号楼105室', classId: 'cls1' },
  { id: 'stu10', name: '陈明', studentId: '20230110', phone: '13800138010', accommodation: '1号楼105室', classId: 'cls1' },
  { id: 'stu11', name: '杨华', studentId: '20230201', phone: '13800138011', accommodation: '2号楼201室', classId: 'cls2' },
  { id: 'stu12', name: '林峰', studentId: '20230202', phone: '13800138012', accommodation: '2号楼201室', classId: 'cls2' },
  { id: 'stu13', name: '黄强', studentId: '20230203', phone: '13800138013', accommodation: '2号楼202室', classId: 'cls2' },
  { id: 'stu14', name: '刘敏', studentId: '20230204', phone: '13800138014', accommodation: '2号楼202室', classId: 'cls2' },
  { id: 'stu15', name: '徐静', studentId: '20230205', phone: '13800138015', accommodation: '2号楼203室', classId: 'cls2' },
  { id: 'stu16', name: '朱涛', studentId: '20230206', phone: '13800138016', accommodation: '2号楼203室', classId: 'cls2' },
  { id: 'stu17', name: '马超', studentId: '20230207', phone: '13800138017', accommodation: '2号楼204室', classId: 'cls2' },
  { id: 'stu18', name: '胡蝶', studentId: '20230208', phone: '13800138018', accommodation: '2号楼204室', classId: 'cls2' },
  { id: 'stu19', name: '郭鹏', studentId: '20230301', phone: '13800138019', accommodation: '3号楼301室', classId: 'cls3' },
  { id: 'stu20', name: '何莉', studentId: '20230302', phone: '13800138020', accommodation: '3号楼301室', classId: 'cls3' },
  { id: 'stu21', name: '罗军', studentId: '20230303', phone: '13800138021', accommodation: '3号楼302室', classId: 'cls3' },
  { id: 'stu22', name: '梁雪', studentId: '20230304', phone: '13800138022', accommodation: '3号楼302室', classId: 'cls3' },
  { id: 'stu23', name: '宋雨', studentId: '20230305', phone: '13800138023', accommodation: '3号楼303室', classId: 'cls3' },
  { id: 'stu24', name: '高飞', studentId: '20230401', phone: '13800138024', accommodation: '4号楼401室', classId: 'cls4' },
  { id: 'stu25', name: '夏雪', studentId: '20230402', phone: '13800138025', accommodation: '4号楼401室', classId: 'cls4' },
  { id: 'stu26', name: '蔡明', studentId: '20230403', phone: '13800138026', accommodation: '4号楼402室', classId: 'cls4' },
  { id: 'stu27', name: '潘婷', studentId: '20230501', phone: '13800138027', accommodation: '5号楼501室', classId: 'cls5' },
  { id: 'stu28', name: '田野', studentId: '20230502', phone: '13800138028', accommodation: '5号楼501室', classId: 'cls5' },
]

export function getStudentsByClassId(classId: string): Student[] {
  return mockStudents.filter(s => s.classId === classId)
}

export function getStudentCountByClassId(classId: string): number {
  return mockStudents.filter(s => s.classId === classId).length
}

export const BUILDINGS = [...new Set(mockClassrooms.map(r => r.building))]
