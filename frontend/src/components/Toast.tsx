import React, { useEffect } from 'react'

type ToastProps = {
  message: string
  onClose: () => void
  type?: 'success' | 'error'
  duration?: number
}

export default function Toast({ message, onClose, type = 'success', duration = 2500 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])
  return (
    <div
      style={{
        position: 'fixed',
        right: 24,
        top: 24,
        minWidth: 220,
        zIndex: 99999,
        background: type === 'success' ? '#43a047' : '#e53935',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: 8,
        boxShadow: '0 2px 16px #0002',
        fontWeight: 500,
        fontSize: 16,
        letterSpacing: 0.2,
        animation: 'toastIn .3s'
      }}
    >
      {message}
    </div>
  )
}
