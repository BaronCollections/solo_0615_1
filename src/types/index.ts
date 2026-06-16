export type UserRole = 'admin' | 'teacher' | 'student'

export interface MockUser {
  username: string
  password: string
  name: string
  role: UserRole
  roleLabel: string
  avatar?: string
}

export interface MenuItem {
  key: string
  title: string
  icon: string
  roles: UserRole[]
  children?: MenuItem[]
}

export interface CourseItem {
  id: string
  name: string
  teacher: string
  classroom: string
  time: string
  weekDay: number
  color: string
}

export interface TaskItem {
  id: string
  title: string
  type: string
  priority: 'high' | 'medium' | 'low'
  deadline: string
  status: 'pending' | 'processing' | 'done'
}

export interface NoticeItem {
  id: string
  title: string
  content: string
  publisher: string
  publishTime: string
  type: string
}

export interface AttendanceData {
  total: number
  present: number
  absent: number
  late: number
  leave: number
  rate: string
}

export interface SystemStatus {
  cpu: string
  memory: string
  disk: string
  uptime: string
  onlineUsers: number
  status: 'normal' | 'warning' | 'error'
}
