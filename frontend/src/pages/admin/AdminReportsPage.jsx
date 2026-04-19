import React, { useState, useEffect } from "react";
import { FiInbox, FiUsers, FiCheck, FiClock, FiDownload } from "react-icons/fi";
import { adminToast } from "../../lib/notifications";
import { staffApi } from "../../lib/api/staffApi";
import { adminApi } from "../../lib/api/adminApi";
import { parseApiError } from "../../lib/api/errors";

const statusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "released":
      return "bg-green-100 text-green-800";
    case "approved":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function escapeCsvCell(val) {
  const s = val == null ? "" : String(val);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(filename, rows, headers) {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];
  const blob = new Blob([lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function mapHistoryRow(r) {
  return {
    id: r.id,
    user_name: r.user_name || "System",
    action: r.action || "—",
    role: r.role || "—",
    date: r.date || "—",
    time: r.time || "",
  };
}

function openPrintableExport(exportData, summary) {
  const w = window.open("", "_blank");
  if (!w) {
    adminToast.error("Popup blocked", "Allow popups to print or save as PDF.");
    return;
  }
  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  const summaryRows = summary
    ? `<p style="margin:0 0 12px;font-size:14px;">
        Total requests: <strong>${esc(summary.total_requests)}</strong>
        · Avg. processing (days): <strong>${summary.avg_processing_time_days != null ? esc(String(summary.avg_processing_time_days)) : "—"}</strong>
        · Approval rate: <strong>${summary.approval_rate != null ? `${esc(String(summary.approval_rate))}%` : "—"}</strong>
      </p>`
    : "";
  const tableRows = exportData
    .map(
      (row) => `
    <tr>
      <td>${esc(row.student_number)}</td>
      <td>${esc(row.student_name)}</td>
      <td>${esc(row.record_type)}</td>
      <td>${esc(row.purpose)}</td>
      <td>${esc(row.status)}</td>
      <td>${esc(row.requested_at)}</td>
      <td>${esc(row.processed_at)}</td>
      <td>${esc(row.released_at)}</td>
    </tr>
  `,
    )
    .join("");
  w.document
    .write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Reports export</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 24px; color: #111; }
      h1 { font-size: 20px; margin: 0 0 16px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
      th { background: #f3f4f6; }
    </style></head><body>
    <h1>Record requests report</h1>
    ${summaryRows}
    <table>
      <thead><tr>
        <th>Student #</th><th>Name</th><th>Record type</th><th>Purpose</th><th>Status</th>
        <th>Requested</th><th>Processed</th><th>Released</th>
      </tr></thead>
      <tbody>${tableRows || '<tr><td colspan="8">No records.</td></tr>'}</tbody>
    </table>
    </body></html>`);
  w.document.close();
  w.onload = () => {
    w.focus();
    w.print();
  };
}

const AdminReportsPage = () => {
  const [summary, setSummary] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);

      const res = await staffApi.getTransactionHistory({
        per_page: 10,
        page: page,
      });

      const list = Array.isArray(res?.data) ? res.data : [];

      setRecentRequests(list.map(mapHistoryRow));

      setPagination({
        current_page: res.current_page,
        last_page: res.last_page,
      });
    } catch (err) {
      const parsed = parseApiError(err);
      setLoadError(parsed.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHistory(1);
  }, []);

  const runExport = async (kind) => {
    setExportLoading(true);
    try {
      const res = await adminApi.exportReports();
      const exportData = Array.isArray(res?.export_data) ? res.export_data : [];
      const summaryExport = res?.summary ?? null;
      if (kind === "csv") {
        const headers = [
          "student_number",
          "student_name",
          "record_type",
          "purpose",
          "status",
          "requested_at",
          "processed_at",
          "released_at",
        ];
        const rows = exportData.map((row) => headers.map((h) => row[h]));
        const stamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:T]/g, "-");
        downloadCsv(`reports_export_${stamp}.csv`, rows, headers);
        adminToast.success("Export completed", "CSV downloaded.");
      } else {
        openPrintableExport(exportData, summaryExport);
        adminToast.success(
          "Print dialog opened",
          "Use your browser to save as PDF.",
        );
      }
    } catch (err) {
      const parsed = parseApiError(err);
      adminToast.error(
        "Export failed",
        parsed.message || "Could not export reports.",
      );
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportCSV = () => runExport("csv");
  const handleExportPDF = () => runExport("pdf");

  return (
    <>
      <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="m-0 text-2xl font-bold text-gray-800">Reports</h2>
          <p className="mt-1 m-0 text-gray-600 text-sm">
            Full reports with export. Admin-only access.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={exportLoading}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-tmcc text-white hover:bg-tmcc-dark disabled:opacity-70"
          >
            <FiDownload /> Export CSV
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={exportLoading}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-staff-red text-white hover:opacity-90 disabled:opacity-70"
          >
            <FiDownload /> Export PDF
          </button>
        </div>
      </section>

      {loadError && (
        <div
          className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm"
          role="alert"
        >
          {loadError}
        </div>
      )}

      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100">
          <h3 className="mt-0 mb-2 text-lg font-semibold text-gray-800">
            Summary
          </h3>
          <p className="m-0 text-sm text-gray-500">
            Key performance indicators from live data.
          </p>
        </div>
        {loading && !summary ? (
          <div className="p-8 text-center text-gray-500">
            Loading summary...
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gray-50 border-l-4 border-blue-500">
              <FiClock className="w-7 h-7 mb-2 text-blue-500" aria-hidden />
              <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">
                Processed Today
              </h4>
              <p className="m-0 text-2xl font-bold text-gray-800">
                {summary?.processed_today ?? "—"}
              </p>
              <small className="block mt-1 text-gray-400 text-xs">
                Approved/rejected today
              </small>
            </div>
            <div className="p-5 rounded-xl bg-gray-50 border-l-4 border-indigo-500">
              <FiUsers className="w-7 h-7 mb-2 text-indigo-500" aria-hidden />
              <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">
                Students
              </h4>
              <p className="m-0 text-2xl font-bold text-gray-800">
                {summary?.students_count ?? "—"}
              </p>
              <small className="block mt-1 text-gray-400 text-xs">
                Total in system
              </small>
            </div>
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="mt-0 mb-2 text-lg font-semibold text-gray-800">
            Transaction History
          </h3>
          <p className="m-0 text-sm text-gray-500">
            Recent record requests (newest first).
          </p>
        </div>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm border-collapse"
            aria-label="Transaction history"
          >
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Role</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : recentRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-gray-500 italic"
                  >
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                recentRequests.map((row) => (
                  <tr key={row.id}>
                    <td className="py-3 px-4">{row.user_name}</td>
                    <td className="py-3 px-4">{row.action}</td>
                    <td className="py-3 px-4">{row.role}</td>
                    <td className="py-3 px-4">{row.date}</td>
                    <td className="py-3 px-4">{row.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-sm text-gray-500 flex items-center justify-between">
          <div className="flex gap-2 justify-center py-4">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => fetchHistory(p)}
                  className={`px-3 py-1 rounded ${
                    p === pagination.current_page
                      ? "bg-tmcc text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminReportsPage;
