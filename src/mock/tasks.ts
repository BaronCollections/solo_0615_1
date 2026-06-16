import type { TaskItem, UserRole } from '../types'

export const studentTasks: TaskItem[] = [
  {
    id: '1',
    title: '完成高等数学第三章作业',
    type: '作业',
    priority: 'high',
    deadline: '今天 23:59',
    status: 'pending'
  },
  {
    id: '2',
    title: '数据结构课程设计报告',
    type: '报告',
    priority: 'high',
    deadline: '明天 18:00',
    status: 'processing'
  },
  {
    id: '3',
    title: '英语四级报名',
    type: '报名',
    priority: 'medium',
    deadline: '本周五',
    status: 'pending'
  },
  {
    id: '4',
    title: '图书馆书籍续借',
    type: '其他',
    priority: 'low',
    deadline: '下周一',
    status: 'pending'
  },
  {
    id: '5',
    title: '体育课选课确认',
    type: '选课',
    priority: 'medium',
    deadline: '本周三',
    status: 'done'
  }
]

export const teacherTasks: TaskItem[] = [
  {
    id: '1',
    title: '批改数据结构作业',
    type: '批改',
    priority: 'high',
    deadline: '今天 18:00',
    status: 'processing'
  },
  {
    id: '2',
    title: '准备下周课件',
    type: '备课',
    priority: 'medium',
    deadline: '本周五',
    status: 'pending'
  },
  {
    id: '3',
    title: '期中成绩录入',
    type: '成绩',
    priority: 'high',
    deadline: '下周一',
    status: 'pending'
  },
  {
    id: '4',
    title: '毕业设计开题评审',
    type: '评审',
    priority: 'medium',
    deadline: '本周四',
    status: 'pending'
  }
]

export const adminTasks: TaskItem[] = [
  {
    id: '1',
    title: '新学期选课系统配置',
    type: '系统',
    priority: 'high',
    deadline: '今天 17:00',
    status: 'processing'
  },
  {
    id: '2',
    title: '教师招聘面试安排',
    type: '人事',
    priority: 'high',
    deadline: '明天 09:00',
    status: 'pending'
  },
  {
    id: '3',
    title: '校园安全检查报告',
    type: '安全',
    priority: 'medium',
    deadline: '本周五',
    status: 'pending'
  },
  {
    id: '4',
    title: '系统备份策略优化',
    type: '系统',
    priority: 'low',
    deadline: '下周三',
    status: 'pending'
  },
  {
    id: '5',
    title: '年度预算编制会议',
    type: '会议',
    priority: 'high',
    deadline: '下周一',
    status: 'pending'
  }
]

export function getTasks(role: UserRole): TaskItem[] {
  switch (role) {
    case 'admin':
      return adminTasks
    case 'teacher':
      return teacherTasks
    case 'student':
    default:
      return studentTasks
  }
}
