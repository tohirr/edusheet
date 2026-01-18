import { getSheetData } from "../lib/google-sheets";

export default async function RankingPage() {
  const data = await getSheetData();
  if (!data) return <div className="p-10 text-center">No data found.</div>;

  // Map and sort students by Total Score (Column Index 5)
  const students = data
    .slice(1)
    .map((row) => ({
      id: row[0],
      name: row[1],
      total: parseFloat(row[5]) || 0,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Academic Leaderboard
        </h1>
        <p className="text-gray-500">
          Celebrating our top performers this term
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 font-semibold text-gray-700">Rank</th>
              <th className="px-6 py-4 font-semibold text-gray-700">
                Student Name
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-right">
                Total Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student, index) => {
              const rank = index + 1;
              // Style logic for top 3
              const isTop3 = rank <= 3;
              const rankStyles =
                rank === 1
                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                  : rank === 2
                    ? "bg-gray-100 text-gray-700 border-gray-200"
                    : rank === 3
                      ? "bg-orange-100 text-orange-700 border-orange-200"
                      : "bg-white text-gray-500";

              return (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold border ${rankStyles}`}
                    >
                      {rank}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 font-medium ${isTop3 ? "text-gray-900" : "text-gray-600"}`}
                  >
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-blue-600">
                    {student.total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
