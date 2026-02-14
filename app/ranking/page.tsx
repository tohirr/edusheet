"use client";

import { RankingTable } from "@/components/RankingTable";
import {
  getAvailableClasses,
  getAvailableTerms,
  getClassRankingFromSheet,
} from "@/lib/public-sheet";
import type { RankingStudent } from "@/types";
import { useEffect, useState } from "react";

export default function RankingPage() {
  const [classes, setClasses] = useState<string[]>([]);
  const [terms, setTerms] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [ranking, setRanking] = useState<RankingStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFilters = async () => {
      setLoading(true);
      setError(null);
      try {
        const availableClasses = await getAvailableClasses();
        setClasses(availableClasses);
        const nextClass = availableClasses[0] ?? "";
        setSelectedClass(nextClass);

        const availableTerms = await getAvailableTerms(nextClass || undefined);
        setTerms(availableTerms);
        setSelectedTerm(availableTerms[0] ?? "");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load ranking data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    const loadTerms = async () => {
      if (!selectedClass) return;
      try {
        const availableTerms = await getAvailableTerms(selectedClass);
        setTerms(availableTerms);
        if (!availableTerms.includes(selectedTerm)) {
          setSelectedTerm(availableTerms[0] ?? "");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load terms",
        );
      }
    };

    loadTerms();
  }, [selectedClass]);

  useEffect(() => {
    const loadRanking = async () => {
      if (!selectedClass || !selectedTerm) return;
      setLoading(true);
      try {
        const data = await getClassRankingFromSheet(
          selectedClass,
          selectedTerm,
        );
        setRanking(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load ranking data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRanking();
  }, [selectedClass, selectedTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Academic Leaderboard
          </h1>
          <p className="text-gray-500">Public class ranking from the sheet.</p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 justify-between">
          <label className="flex flex-col text-sm text-gray-600">
            Class
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="mt-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              disabled={classes.length === 0}
            >
              {classes.length === 0 && <option value="">No classes</option>}
              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm text-gray-600">
            Term
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="mt-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              disabled={terms.length === 0}
            >
              {terms.length === 0 && <option value="">No terms</option>}
              {terms.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg bg-white shadow-sm border border-gray-200 px-6 py-4 text-center text-gray-700">
            Loading ranking...
          </div>
        ) : ranking.length === 0 ? (
          <div className="rounded-lg bg-white shadow-sm border border-gray-200 px-6 py-4 text-center text-gray-700">
            No results available for this class yet.
          </div>
        ) : (
          <RankingTable
            classLabel={selectedClass}
            totalStudents={ranking.length}
            ranking={ranking}
          />
        )}
      </div>
    </div>
  );
}
