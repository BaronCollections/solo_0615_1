import { describe, it, expect } from 'vitest'
import { detectConflicts, detectAllConflicts } from './conflict'
import type { Schedule } from '../mock/scheduling'

describe('排课冲突检测 - 教室冲突', () => {
  const baseSchedule: Schedule = {
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
  }

  describe('detectConflicts - 新增排课时检测教室冲突', () => {
    it('同一教室同一时间段重复排课，应返回教室冲突提示', () => {
      const existingSchedule: Schedule = { ...baseSchedule, id: 'existing-1' }
      const newSchedule: Schedule = {
        ...baseSchedule,
        id: 'new-1',
        courseId: 'c2',
        teacherId: 't2',
        classId: 'cls2',
      }

      const conflicts = detectConflicts(newSchedule, [existingSchedule])

      const classroomConflict = conflicts.find(c => c.type === 'classroom')
      expect(classroomConflict).toBeDefined()
      expect(classroomConflict!.reason).toContain('教室')
      expect(classroomConflict!.reason).toContain('A101')
      expect(classroomConflict!.reason).toContain('已被')
      expect(classroomConflict!.reason).toContain('占用')
    })

    it('同一教室但不同天，不应返回冲突', () => {
      const existingSchedule: Schedule = { ...baseSchedule, id: 'existing-1' }
      const newSchedule: Schedule = {
        ...baseSchedule,
        id: 'new-1',
        dayOfWeek: 2,
        courseId: 'c2',
        teacherId: 't2',
        classId: 'cls2',
      }

      const conflicts = detectConflicts(newSchedule, [existingSchedule])
      const classroomConflict = conflicts.find(c => c.type === 'classroom')
      expect(classroomConflict).toBeUndefined()
    })

    it('同一教室同一天但不同节次，不应返回冲突', () => {
      const existingSchedule: Schedule = { ...baseSchedule, id: 'existing-1' }
      const newSchedule: Schedule = {
        ...baseSchedule,
        id: 'new-1',
        periodStart: 3,
        periodEnd: 4,
        courseId: 'c2',
        teacherId: 't2',
        classId: 'cls2',
      }

      const conflicts = detectConflicts(newSchedule, [existingSchedule])
      const classroomConflict = conflicts.find(c => c.type === 'classroom')
      expect(classroomConflict).toBeUndefined()
    })

    it('同一教室同一节次但不同周次不重叠，不应返回冲突', () => {
      const existingSchedule: Schedule = { ...baseSchedule, id: 'existing-1', weekStart: 1, weekEnd: 8 }
      const newSchedule: Schedule = {
        ...baseSchedule,
        id: 'new-1',
        weekStart: 9,
        weekEnd: 16,
        courseId: 'c2',
        teacherId: 't2',
        classId: 'cls2',
      }

      const conflicts = detectConflicts(newSchedule, [existingSchedule])
      const classroomConflict = conflicts.find(c => c.type === 'classroom')
      expect(classroomConflict).toBeUndefined()
    })

    it('同一教室部分周次重叠，应返回冲突', () => {
      const existingSchedule: Schedule = { ...baseSchedule, id: 'existing-1', weekStart: 1, weekEnd: 8 }
      const newSchedule: Schedule = {
        ...baseSchedule,
        id: 'new-1',
        weekStart: 5,
        weekEnd: 12,
        courseId: 'c2',
        teacherId: 't2',
        classId: 'cls2',
      }

      const conflicts = detectConflicts(newSchedule, [existingSchedule])
      const classroomConflict = conflicts.find(c => c.type === 'classroom')
      expect(classroomConflict).toBeDefined()
    })

    it('排除自身ID时，不应检测到冲突', () => {
      const existingSchedule: Schedule = { ...baseSchedule, id: 's1' }
      const newSchedule: Schedule = {
        ...baseSchedule,
        id: 's1',
        courseId: 'c2',
      }

      const conflicts = detectConflicts(newSchedule, [existingSchedule], 's1')
      const classroomConflict = conflicts.find(c => c.type === 'classroom')
      expect(classroomConflict).toBeUndefined()
    })
  })

  describe('detectAllConflicts - 批量检测教室冲突', () => {
    it('同一教室同一时间段有两门课，应返回教室冲突', () => {
      const schedule1: Schedule = {
        ...baseSchedule,
        id: 's1',
        courseId: 'c1',
        teacherId: 't1',
        classId: 'cls1',
      }
      const schedule2: Schedule = {
        ...baseSchedule,
        id: 's2',
        courseId: 'c2',
        teacherId: 't2',
        classId: 'cls2',
      }

      const conflicts = detectAllConflicts([schedule1, schedule2])
      const classroomConflict = conflicts.find(c => c.type === 'classroom')
      expect(classroomConflict).toBeDefined()
      expect(classroomConflict!.reason).toContain('教室')
      expect(classroomConflict!.reason).toContain('A101')
      expect(classroomConflict!.reason).toContain('同时安排了')
    })

    it('三个排课中两个教室冲突，应只返回那一对的冲突', () => {
      const schedule1: Schedule = { ...baseSchedule, id: 's1', classroomId: 'r1' }
      const schedule2: Schedule = { ...baseSchedule, id: 's2', classroomId: 'r1', courseId: 'c2', teacherId: 't2', classId: 'cls2' }
      const schedule3: Schedule = { ...baseSchedule, id: 's3', classroomId: 'r2', courseId: 'c3', teacherId: 't3', classId: 'cls3' }

      const conflicts = detectAllConflicts([schedule1, schedule2, schedule3])
      const classroomConflicts = conflicts.filter(c => c.type === 'classroom')
      expect(classroomConflicts).toHaveLength(1)
    })
  })
})

