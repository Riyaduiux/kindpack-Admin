import { useEffect, useState, type ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputAdornment,
  ListItemText,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

export type Option = string | { value: string; label: string };

export interface Field {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select' | 'multiselect' | 'switch';
  options?: Option[];
  required?: boolean;
  helper?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  /** Span both columns. */
  full?: boolean;
  placeholder?: string;
}

export type Values = Record<string, unknown>;

const optValue = (o: Option) => (typeof o === 'string' ? o : o.value);
const optLabel = (o: Option) => (typeof o === 'string' ? o : o.label);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Returns field errors (empty object when valid). */
export function validate(fields: Field[], values: Values) {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.type === 'switch') continue;
    const empty = v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
    if (f.required && empty) {
      errors[f.name] = 'Required';
      continue;
    }
    if (empty) continue;
    if (f.type === 'number') {
      const n = Number(v);
      if (Number.isNaN(n)) errors[f.name] = 'Enter a number';
      else if (f.min !== undefined && n < f.min) errors[f.name] = `Must be at least ${f.min}`;
      else if (f.max !== undefined && n > f.max) errors[f.name] = `Must be at most ${f.max}`;
    }
    if (f.type === 'email' && !isEmail(String(v))) errors[f.name] = 'Enter a valid email';
  }
  return errors;
}

/** Converts number fields to numbers before saving. */
export function normalise(fields: Field[], values: Values): Values {
  const out = { ...values };
  for (const f of fields) if (f.type === 'number' && out[f.name] !== '' && out[f.name] !== undefined) out[f.name] = Number(out[f.name]);
  return out;
}

interface FieldsProps {
  fields: Field[];
  values: Values;
  errors?: Record<string, string>;
  onChange: (name: string, value: unknown) => void;
  cols?: number;
}

export function FormFields({ fields, values, errors = {}, onChange, cols = 2 }: FieldsProps) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: `repeat(${cols}, minmax(0, 1fr))` }, gap: 2 }}>
      {fields.map((f) => {
        const span = f.full || f.type === 'textarea' ? { gridColumn: '1 / -1' } : {};
        const value = values[f.name];
        if (f.type === 'switch') {
          return (
            <FormControlLabel
              key={f.name}
              sx={span}
              disabled={f.disabled}
              control={<Switch checked={!!value} onChange={(e) => onChange(f.name, e.target.checked)} />}
              label={f.label}
            />
          );
        }
        const adornments = {
          ...(f.prefix ? { startAdornment: <InputAdornment position="start">{f.prefix}</InputAdornment> } : {}),
          ...(f.suffix ? { endAdornment: <InputAdornment position="end">{f.suffix}</InputAdornment> } : {}),
        };
        if (f.type === 'multiselect') {
          const selected = (value as string[] | undefined) ?? [];
          return (
            <TextField
              key={f.name}
              select
              label={f.label}
              sx={span}
              value={selected}
              required={f.required}
              disabled={f.disabled}
              error={!!errors[f.name]}
              helperText={errors[f.name] ?? f.helper}
              slotProps={{
                select: {
                  multiple: true,
                  renderValue: (sel) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(sel as string[]).map((s) => (
                        <Chip key={s} size="small" label={optLabel(f.options?.find((o) => optValue(o) === s) ?? s)} />
                      ))}
                    </Box>
                  ),
                },
              }}
              onChange={(e) => onChange(f.name, typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
            >
              {(f.options ?? []).map((o) => (
                <MenuItem key={optValue(o)} value={optValue(o)}>
                  <Checkbox size="small" checked={selected.includes(optValue(o))} />
                  <ListItemText primary={optLabel(o)} />
                </MenuItem>
              ))}
            </TextField>
          );
        }
        return (
          <TextField
            key={f.name}
            label={f.label}
            sx={span}
            type={f.type === 'textarea' || f.type === 'select' ? undefined : f.type ?? 'text'}
            select={f.type === 'select'}
            multiline={f.type === 'textarea'}
            minRows={f.type === 'textarea' ? 3 : undefined}
            required={f.required}
            disabled={f.disabled}
            placeholder={f.placeholder}
            value={value ?? ''}
            error={!!errors[f.name]}
            helperText={errors[f.name] ?? f.helper}
            onChange={(e) => onChange(f.name, e.target.value)}
            slotProps={{ input: adornments, inputLabel: f.type === 'date' ? { shrink: true } : undefined, htmlInput: f.type === 'number' ? { step: 'any', min: f.min, max: f.max } : undefined }}
          >
            {f.type === 'select'
              ? (f.options ?? []).map((o) => (
                  <MenuItem key={optValue(o)} value={optValue(o)}>
                    {optLabel(o)}
                  </MenuItem>
                ))
              : null}
          </TextField>
        );
      })}
    </Box>
  );
}

interface DialogProps {
  open: boolean;
  title: string;
  fields: Field[];
  initial?: Values;
  description?: ReactNode;
  submitLabel?: string;
  cols?: number;
  maxWidth?: 'xs' | 'sm' | 'md';
  onClose: () => void;
  /** Return an error message to keep the dialog open, or nothing to close it. */
  onSubmit: (values: Values) => string | void;
  /** Extra checks across fields (e.g. split must add to 100%). */
  check?: (values: Values) => string | null;
  children?: (values: Values) => ReactNode;
  /** Called on every field change (e.g. to update dependent option lists). */
  onChange?: (values: Values) => void;
}

/** Create / edit dialog with validation, driven by a field list. */
export function FormDialog({ open, title, fields, initial, description, submitLabel = 'Save', cols = 2, maxWidth = 'sm', onClose, onSubmit, check, children, onChange }: DialogProps) {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValues(initial ?? {});
      setErrors({});
      setFormError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = () => {
    const errs = validate(fields, values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const normal = normalise(fields, values);
    const crossError = check?.(normal) ?? null;
    if (crossError) {
      setFormError(crossError);
      return;
    }
    const result = onSubmit(normal);
    if (typeof result === 'string') setFormError(result);
    else onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle sx={{ fontFamily: 'Poppins, Inter, sans-serif', fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent sx={{ pt: '8px !important' }}>
        {description ? (
          <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 2 }}>
            {description}
          </Typography>
        ) : null}
        <FormFields
          fields={fields}
          values={values}
          errors={errors}
          cols={cols}
          onChange={(name, value) => {
            const next = { ...values, [name]: value };
            setValues(next);
            onChange?.(next);
            setErrors((e) => ({ ...e, [name]: '' }));
            setFormError(null);
          }}
        />
        {children?.(normalise(fields, values))}
        {formError ? (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {formError}
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
