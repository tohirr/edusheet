"use client";

import type { Student } from "@/types";
import { Award, Calendar, FileText, TrendingUp } from "lucide-react";

type ReportCardProps = {
  report: Student;
  myPosition: number;
  totalStudents: number;
};

const getGradeColor = (grade: string) => {
  const colors: Record<string, string> = {
    A: "text-green-600 bg-green-50",
    B: "text-blue-600 bg-blue-50",
    C: "text-yellow-600 bg-yellow-50",
    D: "text-orange-600 bg-orange-50",
    E: "text-amber-600 bg-amber-50",
    F: "text-red-600 bg-red-50",
  };
  return colors[grade] || "text-gray-600 bg-gray-50";
};

export function ReportCard({
  report,
  myPosition,
  totalStudents,
}: ReportCardProps) {
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-3">
          <div className="bg-indigo-100 p-3 rounded-full">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Average Score</p>
            <p className="text-2xl font-bold text-gray-900">
              {report.average}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-3">
          <div className="bg-green-100 p-3 rounded-full">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Class Position</p>
            <p className="text-2xl font-bold text-gray-900">
              {myPosition}/{totalStudents}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-3">
          <div className="bg-purple-100 p-3 rounded-full">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Term</p>
            <p className="text-lg font-bold text-gray-900">{report.term}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-white" />
            <h2 className="text-xl font-semibold text-white">
              Academic Performance
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Subject
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase">
                  Score
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report.subjects.map((subject) => (
                <tr
                  key={`${subject.subject}-${subject.score}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {subject.subject}
                  </td>
                  <td className="px-6 py-4 text-center text-lg font-semibold text-gray-900">
                    {subject.score}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(subject.grade)}`}
                    >
                      {subject.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-indigo-50">
              <tr>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  TOTAL
                </td>
                <td className="px-6 py-4 text-center text-lg font-bold text-indigo-900">
                  {report.total}
                </td>
                <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Avg: {report.average}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
