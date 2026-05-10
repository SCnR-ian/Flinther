import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useClub } from '@/context/ClubContext'


export default function RegisterPage() {
  const { register, loading, error, clearError } = useAuth()
  const { club } = useClub()
  const navigate = useNavigate()

  const [form, setForm]                   = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors]               = useState({})
  const [verificationSent, setVerificationSent] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name)    e.name    = 'Full name is required'
    if (!form.email)   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'At least 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    clearError()
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) { setErrors(v); return }
    const { confirmPassword, ...payload } = form
    const result = await register(payload)
    if (result.success) {
      if (result.needsVerification) { setVerificationSent(true); return }
      navigate(club ? '/dashboard' : '/onboarding', { replace: true })
    }
  }


  if (verificationSent) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <div className="w-full max-w-[360px] text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6 text-3xl">
            ✉️
          </div>
          <h1 className="text-2xl text-gray-900 mb-3" style={{ fontFamily: '"Kanit", sans-serif' }}>Check your email</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            We've sent a verification link to <span className="text-gray-700 font-medium">{form.email}</span>.
            Click the link to activate your account.
          </p>
          <p className="text-xs text-gray-300">Didn't receive it? Check your spam folder.</p>
        </div>
      </div>
    )
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
            {club ? `Join ${club.name}` : 'Create your account'}
          </h1>
          <p className="text-gray-400 text-sm">
            {club ? 'Create an account to start booking.' : 'Sign up to launch your club on Flinther.'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div>
            <input
              name="name"
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password (min. 8 characters)"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4b6bfb] hover:bg-[#3a5af0] text-white rounded-xl py-3 text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Continue'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-900 underline underline-offset-2 hover:text-gray-500 transition-colors">
            Log in
          </Link>
        </p>
        <p className="text-center text-xs text-gray-300 mt-6 leading-relaxed">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-gray-400">Terms</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-gray-400">Privacy Policy</a>.
        </p>

      </div>
    </div>
  )
}
