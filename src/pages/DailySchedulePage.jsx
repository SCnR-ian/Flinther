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

const SLOT_H = 48 // px per 30-min slot — matches admin Bookings view

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

  // Build ordered coach list
  const coachMap = {}
  for (const s of sessions) {
    if (!coachMap[s.coach_id]) coachMap[s.coach_id] = { id: s.coach_id, name: s.coach_name, sessions: [] }
    coachMap[s.coach_id].sessions.push(s)
  }
  const coaches = Object.values(coachMap).sort((a, b) => a.name.localeCompare(b.name))

  // Time range
  const allMins  = sessions.flatMap(s => [toMins(s.start_time), toMins(s.end_time)])
  const minStart = allMins.length ? Math.min(...allMins) : toMins('09:00')
  const maxEnd   = allMins.length ? Math.max(...allMins) : toMins('22:00')
  const startSlot = Math.floor(minStart / 30) * 30
  const endSlot   = Math.ceil(maxEnd   / 30) * 30

  const slots = []
  for (let m = startSlot; m < endSlot; m += 30) {
    slots.push(m)
  }

  const totalH = slots.length * SLOT_H

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
          <h1 className="text-sm font-semibold text-gray-900 mr-1">Daily Schedule</h1>
          <button onClick={() => setDate(d => addDays(d, -1))}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">‹</button>
          <button onClick={() => setDate(today)}
            className={`px-3 py-1.5 text-sm border rounded-lg ${date === today ? 'bg-black text-white border-black' : 'border-gray-200 hover:bg-gray-50'}`}>
            Today
          </button>
          <button onClick={() => setDate(d => addDays(d, 1))}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">›</button>
          <span className="text-sm text-gray-700 font-medium ml-1">{fmtDateLabel(date)}</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="ml-auto text-sm border border-gray-200 rounded-lg px-2 py-1.5" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-24 text-gray-400 text-sm">No sessions on this date.</div>
      ) : (
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <div className="flex min-w-max">

            {/* Time column */}
            <div className="w-20 shrink-0 border-r border-gray-100">
              {/* spacer for coach header row */}
              <div className="h-10 border-b border-gray-100" />
              <div className="relative" style={{ height: totalH }}>
                {slots.map((mins, i) => {
                  const h = Math.floor(mins / 60)
                  const m = mins % 60
                  const label = `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
                  return (
                    <div key={mins} style={{ top: i * SLOT_H, height: SLOT_H }}
                      className="absolute inset-x-0 flex items-start pt-1 pr-2 justify-end border-b border-gray-100">
                      <span className="text-[11px] text-gray-400 font-mono leading-none">{label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Coach columns */}
            {coaches.map(coach => {
              // Deduplicate group sessions
              const seen = new Set()
              const unique = coach.sessions.filter(s => {
                const key = s.group_id ? `g-${s.group_id}` : `s-${s.start_time}-${s.student_name}`
                if (seen.has(key)) return false
                seen.add(key)
                return true
              })

              // Collect all students per group for display
              const groupStudents = {}
              for (const s of coach.sessions) {
                if (s.group_id) {
                  if (!groupStudents[s.group_id]) groupStudents[s.group_id] = []
                  groupStudents[s.group_id].push(s.student_name)
                }
              }

              return (
                <div key={coach.id} className="w-64 shrink-0 border-r border-gray-100 last:border-r-0">
                  {/* Coach header */}
                  <div className="h-10 flex items-center justify-center border-b border-gray-100 px-3">
                    <span className="text-xs font-semibold text-gray-700 truncate">{coach.name}</span>
                  </div>

                  {/* Session grid */}
                  <div className="relative bg-gray-50/30" style={{ height: totalH }}>
                    {/* Grid lines */}
                    {slots.map((_, i) => (
                      <div key={i} style={{ top: i * SLOT_H, height: SLOT_H }}
                        className="absolute inset-x-0 border-b border-gray-100" />
                    ))}

                    {/* Session cards */}
                    {unique.map((s, i) => {
                      const startMins = toMins(s.start_time)
                      const endMins   = toMins(s.end_time)
                      const top    = ((startMins - startSlot) / 30) * SLOT_H + 2
                      const height = ((endMins - startMins) / 30) * SLOT_H - 4
                      const names  = s.group_id
                        ? (groupStudents[s.group_id] ?? [s.student_name]).join('  ')
                        : s.student_name

                      return (
                        <div key={i} style={{ top, height }}
                          className="absolute inset-x-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-2.5 py-2 overflow-hidden">
                          <p className="text-xs font-semibold text-gray-900 leading-tight truncate">{names}</p>
                          <p className="text-[11px] text-emerald-700 mt-0.5">
                            {fmtTime(s.start_time)} – {fmtTime(s.end_time)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      )}
    </div>
  )
}
