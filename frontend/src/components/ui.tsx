import React from 'react'
import { Loader2 } from 'lucide-react'

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  loading?: boolean
  icon?: React.ReactNode
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading,
  icon,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent)',
      color: '#0f0f0e',
      border: '1px solid var(--accent)',
      fontWeight: 600,
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'var(--danger-dim)',
      color: 'var(--danger)',
      border: '1px solid var(--danger)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
      border: '1px solid transparent',
    },
  }

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: size === 'sm' ? '4px 10px' : '7px 14px',
        borderRadius: 'var(--radius)',
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: size === 'sm' ? 12 : 13,
        transition: 'all 0.15s',
        opacity: (disabled || loading) ? 0.6 : 1,
        whiteSpace: 'nowrap',
        ...styles[variant],
        ...style,
      }}
      {...props}
    >
      {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : icon}
      {children}
    </button>
  )
}

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, id, style, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        style={{
          background: 'var(--bg-input)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          padding: '7px 10px',
          color: 'var(--text)',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          outline: 'none',
          transition: 'border-color 0.15s',
          width: '100%',
          ...style,
        }}
        onFocus={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border-focus)'}
        onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
        {...props}
      />
      {error && <span style={{ fontSize: 11, color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
}

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  children: React.ReactNode
}

export function Select({ label, error, id, children, style, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label htmlFor={selectId} style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        style={{
          background: 'var(--bg-input)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          padding: '7px 10px',
          color: 'var(--text)',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          outline: 'none',
          transition: 'border-color 0.15s',
          width: '100%',
          cursor: 'pointer',
          ...style,
        }}
        onFocus={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border-focus)'}
        onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
        {...props}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: 11, color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
}

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, id, style, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label htmlFor={textareaId} style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={3}
        style={{
          background: 'var(--bg-input)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          padding: '7px 10px',
          color: 'var(--text)',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          outline: 'none',
          transition: 'border-color 0.15s',
          width: '100%',
          resize: 'vertical',
          ...style,
        }}
        onFocus={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border-focus)'}
        onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
        {...props}
      />
      {error && <span style={{ fontSize: 11, color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
}

// Modal
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: number
}

export function Modal({ isOpen, onClose, title, children, width = 480 }: ModalProps) {
  if (!isOpen) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          width: '100%',
          maxWidth: width,
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'slideDown 0.2s ease',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: 1.5, fontSize: 18, color: 'var(--text)' }}>
            {title}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>
            ×
          </button>
        </div>
        <div style={{ padding: 20 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Badge
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'danger'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const colors = {
    default: { bg: 'var(--border)', color: 'var(--text-muted)' },
    accent: { bg: 'var(--accent-dim)', color: 'var(--accent)' },
    success: { bg: 'var(--success-dim)', color: 'var(--success)' },
    danger: { bg: 'var(--danger-dim)', color: 'var(--danger)' },
  }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 2,
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      background: colors[variant].bg,
      color: colors[variant].color,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

// Toast / Alert
interface AlertProps {
  type: 'error' | 'success'
  message: string
  onDismiss?: () => void
  style?: React.CSSProperties
}

export function Alert({ type, message, onDismiss, style: extraStyle }: AlertProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '10px 14px',
      borderRadius: 'var(--radius)',
      border: `1px solid ${type === 'error' ? 'var(--danger)' : 'var(--success)'}`,
      background: type === 'error' ? 'var(--danger-dim)' : 'var(--success-dim)',
      color: type === 'error' ? 'var(--danger)' : 'var(--success)',
      fontSize: 13,
      animation: 'fadeIn 0.2s ease',
      ...extraStyle,
    }}>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
      )}
    </div>
  )
}

// Spinner
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <Loader2
      size={size}
      style={{ animation: 'spin 1s linear infinite', color: 'var(--accent)' }}
    />
  )
}
