import Link from "next/link";
import { RankingTable } from "@/components/RankingTable";
import { getAllClassResults, getAvailableSheets } from "@/lib/google-sheets";

type RankingPageProps = {
  searchParams?: { sheet?: string | string[] };
};

export default async function RankingPage({ searchParams }: RankingPageProps) {
  const sheetParam = Array.isArray(searchParams?.sheet)
    ? searchParams?.sheet[0]
    : searchParams?.sheet;
  const sheets = await getAvailableSheets();

  if (!sheets.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto p-6 text-center text-gray-700">
          No sheets found. Ask your administrator to publish class results.
        </div>
      </div>
    );
  }

  if (!sheetParam || !sheets.includes(sheetParam)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto p-6">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Academic Leaderboard
            </h1>
            <p className="text-gray-500">
              Choose a class term to view the public ranking.
            </p>
          </header>

          <div className="grid gap-3">
            {sheets.map((sheet) => (
              <Link
                key={sheet}
                href={`/ranking?sheet=${encodeURIComponent(sheet)}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
              >
                {sheet}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const ranking = await getAllClassResults(sheetParam);
  const [className, term] = sheetParam.split("-");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Academic Leaderboard
          </h1>
          <p className="text-gray-500">
            {className} - {term || "Term"}
          </p>
        </header>

        {ranking.length === 0 ? (
          <div className="rounded-lg bg-white shadow-sm border border-gray-200 px-6 py-4 text-center text-gray-700">
            No results available for this class yet.
          </div>
        ) : (
          <RankingTable
            classLabel={className}
            totalStudents={ranking.length}
            ranking={ranking}
          />
        )}
      </div>
    </div>
  );
}
