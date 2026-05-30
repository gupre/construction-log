import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { getWorkTypes, createWorkType, deleteWorkType } from '../api'
import type { WorkTypeFormData } from '../types'
import { Button, Input, Badge, Alert, Spinner, Modal } from '../components/ui'

export function WorkTypesPage() {
  const qc = useQueryClient()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [createError, setCreateError] = useState('')

  const { data: workTypes = [], isLoading } = useQuery({
    queryKey: ['work-types'],
    queryFn: getWorkTypes,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkTypeFormData>()

  const createMutation = useMutation({
    mutationFn: createWorkType,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work-types'] })
      reset()
      setCreateError('')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setCreateError(msg || 'Ошибка создания вида работ')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteWorkType,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work-types'] })
      setDeleteId(null)
      setDeleteError('')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setDeleteError(msg || 'Ошибка удаления')
    },
  })

  const onSubmit = (data: WorkTypeFormData) => createMutation.mutate(data)

  return (
    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: 640 }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 36,
        letterSpacing: 3,
        marginBottom: 6,
      }}>
        ВИДЫ РАБОТ
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>
        Справочник видов работ с единицами измерения
      </p>

      {/* Add new */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        padding: 20,
        marginBottom: 20,
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          letterSpacing: 1.5,
          fontSize: 16,
          marginBottom: 14,
          color: 'var(--text-muted)',
        }}>
          ДОБАВИТЬ ВИД РАБОТ
        </h2>
        {createError && <Alert type="error" message={createError} onDismiss={() => setCreateError('')} style={{ marginBottom: 12 }} />}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 2 }}>
            <Input
              label="Наименование *"
              placeholder="Кладка перегородок"
              error={errors.name?.message}
              {...register('name', { required: 'Обязательное поле' })}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Input
              label="Ед. изм. *"
              placeholder="м², м³, шт."
              error={errors.unit?.message}
              {...register('unit', { required: 'Обязательное поле' })}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            icon={<Plus size={14} />}
            loading={createMutation.isPending}
            style={{ marginBottom: errors.name || errors.unit ? 18 : 0 }}
          >
            Добавить
          </Button>
        </form>
      </div>

      {/* List */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Spinner />
          </div>
        ) : workTypes.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            Нет видов работ
          </div>
        ) : (
          workTypes.map((wt, idx) => (
            <div
              key={wt.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderBottom: idx < workTypes.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-dim)',
                  minWidth: 28,
                }}>
                  #{wt.id.toString().padStart(2, '0')}
                </span>
                <span style={{ color: 'var(--text)', fontSize: 13 }}>{wt.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Badge>{wt.unit}</Badge>
                <button
                  onClick={() => setDeleteId(wt.id)}
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
            </div>
          ))
        )}
      </div>

      <Modal isOpen={deleteId !== null} onClose={() => { setDeleteId(null); setDeleteError('') }} title="УДАЛИТЬ ВИД РАБОТ?" width={380}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
          Это действие нельзя отменить.
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 16 }}>
          Нельзя удалить вид работ, используемый в журнальных записях.
        </p>
        {deleteError && <Alert type="error" message={deleteError} style={{ marginBottom: 12 }} />}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => { setDeleteId(null); setDeleteError('') }}>Отмена</Button>
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
