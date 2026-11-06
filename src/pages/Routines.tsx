import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Routines() {
  const [routines, setRoutines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { fetchRoutines() }, [])

  const fetchRoutines = async () => {
    const { data } = await supabase.from('routines').select('*')
    setRoutines(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return
    await supabase.from('routines').delete().eq('id', id)
    fetchRoutines()
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Rotinas</h1>
        <button onClick={() => navigate('/rotinas/novo')} style={{ padding: '8px 16px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Nova Rotina</button>
      </div>
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Dia</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Descrição</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {routines.map((r: any) => (
              <tr key={r.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{r.day}</td>
                <td style={{ padding: '12px 16px' }}>{r.description?.substring(0, 100)}...</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => navigate(`/rotinas/editar/${r.id}`)} style={{ marginRight: '8px', padding: '4px 8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleDelete(r.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
