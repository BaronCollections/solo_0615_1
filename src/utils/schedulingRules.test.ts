import { describe, it, expect } from 'vitest'
import type { Schedule, Course } from '../mock/scheduling'
import {
  filterEnabledCourses,
  excludeSelfFromSchedules,
  detectClassroomConflict,
  checkCourseEnabled,
  validateSchedulingRules,
  weeksOverlap,
  periodsOverlap,
} from './schedulingRules'

const makeCourse = (id: string, enabled = true): Course => ({
  id,
  name: `课程${id}`,
  credit: 3,
  hours: 48,
  enabled,
})

const makeSchedule = (overrides: Partial<Schedule> = {}): Schedule => ({
  id: 's1',
  courseId: 'c1',
  teacherId: 't1',
  classId: 'cls1',
  classroomId: 'r1',
  weekStart: 1,
  weekEnd: 16,
  dayOfWeek: 1,
  periodStart: 1,
  periodEnd: 2,
  ...overrides,
})

describe('weeksOverlap / periodsOverlap', () => {
  it('完全重叠应返回 true', () => {
    expect(weeksOverlap(1, 16, 1, 16)).toBe(true)
    expect(periodsOverlap(1, 2, 1, 2)).toBe(true)
  })
  it('部分重叠应返回 true', () => {
    expect(weeksOverlap(1, 8, 5, 12)).toBe(true)
    expect(periodsOverlap(1, 4, 3, 6)).toBe(true)
  })
  it('完全不重叠应返回 false', () => {
    expect(weeksOverlap(1, 8, 9, 16)).toBe(false)
    expect(periodsOverlap(1, 2, 3, 4)).toBe(false)
  })
})

describe('filterEnabledCourses - 启用课程过滤', () => {
  it('应只返回 enabled 为 true 的课程', () => {
    const courses: Course[] = [
      makeCourse('c1', true),
      makeCourse('c2', false),
      makeCourse('c3', true),
      makeCourse('c4', false),
    ]
    const result = filterEnabledCourses(courses)
    expect(result).toHaveLength(2)
    expect(result.map(c => c.id)).toEqual(['c1', 'c3'])
  })

  it('全部启用时返回全部课程', () => {
    const courses: Course[] = [makeCourse('c1'), makeCourse('c2')]
    expect(filterEnabledCourses(courses)).toHaveLength(2)
  })

  it('全部禁用时返回空数组', () => {
    const courses: Course[] = [makeCourse('c1', false), makeCourse('c2', false)]
    expect(filterEnabledCourses(courses)).toHaveLength(0)
  })
})

describe('excludeSelfFromSchedules - 编辑排除自身', () => {
  it('有 excludeId 时应过滤掉对应 id 的排课', () => {
    const schedules: Schedule[] = [
      makeSchedule({ id: 's1' }),
      makeSchedule({ id: 's2' }),
      makeSchedule({ id: 's3' }),
    ]
    const result = excludeSelfFromSchedules(schedules, 's2')
    expect(result.map(s => s.id)).toEqual(['s1', 's3'])
  })

  it('excludeId 为 undefined 时应原样返回', () => {
    const schedules: Schedule[] = [makeSchedule({ id: 's1' }), makeSchedule({ id: 's2' })]
    const result = excludeSelfFromSchedules(schedules)
    expect(result).toHaveLength(2)
  })

  it('excludeId 不存在时应原样返回', () => {
    const schedules: Schedule[] = [makeSchedule({ id: 's1' })]
    const result = excludeSelfFromSchedules(schedules, 'not-exist')
    expect(result).toHaveLength(1)
  })
})

