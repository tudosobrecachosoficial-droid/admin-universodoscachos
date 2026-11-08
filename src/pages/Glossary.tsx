import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteRecord, listRecords } from '../lib/api'
import { toast } from '../lib/toast'

function GlossaryTable({ terms, search, navigate, onDeleteComplete }: { terms: any[]; search: string; navigate: ReturnType<typeof useNavigate>; onDeleteComplete: () => void }) {
  const filteredTerms = useMemo(
    () => search ? terms.filter((term) => term.term?.toLowerCase().includes(search.toLowerCase()) || term.definition?.toLowerCase().includes(search.toLowerCase())) : terms,
    [terms, search],
  )

  if (!filteredTerms.length) {
    return (
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px 20px', textAlign: 'center', color: '#6b7280' }}>
        Nenhum termo encontrado.
      </div>
    )
  }

  return (
    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f9fafb' }}>
          <tr>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Termo</th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Definição</th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredTerms.map((term: any, index: number) => (
            <tr key={term.id} style={{ borderTop: index === 0 ? 'none' : '1px solid #e5e7eb', transition: 'background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'white' }}>
              <td style={{ padding: '16px 20px', color: '#1f2937', fontWeight: '500' }}>{term.term}</td>
              <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '14px' }}>{term.definition}</td>
              <td style={{ padding: '16px 20px' }}>
                <button onClick={() => navigate(`/glossario/editar/${term.id}`)} style={{ marginRight: '8px', padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✏️ Editar</button>
                <button onClick={async () => { if (!confirm('Tem certeza que deseja deletar este termo?')) return; try { await deleteRecord('glossary', term.id); toast.success('Termo removido com sucesso!'); onDeleteComplete() } catch (error) { toast.error(`Erro ao deletar: ${error instanceof Error ? error.message : error}`) } }} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️ Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Glossary() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [search, setSearch] = useState('')
  const [terms, setTerms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const loadTerms = async () => {
      setLoading(true)

      try {
        const data = await listRecords<any>('glossary', 'term', true)
        if (isMounted) setTerms(data)
      } catch (error) {
        if (isMounted) {
          setTerms([])
          toast.error(`Erro ao carregar glossário: ${error instanceof Error ? error.message : error}`)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void loadTerms()

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', padding: '24px 26px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(255,255,255,0.96))', border: '1px solid rgba(245,158,11,0.12)', boxShadow: '0 18px 40px rgba(245,158,11,0.07)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '999px', background: 'rgba(245,158,11,0.12)', color: '#b45309', fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Glossário</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1f2937', marginBottom: '4px', letterSpacing: '-0.03em' }}>Termos</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Gerencie todos os termos e definições do glossário.</p>
        </div>
        <button onClick={() => navigate('/glossario/novo')} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 16px 30px rgba(245,158,11,0.24)' }}><span>➕</span> Novo Termo</button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input type="text" placeholder="🔍 Buscar termos..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '14px 20px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', outline: 'none', background: '#ffffff' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.12)' }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }} />
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Carregando glossário...</p>
          </div>
        </div>
      ) : (
        <GlossaryTable terms={terms} search={search} navigate={navigate} onDeleteComplete={() => setRefreshKey((value) => value + 1)} />
      )}
    </div>
  )
}
