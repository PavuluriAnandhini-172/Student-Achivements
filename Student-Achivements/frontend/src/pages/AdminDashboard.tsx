import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, getStudentByRegNumber, getStudentAchievements, getStudentDocuments, getAllStudents, updateAchievementStatus, type Student, type Achievement, type Document as DocType } from "@/lib/store";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AchievementCard } from "@/components/AchievementCard";
import { StatCard } from "@/components/StatCard";
import { Search, FileText, User, Check, XIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { navigate("/admin-login"); return; }
    setAdminToken(token);
    fetchAllDocuments(token);
    setAllStudents(getAllStudents()); // keep local for now
  }, [navigate]);

  const fetchAllDocuments = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const docs = await res.json();
        setAllDocuments(docs);
      }
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const student = getStudentByRegNumber(searchQuery.trim());
    if (!student) {
      toast.error("No student found with that registration number");
      setSelectedStudent(null);
      return;
    }
    setSelectedStudent(student);
    setAchievements(getStudentAchievements(student.id));
    setDocuments(getStudentDocuments(student.id));
  };

  const handleStatusUpdate = (id: string, status: Achievement["status"]) => {
    updateAchievementStatus(id, status);
    if (selectedStudent) {
      setAchievements(getStudentAchievements(selectedStudent.id));
    }
    toast.success(`Achievement ${status.toLowerCase()}`);
  };

  const inputClass = "w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <DashboardLayout type="admin">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">Search and manage student records</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Registered Students" value={allStudents.length} />
        <StatCard label="Admin" value="Active" variant="success" />
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="bg-card border border-border rounded-lg p-6 shadow-sm mb-8">
        <h6 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          Search Student
        </h6>
        <div className="flex gap-3">
          <input className={inputClass} placeholder="Enter registration number, e.g. 21BCE10234" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
            Search
          </button>
        </div>
      </form>

      {selectedStudent && (
        <div className="space-y-6 animate-fade-in">
          {/* Student Info */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h6 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Student Profile
            </h6>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-muted-foreground block">Name</span><span className="font-medium">{selectedStudent.name}</span></div>
              <div><span className="text-muted-foreground block">Reg. Number</span><span className="font-mono-id">{selectedStudent.regNumber}</span></div>
              <div><span className="text-muted-foreground block">Email</span><span>{selectedStudent.email}</span></div>
              <div><span className="text-muted-foreground block">Program</span><span>{selectedStudent.academicProgram}</span></div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h6 className="font-semibold text-foreground mb-4">{achievements.length} Achievements</h6>
            {achievements.length === 0 ? (
              <p className="text-muted-foreground text-sm">No achievements found.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((a) => (
                  <div key={a.id} className="relative">
                    <AchievementCard achievement={a} />
                    {a.status === "Pending" && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleStatusUpdate(a.id, "Verified")} className="flex-1 inline-flex items-center justify-center gap-1 bg-success text-success-foreground py-1.5 rounded-md text-xs font-medium">
                          <Check className="w-3 h-3" /> Verify
                        </button>
                        <button onClick={() => handleStatusUpdate(a.id, "Rejected")} className="flex-1 inline-flex items-center justify-center gap-1 bg-destructive text-destructive-foreground py-1.5 rounded-md text-xs font-medium">
                          <XIcon className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents */}
          <div>
            <h6 className="font-semibold text-foreground mb-4">{documents.length} Documents</h6>
            {documents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No documents found.</p>
            ) : (
              <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-accent/50">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">File</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-4 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />{doc.docType}</td>
                        <td className="py-3 px-4 font-mono-id text-muted-foreground hidden sm:table-cell">{doc.fileName}</td>
                        <td className="py-3 px-4 text-muted-foreground">{format(new Date(doc.uploadedAt), "MMM dd, yyyy")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Documents */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h6 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            All Student Documents ({allDocuments.length})
          </h6>
        </div>
        {allDocuments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground text-sm">No documents uploaded yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Document Type</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">File Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Uploaded</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allDocuments.map((doc) => (
                <tr key={doc._id} className="border-b border-border last:border-0">
                  <td className="py-3 px-4">
                    <div className="font-medium">{doc.studentId?.name}</div>
                    <div className="text-xs text-muted-foreground font-mono-id">{doc.studentId?.regNumber}</div>
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    {doc.docType}
                  </td>
                  <td className="py-3 px-4 font-mono-id text-muted-foreground hidden sm:table-cell">
                    {doc.fileData ? (
                      <a href={doc.fileData} download={doc.fileName} className="text-primary hover:underline">
                        {doc.fileName}
                      </a>
                    ) : (
                      doc.fileName
                    )}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{format(new Date(doc.uploadedAt), "MMM dd, yyyy")}</td>
                  <td className="py-3 px-4">
                    {doc.fileData && (
                      <a href={doc.fileData} download={doc.fileName} className="text-primary hover:underline text-sm">
                        <Download className="w-4 h-4 inline mr-1" />
                        Download
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
