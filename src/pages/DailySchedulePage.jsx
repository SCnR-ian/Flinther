import { useState, useEffect, useCallback } from 'react'
import { coachingAPI } from '@/api/api'

function fmtTime(t) {
  const [h, m] = t.substring(0, 5).split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function toMins(t) {
  const [h, m] = t.substring(0, 5).split(':').map(Number)
  return h * 60 + m
}

function fmtDateLabel(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function addDays(iso, n) {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

const SLOT_H = 56 // px per 30-min slot

export default function DailySchedulePage() {
  const today = new Date().toISOString().slice(0, 10)
  const [date,     setDate]     = useState(today)
  const [sessions, setSessions] = useState([])
  const [loading,  setLoading]  = useState(true)

  const load = useCallback((d) => {
    setLoading(true)
    coachingAPI.getDailySchedule(d)
      .then(({ data }) => setSessions(data.sessions || []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load(date) }, [date, load])

  // Build coach columns
  const coachMap = {}
  for (const s of sessions) {
    if (!coachMap[s.coach_id]) coachMap[s.coach_id] = { name: s.coach_name, sessions: [] }
    coachMap[s.coach_id].sessions.push(s)
  }
  const coaches = Object.values(coachMap).sort((a, b) => a.name.localeCompare(b.name))

  // Time range: earliest start to latest end, rounded to 30-min slots
  const allMins = sessions.flatMap(s => [toMins(s.start_time), toMins(s.end_time)])
  const minStart = allMins.length ? Math.min(...allMins) : toMins('09:00')
  const maxEnd   = allMins.length ? Math.max(...allMins) : toMins('22:00')
  const startSlot = Math.floor(minStart / 30) * 30
  const endSlot   = Math.ceil(maxEnd / 30) * 30
  const slots = []
  for (let m = startSlot; m < endSlot; m += 30) {
    const h = Math.floor(m / 60)
    const min = m % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <h1 className="text-base font-semibold text-gray-900 mr-2">Daily Schedule</h1>
          <button onClick={() => setDate(d => addDays(d, -1))}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">‹</button>
          <button onClick={() => setDate(today)}
            className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${date === today ? 'bg-black text-white border-black' : 'border-gray-200 hover:bg-gray-50'}`}>
            Today
          </button>
          <button onClick={() => setDate(d => addDays(d, 1))}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">›</button>
          <span className="text-sm text-gray-600">{fmtDateLabel(date)}</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="ml-auto text-sm border border-gray-200 rounded-lg px-2 py-1.5" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">No sessions on this date.</div>
        ) : (
          <div className="flex gap-0 overflow-x-auto">
            {/* Time column */}
            <div className="shrink-0 w-20 pt-10">
              {slots.map(slot => (
                <div key={slot} style={{ height: SLOT_H }} className="flex items-start pt-1">
                  <span className="text-xs text-gray-400 font-mono">{fmtTime(slot)}</span>
                </div>
              ))}
            </div>

            {/* Coach columns */}
            {coaches.map(coach => {
              // Deduplicate group sessions
              const seen = new Set()
              const unique = coach.sessions.filter(s => {
                const key = s.group_id ?? `${s.start_time}-${s.student_name}`
                if (seen.has(key)) return false
                seen.add(key)
                return true
              })

              return (
                <div key={coach.name} className="flex-1 min-w-[180px] border-l border-gray-100 first:border-l-0">
                  {/* Coach header */}
                  <div className="h-10 flex items-center justify-center px-2">
                    <span className="text-xs font-semibold text-gray-700 text-center truncate">{coach.name}</span>
                  </div>

                  {/* Session grid */}
                  <div className="relative" style={{ height: slots.length * SLOT_H }}>
                    {unique.map((s, i) => {
                      const startMins = toMins(s.start_time)
                      const endMins   = toMins(s.end_time)
                      const top    = ((startMins - startSlot) / 30) * SLOT_H
                      const height = ((endMins - startMins) / 30) * SLOT_H

                      // Group same-time sessions in this coach's column
                      const sameSlot = unique.filter(x => x.start_time === s.start_time)
                      const idx = sameSlot.indexOf(s)
                      const w   = 100 / sameSlot.length

                      return (
                        <div key={i} style={{ top, height, left: `${idx * w}%`, width: `${w}%` }}
                          className="absolute p-1.5">
                          <div className="w-full h-full bg-emerald-50 border border-emerald-200 rounded-xl px-2 py-1.5 overflow-hidden">
                            <p className="text-xs font-semibold text-gray-900 truncate">{s.student_name}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {fmtTime(s.start_time)} – {fmtTime(s.end_time)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
