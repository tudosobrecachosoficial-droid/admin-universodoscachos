import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Quiz() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { fetchQuestions() }, [])

  const fetchQuestions = async () => {
    const { data } = await supabase.from('quiz_questions').select('*')
    setQuestions(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return
    await supabase.from('quiz_questions').delete().eq('id', id)
    fetchQuestions()
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Quiz</h1>
        <button onClick={() => navigate('/quiz/novo')} style={{ padding: '8px 16px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Nova Pergunta</button>
      </div>
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Pergunta</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q: any) => (
              <tr key={q.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{q.question?.substring(0, 100)}...</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => navigate(`/quiz/editar/${q.id}`)} style={{ marginRight: '8px', padding: '4px 8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleDelete(q.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
