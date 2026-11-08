import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteRecord, listRecords } from '../lib/api'
import { toast } from '../lib/toast'

function CareTable({ tips, search, navigate, onDeleteComplete }: { tips: any[]; search: string; navigate: ReturnType<typeof useNavigate>; onDeleteComplete: () => void }) {
  const filteredTips = useMemo(
    () => search ? tips.filter((tip) => tip.title?.toLowerCase().includes(search.toLowerCase()) || tip.text?.toLowerCase().includes(search.toLowerCase())) : tips,
    [tips, search],
  )

  if (!filteredTips.length) {
    return (
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px 20px', textAlign: 'center', color: '#6b7280' }}>
        Nenhuma dica encontrada.
      </div>
    )
  }

  return (
    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f9fafb' }}>
          <tr>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Título</th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Texto</th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredTips.map((tip: any, index: number) => (
            <tr key={tip.id} style={{ borderTop: index === 0 ? 'none' : '1px solid #e5e7eb', transition: 'background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'white' }}>
              <td style={{ padding: '16px 20px', color: '#1f2937', fontWeight: '500' }}>{tip.title}</td>
              <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '14px' }}>{tip.text}</td>
              <td style={{ padding: '16px 20px' }}>
                <button onClick={() => navigate(`/cuidados/editar/${tip.id}`)} style={{ marginRight: '8px', padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✏️ Editar</button>
                <button onClick={async () => { if (!confirm('Tem certeza que deseja deletar esta dica?')) return; try { await deleteRecord('care_tips', tip.id); toast.success('Dica removida com sucesso!'); onDeleteComplete() } catch (error) { toast.error(`Erro ao deletar: ${error instanceof Error ? error.message : error}`) } }} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️ Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Care() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [search, setSearch] = useState('')
  const [tips, setTips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const loadTips = async () => {
      setLoading(true)

      try {
        const data = await listRecords<any>('care_tips')
        if (isMounted) setTips(data)
      } catch (error) {
        if (isMounted) {
          setTips([])
          toast.error(`Erro ao carregar cuidados: ${error instanceof Error ? error.message : error}`)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void loadTips()

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', padding: '24px 26px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(255,255,255,0.96))', border: '1px solid rgba(168,85,247,0.12)', boxShadow: '0 18px 40px rgba(168,85,247,0.08)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '999px', background: 'rgba(168,85,247,0.12)', color: '#7e22ce', fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Cuidados</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1f2937', marginBottom: '4px', letterSpacing: '-0.03em' }}>Dicas</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Gerencie dicas e conteúdos de cuidado para o cabelo.</p>
        </div>
        <button onClick={() => navigate('/cuidados/novo')} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 16px 30px rgba(139,92,246,0.22)' }}><span>➕</span> Nova Dica</button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input type="text" placeholder="🔍 Buscar dicas..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '14px 20px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', outline: 'none', background: '#ffffff' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.12)' }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }} />
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Carregando cuidados...</p>
          </div>
        </div>
      ) : (
        <CareTable tips={tips} search={search} navigate={navigate} onDeleteComplete={() => setRefreshKey((value) => value + 1)} />
      )}
    </div>
  )
}
