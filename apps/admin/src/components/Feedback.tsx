import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField, Typography } from '@mui/material';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  /** Ask for a reason (rejections must include one). */
  reason?: boolean;
}

type Severity = 'success' | 'info' | 'error';

interface FeedbackValue {
  notify: (message: string, severity?: Severity) => void;
  /** Confirm step for destructive / sensitive actions. `onConfirm` may return a toast message. */
  confirm: (options: ConfirmOptions, onConfirm: (reason: string) => string | void) => void;
}

const FeedbackContext = createContext<FeedbackValue | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; severity: Severity } | null>(null);
  const [pending, setPending] = useState<{ options: ConfirmOptions; onConfirm: (reason: string) => string | void } | null>(null);
  const [reason, setReason] = useState('');

  const notify = useCallback((message: string, severity: Severity = 'success') => setToast({ message, severity }), []);
  const confirm = useCallback((options: ConfirmOptions, onConfirm: (reason: string) => string | void) => {
    setReason('');
    setPending({ options, onConfirm });
  }, []);

  const close = () => setPending(null);

  // API failures (validation, permissions, conflicts) are shown as error toasts.
  useEffect(() => {
    const onError = (e: Event) => setToast({ message: String((e as CustomEvent).detail ?? 'Something went wrong'), severity: 'error' });
    window.addEventListener('app:api-error', onError);
    return () => window.removeEventListener('app:api-error', onError);
  }, []);

  return (
    <FeedbackContext.Provider value={{ notify, confirm }}>
      {children}
      <Dialog open={!!pending} onClose={close} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: 'Poppins, Inter, sans-serif', fontWeight: 600 }}>{pending?.options.title}</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">{pending?.options.message}</Typography>
          {pending?.options.reason ? (
            <TextField autoFocus fullWidth multiline minRows={3} label="Reason (required)" sx={{ mt: 2 }} value={reason} onChange={(e) => setReason(e.target.value)} />
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={close} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color={pending?.options.danger ? 'error' : 'primary'}
            disabled={!!pending?.options.reason && reason.trim().length < 3}
            onClick={() => {
              const message = pending?.onConfirm(reason.trim());
              if (message) setToast({ message, severity: 'success' });
              close();
            }}
          >
            {pending?.options.confirmLabel ?? 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!toast} autoHideDuration={toast?.severity === 'error' ? 6000 : 3200} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert
          severity={toast?.severity ?? 'success'}
          variant="filled"
          onClose={() => setToast(null)}
          sx={{ bgcolor: toast?.severity === 'error' ? '#B3261E' : toast?.severity === 'info' ? '#2F4A3A' : '#005026' }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used inside FeedbackProvider');
  return ctx;
}
