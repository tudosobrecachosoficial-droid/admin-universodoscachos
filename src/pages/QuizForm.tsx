import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function QuizForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ question: '', options: [], correct: 0, explanation: '' })

  useEffect(() => { if (id) loadQuestion() }, [id])

  const loadQuestion = async () => {
    const { data } = await supabase.from('quiz_questions').select('*').eq('id', id).single()
    if (data) setFormData({
      question: data.question || '',
      options: Array.isArray(data.options) ? data.options : [],
      correct: data.correct || 0,
      explanation: data.explanation || ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (id) await supabase.from('quiz_questions').update(formData).eq('id', id)
      else await supabase.from('quiz_questions').insert(formData)
      navigate('/quiz')
    } catch (error) { alert('Erro: ' + error) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>{id ? 'Editar' : 'Nova'} Pergunta</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Pergunta</label>
          <textarea value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', minHeight: '80px' }} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Opções (separadas por vírgula)</label>
          <input type="text" value={formData.options.join(', ')} onChange={(e) => setFormData({ ...formData, options: e.target.value.split(',').map(s => s.trim()) })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Resposta Correta (0, 1, 2, 3)</label>
          <input type="number" value={formData.correct} onChange={(e) => setFormData({ ...formData, correct: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Explicação</label>
          <textarea value={formData.explanation} onChange={(e) => setFormData({ ...formData, explanation: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', minHeight: '80px' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 24px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>{loading ? 'Salvando...' : 'Salvar'}</button>
          <button type="button" onClick={() => navigate('/quiz')} style={{ padding: '8px 24px', background: '#d1d5db', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
