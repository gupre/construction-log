import { useState } from 'react'
import { JournalPage } from './pages/JournalPage'
import { WorkTypesPage } from './pages/WorkTypesPage'
import { HardHat, List } from 'lucide-react'

type Tab = 'journal' | 'work-types'

export default function App() {
  const [tab, setTab] = useState<Tab>('journal')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32,
              height: 32,
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius)',
            }}>
              <HardHat size={18} color="#0f0f0e" strokeWidth={2.5} />
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              letterSpacing: 2,
              color: 'var(--text)',
            }}>
              ЖУРНАЛ РАБОТ
            </span>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', gap: 2 }}>
            {[
              { id: 'journal' as Tab, label: 'Журнал', icon: List },
              { id: 'work-types' as Tab, label: 'Виды работ', icon: HardHat },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  background: tab === id ? 'var(--accent-dim)' : 'transparent',
                  border: tab === id ? '1px solid var(--accent)' : '1px solid transparent',
                  borderRadius: 'var(--radius)',
                  color: tab === id ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '24px' }}>
        {tab === 'journal' ? <JournalPage /> : <WorkTypesPage />}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '12px 24px',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
      }}>
        СТРОИТЕЛЬНЫЙ ЖУРНАЛ · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
