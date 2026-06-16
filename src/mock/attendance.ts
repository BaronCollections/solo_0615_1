import type { AttendanceData, UserRole } from '../types'

export const studentAttendance: AttendanceData = {
  total: 32,
  present: 28,
  absent: 1,
  late: 2,
  leave: 1,
  rate: '87.5%'
}

export const teacherAttendance: AttendanceData = {
  total: 120,
  present: 112,
  absent: 3,
  late: 3,
  leave: 2,
  rate: '93.3%'
}

export const adminAttendance: AttendanceData = {
  total: 1560,
  present: 1482,
  absent: 35,
  late: 28,
  leave: 15,
  rate: '95.0%'
}

export function getAttendance(role: UserRole): AttendanceData {
  switch (role) {
    case 'admin':
      return adminAttendance
    case 'teacher':
      return teacherAttendance
    case 'student':
    default:
      return studentAttendance
  }
}
