export type ToastKind = 'success' | 'error' | 'info'

export function showToast(kind: ToastKind, message: string) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new CustomEvent('app-toast', {
    detail: {
      kind,
      message,
    },
  }))
}

export const toast = {
  success: (message: string) => showToast('success', message),
  error: (message: string) => showToast('error', message),
  info: (message: string) => showToast('info', message),
}
