export async function loginStudent(username: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }

  return response.json();
}

export async function getStudentReport(studentId: string, sheetName: string) {
  if (!studentId) {
    throw new Error("Student ID is required");
  }
  const query = sheetName ? `?sheet=${sheetName}` : "";
  const response = await fetch(`/api/reports/${studentId}${query}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch report");
  }

  return response.json();
}

export async function getClassRanking(sheetName: string) {
  const query = sheetName ? `?sheet=${sheetName}` : "";
  const response = await fetch(`/api/ranking${query}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch ranking");
  }

  return response.json();
}

export async function getAvailableSheets() {
  const response = await fetch("/api/sheets");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch sheets");
  }

  return response.json();
}
