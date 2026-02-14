"use client";

import type { RankingStudent } from "@/types";
import { Users } from "lucide-react";

type RankingTableProps = {
  classLabel: string;
  totalStudents: number;
  ranking: RankingStudent[];
  highlightStudentId?: string;
};

const getRankStyle = (position: number) => {
  if (position === 1) return "bg-yellow-100 text-yellow-700";
  if (position === 2) return "bg-gray-100 text-gray-700";
  if (position === 3) return "bg-orange-100 text-orange-700";
  return "bg-blue-50 text-blue-700";
};

export function RankingTable({
  classLabel,
  totalStudents,
  ranking,
  highlightStudentId,
}: RankingTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-white" />
          <h2 className="text-xl font-semibold text-white">
            Class Ranking - {classLabel}
          </h2>
        </div>
        <span className="text-white text-sm">{totalStudents} Students</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase">
                Total Score
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase">
                Average
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ranking.map((student) => {
              const isCurrentUser = student.studentId === highlightStudentId;
              return (
                <tr
                  key={student.studentId}
                  className={isCurrentUser ? "bg-indigo-50" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankStyle(student.position)}`}
                    >
                      {student.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {student.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-indigo-600">(You)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-lg font-semibold text-gray-900">
                    {student.total}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {student.average}%
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
