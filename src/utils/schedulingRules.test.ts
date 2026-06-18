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

  describe('边界：首次冲突后修改字段再验证 - 回归测试', () => {
    const existingConflict = makeSchedule({
      id: 'existing-1',
      courseId: 'c1',
      classroomId: 'r1',
      dayOfWeek: 1,
      periodStart: 1,
      periodEnd: 2,
      weekStart: 1,
      weekEnd: 16,
    })

    it('先检测到教室冲突，修改为不冲突教室后应清空冲突并通过验证', () => {
      const schedule = makeSchedule({
        id: 'new-1',
        courseId: 'c1',
        classroomId: 'r1',
        dayOfWeek: 1,
        periodStart: 1,
        periodEnd: 2,
      })
      const result1 = validateSchedulingRules(schedule, courses, [existingConflict])
      expect(result1.passed).toBe(false)
      expect(result1.classroomConflicts).toHaveLength(1)

      const modifiedSchedule = { ...schedule, classroomId: 'r2' }
      const result2 = validateSchedulingRules(modifiedSchedule, courses, [existingConflict])
      expect(result2.passed).toBe(true)
      expect(result2.classroomConflicts).toHaveLength(0)
      expect(result2.errors).toHaveLength(0)
      expect(result2.disabledCourseError).toBeUndefined()
    })

    it('先检测到教室冲突，修改为不冲突节次后应清空冲突并通过验证', () => {
      const schedule = makeSchedule({
        id: 'new-1',
        courseId: 'c1',
        classroomId: 'r1',
        dayOfWeek: 1,
        periodStart: 1,
        periodEnd: 2,
      })
      const result1 = validateSchedulingRules(schedule, courses, [existingConflict])
      expect(result1.passed).toBe(false)
      expect(result1.classroomConflicts).toHaveLength(1)

      const modifiedSchedule = { ...schedule, periodStart: 3, periodEnd: 4 }
      const result2 = validateSchedulingRules(modifiedSchedule, courses, [existingConflict])
      expect(result2.passed).toBe(true)
      expect(result2.classroomConflicts).toHaveLength(0)
      expect(result2.errors).toHaveLength(0)
    })

    it('先检测到教室冲突，修改为不冲突星期后应清空冲突并通过验证', () => {
      const schedule = makeSchedule({
        id: 'new-1',
        courseId: 'c1',
        classroomId: 'r1',
        dayOfWeek: 1,
        periodStart: 1,
        periodEnd: 2,
      })
      const result1 = validateSchedulingRules(schedule, courses, [existingConflict])
      expect(result1.passed).toBe(false)

      const modifiedSchedule = { ...schedule, dayOfWeek: 2 }
      const result2 = validateSchedulingRules(modifiedSchedule, courses, [existingConflict])
      expect(result2.passed).toBe(true)
      expect(result2.classroomConflicts).toHaveLength(0)
    })

    it('先检测到教室冲突，修改为不冲突周次后应清空冲突并通过验证', () => {
      const schedule = makeSchedule({
        id: 'new-1',
        courseId: 'c1',
        classroomId: 'r1',
        dayOfWeek: 1,
        periodStart: 1,
        periodEnd: 2,
        weekStart: 1,
        weekEnd: 16,
      })
      const result1 = validateSchedulingRules(schedule, courses, [existingConflict])
      expect(result1.passed).toBe(false)

      const modifiedSchedule = { ...schedule, weekStart: 17, weekEnd: 20 }
      const result2 = validateSchedulingRules(modifiedSchedule, courses, [existingConflict])
      expect(result2.passed).toBe(true)
      expect(result2.classroomConflicts).toHaveLength(0)
    })

    it('每次验证应返回独立结果，前一次冲突不应污染后一次验证', () => {
      const conflictSchedule = makeSchedule({
        id: 'new-1',
        courseId: 'c1',
        classroomId: 'r1',
      })
      const result1 = validateSchedulingRules(conflictSchedule, courses, [existingConflict])
      expect(result1.passed).toBe(false)
      expect(result1.classroomConflicts).toHaveLength(1)

      const okSchedule = makeSchedule({
        id: 'new-2',
        courseId: 'c1',
        classroomId: 'r2',
      })
      const result2 = validateSchedulingRules(okSchedule, courses, [existingConflict])
      expect(result2.passed).toBe(true)
      expect(result2.classroomConflicts).toHaveLength(0)

      expect(result1).not.toBe(result2)
      expect(result1.classroomConflicts).not.toBe(result2.classroomConflicts)
    })

    it('验证通过时 disabledCourseError 应显式为 undefined', () => {
      const schedule = makeSchedule({
        id: 'new-1',
        courseId: 'c1',
        classroomId: 'r2',
      })
      const result = validateSchedulingRules(schedule, courses, [existingConflict])
      expect(result.passed).toBe(true)
      expect(result.disabledCourseError).toBeUndefined()
      expect('disabledCourseError' in result).toBe(true)
    })

    it('从课程禁用错误改为正常课程后，disabledCourseError 应清空', () => {
      const disabledSchedule = makeSchedule({
        id: 'new-1',
        courseId: 'c2',
        classroomId: 'r2',
      })
      const result1 = validateSchedulingRules(disabledSchedule, courses, [existingConflict])
      expect(result1.passed).toBe(false)
      expect(result1.disabledCourseError).toBeDefined()

      const fixedSchedule = { ...disabledSchedule, courseId: 'c1' }
      const result2 = validateSchedulingRules(fixedSchedule, courses, [existingConflict])
      expect(result2.passed).toBe(true)
      expect(result2.disabledCourseError).toBeUndefined()
      expect(result2.classroomConflicts).toHaveLength(0)
    })

    it('先有教室冲突后改到不冲突教室，所有错误字段应清空', () => {
      const conflictSchedule = makeSchedule({
        id: 'new-1',
        courseId: 'c1',
        classroomId: 'r1',
        dayOfWeek: 1,
        periodStart: 1,
        periodEnd: 2,
      })
      const result1 = validateSchedulingRules(conflictSchedule, courses, [existingConflict])
      expect(result1.passed).toBe(false)
      expect(result1.classroomConflicts).toHaveLength(1)
      expect(result1.errors.length).toBeGreaterThan(0)

      const fixedSchedule = { ...conflictSchedule, classroomId: 'r2' }
      const result2 = validateSchedulingRules(fixedSchedule, courses, [existingConflict])
      expect(result2.passed).toBe(true)
      expect(result2.classroomConflicts).toHaveLength(0)
      expect(result2.errors).toHaveLength(0)
      expect(result2.disabledCourseError).toBeUndefined()
    })

    it('先有教室冲突后改到不冲突节次，所有错误字段应清空', () => {
      const conflictSchedule = makeSchedule({
        id: 'new-1',
        courseId: 'c1',
        classroomId: 'r1',
        dayOfWeek: 1,
        periodStart: 1,
        periodEnd: 2,
      })
      const result1 = validateSchedulingRules(conflictSchedule, courses, [existingConflict])
      expect(result1.passed).toBe(false)
      expect(result1.classroomConflicts).toHaveLength(1)

      const fixedSchedule = { ...conflictSchedule, periodStart: 3, periodEnd: 4 }
      const result2 = validateSchedulingRules(fixedSchedule, courses, [existingConflict])
      expect(result2.passed).toBe(true)
      expect(result2.classroomConflicts).toHaveLength(0)
      expect(result2.errors).toHaveLength(0)
    })

    it('先有教室冲突后改到不冲突星期，所有错误字段应清空', () => {
      const conflictSchedule = makeSchedule({
        id: 'new-1',
        courseId: 'c1',
        classroomId: 'r1',
        dayOfWeek: 1,
        periodStart: 1,
        periodEnd: 2,
      })
      const result1 = validateSchedulingRules(conflictSchedule, courses, [existingConflict])
      expect(result1.passed).toBe(false)
      expect(result1.classroomConflicts).toHaveLength(1)

      const fixedSchedule = { ...conflictSchedule, dayOfWeek: 2 }
      const result2 = validateSchedulingRules(fixedSchedule, courses, [existingConflict])
      expect(result2.passed).toBe(true)
      expect(result2.classroomConflicts).toHaveLength(0)
      expect(result2.errors).toHaveLength(0)
    })

    it('先有教室冲突后改到不冲突周次，所有错误字段应清空', () => {
      const conflictSchedule = makeSchedule({
        id: 'new-1',
        courseId: 'c1',
        classroomId: 'r1',
        dayOfWeek: 1,
        periodStart: 1,
        periodEnd: 2,
        weekStart: 1,
        weekEnd: 16,
      })
      const result1 = validateSchedulingRules(conflictSchedule, courses, [existingConflict])
      expect(result1.passed).toBe(false)
      expect(result1.classroomConflicts).toHaveLength(1)

      const fixedSchedule = { ...conflictSchedule, weekStart: 17, weekEnd: 20 }
      const result2 = validateSchedulingRules(fixedSchedule, courses, [existingConflict])
      expect(result2.passed).toBe(true)
      expect(result2.classroomConflicts).toHaveLength(0)
      expect(result2.errors).toHaveLength(0)
    })

    it('同时有课程禁用和教室冲突，先改课程再改教室后应完全通过', () => {
      const badSchedule = makeSchedule({
        id: 'new-1',
        courseId: 'c2',
        classroomId: 'r1',
      })
      const result1 = validateSchedulingRules(badSchedule, courses, [existingConflict])
      expect(result1.passed).toBe(false)
      expect(result1.disabledCourseError).toBeDefined()
      expect(result1.classroomConflicts).toHaveLength(1)
      expect(result1.errors).toHaveLength(2)

      const fixedCourse = { ...badSchedule, courseId: 'c1' }
      const result2 = validateSchedulingRules(fixedCourse, courses, [existingConflict])
      expect(result2.passed).toBe(false)
      expect(result2.disabledCourseError).toBeUndefined()
      expect(result2.classroomConflicts).toHaveLength(1)
      expect(result2.errors).toHaveLength(1)

      const fixedAll = { ...fixedCourse, classroomId: 'r2' }
      const result3 = validateSchedulingRules(fixedAll, courses, [existingConflict])
      expect(result3.passed).toBe(true)
      expect(result3.disabledCourseError).toBeUndefined()
      expect(result3.classroomConflicts).toHaveLength(0)
      expect(result3.errors).toHaveLength(0)
    })
  })
})
