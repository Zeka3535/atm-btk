import type { DemoTask } from '../types'
import { todayYmd } from '../types'

/** Содержит подстроку без учёта регистра (как TaskListOrganizer.a) */
function has(hay: string, needle: string): boolean {
  return hay.toLowerCase().includes(needle.toLowerCase())
}

/**
 * Ранг периода как TaskListOrganizer.b(String):
 * 1 — утро / до 13; 2 — в течение дня; 3 — до 17; 4 — вечер 17–20; 5 — неизвестно.
 */
export function periodRank(periodLabel: string | undefined | null): number {
  if (!periodLabel || !periodLabel.length) return 5
  const p = periodLabel

  if (has(p, 'до 13') || has(p, 'до13')) return 1
  if (has(p, 'утр')) return 1
  if (has(p, 'с 9') || has(p, 'с 8') || has(p, 'с 10') || has(p, 'с 11') || has(p, 'с 12')) return 1

  /* 18/19 раньше «9:», иначе ложные совпадения */
  if (has(p, '19:') || has(p, '18:') || has(p, '19.') || has(p, '18.')) return 4

  if (
    has(p, '9:') ||
    has(p, '9.') ||
    has(p, '8:') ||
    has(p, '8.') ||
    has(p, '10:') ||
    has(p, '11:') ||
    has(p, '12:') ||
    has(p, '09:') ||
    has(p, '08:')
  ) {
    return 1
  }

  if (has(p, 'течени')) return 2

  if (
    has(p, 'после 13') ||
    has(p, 'после13') ||
    has(p, 'обед') ||
    has(p, 'до 17') ||
    has(p, 'до17') ||
    has(p, '13-17') ||
    has(p, '14-17') ||
    has(p, '15-17') ||
    has(p, '16-17') ||
    has(p, '13 - 17') ||
    has(p, '14 - 17') ||
    has(p, ' - 17') ||
    has(p, '-17')
  ) {
    return 3
  }

  if (
    has(p, 'вечер') ||
    has(p, 'с 17') ||
    has(p, 'после 17') ||
    has(p, '17:00') ||
    has(p, '17.00') ||
    has(p, '17-20') ||
    has(p, '17:00-20') ||
    has(p, '17.00-20') ||
    has(p, '17 - 20') ||
    has(p, '18-20') ||
    has(p, '19-')
  ) {
    return 4
  }

  if (has(p, '18') || has(p, '19')) return 4
  if (has(p, '8') || has(p, '9') || has(p, '10') || has(p, '11') || has(p, '12')) return 1

  return 5
}

export function isReportSentToday(t: DemoTask): boolean {
  return t.isSended && t.reportSentDay === todayYmd()
}

/** Хвост списка: отписано (1), затем «Отчёт послан» (2) */
function listTailRank(t: DemoTask): number {
  if (isReportSentToday(t)) return 2
  if (t.isOtpisano) return 1
  return 0
}

/** Входящие: как TaskListOrganizer$1 — отписано/отчёт в конец, затем ранг периода, затем id */
export function sortIncoming(tasks: DemoTask[]): DemoTask[] {
  const active = tasks
    .filter((t) => !t.isClosed)
    .map((t) => {
      if (t.isSended && t.reportSentDay && t.reportSentDay !== todayYmd()) {
        return { ...t, isSended: false }
      }
      return t
    })

  return [...active].sort((a, b) => {
    const byTail = listTailRank(a) - listTailRank(b)
    if (byTail !== 0) return byTail

    const byPeriod = periodRank(a.periodLabel) - periodRank(b.periodLabel)
    if (byPeriod !== 0) return byPeriod

    return a.id.localeCompare(b.id, undefined, { numeric: true })
  })
}

/** Только окончательно закрытые */
export function closedTasks(tasks: DemoTask[]): DemoTask[] {
  return tasks.filter((t) => t.isClosed)
}
