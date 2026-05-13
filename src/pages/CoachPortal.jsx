import { useState, useEffect, useMemo } from 'react'
import { Calendar, Users, Clock, LogOut } from 'lucide-react'
import { coachingAPI } from '@/api/api'
import { useAuth } from '@/context/AuthContext'

const TABS = ['Schedule', 'Students', 'Hours']
const TAB_ICONS = {
  Schedule: <Calendar className="w-4 h-4 shrink-0" />,
  Students: <Users    className="w-4 h-4 shrink-0" />,
  Hours:    <Clock    className="w-4 h-4 shrink-0" />,
}

function fmtDate(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short',
  })
}
function fmtTime(t) {
  const [h, m] = t.substring(0, 5).split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}
function sessionMins(s) {
  const [sh, sm] = s.start_time.substring(0, 5).split(':').map(Number)
  const [eh, em] = s.end_time.substring(0, 5).split(':').map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
}

export default function CoachPortal() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Schedule')
  const [sessions,  setSessions]  = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    coachingAPI.getMyCoachSessions()
      .then(({ data }) => setSessions(data.sessions || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toISOString().slice(0, 10)

  const upcoming = useMemo(() =>
    sessions.filter(s => s.date?.slice(0, 10) >= today)
      .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time)),
    [sessions, today])

  const past = useMemo(() =>
    sessions.filter(s => s.date?.slice(0, 10) < today),
    [sessions, today])

  const byDate = useMemo(() => {
    const map = {}
    upcoming.forEach(s => {
      const d = s.date?.slice(0, 10)
      if (!map[d]) map[d] = []
      map[d].push(s)
    })
    return Object.entries(map)
  }, [upcoming])

  const students = useMemo(() => {
    const map = {}
    sessions.forEach(s => {
      if (!map[s.student_id]) map[s.student_id] = { id: s.student_id, name: s.student_name, count: 0, lastDate: s.date }
      map[s.student_id].count++
      if (s.date > map[s.student_id].lastDate) map[s.student_id].lastDate = s.date
    })
    return Object.values(map).sort((a, b) => b.count - a.count)
  }, [sessions])

  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthSessions = sessions.filter(s => s.date?.slice(0, 7) === thisMonth)
  const monthMins = monthSessions.reduce((acc, s) => acc + sessionMins(s), 0)
  const totalMins = sessions.reduce((acc, s) => acc + sessionMins(s), 0)

  const Sidebar = () => (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 bg-white border-r border-gray-100 z-40">
      <div className="px-5 h-14 flex flex-col justify-center border-b border-gray-100 shrink-0">
        <span className="font-semibold text-sm text-gray-900">{user?.name || 'Coach'}</span>
        <span className="text-xs text-gray-400">Coach Portal</span>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
              activeTab === tab ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {TAB_ICONS[tab]}
            {tab}
          </button>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-gray-100 shrink-0">
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/' }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Log out
        </button>
      </div>
    </aside>
  )

  return (
    <>
      <Sidebar />
      <div className="lg:pl-56 py-8 px-4 pb-24 min-h-screen bg-gray-50">

        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between mb-5">
          <div>
            <p className="font-semibold text-gray-900">{user?.name || 'Coach'}</p>
            <p className="text-xs text-gray-400">Coach Portal</p>
          </div>
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/' }}
            className="text-xs text-gray-400 hover:text-gray-700"
          >Log out</button>
        </div>

        {/* Mobile tab pills */}
        <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >{tab}</button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
          </div>
        )}

        {/* ── Schedule ── */}
        {!loading && activeTab === 'Schedule' && (
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Upcoming Sessions ({upcoming.length})
            </p>
            {byDate.length === 0
              ? <p className="text-gray-400 text-sm">No upcoming sessions.</p>
              : byDate.map(([date, daySessions]) => (
                <div key={date} className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{fmtDate(date)}</p>
                  <div className="space-y-2">
                    {daySessions.map(s => (
                      <div key={s.id} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{s.student_name}</p>
                          {s.court_name && <p className="text-xs text-gray-400 mt-0.5">{s.court_name}</p>}
                        </div>
                        <p className="text-xs font-mono text-gray-500 shrink-0 ml-4">
                          {fmtTime(s.start_time)} – {fmtTime(s.end_time)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ── Students ── */}
        {!loading && activeTab === 'Students' && (
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              {students.length} Student{students.length !== 1 ? 's' : ''}
            </p>
            {students.length === 0
              ? <p className="text-gray-400 text-sm">No students yet.</p>
              : (
                <div className="space-y-2">
                  {students.map(s => (
                    <div key={s.id} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
                      <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">{s.count} session{s.count !== 1 ? 's' : ''}</p>
                        <p className="text-xs text-gray-400">Last: {fmtDate(s.lastDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* ── Hours ── */}
        {!loading && activeTab === 'Hours' && (
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Hours Summary</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-2xl font-semibold text-gray-900">{monthSessions.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">Sessions this month</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-2xl font-semibold text-gray-900">{(monthMins / 60).toFixed(1)}h</p>
                <p className="text-xs text-gray-400 mt-0.5">Hours this month</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-2xl font-semibold text-gray-900">{sessions.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">Total sessions</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-2xl font-semibold text-gray-900">{(totalMins / 60).toFixed(1)}h</p>
                <p className="text-xs text-gray-400 mt-0.5">Total hours</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
