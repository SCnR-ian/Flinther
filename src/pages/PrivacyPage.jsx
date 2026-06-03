import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block">← Back</Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly, including your name, email address, and password when you register. We also collect information about how you use the Service, such as booking history, session attendance, and activity within your club.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <p>We use your information to operate and improve the Service, process bookings and payments, send you notifications related to your account and club activities, and respond to your enquiries. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">3. Information Shared with Clubs</h2>
            <p>When you join a club on Flinther, your name, email address, and activity within that club (bookings, coaching sessions, check-ins) are accessible to that club's administrators. This is necessary to provide the Service.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">4. Third-Party Services</h2>
            <p>We may use third-party services for payment processing (such as Stripe) and authentication (such as Google OAuth). These services have their own privacy policies and we encourage you to review them. We only share the minimum information necessary.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">5. Data Security</h2>
            <p>We take reasonable technical and organisational measures to protect your personal information. However, no method of transmission over the internet is 100% secure and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">6. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide the Service. You may request deletion of your account by contacting us.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">7. Your Rights</h2>
            <p>You have the right to access, correct, or request deletion of your personal information. To exercise these rights, please contact us at <a href="mailto:support@flinther.com" className="underline hover:text-gray-500">support@flinther.com</a>.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">8. Cookies</h2>
            <p>We use cookies and similar technologies to maintain your session and improve your experience. You can control cookie settings through your browser, but disabling cookies may affect the functionality of the Service.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a notice within the Service.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">10. Contact</h2>
            <p>For any privacy-related questions, please contact us at <a href="mailto:support@flinther.com" className="underline hover:text-gray-500">support@flinther.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
