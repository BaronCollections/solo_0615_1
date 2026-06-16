import { reactive } from 'vue'
import type { Course, Teacher, ClassGroup, Classroom, Schedule, Student } from '../mock/scheduling'
import {
  mockCourses,
  mockTeachers,
  mockClassGroups,
  mockClassrooms,
  mockSchedules,
  mockStudents,
  getCourseName as _getCourseName,
  getTeacherName as _getTeacherName,
  getClassGroupName as _getClassGroupName,
  getClassroomName as _getClassroomName,
  getStudentsByClassId as _getStudentsByClassId,
  getStudentCountByClassId as _getStudentCountByClassId,
} from '../mock/scheduling'

export const store = reactive({
  courses: [...mockCourses] as Course[],
  teachers: [...mockTeachers] as Teacher[],
  classGroups: [...mockClassGroups] as ClassGroup[],
  classrooms: [...mockClassrooms] as Classroom[],
  schedules: [...mockSchedules] as Schedule[],
  students: [...mockStudents] as Student[],
})

export function getCourseName(id: string): string {
  return store.courses.find(c => c.id === id)?.name ?? ''
}

export function getTeacherName(id: string): string {
  return store.teachers.find(t => t.id === id)?.name ?? ''
}

export function getClassGroupName(id: string): string {
  return store.classGroups.find(c => c.id === id)?.name ?? ''
}

export function getClassroomName(id: string): string {
  return store.classrooms.find(r => r.id === id)?.name ?? ''
}

export function getBuildingList(): string[] {
  return [...new Set(store.classrooms.map(r => r.building))]
}

export function getStudentsByClassId(classId: string): Student[] {
  return store.students.filter(s => s.classId === classId)
}

export function getStudentCountByClassId(classId: string): number {
  return store.students.filter(s => s.classId === classId).length
}
