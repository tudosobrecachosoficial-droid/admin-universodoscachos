import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteRecord, listRecords } from '../lib/api'
import { toast } from '../lib/toast'

function RoutineTable({ routines, search, navigate, onDeleteComplete }: { routines: any[]; search: string; navigate: ReturnType<typeof useNavigate>; onDeleteComplete: () => void }) {
  const filteredRoutines = useMemo(
    () => search ? routines.filter((routine) => routine.day?.toLowerCase().includes(search.toLowerCase()) || routine.description?.toLowerCase().includes(search.toLowerCase())) : routines,
    [routines, search],
  )

  if (!filteredRoutines.length) {
    return (
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px 20px', textAlign: 'center', color: '#6b7280' }}>
        Nenhuma rotina encontrada.
      </div>
    )
  }

  return (
    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f9fafb' }}>
          <tr>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dia</th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Descrição</th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoutines.map((routine: any, index: number) => (
            <tr key={routine.id} style={{ borderTop: index === 0 ? 'none' : '1px solid #e5e7eb', transition: 'background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'white' }}>
              <td style={{ padding: '16px 20px', color: '#1f2937', fontWeight: '500' }}>{routine.day}</td>
              <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '14px' }}>{routine.description}</td>
              <td style={{ padding: '16px 20px' }}>
                <button onClick={() => navigate(`/rotinas/editar/${routine.id}`)} style={{ marginRight: '8px', padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✏️ Editar</button>
                <button onClick={async () => { if (!confirm('Tem certeza que deseja deletar esta rotina?')) return; try { await deleteRecord('routines', routine.id); toast.success('Rotina removida com sucesso!'); onDeleteComplete() } catch (error) { toast.error(`Erro ao deletar: ${error instanceof Error ? error.message : error}`) } }} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️ Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Routines() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [search, setSearch] = useState('')
  const [routines, setRoutines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const loadRoutines = async () => {
      setLoading(true)

      try {
        const data = await listRecords<any>('routines')
        if (isMounted) setRoutines(data)
      } catch (error) {
        if (isMounted) {
          setRoutines([])
          toast.error(`Erro ao carregar rotinas: ${error instanceof Error ? error.message : error}`)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void loadRoutines()

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', padding: '24px 26px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(255,255,255,0.96))', border: '1px solid rgba(236,72,153,0.12)', boxShadow: '0 18px 40px rgba(236,72,153,0.08)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '999px', background: 'rgba(236,72,153,0.12)', color: '#be185d', fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Rotinas</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1f2937', marginBottom: '4px', letterSpacing: '-0.03em' }}>Planejamento</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Gerencie as rotinas e cronogramas de cuidados.</p>
        </div>
        <button onClick={() => navigate('/rotinas/novo')} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 16px 30px rgba(236,72,153,0.22)' }}><span>➕</span> Nova Rotina</button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input type="text" placeholder="🔍 Buscar rotinas..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '14px 20px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', outline: 'none', background: '#ffffff' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(236, 72, 153, 0.12)' }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }} />
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Carregando rotinas...</p>
          </div>
        </div>
      ) : (
        <RoutineTable routines={routines} search={search} navigate={navigate} onDeleteComplete={() => setRefreshKey((value) => value + 1)} />
      )}
    </div>
  )
}
