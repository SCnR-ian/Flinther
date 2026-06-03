import { Link } from 'react-router-dom'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block">← Back</Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>By creating an account or using Flinther ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. Description of Service</h2>
            <p>Flinther is a club management platform that enables sports clubs and their members to manage bookings, coaching sessions, schedules, and related activities. The Service is provided to clubs and their authorised members.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">3. Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information when registering and to notify us promptly of any unauthorised use of your account. You must be at least 16 years old to create an account.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">4. Acceptable Use</h2>
            <p>You agree not to misuse the Service. This includes, but is not limited to: attempting to gain unauthorised access to other accounts or systems, submitting false or misleading information, or using the Service for any unlawful purpose.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">5. Payments and Fees</h2>
            <p>Certain features of the Service may require payment. Any applicable fees will be clearly communicated before you are charged. All payments are non-refundable unless otherwise stated or required by applicable law.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">6. Cancellations and Bookings</h2>
            <p>Cancellation policies for bookings and coaching sessions are set by the individual club. Flinther is not responsible for any refunds or disputes arising from club-specific cancellation policies.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Flinther shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. The Service is provided "as is" without warranties of any kind.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">8. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the Service after changes are posted constitutes your acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">9. Contact</h2>
            <p>For any questions about these Terms, please contact us at <a href="mailto:support@flinther.com" className="underline hover:text-gray-500">support@flinther.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
