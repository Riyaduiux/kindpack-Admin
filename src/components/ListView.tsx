import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react';
import { Box, Button, Card, IconButton, InputAdornment, ListItemIcon, Menu, MenuItem, TextField, Tooltip } from '@mui/material';
import { DataGrid, type GridColDef, type GridValidRowModel } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import { useSearchParams } from 'react-router';
import { useFeedback } from './Feedback';
import { downloadFile, fileStamp, gridToCsv } from './csv';

export interface FilterDef<T> {
  key: keyof T;
  label: string;
  options?: string[];
}

interface ListViewProps<T extends GridValidRowModel> {
  rows: T[];
  columns: GridColDef<T>[];
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  filters?: FilterDef<T>[];
  onRowClick?: (row: T) => void;
  /** Extra controls shown in the filter bar (date range, etc.). */
  extra?: ReactNode;
  pageSize?: number;
  exportName?: string;
  rowHeight?: number;
}

/** Filter bar + clean table, used by every list screen. */
export default function ListView<T extends GridValidRowModel>({
  rows,
  columns,
  searchKeys = [],
  searchPlaceholder = 'Search…',
  filters = [],
  onRowClick,
  extra,
  pageSize = 10,
  exportName,
  rowHeight = 56,
}: ListViewProps<T>) {
  const { notify } = useFeedback();
  const [params] = useSearchParams();
  // A search from the top bar arrives as ?q=… and pre-fills the table search.
  const q = params.get('q');
  const [search, setSearch] = useState(() => q ?? '');
  useEffect(() => {
    if (q !== null) setSearch(q);
  }, [q]);
  const [values, setValues] = useState<Record<string, string>>({});

  const filterOptions = useMemo(
    () =>
      filters.map((f) => ({
        ...f,
        options: f.options ?? Array.from(new Set(rows.flatMap((r) => (Array.isArray(r[f.key]) ? (r[f.key] as unknown[]).map(String) : [String(r[f.key])])))).sort(),
      })),
    [filters, rows],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q))) return false;
      return filters.every((f) => {
        const want = values[f.key as string];
        if (!want) return true;
        const v = r[f.key];
        return Array.isArray(v) ? v.map(String).includes(want) : String(v) === want;
      });
    });
  }, [rows, search, values, filters, searchKeys]);

  const sizedColumns = useSizedColumns(columns, rows);

  return (
    <Card>
      {searchKeys.length > 0 || filters.length > 0 || extra || exportName ? (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        {searchKeys.length > 0 && (
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 240, flex: { xs: 1, md: 'unset' } }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
          />
        )}
        {filterOptions.map((f) => (
          <TextField
            key={String(f.key)}
            select
            size="small"
            label={f.label}
            value={values[f.key as string] ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, [f.key as string]: e.target.value }))}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All</MenuItem>
            {f.options.map((o) => (
              <MenuItem key={o} value={o}>
                {o.replace(/_/g, ' ')}
              </MenuItem>
            ))}
          </TextField>
        ))}
        {extra}
        <Box sx={{ flex: 1 }} />
        {exportName ? (
          <Button size="small" color="inherit" startIcon={<FileDownloadOutlined />} onClick={() => {
              downloadFile(`${exportName.replace(/\s+/g, '-')}-${fileStamp()}.csv`, gridToCsv(columns, visible));
              notify(`Exported ${visible.length} ${exportName} to CSV`);
            }}>
            Export
          </Button>
        ) : null}
      </Box>
      ) : null}
      <DataGrid
        rows={visible}
        columns={sizedColumns}
        autoHeight
        rowHeight={rowHeight}
        // Rows grow when text needs a second line, so nothing is ever clipped.
        getRowHeight={() => 'auto'}
        sx={{ '& .MuiDataGrid-cell': { minHeight: `${rowHeight}px !important` } }}
        columnHeaderHeight={46}
        disableRowSelectionOnClick
        disableColumnMenu
        onRowClick={onRowClick ? (p) => onRowClick(p.row as T) : undefined}
        initialState={{ pagination: { paginationModel: { pageSize } } }}
        pageSizeOptions={[pageSize, 25, 50]}
        localeText={{ noRowsLabel: 'Nothing matches these filters' }}
      />
    </Card>
  );
}

export interface RowAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
}

const MENU_SLOT = 30;

