/* oxlint-disable react(incompatible-library) */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { getRecord, saveRecord } from '../lib/api'
import ImageUpload from '../components/ImageUpload'
import { toast } from '../lib/toast'

const careSchema = z.object({
  num: z.string().trim().min(1, 'Informe o número da dica.'),
  title: z.string().trim().min(1, 'Informe o título.'),
  text: z.string().trim().min(1, 'Informe o texto da dica.'),
  image: z.string().default(''),
})

type CareFormValues = z.infer<typeof careSchema>

export default function CareForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  // oxlint-disable-next-line react(incompatible-library)
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<CareFormValues>({
    resolver: zodResolver(careSchema),
    defaultValues: {
      num: '',
      title: '',
      text: '',
      image: '',
    },
  })

  useEffect(() => {
    if (!id) return

    getRecord<CareFormValues>('care_tips', id)
      .then((tip) => reset({
        num: tip.num || '',
        title: tip.title || '',
        text: tip.text || '',
        image: tip.image || '',
      }))
      .catch((error: unknown) => toast.error(`Erro ao carregar dica: ${error instanceof Error ? error.message : error}`))
  }, [id, reset])

  const onSubmit = async (formData: CareFormValues) => {
    try {
      await saveRecord('care_tips', formData, id)
      toast.success(id ? 'Dica atualizada com sucesso!' : 'Dica criada com sucesso!')
      navigate('/cuidados')
    } catch (error) {
      toast.error(`Erro ao salvar: ${error instanceof Error ? error.message : error}`)
    }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>{id ? 'Editar' : 'Nova'} Dica</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Número</label>
          <input
            type="text"
            {...register('num')}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
          {errors.num && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.num.message}</p>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Título</label>
          <input
            type="text"
            {...register('title')}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
          {errors.title && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.title.message}</p>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Texto</label>
          <textarea
            {...register('text')}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', minHeight: '120px' }}
          />
          {errors.text && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.text.message}</p>}
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
          <button type="button" onClick={() => navigate('/cuidados')} style={{ padding: '8px 24px', background: '#d1d5db', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
