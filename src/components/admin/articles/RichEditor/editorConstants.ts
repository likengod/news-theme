export const TEXT_PALETTE_ROWS = [
  ["#000000", "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#ffffff"],
  ["#450a0a", "#7f1d1d", "#991b1b", "#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5"],
  ["#431407", "#7c2d12", "#9a3412", "#c2410c", "#ea580c", "#f97316", "#fb923c", "#fdba74"],
  ["#422006", "#713f12", "#854d0e", "#a16207", "#ca8a04", "#eab308", "#facc15", "#fef08a"],
  ["#052e16", "#14532d", "#166534", "#15803d", "#16a34a", "#22c55e", "#4ade80", "#86efac"],
  ["#042f2e", "#134e4a", "#115e59", "#0f766e", "#0d9488", "#14b8a6", "#2dd4bf", "#5eead4"],
  ["#172554", "#1e3a8a", "#1e40af", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"],
  ["#3b0764", "#581c87", "#6b21a8", "#7e22ce", "#9333ea", "#a855f7", "#c084fc", "#e9d5ff"],
];

export const HIGHLIGHT_PALETTE_ROWS = [
  ["#fef08a", "#fde047", "#facc15", "#eab308"],
  ["#bbf7d0", "#86efac", "#4ade80", "#22c55e"],
  ["#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9"],
  ["#fbcfe8", "#f472b6", "#ec4899", "#db2777"],
  ["#fed7aa", "#fdba74", "#fb923c", "#f97316"],
  ["#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7"],
  ["#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8"],
];

export const FONT_SIZES = ["12", "14", "16", "18", "20", "24", "28", "32", "36"];

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function createTableHtml(): string {
  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #cbd5e1;font-size:14px">
      <thead>
        <tr style="background:#f8fafc">
          <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:left;font-weight:600">Header 1</th>
          <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:left;font-weight:600">Header 2</th>
          <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:left;font-weight:600">Header 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 1, Cell 1</td>
          <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 1, Cell 2</td>
          <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 1, Cell 3</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 2, Cell 1</td>
          <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 2, Cell 2</td>
          <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 2, Cell 3</td>
        </tr>
      </tbody>
    </table>
    <p><br/></p>
  `;
}
