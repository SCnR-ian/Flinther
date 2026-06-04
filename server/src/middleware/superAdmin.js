const crypto = require('crypto')

// Constant-time comparison to avoid leaking the key via response timing.
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

/**
 * Middleware: validates the X-Super-Admin-Key header.
 * Used to protect super-admin endpoints that manage clubs.
 */
function requireSuperAdmin(req, res, next) {
  const key = req.headers['x-super-admin-key']
  if (!key || !process.env.SUPER_ADMIN_KEY || !safeEqual(key, process.env.SUPER_ADMIN_KEY)) {
    return res.status(403).json({ message: 'Forbidden.' })
  }
  next()
}

module.exports = { requireSuperAdmin }
