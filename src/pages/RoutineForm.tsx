/* oxlint-disable react(incompatible-library) */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { getRecord, saveRecord } from '../lib/api'
import ImageUpload from '../components/ImageUpload'
import { toast } from '../lib/toast'

const routineSchema = z.object({
  day: z.string().trim().min(1, 'Informe o dia da rotina.'),
  description: z.string().trim().min(1, 'Informe a descrição da rotina.'),
  steps: z.array(z.string().trim().min(1)).min(1, 'Adicione pelo menos um passo.'),
  image: z.string().default(''),
})

type RoutineFormValues = z.infer<typeof routineSchema>

export default function RoutineForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  // oxlint-disable-next-line react(incompatible-library)
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      day: '',
      description: '',
      steps: [],
      image: '',
    },
  })

  useEffect(() => {
    if (!id) return

    getRecord<RoutineFormValues>('routines', id)
      .then((routine) => reset({
        day: routine.day || '',
        description: routine.description || '',
        steps: Array.isArray(routine.steps) ? routine.steps.map((step) => String(step).trim()).filter(Boolean) : [],
        image: routine.image || '',
      }))
      .catch((error: unknown) => toast.error(`Erro ao carregar rotina: ${error instanceof Error ? error.message : error}`))
  }, [id, reset])

  const parseSteps = (value: string) => value.split(',').map((step) => step.trim()).filter(Boolean)

  const onSubmit = async (formData: RoutineFormValues) => {
    try {
      await saveRecord('routines', formData, id)
      toast.success(id ? 'Rotina atualizada com sucesso!' : 'Rotina criada com sucesso!')
      navigate('/rotinas')
    } catch (error) {
      toast.error(`Erro ao salvar: ${error instanceof Error ? error.message : error}`)
    }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>{id ? 'Editar' : 'Nova'} Rotina</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Dia</label>
          <input
            type="text"
            {...register('day')}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
          {errors.day && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.day.message}</p>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Descrição</label>
          <textarea
            {...register('description')}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', minHeight: '120px' }}
          />
          {errors.description && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.description.message}</p>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Passos (separados por vírgula)</label>
          <input
            type="text"
            value={(watch('steps') ?? []).join(', ')}
            onChange={(e) => setValue('steps', parseSteps(e.target.value), { shouldDirty: true })}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
          {errors.steps && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.steps.message}</p>}
        </div>
        <ImageUpload
          value={watch('image') ?? ''}
          onChange={(url) => setValue('image', url, { shouldDirty: true })}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ padding: '8px 24px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isSubmitting ? 0.5 : 1 }}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" onClick={() => navigate('/rotinas')} style={{ padding: '8px 24px', background: '#d1d5db', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