function RowActions({ primary, more, reserveMenu }: { primary: RowAction[]; more: RowAction[]; reserveMenu: boolean }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const stop = (e: MouseEvent) => e.stopPropagation();
  return (
    <Box onClick={stop} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, flexWrap: 'nowrap' }}>
      {primary.map((a) =>
        a.icon ? (
          <Tooltip key={a.label} title={a.label}>
            <IconButton size="small" color={a.danger ? 'error' : 'primary'} onClick={a.onClick}>
              {a.icon}
            </IconButton>
          </Tooltip>
        ) : (
          <Button key={a.label} size="small" variant={a.danger ? 'text' : 'outlined'} color={a.danger ? 'error' : 'primary'} onClick={a.onClick} sx={{ minWidth: 0, px: 1.25, py: 0.25, borderRadius: 2, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {a.label}
          </Button>
        ),
      )}
      {more.length === 0 && reserveMenu ? <Box sx={{ width: MENU_SLOT, flexShrink: 0 }} /> : null}
      {more.length > 0 && (
        <>
          <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} aria-label="More actions" sx={{ width: MENU_SLOT, height: MENU_SLOT, flexShrink: 0 }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
            {more.map((a) => (
              <MenuItem
                key={a.label}
                onClick={() => {
                  setAnchor(null);
                  a.onClick();
                }}
                sx={{ color: a.danger ? 'error.main' : undefined, fontSize: 14 }}
              >
                {a.icon ? <ListItemIcon sx={{ color: 'inherit' }}>{a.icon}</ListItemIcon> : null}
                {a.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
}

interface ActionsConfig<T> {
  getActions: (row: T) => RowAction[];
  inline: number;
}

type ActionsColDef<T extends GridValidRowModel> = GridColDef<T> & { __actions?: ActionsConfig<T> };

/** Approximate rendered width of one row's inline buttons (Inter 13px semibold). */
function inlineWidth(actions: RowAction[]) {
  return actions.reduce((w, a) => w + (a.icon ? 34 : Math.ceil(a.label.length * 7.4) + 24) + 4, 0);
}

function renderActions<T extends GridValidRowModel>(cfg: ActionsConfig<T>, row: T, reserveMenu: boolean) {
  const all = cfg.getActions(row);
  return <RowActions primary={all.slice(0, cfg.inline)} more={all.slice(cfg.inline)} reserveMenu={reserveMenu} />;
}

/** Actions column: the first `inline` actions are buttons, the rest go in a ⋮ menu. ListView sizes it to fit. */
export function actionsColumn<T extends GridValidRowModel>(
  getActions: (row: T) => RowAction[],
  { inline = 1, width }: { inline?: number; width?: number } = {},
): GridColDef<T> {
  const cfg: ActionsConfig<T> = { getActions, inline };
  const col: ActionsColDef<T> = {
    field: '__actions',
    headerName: 'Actions',
    sortable: false,
    width: width ?? 150,
    align: 'right',
    headerAlign: 'right',
    renderCell: ({ row }) => renderActions(cfg, row, true),
    __actions: cfg,
  };
  return col;
}

/**
 * Makes a data column proportional so the table always fits its card (no hidden columns behind a
 * horizontal scrollbar). Text wraps when space is tight. Custom cells (chips, progress, avatars)
 * keep most of their width so they never get squeezed.
 */
/** Text a plain cell will show, using the column's own getter/formatter. */
function cellText<T extends GridValidRowModel>(c: GridColDef<T>, row: T) {
  let v: unknown = (row as Record<string, unknown>)[c.field];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (c.valueGetter) v = (c.valueGetter as any)(v, row, c, undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (c.valueFormatter) v = (c.valueFormatter as any)(v, row, c, undefined);
  return v === null || v === undefined ? '' : String(v);
}

function fitColumn<T extends GridValidRowModel>(c: GridColDef<T>, rows: T[]): GridColDef<T> {
  const base = c.width ?? c.minWidth ?? 120;
  // Headers never wrap: reserve room for the title (Inter 13px semibold) + cell padding.
  const headerMin = Math.ceil((c.headerName ?? c.field).length * 7.6) + 30;
  // Small custom cells (status chips, badges) keep their width. Wide custom cells (avatar + name,
  // progress bars) already truncate with "…" and may shrink. Plain text wraps.
  // Short plain values (dates, amounts, counts) must not wrap: reserve their longest value's width.
  const longest = !c.renderCell && base <= 130 ? Math.max(0, ...rows.map((r) => cellText(c, r).length)) : 0;
  const shortMin = Math.min(base, Math.ceil(longest * 7.3) + 22);
  const contentMin = c.renderCell ? (base <= 180 ? base : Math.round(base * 0.62)) : base <= 130 ? shortMin : Math.round(base * 0.5);
  const { width: _w, ...rest } = c;
  void _w;
  // Share spare space by intended width: a flex column's weight is its flex × its minimum width.
  const weight = c.flex ? (c.flex * (c.minWidth ?? 150)) / 100 : base / 100;
  return { ...rest, flex: weight, minWidth: Math.max(72, headerMin, contentMin) };
}

/** Gives the actions column the exact width its widest row needs, and reserves the ⋮ slot when any row has a menu. */
function useSizedColumns<T extends GridValidRowModel>(columns: GridColDef<T>[], rows: T[]) {
  return useMemo(
    () =>
      columns.map((c) => {
        const cfg = (c as ActionsColDef<T>).__actions;
        if (!cfg) return fitColumn(c, rows);
        let widest = 0;
        let anyMenu = false;
        for (const r of rows) {
          const all = cfg.getActions(r);
          widest = Math.max(widest, inlineWidth(all.slice(0, cfg.inline)));
          if (all.length > cfg.inline) anyMenu = true;
        }
        const width = Math.max(90, widest + (anyMenu ? MENU_SLOT + 4 : 0) + 24);
        return { ...c, width, minWidth: width, renderCell: ({ row }: { row: T }) => renderActions(cfg, row, anyMenu) } as GridColDef<T>;
      }),
    [columns, rows],
  );
}
