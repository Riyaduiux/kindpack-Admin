import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

const escape = (v: unknown) => {
  const s = Array.isArray(v) ? v.join('; ') : v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function downloadFile(filename: string, content: string, type = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob(['﻿' + content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Builds a CSV from plain objects. */
export function toCsv(rows: Record<string, unknown>[], headers?: { key: string; label: string }[]) {
  const cols = headers ?? Object.keys(rows[0] ?? {}).map((k) => ({ key: k, label: k }));
  return [cols.map((c) => escape(c.label)).join(','), ...rows.map((r) => cols.map((c) => escape(r[c.key])).join(','))].join('\n');
}

/** CSV of table rows using the table's own columns and formatters. */
export function gridToCsv<T extends GridValidRowModel>(columns: GridColDef<T>[], rows: T[]) {
  const cols = columns.filter((c) => !c.field.startsWith('__'));
  const header = cols.map((c) => escape(c.headerName ?? c.field)).join(',');
  const body = rows.map((row) =>
    cols
      .map((c) => {
        let value: unknown = (row as Record<string, unknown>)[c.field];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (c.valueGetter) value = (c.valueGetter as any)(value, row, c, undefined);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (c.valueFormatter) value = (c.valueFormatter as any)(value, row, c, undefined);
        return escape(value);
      })
      .join(','),
  );
  return [header, ...body].join('\n');
}

export const fileStamp = () => new Date().toISOString().slice(0, 10);
