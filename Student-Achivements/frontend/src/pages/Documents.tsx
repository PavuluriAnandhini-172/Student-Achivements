import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentStudent, getStudentDocuments, addDocument, type Student, type Document as DocType } from "@/lib/store";
import { DashboardLayout } from "@/components/DashboardLayout";
import { toast } from "sonner";
import { Upload, FileText } from "lucide-react";
import { format } from "date-fns";

const docTypes = ["Mark Memo", "Aadhaar Card", "PAN Card", "Voter ID", "APAAR / ABC ID", "Transfer Certificate", "Migration Certificate", "Other"];

export default function Documents() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [docType, setDocType] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState<string>("");

  useEffect(() => {
    const s = getCurrentStudent();
    if (!s) { navigate("/login"); return; }
    setStudent(s);
    setDocuments(getStudentDocuments(s.id));
  }, [navigate]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !docType) return;
    if (!fileData) {
      toast.error("Please select a file to upload.");
      return;
    }

    addDocument({
      studentId: student.id,
      docType,
      fileName: fileName || `${docType}.pdf`,
      fileData,
    });

    toast.success("Document uploaded successfully!");
    setDocuments(getStudentDocuments(student.id));
    setDocType("");
    setFileName("");
    setFileData("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileData("");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFileData(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!student) return null;

  const inputClass = "w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Documents</h2>
        <p className="text-muted-foreground text-sm mt-1">Upload and manage your verification documents</p>
      </div>

      <form onSubmit={handleUpload} className="bg-card border border-border rounded-lg p-6 shadow-sm mb-8">
        <h6 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary" />
          Upload New Document
        </h6>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Document Type</label>
            <select required className={inputClass} value={docType} onChange={(e) => setDocType(e.target.value)}>
              <option value="">Select type</option>
              {docTypes.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Select File</label>
            <input
              required
              type="file"
              accept="application/pdf,image/*"
              className={inputClass}
              onChange={handleFileChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">File Name</label>
            <input
              className={inputClass}
              placeholder="e.g. markmemo_sem5.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-primary text-primary-foreground py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
            Upload Document
          </button>
        </div>
      </form>

      {documents.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground text-sm">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Document Type</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">File Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-border last:border-0">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
