"use client";

import { ReportCard } from "@/components/ReportCard";
import { RankingTable } from "@/components/RankingTable";
import { getClassRanking, getStudentReport } from "@/lib/api-client";
import { clearUser, loadUser } from "@/lib/session";
import type { RankingStudent, Student, User } from "@/types";
import { FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const termOptions = [
  { value: "FirstTerm", label: "First Term" },
  { value: "SecondTerm", label: "Second Term" },
  { value: "ThirdTerm", label: "Third Term" },
];

type RankingPayload = {
  class: string;
  term: string;
  totalStudents: number;
  ranking: RankingStudent[];
};

export default function StudentDashboard() {
  const router = useRouter();
  const [view, setView] = useState<"report" | "ranking">("report");
  const [user, setUser] = useState<User | null>(null);
  const [report, setReport] = useState<Student | null>(null);
  const [ranking, setRanking] = useState<RankingPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState("FirstTerm");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = loadUser();
    if (!storedUser) {
      setLoadingUser(false);
      router.replace("/login");
      return;
    }
    setUser(storedUser);
    setLoadingUser(false);
  }, [router]);

  const sheetName = useMemo(() => {
    if (!user?.class) return null;
    return `${user.class}-${selectedTerm}`;
  }, [selectedTerm, user?.class]);

  useEffect(() => {
    if (!user || !sheetName) return;
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [reportData, rankingData] = await Promise.all([
          getStudentReport(user.id, sheetName),
          getClassRanking(sheetName),
        ]);
        setReport(reportData);
        setRanking(rankingData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sheetName, user]);

  const handleLogout = () => {
    clearUser();
    router.push("/login");
  };

  const myPosition =
    ranking?.ranking.find((student) => student.studentId === user?.id)
      ?.position || 0;

  if (loadingUser || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">ReportHub</h1>
              <p className="text-sm text-gray-600">Welcome, {user.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {termOptions.map((term) => (
                <option key={term.value} value={term.value}>
                  {term.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setView("report")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              view === "report"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            My Report Card
          </button>
          <button
            onClick={() => setView("ranking")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              view === "ranking"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Class Ranking
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {view === "report" && report && ranking && (
          <ReportCard
            report={report}
            myPosition={myPosition}
            totalStudents={ranking.totalStudents}
          />
        )}

        {view === "ranking" && ranking && (
          <RankingTable
            classLabel={ranking.class}
            totalStudents={ranking.totalStudents}
            ranking={ranking.ranking}
            highlightStudentId={user.id}
          />
        )}
      </div>
    </div>
  );
}
