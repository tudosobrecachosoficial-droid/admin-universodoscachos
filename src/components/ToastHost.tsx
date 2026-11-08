import { useEffect, useState } from 'react'

import type { ToastKind } from '../lib/toast'

type ToastItem = {
  id: number
  kind: ToastKind
  message: string
}

const baseStyle = {
  position: 'fixed' as const,
  right: '24px',
  bottom: '24px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px',
}

const kindStyles: Record<ToastKind, { background: string; border: string; color: string }> = {
  success: { background: '#ecfdf5', border: '#a7f3d0', color: '#065f46' },
  error: { background: '#fef2f2', border: '#fecaca', color: '#991b1b' },
  info: { background: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
}

export default function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ kind: ToastKind; message: string }>
      const { kind, message } = customEvent.detail ?? { kind: 'info', message: '' }

      if (!message) return

      const id = Date.now() + Math.random()
      setToasts((current) => [...current, { id, kind, message }])

      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
      }, 3200)
    }

    window.addEventListener('app-toast', handleToast)
    return () => window.removeEventListener('app-toast', handleToast)
  }, [])

  return (
    <div style={baseStyle}>
      {toasts.map((toast) => {
        const palette = kindStyles[toast.kind]

        return (
          <div
            key={toast.id}
            style={{
              minWidth: '280px',
              maxWidth: '360px',
              padding: '14px 16px',
              borderRadius: '12px',
              border: `1px solid ${palette.border}`,
              background: palette.background,
              color: palette.color,
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {toast.message}
          </div>
        )
      })}
    </div>
  )
}
