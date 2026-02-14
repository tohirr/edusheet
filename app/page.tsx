import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="flex flex-col gap-6">
          <p className="uppercase tracking-[0.3em] text-sm text-indigo-600 font-semibold">
            Student Results Portal
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Track academic performance, rankings, and term reports in one place.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            ReportHub lets students log in with their school ID to view detailed
            results while keeping the class leaderboard available to everyone.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/login"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              Student Login
            </Link>
            <Link
              href="/ranking"
              className="px-6 py-3 rounded-lg border border-indigo-200 text-indigo-700 font-semibold hover:bg-white transition-colors"
            >
              View Public Ranking
            </Link>
          </div>
        </header>

        <section className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Private Results",
              body: "Access subject scores, averages, and term totals with confidence that your data stays private.",
            },
            {
              title: "Public Leaderboard",
              body: "Celebrate top performers with a clear class ranking view available to all students.",
            },
            {
              title: "Google Sheets Ready",
              body: "Teachers update results in Google Sheets while the portal syncs them instantly.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl shadow-sm p-6 border border-white/60"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 mt-2">{feature.body}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