describe('detectClassroomConflict - 教室同时间冲突', () => {
  it('同一教室同一时间段重复排课，应返回教室冲突', () => {
    const existing = makeSchedule({ id: 'existing-1', classroomId: 'r1' })
    const newSchedule = makeSchedule({
      id: 'new-1',
      courseId: 'c2',
      teacherId: 't2',
      classId: 'cls2',
      classroomId: 'r1',
    })
    const conflicts = detectClassroomConflict(newSchedule, [existing])
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0].type).toBe('classroom')
    expect(conflicts[0].reason).toContain('教室')
    expect(conflicts[0].reason).toContain('A101')
    expect(conflicts[0].reason).toContain('已被')
    expect(conflicts[0].reason).toContain('占用')
  })

  it('同一教室但不同天，不应返回冲突', () => {
    const existing = makeSchedule({ id: 'e1', classroomId: 'r1', dayOfWeek: 1 })
    const newSchedule = makeSchedule({ id: 'n1', classroomId: 'r1', dayOfWeek: 2 })
    expect(detectClassroomConflict(newSchedule, [existing])).toHaveLength(0)
  })

  it('同一教室同一天但不同节次，不应返回冲突', () => {
    const existing = makeSchedule({ id: 'e1', classroomId: 'r1', periodStart: 1, periodEnd: 2 })
    const newSchedule = makeSchedule({ id: 'n1', classroomId: 'r1', periodStart: 3, periodEnd: 4 })
    expect(detectClassroomConflict(newSchedule, [existing])).toHaveLength(0)
  })

  it('同一教室同一节次但不同周次不重叠，不应返回冲突', () => {
    const existing = makeSchedule({ id: 'e1', classroomId: 'r1', weekStart: 1, weekEnd: 8 })
    const newSchedule = makeSchedule({ id: 'n1', classroomId: 'r1', weekStart: 9, weekEnd: 16 })
    expect(detectClassroomConflict(newSchedule, [existing])).toHaveLength(0)
  })

  it('同一教室部分周次重叠，应返回冲突', () => {
    const existing = makeSchedule({ id: 'e1', classroomId: 'r1', weekStart: 1, weekEnd: 8 })
    const newSchedule = makeSchedule({ id: 'n1', classroomId: 'r1', weekStart: 5, weekEnd: 12 })
    expect(detectClassroomConflict(newSchedule, [existing])).toHaveLength(1)
  })

  it('排除自身ID时，不应检测到冲突', () => {
    const existing = makeSchedule({ id: 's1', classroomId: 'r1' })
    const newSchedule = makeSchedule({ id: 's1', classroomId: 'r1', courseId: 'c2' })
    expect(detectClassroomConflict(newSchedule, [existing], 's1')).toHaveLength(0)
  })

  it('不同教室同一时间，不应返回冲突', () => {
    const existing = makeSchedule({ id: 'e1', classroomId: 'r1' })
    const newSchedule = makeSchedule({ id: 'n1', classroomId: 'r2' })
    expect(detectClassroomConflict(newSchedule, [existing])).toHaveLength(0)
  })
})

describe('checkCourseEnabled - 课程启用检查', () => {
  it('课程存在且启用时应返回 valid true', () => {
    const courses = [makeCourse('c1', true)]
    const result = checkCourseEnabled('c1', courses)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.courseName).toBe('课程c1')
  })

  it('课程存在但禁用时应返回 valid false 并包含错误信息', () => {
    const courses = [makeCourse('c1', false)]
    const result = checkCourseEnabled('c1', courses)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('已停用')
    expect(result.error).toContain('课程c1')
  })

  it('课程不存在时应返回 valid false', () => {
    const courses: Course[] = []
    const result = checkCourseEnabled('not-exist', courses)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('不存在')
  })
})

describe('validateSchedulingRules - 规则统一验证入口', () => {
  const courses: Course[] = [
    makeCourse('c1', true),
    makeCourse('c2', false),
  ]

  it('课程启用且无教室冲突时，passed 应为 true', () => {
    const schedule = makeSchedule({ id: 'n1', courseId: 'c1', classroomId: 'r1' })
    const existing = [makeSchedule({ id: 'e1', courseId: 'c1', classroomId: 'r2' })]
    const result = validateSchedulingRules(schedule, courses, existing)
    expect(result.passed).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.classroomConflicts).toHaveLength(0)
    expect(result.disabledCourseError).toBeUndefined()
  })

  it('课程禁用时，passed 应为 false 并包含停用错误', () => {
    const schedule = makeSchedule({ id: 'n1', courseId: 'c2', classroomId: 'r1' })
    const result = validateSchedulingRules(schedule, courses, [])
    expect(result.passed).toBe(false)
    expect(result.disabledCourseError).toBeDefined()
    expect(result.errors.some(e => e.includes('停用'))).toBe(true)
  })

  it('存在教室冲突时，passed 应为 false 并包含冲突', () => {
    const schedule = makeSchedule({ id: 'n1', courseId: 'c1', classroomId: 'r1' })
    const existing = [makeSchedule({ id: 'e1', courseId: 'c1', classroomId: 'r1' })]
    const result = validateSchedulingRules(schedule, courses, existing)
    expect(result.passed).toBe(false)
    expect(result.classroomConflicts).toHaveLength(1)
    expect(result.errors.some(e => e.includes('教室'))).toBe(true)
  })

  it('课程禁用且有教室冲突时，应同时包含两个错误', () => {
    const schedule = makeSchedule({ id: 'n1', courseId: 'c2', classroomId: 'r1' })
    const existing = [makeSchedule({ id: 'e1', courseId: 'c1', classroomId: 'r1' })]
    const result = validateSchedulingRules(schedule, courses, existing)
    expect(result.passed).toBe(false)
    expect(result.disabledCourseError).toBeDefined()
    expect(result.classroomConflicts).toHaveLength(1)
    expect(result.errors).toHaveLength(2)
  })

  it('编辑模式下排除自身，应通过验证', () => {
    const schedule = makeSchedule({ id: 's1', courseId: 'c1', classroomId: 'r1' })
    const existing = [makeSchedule({ id: 's1', courseId: 'c1', classroomId: 'r1' })]
    const result = validateSchedulingRules(schedule, courses, existing, 's1')
    expect(result.passed).toBe(true)
  })
})
