"use client";

import { ReportCard } from "@/components/ReportCard";
import { RankingTable } from "@/components/RankingTable";
import {
  getAvailableTerms,
  getClassRankingFromSheet,
  getStudentReportFromSheet,
} from "@/lib/public-sheet";
import { clearUser, loadUser } from "@/lib/session";
import type { RankingStudent, Student, User } from "@/types";
import { FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [terms, setTerms] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = loadUser();
      if (!storedUser) {
        setLoadingUser(false);
        router.replace("/login");
        return;
      }
      setUser(storedUser);
      try {
        const availableTerms = await getAvailableTerms(storedUser.class);
        setTerms(availableTerms);
        if (availableTerms.length > 0) {
          setSelectedTerm(availableTerms[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load sheet terms",
        );
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserData();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const reportData = await getStudentReportFromSheet(
          user.id,
          selectedTerm || undefined,
        );
        if (!reportData) {
          setReport(null);
          setRanking(null);
          return;
        }
        const rankingData = await getClassRankingFromSheet(
          reportData.class,
          selectedTerm || reportData.term,
        );
        setReport(reportData);
        setRanking({
          class: reportData.class,
          term: selectedTerm || reportData.term,
          totalStudents: rankingData.length,
          ranking: rankingData,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedTerm, user]);

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
              disabled={terms.length === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {terms.length === 0 && (
                <option value="">No term data</option>
              )}
              {terms.map((term) => (
                <option key={term} value={term}>
                  {term}
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
