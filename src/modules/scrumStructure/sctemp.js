import React, { useState, useRef, useCallback } from "react";
import { ChevronUp, ChevronDown, Plus, Trash2, GripVertical, Copy } from "lucide-react";

// ---------------------------------------------------------------------------
// Column definitions — mirrors the structure of Scrum_Structure.xlsx
// ---------------------------------------------------------------------------
const COLUMNS = [
  { key: "companyName", label: "Company Name", width: 140, type: "text" },
  { key: "hrId", label: "HR ID", width: 130, type: "text" },
  { key: "hrTitle", label: "HR Title", width: 170, type: "text" },
  { key: "hiringManagerPoc", label: "Hiring Mgr POC", width: 90, type: "select", options: ["Y", "N"] },
  { key: "category", label: "Category", width: 110, type: "select", options: ["Diamond", "Gold", "Silver", "Bronze"] },
  { key: "interviewRounds", label: "# Rounds", width: 80, type: "number" },
  { key: "inboundOutbound", label: "In/Out", width: 80, type: "select", options: ["AM", "Inbound", "Outbound"] },
  { key: "status", label: "Status", width: 110, type: "select", options: ["Fasttrack", "Medium", "Slow", "Covered"] },
  { key: "activeTRs", label: "Active TRs", width: 80, type: "number" },
  { key: "ta", label: "TA", width: 100, type: "text" },
  { key: "ctcBudget", label: "CTC Budget", width: 100, type: "text" },
  { key: "feePercent", label: "Fee %", width: 90, type: "number" },
  { key: "totalRevenue", label: "Total Revenue", width: 110, type: "number" },
  { key: "hrStatus", label: "HR Status", width: 150, type: "text" },
  { key: "hrCreatedDate", label: "HR Created", width: 110, type: "date" },
  { key: "daysOpen", label: "Days Open", width: 90, type: "number" },
  { key: "activeProfiles", label: "Active Profiles", width: 100, type: "number" },
  { key: "notes", label: "Updates / Notes", width: 260, type: "textarea" },
];

const uid = () => Math.random().toString(36).slice(2, 10);

const emptyRow = () =>
  COLUMNS.reduce(
    (acc, c) => ({ ...acc, [c.key]: "" }),
    { id: uid() }
  );

const SEED_ROWS = [
  {
    id: uid(),
    companyName: "Meculax",
    hrId: "HR170226155139",
    hrTitle: "Lead Software Engineer",
    hiringManagerPoc: "Y",
    category: "Diamond",
    interviewRounds: 3,
    inboundOutbound: "AM",
    status: "Fasttrack",
    activeTRs: 3,
    ta: "Mazahar",
    ctcBudget: "40 LPA",
    feePercent: 10,
    totalRevenue: 1200000,
    hrStatus: "In Process (Active)",
    hrCreatedDate: "2026-05-05",
    daysOpen: 45,
    activeProfiles: 3,
    notes: "Vinod Dhekane - L1 28 Apr 9PM IST. Rohit Gulve - L1 24 Apr, L2 29 Apr.",
  },
  {
    id: uid(),
    companyName: "Meculax",
    hrId: "HR170226155139",
    hrTitle: "Lead Software Engineer",
    hiringManagerPoc: "N",
    category: "Diamond",
    interviewRounds: 3,
    inboundOutbound: "AM",
    status: "Medium",
    activeTRs: 1,
    ta: "Sana",
    ctcBudget: "40 LPA",
    feePercent: 10,
    totalRevenue: 400000,
    hrStatus: "In Process (Active)",
    hrCreatedDate: "2026-02-04",
    daysOpen: 135,
    activeProfiles: 1,
    notes: "Screen reject cluster - see master thread for full history.",
  },
  {
    id: uid(),
    companyName: "Meculax",
    hrId: "HR170226155139",
    hrTitle: "Lead Software Engineer",
    hiringManagerPoc: "Y",
    category: "Diamond",
    interviewRounds: 3,
    inboundOutbound: "AM",
    status: "Covered",
    activeTRs: 2,
    ta: "Ruhi",
    ctcBudget: "40 LPA",
    feePercent: 10,
    totalRevenue: 800000,
    hrStatus: "In Process (Active)",
    hrCreatedDate: "2026-04-16",
    daysOpen: 64,
    activeProfiles: 6,
    notes: "6 active profiles in pipeline, 2 at L2.",
  },
  {
    id: uid(),
    companyName: "Meculax",
    hrId: "HR170226155139",
    hrTitle: "Lead Software Engineer",
    hiringManagerPoc: "N",
    category: "Diamond",
    interviewRounds: 3,
    inboundOutbound: "AM",
    status: "Slow",
    activeTRs: 1,
    ta: "Mazahar",
    ctcBudget: "40 LPA",
    feePercent: 10,
    totalRevenue: 400000,
    hrStatus: "In Process (Active)",
    hrCreatedDate: "2026-04-28",
    daysOpen: 52,
    activeProfiles: 1,
    notes: "Slow movement - needs follow-up call.",
  },
];

