import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Plus, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Filter } from 'lucide-react'
import { getEntries, deleteEntry } from '../api'
import type { WorkEntry, FiltersState } from '../types'
import { Button, Badge, Modal, Alert, Spinner, Input } from '../components/ui'
import { EntryForm } from '../components/EntryForm'

export function JournalPage() {
  const qc = useQueryClient()
  const [filters, setFilters] = useState<FiltersState>({ dateFrom: '', dateTo: '', sortOrder: 'desc' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<WorkEntry | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState('')

  const { data: entries = [], isLoading, isError } = useQuery({
    queryKey: ['entries', filters],
    queryFn: () => getEntries({
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      sortOrder: filters.sortOrder,
    }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries'] })
      setDeleteId(null)
      setDeleteError('')
    },
    onError: () => setDeleteError('Ошибка удаления записи'),
  })

  const openAdd = () => { setEditEntry(null); setModalOpen(true) }
  const openEdit = (e: WorkEntry) => { setEditEntry(e); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditEntry(null) }
  const toggleSort = () => setFilters(f => ({ ...f, sortOrder: f.sortOrder === 'desc' ? 'asc' : 'desc' }))
  const clearFilters = () => setFilters({ dateFrom: '', dateTo: '', sortOrder: 'desc' })

  const hasFilters = filters.dateFrom || filters.dateTo

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Page header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            letterSpacing: 3,
            color: 'var(--text)',
            lineHeight: 1,
          }}>
            ЖУРНАЛ РАБОТ
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            {entries.length > 0
              ? `${entries.length} ${entries.length === 1 ? 'запись' : entries.length < 5 ? 'записи' : 'записей'}`
              : 'Записей не найдено'}
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={15} />} onClick={openAdd}>
          Добавить запись
        </Button>
      </div>

      {/* Filters */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        padding: '14px 16px',
        marginBottom: 16,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'flex-end',
      }}>
        <Filter size={14} color="var(--text-muted)" style={{ marginBottom: 8 }} />
        <div style={{ flex: '1 1 160px' }}>
          <Input
            label="Дата с"
            type="date"
            value={filters.dateFrom}
            onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
          />
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <Input
            label="Дата по"
            type="date"
            value={filters.dateTo}
            onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleSort}
          icon={filters.sortOrder === 'desc' ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
          style={{ marginBottom: 0, alignSelf: 'flex-end' }}
        >
          {filters.sortOrder === 'desc' ? 'Сначала новые' : 'Сначала старые'}
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} style={{ alignSelf: 'flex-end' }}>
            Сбросить
          </Button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Spinner size={32} />
        </div>
      ) : isError ? (
        <Alert type="error" message="Не удалось загрузить данные. Проверьте соединение с сервером." />
      ) : entries.length === 0 ? (
        <EmptyState hasFilters={!!hasFilters} onAdd={openAdd} onClear={clearFilters} />
      ) : (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {[
                    { label: 'Дата', icon: <ArrowUpDown size={11} />, onClick: toggleSort },
                    { label: 'Вид работ' },
                    { label: 'Объём' },
                    { label: 'Исполнитель' },
                    { label: 'Примечания' },
                    { label: '' },
                  ].map((col, i) => (
                    <th
                      key={i}
                      onClick={col.onClick}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        fontSize: 11,
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        color: 'var(--text-muted)',
                        cursor: col.onClick ? 'pointer' : 'default',
                        whiteSpace: 'nowrap',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {col.label}
                        {col.icon}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    style={{
                      borderBottom: idx < entries.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>
                        {format(parseISO(entry.date), 'dd.MM.yyyy')}
                      </span>
                      <br />
                      <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {format(parseISO(entry.date), 'EEEE', { locale: ru })}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: 'var(--text)', fontWeight: 500 }}>
                        {entry.workType.name}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <Badge variant="accent">
                        {entry.volume} {entry.unit}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {entry.executor}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-dim)', fontSize: 12, maxWidth: 200 }}>
                      {entry.notes || '—'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEdit(entry)}
                          title="Редактировать"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-dim)', padding: 4, borderRadius: 2,
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(entry.id)}
                          title="Удалить"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-dim)', padding: 4, borderRadius: 2,
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editEntry ? 'РЕДАКТИРОВАТЬ ЗАПИСЬ' : 'НОВАЯ ЗАПИСЬ'}
      >
        <EntryForm entry={editEntry} onSuccess={closeModal} onCancel={closeModal} />
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={deleteId !== null} onClose={() => { setDeleteId(null); setDeleteError('') }} title="УДАЛИТЬ ЗАПИСЬ?" width={380}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
          Это действие нельзя отменить.
        </p>
        {deleteError && <Alert type="error" message={deleteError} style={{ marginBottom: 12 }} />}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Отмена</Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => deleteId && deleteMutation.mutate(deleteId)}
          >
            Удалить
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function EmptyState({ hasFilters, onAdd, onClear }: { hasFilters: boolean; onAdd: () => void; onClear: () => void }) {
  return (
    <div style={{
      border: '1px dashed var(--border)',
      borderRadius: 4,
      padding: 60,
      textAlign: 'center',
      color: 'var(--text-muted)',
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--text-dim)', marginBottom: 8 }}>
        {hasFilters ? '◌' : '○'}
      </div>
      <p style={{ marginBottom: 16, fontSize: 13 }}>
        {hasFilters ? 'Записей по выбранным фильтрам не найдено' : 'В журнале пока нет записей'}
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {hasFilters && (
          <Button variant="secondary" size="sm" onClick={onClear}>Сбросить фильтры</Button>
        )}
        <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={onAdd}>
          Добавить запись
        </Button>
      </div>
    </div>
  )
}
