import { Bell } from 'lucide-react'
import type { Notif } from '../../data/notifications'

const tones = {
  lime: 'bg-lime text-on-lime',
  electric: 'bg-electric text-on-lime',
  plain: 'bg-ink text-on-lime',
}

export function NotificationCard({ n, compact = false }: { n: Notif; compact?: boolean }) {
  return (
    <div className={`flex w-full items-start gap-2.5 rounded-2xl bg-surface-2/95 text-left ring-1 ring-white/10 backdrop-blur ${compact ? 'p-2.5' : 'p-3'}`}>
      <span aria-hidden="true" className={`grid size-8 shrink-0 place-items-center rounded-lg ${tones[n.tone]}`}>
        <Bell size={16} strokeWidth={2.4} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">{n.app}</span>
        <span className="block truncate text-[13px] font-semibold text-ink">{n.title}</span>
        <span className="block truncate text-xs text-muted">{n.body}</span>
      </span>
    </div>
  )
}
