import type { Schedule } from '../mock/scheduling'
import { getCourseName, getTeacherName, getClassGroupName, getClassroomName, DAY_LABELS, PERIOD_LABELS } from '../mock/scheduling'

export type ConflictType = 'classroom' | 'teacher' | 'class'

export interface Conflict {
  type: ConflictType
  existingSchedule: Schedule
  newSchedule: Schedule
  reason: string
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

export function detectConflicts(
  newSchedule: Schedule,
  existingSchedules: Schedule[],
  excludeId?: string
): Conflict[] {
  const conflicts: Conflict[] = []

  for (const existing of existingSchedules) {
    if (excludeId && existing.id === excludeId) continue

    if (existing.dayOfWeek !== newSchedule.dayOfWeek) continue

    if (!periodsOverlap(existing.periodStart, existing.periodEnd, newSchedule.periodStart, newSchedule.periodEnd)) continue

    if (!weeksOverlap(existing.weekStart, existing.weekEnd, newSchedule.weekStart, newSchedule.weekEnd)) continue

    if (existing.classroomId === newSchedule.classroomId) {
      conflicts.push({
        type: 'classroom',
        existingSchedule: existing,
        newSchedule,
        reason: `教室 ${getClassroomName(existing.classroomId)} 在${DAY_LABELS[existing.dayOfWeek - 1]}${PERIOD_LABELS[(existing.periodStart - 1) / 2 | 0]} 已被《${getCourseName(existing.courseId)}》（${getClassGroupName(existing.classId)}）占用`
      })
    }

    if (existing.teacherId === newSchedule.teacherId) {
      conflicts.push({
        type: 'teacher',
        existingSchedule: existing,
        newSchedule,
        reason: `教师 ${getTeacherName(existing.teacherId)} 在${DAY_LABELS[existing.dayOfWeek - 1]}${PERIOD_LABELS[(existing.periodStart - 1) / 2 | 0]} 已有《${getCourseName(existing.courseId)}》授课安排`
      })
    }

    if (existing.classId === newSchedule.classId) {
      conflicts.push({
        type: 'class',
        existingSchedule: existing,
        newSchedule,
        reason: `班级 ${getClassGroupName(existing.classId)} 在${DAY_LABELS[existing.dayOfWeek - 1]}${PERIOD_LABELS[(existing.periodStart - 1) / 2 | 0]} 已有《${getCourseName(existing.courseId)}》课程`
      })
    }
  }

  return conflicts
}

export function detectAllConflicts(schedules: Schedule[]): Conflict[] {
  const conflicts: Conflict[] = []

  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      const a = schedules[i]
      const b = schedules[j]

      if (a.dayOfWeek !== b.dayOfWeek) continue
      if (!periodsOverlap(a.periodStart, a.periodEnd, b.periodStart, b.periodEnd)) continue
      if (!weeksOverlap(a.weekStart, a.weekEnd, b.weekStart, b.weekEnd)) continue

      if (a.classroomId === b.classroomId) {
        conflicts.push({
          type: 'classroom',
          existingSchedule: a,
          newSchedule: b,
          reason: `教室 ${getClassroomName(a.classroomId)} 在${DAY_LABELS[a.dayOfWeek - 1]}${PERIOD_LABELS[(a.periodStart - 1) / 2 | 0]} 同时安排了《${getCourseName(a.courseId)}》和《${getCourseName(b.courseId)}》`
        })
      }

      if (a.teacherId === b.teacherId) {
        conflicts.push({
          type: 'teacher',
          existingSchedule: a,
          newSchedule: b,
          reason: `教师 ${getTeacherName(a.teacherId)} 在${DAY_LABELS[a.dayOfWeek - 1]}${PERIOD_LABELS[(a.periodStart - 1) / 2 | 0]} 同时安排了《${getCourseName(a.courseId)}》和《${getCourseName(b.courseId)}》`
        })
      }

      if (a.classId === b.classId) {
        conflicts.push({
          type: 'class',
          existingSchedule: a,
          newSchedule: b,
          reason: `班级 ${getClassGroupName(a.classId)} 在${DAY_LABELS[a.dayOfWeek - 1]}${PERIOD_LABELS[(a.periodStart - 1) / 2 | 0]} 同时安排了《${getCourseName(a.courseId)}》和《${getCourseName(b.courseId)}》`
        })
      }
    }
  }

  return conflicts
}