describe('排课冲突检测 - 教师冲突', () => {
  const baseSchedule: Schedule = {
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
  }

  describe('detectConflicts - 新增排课时检测教师冲突', () => {
    it('同一教师同一时间段重复排课，应返回教师冲突提示', () => {
      const existingSchedule: Schedule = { ...baseSchedule, id: 'existing-1' }
      const newSchedule: Schedule = {
        ...baseSchedule,
        id: 'new-1',
        courseId: 'c2',
        classId: 'cls2',
        classroomId: 'r2',
      }

      const conflicts = detectConflicts(newSchedule, [existingSchedule])

      const teacherConflict = conflicts.find(c => c.type === 'teacher')
      expect(teacherConflict).toBeDefined()
      expect(teacherConflict!.reason).toContain('教师')
      expect(teacherConflict!.reason).toContain('王建国')
      expect(teacherConflict!.reason).toContain('已有')
      expect(teacherConflict!.reason).toContain('授课安排')
    })

    it('同一教师但不同天，不应返回冲突', () => {
      const existingSchedule: Schedule = { ...baseSchedule, id: 'existing-1' }
      const newSchedule: Schedule = {
        ...baseSchedule,
        id: 'new-1',
        dayOfWeek: 2,
        courseId: 'c2',
        classId: 'cls2',
        classroomId: 'r2',
      }

      const conflicts = detectConflicts(newSchedule, [existingSchedule])
      const teacherConflict = conflicts.find(c => c.type === 'teacher')
      expect(teacherConflict).toBeUndefined()
    })

    it('同一教师同一天但不同节次，不应返回冲突', () => {
      const existingSchedule: Schedule = { ...baseSchedule, id: 'existing-1' }
      const newSchedule: Schedule = {
        ...baseSchedule,
        id: 'new-1',
        periodStart: 3,
        periodEnd: 4,
        courseId: 'c2',
        classId: 'cls2',
        classroomId: 'r2',
      }

      const conflicts = detectConflicts(newSchedule, [existingSchedule])
      const teacherConflict = conflicts.find(c => c.type === 'teacher')
      expect(teacherConflict).toBeUndefined()
    })

    it('同一教师同一节次但不同周次不重叠，不应返回冲突', () => {
      const existingSchedule: Schedule = { ...baseSchedule, id: 'existing-1', weekStart: 1, weekEnd: 8 }
      const newSchedule: Schedule = {
        ...baseSchedule,
        id: 'new-1',
        weekStart: 9,
        weekEnd: 16,
        courseId: 'c2',
        classId: 'cls2',
        classroomId: 'r2',
      }

      const conflicts = detectConflicts(newSchedule, [existingSchedule])
      const teacherConflict = conflicts.find(c => c.type === 'teacher')
      expect(teacherConflict).toBeUndefined()
    })

    it('同一教师部分周次重叠，应返回冲突', () => {
      const existingSchedule: Schedule = { ...baseSchedule, id: 'existing-1', weekStart: 1, weekEnd: 8 }
      const newSchedule: Schedule = {
        ...baseSchedule,
        id: 'new-1',
        weekStart: 5,
        weekEnd: 12,
        courseId: 'c2',
        classId: 'cls2',
        classroomId: 'r2',
      }

      const conflicts = detectConflicts(newSchedule, [existingSchedule])
      const teacherConflict = conflicts.find(c => c.type === 'teacher')
      expect(teacherConflict).toBeDefined()
    })

    it('排除自身ID时，不应检测到冲突', () => {
      const existingSchedule: Schedule = { ...baseSchedule, id: 's1' }
      const newSchedule: Schedule = {
        ...baseSchedule,
        id: 's1',
        courseId: 'c2',
      }

      const conflicts = detectConflicts(newSchedule, [existingSchedule], 's1')
      const teacherConflict = conflicts.find(c => c.type === 'teacher')
      expect(teacherConflict).toBeUndefined()
    })
  })

  describe('detectAllConflicts - 批量检测教师冲突', () => {
    it('同一教师同一时间段有两门课，应返回教师冲突', () => {
      const schedule1: Schedule = {
        ...baseSchedule,
        id: 's1',
        courseId: 'c1',
        classId: 'cls1',
        classroomId: 'r1',
      }
      const schedule2: Schedule = {
        ...baseSchedule,
        id: 's2',
        courseId: 'c2',
        classId: 'cls2',
        classroomId: 'r2',
      }

      const conflicts = detectAllConflicts([schedule1, schedule2])
      const teacherConflict = conflicts.find(c => c.type === 'teacher')
      expect(teacherConflict).toBeDefined()
      expect(teacherConflict!.reason).toContain('教师')
      expect(teacherConflict!.reason).toContain('王建国')
      expect(teacherConflict!.reason).toContain('同时安排了')
    })

    it('三个排课中两个教师冲突，应只返回那一对的冲突', () => {
      const schedule1: Schedule = { ...baseSchedule, id: 's1', teacherId: 't1' }
      const schedule2: Schedule = { ...baseSchedule, id: 's2', teacherId: 't1', courseId: 'c2', classId: 'cls2', classroomId: 'r2' }
      const schedule3: Schedule = { ...baseSchedule, id: 's3', teacherId: 't2', courseId: 'c3', classId: 'cls3', classroomId: 'r3' }

      const conflicts = detectAllConflicts([schedule1, schedule2, schedule3])
      const teacherConflicts = conflicts.filter(c => c.type === 'teacher')
      expect(teacherConflicts).toHaveLength(1)
    })
  })
})
