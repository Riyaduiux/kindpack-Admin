import { createContext, useContext } from 'react';

interface LayoutValue {
  /** Opens the sidebar drawer on small screens. */
  openMenu: () => void;
  isDesktop: boolean;
}

export const LayoutContext = createContext<LayoutValue>({ openMenu: () => undefined, isDesktop: true });
export const useLayout = () => useContext(LayoutContext);
