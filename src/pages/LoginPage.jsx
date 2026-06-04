import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { authAPI } from '@/api/api'


export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fromLoc  = location.state?.from
  const from     = fromLoc ? fromLoc.pathname + (fromLoc.search || '') : '/admin'

  const [form, setForm]     = useState({ identifier: '', password: '' })
  const [errors, setErrors] = useState({})
  const [unverified, setUnverified] = useState(false)
  const [resendState, setResendState] = useState('idle') // idle | sending | sent

  const validate = () => {
    const e = {}
    if (!form.identifier) e.identifier = 'Email is required'
    if (!form.password)   e.password   = 'Password is required'
    return e
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    clearError()
    setUnverified(false)
    setResendState('idle')
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const handleResend = async () => {
    if (resendState === 'sending') return
    setResendState('sending')
    try {
      await authAPI.resendVerification(form.identifier)
    } catch { /* enumeration-safe: backend always succeeds */ }
    setResendState('sent')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) { setErrors(v); return }
    const result = await login(form)
    if (result.success) {
      const u = result.user
      const dest = u?.role === 'coach' ? '/coach'
                 : u?.platform_owner && !u?.club_id ? '/onboarding'
                 : (u?.role === 'admin' || u?.platform_owner) ? '/admin'
                 : from
      navigate(dest, { replace: true })
    } else {
      setUnverified(Boolean(result.needsVerification))
    }
  }

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center justify-center px-4"
      style={{ fontFamily: '"DM Sans", sans-serif' }}
    >
      {/* Back button */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </Link>

      <div className="w-full max-w-[360px]">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-white text-xl"
            style={{ fontFamily: '"Kanit", sans-serif' }}
          >
            F
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl text-gray-900 mb-1" style={{ fontFamily: '"Kanit", sans-serif' }}>
            Your club platform.
          </h1>
          <p className="text-gray-400 text-sm">Log in to your Flinther account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        {/* Unverified account — offer to resend the verification email */}
        {unverified && (
          <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
            {resendState === 'sent' ? (
              <p className="text-amber-700">✓ Verification email sent. Please check your inbox (and spam folder).</p>
            ) : (
              <p className="text-amber-700">
                Your email isn't verified yet.{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendState === 'sending'}
                  className="underline underline-offset-2 font-medium hover:text-amber-900 disabled:opacity-50"
                >
                  {resendState === 'sending' ? 'Sending…' : 'Resend verification email'}
                </button>
              </p>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div>
            <input
              name="identifier"
              type="text"
              placeholder="Enter your email address…"
              autoComplete="username"
              value={form.identifier}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {errors.identifier && <p className="text-xs text-red-500 mt-1">{errors.identifier}</p>}
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4b6bfb] hover:bg-[#3a5af0] text-white rounded-xl py-3 text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Continue'}
          </button>
        </form>

        {/* Footer links */}
        <p className="text-center text-sm text-gray-400 mt-6">
          New user?{' '}
          <Link to="/register" className="text-gray-900 underline underline-offset-2 hover:text-gray-500 transition-colors">
            Sign up
          </Link>
        </p>
        <p className="text-center text-xs text-gray-300 mt-6 leading-relaxed">
          By continuing, you acknowledge that you understand
          and agree to our{' '}
          <a href="#" className="underline hover:text-gray-400">Terms</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-gray-400">Privacy Policy</a>.
        </p>

      </div>
    </div>
  )
}
