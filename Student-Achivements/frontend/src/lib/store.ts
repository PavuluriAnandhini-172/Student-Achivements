export interface Student {
  id: string;
  name: string;
  regNumber: string;
  email: string;
  phone: string;
  admissionCategory: string;
  academicProgram: string;
  password: string;
  avatar?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  studentId: string;
  title: string;
  activityType: string;
  academicYear: string;
  semester: string;
  description: string;
  certificateFileName?: string;
  certificateData?: string;
  status: "Pending" | "Verified" | "Rejected";
  createdAt: string;
}

export interface Document {
  id: string;
  studentId: string;
  docType: string;
  fileName: string;
  fileData?: string;
  uploadedAt: string;
}

const STUDENTS_KEY = "csapms_students";
const ACHIEVEMENTS_KEY = "csapms_achievements";
const DOCUMENTS_KEY = "csapms_documents";
const SESSION_KEY = "csapms_session";

function getItems<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function setItems<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

// Students
export function registerStudent(data: Omit<Student, "id" | "createdAt">): Student {
  const students = getItems<Student>(STUDENTS_KEY);
  if (students.find((s) => s.regNumber === data.regNumber)) {
    throw new Error("Registration number already exists");
  }
  if (students.find((s) => s.email === data.email)) {
    throw new Error("Email already registered");
  }
  const student: Student = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
  students.push(student);
  setItems(STUDENTS_KEY, students);
  return student;
}

export function loginStudent(regNumber: string, password: string): Student {
  const students = getItems<Student>(STUDENTS_KEY);
  const student = students.find((s) => s.regNumber === regNumber && s.password === password);
  if (!student) throw new Error("Invalid credentials");
  localStorage.setItem(SESSION_KEY, JSON.stringify({ type: "student", id: student.id }));
  return student;
}

export function loginAdmin(username: string, password: string): boolean {
  if (username === "admin" && password === "admin123") {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ type: "admin" }));
    return true;
  }
  throw new Error("Invalid admin credentials");
}

export function getSession(): { type: "student" | "admin"; id?: string } | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentStudent(): Student | null {
  const session = getSession();
  if (!session || session.type !== "student") return null;
  return getItems<Student>(STUDENTS_KEY).find((s) => s.id === session.id) || null;
}

export function updateStudent(id: string, data: Partial<Student>) {
  const students = getItems<Student>(STUDENTS_KEY);
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Student not found");
  students[idx] = { ...students[idx], ...data };
  setItems(STUDENTS_KEY, students);
  return students[idx];
}

export function getStudentByRegNumber(regNumber: string): Student | undefined {
  return getItems<Student>(STUDENTS_KEY).find((s) => s.regNumber === regNumber);
}

export function getAllStudents(): Student[] {
  return getItems<Student>(STUDENTS_KEY);
}

// Achievements
export function addAchievement(data: Omit<Achievement, "id" | "status" | "createdAt">): Achievement {
  const achievements = getItems<Achievement>(ACHIEVEMENTS_KEY);
  const achievement: Achievement = { ...data, id: Date.now().toString(), status: "Pending", createdAt: new Date().toISOString() };
  achievements.push(achievement);
  setItems(ACHIEVEMENTS_KEY, achievements);
  return achievement;
}

export function getStudentAchievements(studentId: string): Achievement[] {
  return getItems<Achievement>(ACHIEVEMENTS_KEY).filter((a) => a.studentId === studentId);
}

export function updateAchievementStatus(id: string, status: Achievement["status"]) {
  const achievements = getItems<Achievement>(ACHIEVEMENTS_KEY);
  const idx = achievements.findIndex((a) => a.id === id);
  if (idx !== -1) {
    achievements[idx].status = status;
    setItems(ACHIEVEMENTS_KEY, achievements);
  }
}

// Documents
export function addDocument(data: Omit<Document, "id" | "uploadedAt">): Document {
  const docs = getItems<Document>(DOCUMENTS_KEY);
  const doc: Document = { ...data, id: Date.now().toString(), uploadedAt: new Date().toISOString() };
  docs.push(doc);
  setItems(DOCUMENTS_KEY, docs);
  return doc;
}

export function getStudentDocuments(studentId: string): Document[] {
  return getItems<Document>(DOCUMENTS_KEY).filter((d) => d.studentId === studentId);
}
