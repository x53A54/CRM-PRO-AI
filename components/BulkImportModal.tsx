import React, { useMemo, useState } from "react";
import { bulkUploadLeads } from "../intelligenceService";

interface PreviewRow {
  name: string;
  email: string;
  phone: string;
  status: string;
  priority: string;
  value: string;
  followUpDate: string;
}

interface Props {
  onClose: () => void;
  onImportSuccess: (summary: {
    imported: number;
    skipped: number;
    errors: string[];
  }) => void;
}

const expectedHeaders = [
  "name",
  "email",
  "phone",
  "status",
  "priority",
  "value",
  "followUpDate"
];

const parseCsvLine = (line: string) => {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
};

const parseCsvPreview = (csvText: string): PreviewRow[] => {
  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1, 6).map(line => {
    const columns = parseCsvLine(line);

    return headers.reduce((row, header, index) => {
      row[header as keyof PreviewRow] = columns[index] || "";
      return row;
    }, {} as PreviewRow);
  });
};

const BulkImportModal: React.FC<Props> = ({ onClose, onImportSuccess }) => {
  const role = localStorage.getItem("role");
  const [file, setFile] = useState<File | null>(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [error, setError] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const previewHeaders = useMemo(() => expectedHeaders, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] || null;

    setFile(selectedFile);
    setPreviewRows([]);
    setError("");

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Only CSV files are supported right now.");
      return;
    }

    try {
      const text = await selectedFile.text();
      const headers = parseCsvLine(
        text
          .split(/\r?\n/)
          .find(line => line.trim()) || ""
      );

      const hasRequiredHeaders = expectedHeaders.every(header =>
        headers.includes(header)
      );

      if (!hasRequiredHeaders) {
        setError(
          "CSV headers must be: name,email,phone,status,priority,value,followUpDate"
        );
        return;
      }

      setPreviewRows(parseCsvPreview(text));
    } catch (readError) {
      console.error(readError);
      setError("Failed to read CSV file.");
    }
  };

  const handleImport = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      setError("Select a CSV file first.");
      return;
    }

    try {
      setIsImporting(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Missing auth token");
      }

      const summary = await bulkUploadLeads(
        token,
        file,
        role === "admin" ? assignedTo.trim() : undefined
      );

      onImportSuccess(summary);
      onClose();
    } catch (importError) {
      console.error(importError);
      setError(
        importError instanceof Error
          ? importError.message
          : "Failed to import leads."
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="glass relative z-10 w-full max-w-4xl rounded-2xl border border-white/10 p-8">
        <h3 className="mb-6 text-2xl font-bold text-[#06D001]">
          Import Leads
        </h3>

        <form onSubmit={handleImport} className="space-y-4">
          <div>
            <input
              id="csvUpload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <label
              htmlFor="csvUpload"
              className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-300 transition-all hover:border-[#06D001] hover:bg-[#06D001]/10"
            >
              Choose CSV File
            </label>

            <p className="mt-2 text-sm text-gray-400">
              {file ? file.name : "No file selected"}
            </p>
          </div>

          {role === "admin" && (
            <input
              placeholder="Assign Executive (User ID, optional)"
              value={assignedTo}
              onChange={event => setAssignedTo(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            />
          )}

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          {previewRows.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-gray-400">
                  <tr>
                    {previewHeaders.map(header => (
                      <th key={header} className="px-3 py-2">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, index) => (
                    <tr
                      key={`${row.email}-${index}`}
                      className="border-b border-white/5"
                    >
                      {previewHeaders.map(header => (
                        <td key={header} className="px-3 py-2 text-white">
                          {row[header as keyof PreviewRow] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white/5 px-6 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!file || isImporting}
              className="rounded-xl bg-[#06D001] px-6 py-2 font-bold text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isImporting ? "Importing..." : "Import Leads"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkImportModal;
