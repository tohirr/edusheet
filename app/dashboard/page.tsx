import { getServerSession } from "next-auth";
import { getSheetData } from "../lib/google-sheets";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const rows = await getSheetData();
  const studentData = rows?.find((row) => row[0] === session.user?.id);
  if (!studentData) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {studentData[1]}!</h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded shadow">
          <p className="text-gray-500">Math</p>
          <p className="text-3xl font-bold">{studentData[2]}</p>
        </div>
        <div className="p-4 border rounded shadow">
          <p className="text-gray-500">English</p>
          <p className="text-3xl font-bold">{studentData[3]}</p>
        </div>
        <div className="p-4 border rounded shadow">
          <p className="text-gray-500">Science</p>
          <p className="text-3xl font-bold">{studentData[4]}</p>
        </div>
      </div>
    </div>
  );
}
