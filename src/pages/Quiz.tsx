import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteRecord, listRecords } from '../lib/api'
import { toast } from '../lib/toast'

function QuizTable({ questions, search, navigate, onDeleteComplete }: { questions: any[]; search: string; navigate: ReturnType<typeof useNavigate>; onDeleteComplete: () => void }) {
  const filteredQuestions = useMemo(
    () => search ? questions.filter((question) => question.question?.toLowerCase().includes(search.toLowerCase()) || question.explanation?.toLowerCase().includes(search.toLowerCase())) : questions,
    [questions, search],
  )

  if (!filteredQuestions.length) {
    return (
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px 20px', textAlign: 'center', color: '#6b7280' }}>
        Nenhuma pergunta encontrada.
      </div>
    )
  }

  return (
    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f9fafb' }}>
          <tr>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pergunta</th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((question: any, index: number) => (
            <tr key={question.id} style={{ borderTop: index === 0 ? 'none' : '1px solid #e5e7eb', transition: 'background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'white' }}>
              <td style={{ padding: '16px 20px', color: '#1f2937', fontWeight: '500' }}>{question.question?.substring(0, 100)}{question.question?.length > 100 ? '...' : ''}</td>
              <td style={{ padding: '16px 20px' }}>
                <button onClick={() => navigate(`/quiz/editar/${question.id}`)} style={{ marginRight: '8px', padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✏️ Editar</button>
                <button onClick={async () => { if (!confirm('Tem certeza que deseja deletar esta pergunta?')) return; try { await deleteRecord('quiz_questions', question.id); toast.success('Pergunta removida com sucesso!'); onDeleteComplete() } catch (error) { toast.error(`Erro ao deletar: ${error instanceof Error ? error.message : error}`) } }} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️ Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Quiz() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [search, setSearch] = useState('')
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const loadQuestions = async () => {
      setLoading(true)

      try {
        const data = await listRecords<any>('quiz_questions')
        if (isMounted) setQuestions(data)
      } catch (error) {
        if (isMounted) {
          setQuestions([])
          toast.error(`Erro ao carregar quiz: ${error instanceof Error ? error.message : error}`)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void loadQuestions()

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', padding: '24px 26px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(255,255,255,0.96))', border: '1px solid rgba(59,130,246,0.12)', boxShadow: '0 18px 40px rgba(59,130,246,0.08)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '999px', background: 'rgba(59,130,246,0.12)', color: '#1d4ed8', fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Quiz</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1f2937', marginBottom: '4px', letterSpacing: '-0.03em' }}>Perguntas</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Gerencie todas as perguntas e respostas do quiz.</p>
        </div>
        <button onClick={() => navigate('/quiz/novo')} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 16px 30px rgba(59,130,246,0.22)' }}><span>➕</span> Nova Pergunta</button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input type="text" placeholder="🔍 Buscar perguntas..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '14px 20px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', outline: 'none', background: '#ffffff' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.12)' }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }} />
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Carregando quiz...</p>
          </div>
        </div>
      ) : (
        <QuizTable questions={questions} search={search} navigate={navigate} onDeleteComplete={() => setRefreshKey((value) => value + 1)} />
      )}
    </div>
  )
}
