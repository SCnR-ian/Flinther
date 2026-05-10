import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authAPI } from '@/api/api'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState('verifying') // verifying | success | error

  useEffect(() => {
    if (!token) { setStatus('error'); return }
    authAPI.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="w-full max-w-[360px] text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6 text-3xl">
          {status === 'verifying' && '⏳'}
          {status === 'success'   && '✅'}
          {status === 'error'     && '❌'}
        </div>

        {status === 'verifying' && (
          <>
            <h1 className="text-2xl text-gray-900 mb-2" style={{ fontFamily: '"Kanit", sans-serif' }}>Verifying…</h1>
            <p className="text-gray-400 text-sm">Just a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <h1 className="text-2xl text-gray-900 mb-3" style={{ fontFamily: '"Kanit", sans-serif' }}>Email verified</h1>
            <p className="text-gray-400 text-sm mb-8">Your account is active. You can now log in.</p>
            <Link
              to="/login"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-black transition-colors"
            >
              Log in →
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-2xl text-gray-900 mb-3" style={{ fontFamily: '"Kanit", sans-serif' }}>Link invalid</h1>
            <p className="text-gray-400 text-sm mb-8">This verification link has expired or already been used.</p>
            <Link
              to="/register"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-black transition-colors"
            >
              Sign up again
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
