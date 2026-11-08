import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { getRecord, saveRecord } from '../lib/api'
import { toast } from '../lib/toast'

const glossarySchema = z.object({
  term: z.string().trim().min(1, 'Informe o termo.').max(80, 'O termo deve ter no máximo 80 caracteres.'),
  definition: z.string().trim().min(1, 'Informe a definição.').max(500, 'A definição deve ter no máximo 500 caracteres.'),
  category: z.string().trim().max(50, 'A categoria deve ter no máximo 50 caracteres.').default(''),
})

type GlossaryFormValues = z.infer<typeof glossarySchema>

export default function GlossaryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<GlossaryFormValues>({
    resolver: zodResolver(glossarySchema),
    defaultValues: {
      term: '',
      definition: '',
      category: '',
    },
  })

  useEffect(() => {
    if (!id) return

    getRecord<GlossaryFormValues>('glossary', id)
      .then((term) => reset({
        term: term.term || '',
        definition: term.definition || '',
        category: term.category || '',
      }))
      .catch((error: unknown) => toast.error(`Erro ao carregar termo: ${error instanceof Error ? error.message : error}`))
  }, [id, reset])

  const onSubmit = async (formData: GlossaryFormValues) => {
    try {
      const normalizedData = {
        term: formData.term.trim(),
        definition: formData.definition.trim(),
        category: formData.category.trim(),
      }

      await saveRecord('glossary', normalizedData, id)
      toast.success(id ? 'Termo atualizado com sucesso!' : 'Termo criado com sucesso!')
      navigate('/glossario')
    } catch (error) {
      toast.error(`Erro ao salvar: ${error instanceof Error ? error.message : error}`)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
          {id ? 'Editar' : 'Novo'} Termo
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          {id ? 'Atualize as informações do termo' : 'Adicione um novo termo ao glossário'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Termo</label>
          <input
            type="text"
            {...register('term')}
            placeholder="Termo do glossário"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#7c3aed'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          {errors.term && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.term.message}</p>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Definição</label>
          <textarea
            {...register('definition')}
            placeholder="Definição do termo"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.2s',
              minHeight: '120px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#7c3aed'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          {errors.definition && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.definition.message}</p>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Categoria</label>
          <input
            type="text"
            {...register('category')}
            placeholder="Categoria do termo"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#7c3aed'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 32px',
              background: isSubmitting ? '#9ca3af' : '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = '#6d28d9'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = '#7c3aed'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            {isSubmitting ? (
              <>
                <span>⏳</span> Salvando...
              </>
            ) : (
              <>
                <span>💾</span> Salvar
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/glossario')}
            style={{
              padding: '12px 32px',
              background: '#d1d5db',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#9ca3af'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#d1d5db'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