const STATUS_COLORS = {
  Fasttrack: "#1f9d55",
  Medium: "#d97706",
  Slow: "#dc2626",
  Covered: "#2563eb",
};

function StatusPill({ value }) {
  if (!value) return null;
  const color = STATUS_COLORS[value] || "#6b7280";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        color: "#fff",
        background: color,
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  );
}

function Cell({ row, col, isEditing, onStartEdit, onChange, onCommit }) {
  const value = row[col.key];

  if (!isEditing) {
    let display = value === "" || value == null ? "" : value;
    if (col.key === "status") {
      return (
        <div
          onClick={onStartEdit}
          style={{ cursor: "text", padding: "6px 8px", minHeight: 30, display: "flex", alignItems: "center" }}
        >
          <StatusPill value={value} />
        </div>
      );
    }
    return (
      <div
        onClick={onStartEdit}
        title={String(display)}
        style={{
          cursor: "text",
          padding: "6px 8px",
          minHeight: 30,
          whiteSpace: col.type === "textarea" ? "pre-wrap" : "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: display === "" ? "#b8bcc4" : "#1f2430",
        }}
      >
        {display === "" ? "—" : display}
      </div>
    );
  }

  const baseStyle = {
    width: "100%",
    border: "1px solid #4c6ef5",
    borderRadius: 4,
    padding: "5px 7px",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    background: "#fff",
  };

  if (col.type === "select") {
    return (
      <select
        autoFocus
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        style={baseStyle}
      >
        <option value="" />
        {col.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
  if (col.type === "textarea") {
    return (
      <textarea
        autoFocus
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        rows={3}
        style={{ ...baseStyle, resize: "vertical", minWidth: 220 }}
      />
    );
  }
  return (
    <input
      autoFocus
      type={col.type === "number" ? "number" : col.type === "date" ? "date" : "text"}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onCommit}
      onKeyDown={(e) => {
        if (e.key === "Enter") onCommit();
      }}
      style={baseStyle}
    />
  );
}

export default function ScrumStructure() {
  const [rows, setRows] = useState(SEED_ROWS);
  const [editingCell, setEditingCell] = useState(null); // { rowId, colKey }
  const [selectedRow, setSelectedRow] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const dragIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const updateCell = (rowId, key, val) => {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, [key]: val } : r)));
  };

  const moveRow = useCallback((index, dir) => {
    setRows((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      setTimeout(() => {
        setFlashId(next[target].id);
        setTimeout(() => setFlashId(null), 500);
      }, 0);
      return next;
    });
  }, []);

  const addRow = (index) => {
    setRows((prev) => {
      const next = [...prev];
      const row = emptyRow();
      next.splice(index + 1, 0, row);
      setTimeout(() => {
        setFlashId(row.id);
        setTimeout(() => setFlashId(null), 600);
      }, 0);
      return next;
    });
  };

  const duplicateRow = (index) => {
    setRows((prev) => {
      const next = [...prev];
      const copy = { ...next[index], id: uid() };
      next.splice(index + 1, 0, copy);
      return next;
    });
  };

  const deleteRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelectedRow(null);
  };

  const onDragStart = (index) => {
    dragIndex.current = index;
  };
  const onDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const onDrop = (index) => {
    setRows((prev) => {
      const from = dragIndex.current;
      if (from === null || from === index) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#f4f5f7",
        minHeight: "100%",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#1f2430", letterSpacing: -0.3 }}>
            Recruitment Tracker
          </h1>
          <p style={{ fontSize: 12.5, color: "#6b7280", margin: "4px 0 0" }}>
            Click any cell to edit. Use the arrows to reorder rows, like dragging rows in Excel — or drag the handle.
          </p>
        </div>
        <button
          onClick={() => addRow(rows.length - 1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#4c6ef5",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={15} /> Add Row
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          overflow: "auto",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
          maxWidth: "100%",
        }}
      >
        <table style={{ borderCollapse: "collapse", fontSize: 13, minWidth: "100%" }}>
          <thead>
            <tr>
              <th
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                  background: "#eef0f4",
                  borderBottom: "1px solid #e5e7eb",
                  padding: "8px 6px",
                  width: 96,
                  minWidth: 96,
                }}
              />
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  style={{
                    textAlign: "left",
                    padding: "8px 8px",
                    background: "#eef0f4",
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight: 600,
                    color: "#444b5a",
                    fontSize: 11.5,
                    textTransform: "uppercase",
                    letterSpacing: 0.3,
                    minWidth: c.width,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.label}
                </th>
              ))}
              <th
                style={{
                  background: "#eef0f4",
                  borderBottom: "1px solid #e5e7eb",
                  width: 44,
                }}
              />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id}
                onDragOver={(e) => onDragOver(e, index)}
                onDrop={() => onDrop(index)}
                style={{
                  background:
                    flashId === row.id
                      ? "#dfe8ff"
                      : dragOverIndex === index
                      ? "#f0f4ff"
                      : selectedRow === row.id
                      ? "#f7f8fb"
                      : "#fff",
                  transition: "background 0.4s ease",
                }}
                onClick={() => setSelectedRow(row.id)}
              >
                <td
                  style={{
                    position: "sticky",
                    left: 0,
                    background: "inherit",
                    borderBottom: "1px solid #f0f1f4",
                    padding: "4px 6px",
                    verticalAlign: "top",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <span
                      draggable
                      onDragStart={() => onDragStart(index)}
                      title="Drag to reorder"
                      style={{ cursor: "grab", color: "#b8bcc4", display: "flex" }}
                    >
                      <GripVertical size={14} />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveRow(index, -1);
                      }}
                      disabled={index === 0}
                      title="Move row up"
                      style={iconBtnStyle(index === 0)}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveRow(index, 1);
                      }}
                      disabled={index === rows.length - 1}
                      title="Move row down"
                      style={iconBtnStyle(index === rows.length - 1)}
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </td>
                {COLUMNS.map((col) => {
                  const isEditing =
                    editingCell &&
                    editingCell.rowId === row.id &&
                    editingCell.colKey === col.key;
                  return (
                    <td
                      key={col.key}
                      style={{
                        borderBottom: "1px solid #f0f1f4",
                        borderRight: "1px solid #f5f6f8",
                        padding: 0,
                        verticalAlign: "top",
                        minWidth: col.width,
                      }}
                    >
                      <Cell
                        row={row}
                        col={col}
                        isEditing={isEditing}
                        onStartEdit={() => setEditingCell({ rowId: row.id, colKey: col.key })}
                        onChange={(val) => updateCell(row.id, col.key, val)}
                        onCommit={() => setEditingCell(null)}
                      />
                    </td>
                  );
                })}
                <td style={{ borderBottom: "1px solid #f0f1f4", padding: "4px 6px" }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateRow(index);
                      }}
                      title="Duplicate row"
                      style={iconBtnStyle(false)}
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRow(row.id);
                      }}
                      title="Delete row"
                      style={iconBtnStyle(false, "#dc2626")}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 11.5, color: "#9aa0ab", marginTop: 10 }}>
        {rows.length} row{rows.length !== 1 ? "s" : ""} · data only lives in this session
      </p>
    </div>
  );
}

function iconBtnStyle(disabled, color) {
  return {
    border: "none",
    background: "transparent",
    color: disabled ? "#d4d6db" : color || "#6b7280",
    cursor: disabled ? "default" : "pointer",
    padding: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  };
}
