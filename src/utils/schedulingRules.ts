import type { Schedule, Course } from '../mock/scheduling'
import { getCourseName, getClassroomName, getClassGroupName, DAY_LABELS, PERIOD_LABELS } from '../mock/scheduling'

export interface ClassroomConflict {
  type: 'classroom'
  existingSchedule: Schedule
  reason: string
}

export interface RuleValidationResult {
  passed: boolean
  errors: string[]
  classroomConflicts: ClassroomConflict[]
  disabledCourseError?: string
}

export function weeksOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA <= endB && startB <= endA
}

export function periodsOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA <= endB && startB <= endA
}

export function filterEnabledCourses(courses: Course[]): Course[] {
  return courses.filter(c => c.enabled)
}

export function excludeSelfFromSchedules(
  schedules: Schedule[],
  excludeId?: string
): Schedule[] {
  if (!excludeId) return schedules
  return schedules.filter(s => s.id !== excludeId)
}

export function detectClassroomConflict(
  newSchedule: Schedule,
  existingSchedules: Schedule[],
  excludeId?: string
): ClassroomConflict[] {
  const conflicts: ClassroomConflict[] = []
  const candidates = excludeSelfFromSchedules(existingSchedules, excludeId)

  for (const existing of candidates) {
    if (existing.dayOfWeek !== newSchedule.dayOfWeek) continue
    if (!periodsOverlap(existing.periodStart, existing.periodEnd, newSchedule.periodStart, newSchedule.periodEnd)) continue
    if (!weeksOverlap(existing.weekStart, existing.weekEnd, newSchedule.weekStart, newSchedule.weekEnd)) continue

    if (existing.classroomId === newSchedule.classroomId) {
      conflicts.push({
        type: 'classroom',
        existingSchedule: existing,
        reason: `教室 ${getClassroomName(existing.classroomId)} 在${DAY_LABELS[existing.dayOfWeek - 1]}${PERIOD_LABELS[(existing.periodStart - 1) / 2 | 0]} 已被《${getCourseName(existing.courseId)}》（${getClassGroupName(existing.classId)}）占用`
      })
    }
  }

  return conflicts
}

export function checkCourseEnabled(
  courseId: string,
  courses: Course[]
): { valid: boolean; courseName: string; error?: string } {
  const course = courses.find(c => c.id === courseId)
  const courseName = course?.name ?? ''

  if (!course) {
    return { valid: false, courseName, error: '所选课程不存在' }
  }

  if (!course.enabled) {
    return { valid: false, courseName, error: `课程《${courseName}》已停用，请选择其他课程` }
  }

  return { valid: true, courseName }
}

export function validateSchedulingRules(
  schedule: Schedule,
  allCourses: Course[],
  existingSchedules: Schedule[],
  excludeId?: string
): RuleValidationResult {
  const errors: string[] = []
  const result: RuleValidationResult = {
    passed: true,
    errors,
    classroomConflicts: [],
  }

  const courseCheck = checkCourseEnabled(schedule.courseId, allCourses)
  if (!courseCheck.valid) {
    result.passed = false
    result.disabledCourseError = courseCheck.error
    errors.push(courseCheck.error!)
  }

  const classroomConflicts = detectClassroomConflict(schedule, existingSchedules, excludeId)
  if (classroomConflicts.length > 0) {
    result.passed = false
    result.classroomConflicts = classroomConflicts
    for (const c of classroomConflicts) {
      errors.push(c.reason)
    }
  }

  return result
}
