import type { CourseItem, UserRole } from '../types'

const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#8e44ad', '#16a085']

export const todayCourses: CourseItem[] = [
  {
    id: '1',
    name: '高等数学',
    teacher: '王教授',
    classroom: '教学楼A-301',
    time: '08:00 - 09:40',
    weekDay: 1,
    color: colors[0]
  },
  {
    id: '2',
    name: '大学英语',
    teacher: '李老师',
    classroom: '教学楼B-205',
    time: '10:00 - 11:40',
    weekDay: 1,
    color: colors[1]
  },
  {
    id: '3',
    name: '数据结构',
    teacher: '张教授',
    classroom: '实验楼C-102',
    time: '14:00 - 15:40',
    weekDay: 1,
    color: colors[2]
  },
  {
    id: '4',
    name: '计算机网络',
    teacher: '刘老师',
    classroom: '教学楼A-401',
    time: '16:00 - 17:40',
    weekDay: 1,
    color: colors[3]
  }
]

export const teacherTodayCourses: CourseItem[] = [
  {
    id: '1',
    name: '数据结构',
    teacher: '李老师',
    classroom: '实验楼C-102',
    time: '08:00 - 09:40',
    weekDay: 1,
    color: colors[2]
  },
  {
    id: '2',
    name: '算法设计',
    teacher: '李老师',
    classroom: '教学楼A-305',
    time: '10:00 - 11:40',
    weekDay: 1,
    color: colors[5]
  },
  {
    id: '3',
    name: '毕业设计指导',
    teacher: '李老师',
    classroom: '会议室B-201',
    time: '14:00 - 16:00',
    weekDay: 1,
    color: colors[6]
  }
]

export const adminTodayCourses: CourseItem[] = [
  {
    id: '1',
    name: '校务会议',
    teacher: '校领导',
    classroom: '行政楼会议室',
    time: '09:00 - 11:00',
    weekDay: 1,
    color: colors[0]
  },
  {
    id: '2',
    name: '系统巡检',
    teacher: '信息中心',
    classroom: '数据中心',
    time: '14:00 - 15:30',
    weekDay: 1,
    color: colors[4]
  }
]

export function getTodayCourses(role: UserRole): CourseItem[] {
  switch (role) {
    case 'admin':
      return adminTodayCourses
    case 'teacher':
      return teacherTodayCourses
    case 'student':
    default:
      return todayCourses
  }
}
