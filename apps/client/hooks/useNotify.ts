import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

export function useNotify(): (content: string, type: string) => void {
  const toastContext = useContext(ToastContext) as any;
  return toastContext.notify;
}
