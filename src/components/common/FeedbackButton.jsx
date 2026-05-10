import { useState } from 'react'
import { feedbackAPI } from '@/api/api'

export default function FeedbackButton({ page }) {
  const [open, setOpen]       = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState('idle') // idle | sending | done | error

  const submit = async () => {
    if (!message.trim()) return
    setStatus('sending')
    try {
      await feedbackAPI.submit({ message, name, email, page: page || window.location.pathname })
      setStatus('done')
      setTimeout(() => { setOpen(false); setStatus('idle'); setMessage(''); setName(''); setEmail('') }, 1800)
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg hover:bg-black transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        Feedback
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4" style={{ fontFamily: '"DM Sans", sans-serif' }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-lg">Share feedback</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {status === 'done' ? (
              <div className="text-center py-8">
                <p className="text-2xl mb-2">✓</p>
                <p className="font-medium text-gray-900">Thanks for the feedback!</p>
              </div>
            ) : (
              <>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 mb-3"
                />
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email (optional)"
                    type="email"
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                {status === 'error' && (
                  <p className="text-red-500 text-xs mb-3">Something went wrong. Please try again.</p>
                )}
                <button
                  onClick={submit}
                  disabled={!message.trim() || status === 'sending'}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Sending…' : 'Send feedback'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
