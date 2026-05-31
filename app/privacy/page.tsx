export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <a href="/" className="text-sm font-bold text-slate-600 underline">
        ← Back to search
      </a>
      <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950">Privacy & GDPR</h1>
      <div className="mt-6 space-y-5 text-slate-700">
        <p>
          This starter app does not create user accounts, store flight searches, or save personal information in a database. Search requests are sent from the server to the configured flight API provider only to return live flight offers.
        </p>
        <p>
          Google Analytics is optional and loads only after the visitor grants consent in the banner. If consent is rejected, the app remains fully usable and analytics scripts are not loaded.
        </p>
        <p>
          If you later add price alerts or user accounts, add a formal privacy policy, cookie policy, account deletion flow, consent records, data retention policy, processor list, and export/delete rights handling before launch.
        </p>
        <p>
          Affiliate links are placeholders in this codebase. Replace them with your approved travel partner links and disclose sponsored/affiliate relationships clearly to visitors.
        </p>
      </div>
    </main>
  );
}
