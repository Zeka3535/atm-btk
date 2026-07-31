import { useDemo } from '../context/DemoContext'

export function OfflineBanner() {
  const { offline, offlineSince } = useDemo()
  if (!offline) return null
  return (
    <div className="offline-banner" role="status">
      Нет сети. Показаны сохранённые заявки от {offlineSince}
    </div>
  )
}
