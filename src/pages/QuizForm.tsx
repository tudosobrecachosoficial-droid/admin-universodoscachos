import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRecord, saveRecord } from '../lib/api'
import { toast } from '../lib/toast'

const quizSchema = z.object({
  question: z.string().trim().min(1, 'Informe a pergunta.'),
  options: z.string().refine((value) => value.split(',').map((option) => option.trim()).filter(Boolean).length >= 2, 'Informe pelo menos duas opções separadas por vírgula.'),
  correct: z.number().int('Informe um número inteiro.').min(0, 'O índice deve ser 0 ou maior.'),
  explanation: z.string(),
}).superRefine((values, context) => {
  const options = values.options.split(',').map((option) => option.trim()).filter(Boolean)
  if (values.correct >= options.length) {
    context.addIssue({ code: 'custom', path: ['correct'], message: 'A resposta correta deve corresponder a uma das opções.' })
  }
})

type QuizFormValues = z.infer<typeof quizSchema>
const inputStyle = { width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }
const errorStyle = { color: '#dc2626', fontSize: '13px', marginTop: '4px' }

export default function QuizForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: { question: '', options: '', correct: 0, explanation: '' },
  })

  useEffect(() => {
    if (!id) return
    getRecord<{ question: string; options: unknown; correct: number; explanation: string }>('quiz_questions', id)
      .then((question) => reset({
        question: question.question || '',
        options: Array.isArray(question.options) ? question.options.join(', ') : '',
        correct: question.correct || 0,
        explanation: question.explanation || '',
      }))
      .catch((error: unknown) => toast.error(`Erro ao carregar pergunta: ${error instanceof Error ? error.message : error}`))
  }, [id, reset])

  const onSubmit = async (values: QuizFormValues) => {
    try {
      await saveRecord('quiz_questions', {
        ...values,
        options: values.options.split(',').map((option) => option.trim()).filter(Boolean),
      }, id)
      toast.success(id ? 'Pergunta atualizada com sucesso!' : 'Pergunta criada com sucesso!')
      navigate('/quiz')
    } catch (error) {
      toast.error(`Erro ao salvar: ${error instanceof Error ? error.message : error}`)
    }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>{id ? 'Editar' : 'Nova'} Pergunta</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Pergunta</label>
          <textarea {...register('question')} style={{ ...inputStyle, minHeight: '80px' }} />
          {errors.question && <p role="alert" style={errorStyle}>{errors.question.message}</p>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Opções (separadas por vírgula)</label>
          <input {...register('options')} style={inputStyle} />
          {errors.options && <p role="alert" style={errorStyle}>{errors.options.message}</p>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Resposta Correta (0, 1, 2, 3)</label>
          <input type="number" {...register('correct', { valueAsNumber: true })} style={inputStyle} />
          {errors.correct && <p role="alert" style={errorStyle}>{errors.correct.message}</p>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Explicação</label>
          <textarea {...register('explanation')} style={{ ...inputStyle, minHeight: '80px' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" disabled={isSubmitting} style={{ padding: '8px 24px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.5 : 1 }}>{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
          <button type="button" onClick={() => navigate('/quiz')} style={{ padding: '8px 24px', background: '#d1d5db', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
