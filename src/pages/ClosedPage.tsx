import { useCallback, useState } from 'react'
import { ContactsModal } from '../components/ContactsModal'
import { MapsModal } from '../components/MapsModal'
import { OfflineBanner } from '../components/OfflineBanner'
import { PullToRefresh } from '../components/PullToRefresh'
import { ReportModal } from '../components/ReportModal'
import { TaskCard } from '../components/TaskCard'
import { TasksToolbar } from '../components/NavChrome'
import { useDemo } from '../context/DemoContext'
import { closedTasks } from '../data/mockTasks'
import type { CallContact } from '../types'

export function ClosedPage() {
  const { tasks, refreshTasks } = useDemo()
  const list = closedTasks(tasks)
  const [reportId, setReportId] = useState<string | null>(null)
  const [contacts, setContacts] = useState<CallContact[] | null>(null)
  const [mapAddr, setMapAddr] = useState<string | null>(null)

  const onRefresh = useCallback(() => refreshTasks(), [refreshTasks])

  return (
    <div className="page page-list">
      <TasksToolbar mode="closed" />
      <PullToRefresh onRefresh={onRefresh}>
        <OfflineBanner />
        {list.length === 0 && <p className="empty">нет данных</p>}
        {list.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onReport={setReportId}
            onContacts={setContacts}
            onMaps={setMapAddr}
          />
        ))}
      </PullToRefresh>
      <ReportModal taskId={reportId} onClose={() => setReportId(null)} />
      <ContactsModal contacts={contacts} onClose={() => setContacts(null)} />
      <MapsModal address={mapAddr} onClose={() => setMapAddr(null)} />
    </div>
  )
}
