import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Welcome to <span className="text-blue-600">Scholarly</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          The official digital report portal. Access your grades, view class
          rankings, and track your academic performance in real-time.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            Student Login
          </Link>
          <Link
            href="/ranking"
            className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            View Rankings
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="font-bold text-xl mb-2">Live Reports</h3>
            <p className="text-gray-600">
              See your subject scores as soon as teachers upload them.
            </p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="font-bold text-xl mb-2">Class Rankings</h3>
            <p className="text-gray-600">
              See where you stand among your peers and stay motivated.
            </p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="font-bold text-xl mb-2">Mobile Ready</h3>
            <p className="text-gray-600">
              Check your results on the go from any smartphone or tablet.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Scholarly Portal • Built for School
        Excellence
      </footer>
    </div>
  );
}
