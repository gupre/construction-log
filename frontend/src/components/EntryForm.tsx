import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWorkTypes, createEntry, updateEntry } from '../api'
import type { WorkEntry, WorkEntryFormData } from '../types'
import { Button, Alert } from './ui'

interface Props {
  entry?: WorkEntry | null
  onSuccess: () => void
  onCancel: () => void
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, color: 'var(--text-muted)', fontWeight: 500,
  textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 4,
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-input)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: '7px 10px', color: 'var(--text)',
  fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', width: '100%',
}

const errorStyle: React.CSSProperties = { fontSize: 11, color: 'var(--danger)', marginTop: 3 }

export function EntryForm({ entry, onSuccess, onCancel }: Props) {
  const qc = useQueryClient()

  const { data: workTypes = [] } = useQuery({
    queryKey: ['work-types'],
    queryFn: getWorkTypes,
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<WorkEntryFormData>({
    defaultValues: entry ? {
      date: entry.date.split('T')[0],
      workTypeId: entry.workTypeId,
      volume: entry.volume,
      unit: entry.unit,
      executor: entry.executor,
      notes: entry.notes || '',
    } : {
      date: new Date().toISOString().split('T')[0],
      unit: '',
      executor: '',
      notes: '',
    },
  })

  const watchedWorkTypeId = watch('workTypeId')

  useEffect(() => {
    if (watchedWorkTypeId && !entry) {
      const wt = workTypes.find(t => t.id === Number(watchedWorkTypeId))
      if (wt) setValue('unit', wt.unit)
    }
  }, [watchedWorkTypeId, workTypes, setValue, entry])

  const mutation = useMutation({
    mutationFn: (data: WorkEntryFormData) =>
      entry ? updateEntry(entry.id, data) : createEntry(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['entries'] }); onSuccess() },
  })

  const onSubmit = (data: WorkEntryFormData) => {
    mutation.mutate({ ...data, workTypeId: Number(data.workTypeId), volume: Number(data.volume) })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {mutation.isError && <Alert type="error" message="Ошибка сохранения. Проверьте данные." />}

      <div>
        <label style={labelStyle}>Дата *</label>
        <input type="date" style={inputStyle} {...register('date', { required: 'Дата обязательна' })} />
        {errors.date && <div style={errorStyle}>{errors.date.message}</div>}
      </div>

      <div>
        <label style={labelStyle}>Вид работ *</label>
        <select style={{ ...inputStyle, cursor: 'pointer' }}
          {...register('workTypeId', { required: 'Выберите вид работ' })}>
          <option value="">— Выберите вид работ —</option>
          {workTypes.map(wt => (
            <option key={wt.id} value={wt.id}>{wt.name}</option>
          ))}
        </select>
        {errors.workTypeId && <div style={errorStyle}>{errors.workTypeId.message}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Объём *</label>
          <input type="number" step="0.01" min="0.01" placeholder="0"
            style={inputStyle}
            {...register('volume', { required: 'Объём обязателен', min: { value: 0.01, message: 'Должно быть > 0' } })} />
          {errors.volume && <div style={errorStyle}>{errors.volume.message}</div>}
        </div>
        <div>
          <label style={labelStyle}>Ед. изм. *</label>
          <input type="text" placeholder="м², м³..." style={inputStyle}
            {...register('unit', { required: 'Ед. изм. обязательна' })} />
          {errors.unit && <div style={errorStyle}>{errors.unit.message}</div>}
        </div>
      </div>

      <div>
        <label style={labelStyle}>ФИО исполнителя *</label>
        <input type="text" placeholder="Иванов И.И." style={inputStyle}
          {...register('executor', { required: 'ФИО обязательно', minLength: { value: 2, message: 'Минимум 2 символа' } })} />
        {errors.executor && <div style={errorStyle}>{errors.executor.message}</div>}
      </div>

      <div>
        <label style={labelStyle}>Примечания</label>
        <textarea rows={3} placeholder="Дополнительная информация..."
          style={{ ...inputStyle, resize: 'vertical' }}
          {...register('notes')} />
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 4 }}>
        <Button type="button" variant="ghost" onClick={onCancel}>Отмена</Button>
        <Button type="submit" variant="primary" loading={mutation.isPending}>
          {entry ? 'Сохранить' : 'Добавить запись'}
        </Button>
      </div>
    </form>
  )
}
