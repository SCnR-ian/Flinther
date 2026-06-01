import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { coachingAPI } from '@/api/api'

function fmtTime(t) {
  const [h, m] = t.substring(0, 5).split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function fmtDate(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'short',
  })
}

function groupByDate(sessions) {
  const map = {}
  for (const s of sessions) {
    const key = s.date?.slice(0, 10)
    if (!map[key]) map[key] = []
    map[key].push(s)
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
}

export default function CoachSchedulePage() {
  const { coachId } = useParams()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    coachingAPI.getPublicSchedule(coachId)
      .then(({ data }) => setData(data))
      .catch(err => {
        const status = err?.response?.status
        setError(status === 404 ? 'Coach not found.' : `Error loading schedule (${status ?? 'network error'}).`)
      })
      .finally(() => setLoading(false))
  }, [coachId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">{error}</div>
  )

  const { coach, sessions, bookings } = data
  const sessionsByDate = groupByDate(sessions)

  // Build a set of dates that have bookings for quick lookup
  const bookingDates = new Set(bookings.map(b => b.date?.slice(0, 10)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-5">
        <div className="max-w-lg mx-auto">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Coach Schedule</p>
          <h1 className="text-xl font-semibold text-gray-900">{coach.name}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {sessionsByDate.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No upcoming sessions.</div>
        ) : (
          sessionsByDate.map(([date, daySessions]) => {
            // Deduplicate group sessions (same group_id = same court time)
            const seen = new Set()
            const unique = daySessions.filter(s => {
              const key = s.group_id ?? `solo-${s.start_time}-${s.student_name}`
              if (seen.has(key)) return false
              seen.add(key)
              return true
            })

            const hasBookings = bookingDates.has(date)

            return (
              <div key={date} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Date header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{fmtDate(date)}</span>
                  {hasBookings && (
                    <span className="text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      Court bookings active
                    </span>
                  )}
                </div>

                {/* Sessions */}
                <div className="divide-y divide-gray-50">
                  {unique.map((s, i) => (
                    <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{s.student_name}</p>
                        {s.group_id && (
                          <p className="text-xs text-gray-400">Group session</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 shrink-0 font-mono">
                        {fmtTime(s.start_time)} – {fmtTime(s.end_time)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
