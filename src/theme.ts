import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

// Kind Pack design tokens (Figma: Admin Panel › Design system).
// Change these values to restyle the whole dashboard.
export const forest = {
  900: '#0B2E1F',
  800: '#0E3B26',
  700: '#145233',
  600: '#1F6B45',
};

export const brand = {
  primary: forest[700], // primary actions
  primaryDark: forest[800],
  primaryLight: '#1F6B45',
  primarySoft: '#EEF5EF',
  background: '#F7F5EE', // app background (cream)
  secondary: '#6D8B74', // sage
  slate: '#5F6B62', // muted text
  ink: '#0B1A12',
  border: 'rgba(11,46,31,0.08)',
  // extra tokens used by the new screens
  sage: '#6D8B74',
  mint: '#BFE3C8',
  lime: '#B7E4A0',
  amber: '#F2B84B',
  coral: '#E86A5B',
  sky: '#6FA8DC',
  placeholder: '#98A39B',
  field: '#F6F8F5',
  chip: '#F0F3EF',
};

export const gradients = {
  primary: `linear-gradient(135deg, ${forest[700]} 14.286%, ${forest[800]} 85.714%)`,
  icon: `linear-gradient(135deg, ${forest[600]} 14.286%, ${forest[700]} 85.714%)`,
  danger: 'linear-gradient(154deg, #E5675A 14.286%, #C94A3C 85.714%)',
  sidebar: `linear-gradient(133deg, ${forest[700]} 0%, ${forest[900]} 84.746%)`,
  panel: `linear-gradient(159deg, ${forest[600]} 0%, ${forest[900]} 77.519%)`,
  hero: `linear-gradient(165deg, ${forest[700]} 14.925%, ${forest[900]} 89.552%)`,
  page: 'linear-gradient(156deg, #EAF1E8 14.599%, #F7F5EE 87.591%)',
  amber: 'linear-gradient(135deg, #F2B84B 14.286%, #D99A1E 85.714%)',
  sky: 'linear-gradient(135deg, #6FA8DC 14.286%, #3F7FBF 85.714%)',
  coral: 'linear-gradient(135deg, #E86A5B 14.286%, #C94A3C 85.714%)',
  impact: `linear-gradient(146deg, #6D8B74 14.286%, ${forest[600]} 85.714%)`,
};

export const shadows = {
  card: '0px 1px 2px rgba(0,0,0,0.04), 0px 10px 28px rgba(11,46,31,0.07)',
};

export const statusColors = {
  green: { fg: '#1C6B3B', bg: '#E3F1E7' },
  amber: { fg: '#8A5A00', bg: '#FBEFD3' },
  red: { fg: '#B3261E', bg: '#FBE3E0' },
  blue: { fg: '#1D4F91', bg: '#E0ECFB' },
  grey: { fg: '#5A625C', bg: '#ECEEEA' },
  purple: { fg: '#5B3FA8', bg: '#ECE6FA' },
};

const font = '"Poppins", "Inter", sans-serif';

export const theme = createTheme({
  palette: {
    primary: { main: brand.primary, dark: brand.primaryDark, light: brand.primaryLight, contrastText: '#fff' },
    secondary: { main: brand.secondary, contrastText: '#fff' },
    success: { main: '#1C6B3B' },
    warning: { main: '#D99A1E' },
    error: { main: '#C94A3C' },
    info: { main: '#1D4F91' },
    background: { default: brand.background, paper: '#FFFFFF' },
    text: { primary: brand.ink, secondary: brand.slate },
    divider: 'rgba(11,46,31,0.07)',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: font,
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600, fontSize: '1.875rem', lineHeight: 1.2 },
    h5: { fontWeight: 600, fontSize: '1.375rem', lineHeight: 1.2 },
    h6: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { fontSize: 14 },
    body2: { fontSize: 13 },
    button: { textTransform: 'none', fontWeight: 500, fontSize: 14 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { background: gradients.page, backgroundAttachment: 'fixed', minHeight: '100vh' } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 22, minHeight: 44 },
        containedPrimary: { background: gradients.primary, boxShadow: shadows.card, '&:hover': { background: gradients.primary, filter: 'brightness(1.12)' }, '&.Mui-disabled': { background: '#E6ECE7', color: brand.placeholder, boxShadow: 'none' } },
        containedError: { background: gradients.danger, '&:hover': { background: gradients.danger, filter: 'brightness(1.05)' } },
        outlined: { borderColor: 'rgba(11,46,31,0.07)', color: brand.ink, background: '#fff', '&:hover': { borderColor: 'rgba(11,46,31,0.2)', background: '#fff' } },
        text: { color: forest[700] },
      },
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 24 } } },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { border: '1px solid rgba(11,46,31,0.04)', borderRadius: 24, boxShadow: shadows.card } },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 500, borderRadius: 999 } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: brand.field,
          '& fieldset': { borderColor: 'rgba(11,46,31,0.08)' },
          '&:hover fieldset': { borderColor: 'rgba(11,46,31,0.2)' },
          '&.Mui-focused fieldset': { borderColor: forest[600], borderWidth: 2 },
          '&.Mui-error fieldset': { borderColor: brand.coral, borderWidth: 2 },
        },
        input: { fontSize: 14, '&::placeholder': { color: brand.placeholder, opacity: 1 } },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontSize: 14 } } },
    MuiCheckbox: { styleOverrides: { root: { color: 'rgba(11,46,31,0.25)', '&.Mui-checked': { color: forest[700] } } } },
    MuiSwitch: {
      styleOverrides: {
        switchBase: { '&.Mui-checked': { color: '#fff' }, '&.Mui-checked + .MuiSwitch-track': { background: gradients.primary, opacity: 1 } },
        track: { backgroundColor: '#CBD2CC', opacity: 1 },
      },
    },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 500, minHeight: 44 } } },
    MuiTabs: { styleOverrides: { root: { minHeight: 44 }, indicator: { backgroundColor: forest[700] } } },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundColor: '#fff',
          '--DataGrid-rowBorderColor': 'rgba(11,46,31,0.07)',
          '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fff' },
          '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 500, color: brand.placeholder, fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase' },
          '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center', lineHeight: 1.35, whiteSpace: 'normal', overflowWrap: 'anywhere', paddingTop: 8, paddingBottom: 8 },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': { outline: 'none' },
          '& .MuiDataGrid-row:hover': { backgroundColor: brand.primarySoft, cursor: 'pointer' },
        },
      },
    },
  },
});

/** Product name shown in the sidebar, login page and browser tab. */
export const APP_NAME = 'Kind Pack';
