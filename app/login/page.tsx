"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [studentId, setStudentId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", { studentId, callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-8 border rounded shadow-md">
        <h1 className="text-xl font-bold mb-4">Student Login</h1>
        <input
          type="text"
          placeholder="Enter Student ID"
          className="border p-2 w-full mb-4"
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          View Report
        </button>
      </form>
    </div>
  );
}
