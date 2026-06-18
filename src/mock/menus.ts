import type { MenuItem, UserRole } from '../types'

export const menuList: MenuItem[] = [
  {
    key: 'dashboard',
    title: '工作台',
    icon: 'HomeFilled',
    roles: ['admin', 'teacher', 'student']
  },
  {
    key: 'course',
    title: '课程管理',
    icon: 'Reading',
    roles: ['admin', 'teacher'],
    children: [
      {
        key: 'course-list',
        title: '课程列表',
        icon: 'List',
        roles: ['admin', 'teacher']
      },
      {
        key: 'course-schedule',
        title: '课程表',
        icon: 'Calendar',
        roles: ['admin', 'teacher', 'student']
      }
    ]
  },
  {
    key: 'student',
    title: '学生管理',
    icon: 'User',
    roles: ['admin', 'teacher'],
    children: [
      {
        key: 'student-list',
        title: '学生列表',
        icon: 'UserFilled',
        roles: ['admin', 'teacher']
      },
      {
        key: 'student-score',
        title: '成绩管理',
        icon: 'Trophy',
        roles: ['admin', 'teacher']
      }
    ]
  },
  {
    key: 'teacher',
    title: '教师管理',
    icon: 'Avatar',
    roles: ['admin'],
    children: [
      {
        key: 'teacher-list',
        title: '教师列表',
        icon: 'UserFilled',
        roles: ['admin']
      },
      {
        key: 'teacher-evaluate',
        title: '教师评价',
        icon: 'Star',
        roles: ['admin', 'student']
      }
    ]
  },
  {
    key: 'scheduling',
    title: '排课管理',
    icon: 'Calendar',
    roles: ['admin', 'teacher'],
    children: [
      {
        key: 'course-scheduling',
        title: '课程排课',
        icon: 'EditCalendar',
        roles: ['admin', 'teacher']
      }
    ]
  },
  {
    key: 'attendance',
    title: '考勤管理',
    icon: 'Clock',
    roles: ['admin', 'teacher', 'student']
  },
  {
    key: 'notice',
    title: '校园公告',
    icon: 'Bell',
    roles: ['admin', 'teacher', 'student']
  },
  {
    key: 'system',
    title: '系统管理',
    icon: 'Setting',
    roles: ['admin'],
    children: [
      {
        key: 'system-user',
        title: '用户管理',
        icon: 'User',
        roles: ['admin']
      },
      {
        key: 'system-role',
        title: '角色权限',
        icon: 'Lock',
        roles: ['admin']
      },
      {
        key: 'system-log',
        title: '操作日志',
        icon: 'Document',
        roles: ['admin']
      }
    ]
  }
]

export function getMenusByRole(role: UserRole): MenuItem[] {
  const filterMenus = (menus: MenuItem[]): MenuItem[] => {
    return menus
      .filter((menu) => menu.roles.includes(role))
      .map((menu) => ({
        ...menu,
        children: menu.children ? filterMenus(menu.children) : undefined
      }))
  }
  return filterMenus(menuList)
}
