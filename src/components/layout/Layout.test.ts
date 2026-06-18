/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import Layout from './Layout.vue'

vi.mock('../../stores/auth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@element-plus/icons-vue', () => ({
  School: { template: '<div />' },
  HomeFilled: { template: '<div />' },
  Reading: { template: '<div />' },
  List: { template: '<div />' },
  Calendar: { template: '<div />' },
  User: { template: '<div />' },
  UserFilled: { template: '<div />' },
  Trophy: { template: '<div />' },
  Avatar: { template: '<div />' },
  Star: { template: '<div />' },
  EditCalendar: { template: '<div />' },
  Clock: { template: '<div />' },
  Bell: { template: '<div />' },
  Setting: { template: '<div />' },
  Lock: { template: '<div />' },
  Document: { template: '<div />' },
}))

import { useAuth } from '../../stores/auth'

const mockAdminUser = {
  username: 'admin',
  password: 'admin123',
  name: '系统管理员',
  role: 'admin' as const,
  roleLabel: '管理员',
}

const globalComponents = {
  'el-icon': { template: '<i class="el-icon"><slot /></i>' },
  'el-menu': {
    props: ['defaultActive'],
    template: `
      <nav class="el-menu" :data-default-active="defaultActive">
        <slot />
      </nav>
    `,
  },
  'el-sub-menu': {
    props: ['index'],
    template: `
      <div class="el-sub-menu" :data-index="index">
        <slot name="title" />
        <div class="el-sub-menu-children">
          <slot />
        </div>
      </div>
    `,
  },
  'el-menu-item': {
    props: ['index'],
    emits: ['click'],
    template: `
      <div
        class="el-menu-item"
        :data-index="index"
        @click="$emit('click')"
      >
        <slot />
      </div>
    `,
  },
  'el-tag': {
    props: ['type', 'size', 'effect'],
    template: '<span class="el-tag"><slot /></span>',
  },
  'el-button': {
    props: ['type', 'size', 'link', 'effect'],
    emits: ['click'],
    template: `
      <button
        class="el-button"
        :data-type="type"
        :data-link="link"
        @click="$emit('click')"
      >
        <slot />
      </button>
    `,
  },
  'el-message-box': { template: '<div />' },
  'el-message': { template: '<div />' },
  'el-drawer': {
    props: ['title', 'size', 'direction'],
    template: '<div class="el-drawer"><slot /></div>',
  },
}

describe('侧边栏排课菜单渲染 - 回归测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuth as any).mockReturnValue({
      currentUser: ref(mockAdminUser),
      isLoggedIn: computed(() => true),
      userRole: computed(() => 'admin'),
      userName: computed(() => '系统管理员'),
      login: vi.fn(),
      logout: vi.fn(),
    })
  })

  const mountLayout = () => {
    return mount(Layout, {
      global: {
        components: globalComponents,
        stubs: {
          Header: {
            props: ['pageTitle'],
            template: '<header class="layout-header" :data-title="pageTitle">{{ pageTitle }}</header>',
          },
          Sidebar: false,
          TodayCourses: { template: '<div class="today-courses">今日课程</div>' },
          PendingTasks: { template: '<div class="pending-tasks">待办事项</div>' },
          CampusNotice: { template: '<div class="campus-notice">校园公告</div>' },
          AttendanceOverview: { template: '<div class="attendance-overview">考勤概览</div>' },
          SystemStatus: { template: '<div class="system-status">系统状态</div>' },
          ScheduleFilter: { template: '<div class="schedule-filter">排课筛选</div>' },
          ScheduleTable: { template: '<table class="schedule-table"><tr><td>排课表格</td></tr></table>' },
          ScheduleForm: { template: '<div class="schedule-form">排课表单</div>' },
          ConflictPanel: { template: '<div class="conflict-panel">冲突面板</div>' },
          ResourceManage: { template: '<div class="resource-manage">资源管理</div>' },
        },
      },
    })
  }

  it('登录管理员后默认显示工作台首页看板', () => {
    const wrapper = mountLayout()

    expect(wrapper.find('.layout-header').attributes('data-title')).toBe('工作台')
    expect(wrapper.find('.dashboard').exists()).toBe(true)
    expect(wrapper.find('.welcome-title').exists()).toBe(true)
    expect(wrapper.find('.dashboard-grid').exists()).toBe(true)
    expect(wrapper.find('.schedule-table').exists()).toBe(false)
  })

  it('点击"排课管理/课程排课"后，内容区应出现排课表格而不是首页看板', async () => {
    const wrapper = mountLayout()

    expect(wrapper.find('.layout-header').attributes('data-title')).toBe('工作台')
    expect(wrapper.find('.dashboard').exists()).toBe(true)
    expect(wrapper.find('.schedule-table').exists()).toBe(false)

    const sidebarComp = wrapper.findComponent({ name: 'Sidebar' })
    const sidebarVm = sidebarComp.vm as any

    sidebarVm.$emit('update:activeMenu', 'course-scheduling')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.layout-header').attributes('data-title')).toBe('课程排课')
    expect(wrapper.find('.dashboard').exists()).toBe(false)
    expect(wrapper.find('.scheduling-page').exists()).toBe(true)
    expect(wrapper.find('.schedule-table').exists()).toBe(true)
    expect(wrapper.find('.conflict-panel').exists()).toBe(true)
    expect(wrapper.find('.schedule-filter').exists()).toBe(true)
  })
})
