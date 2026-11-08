import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Care() {
  const [tips, setTips] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchTips() }, [])
  useEffect(() => {
    if (search) setFiltered(tips.filter(t => t.title.toLowerCase().includes(search.toLowerCase())))
    else setFiltered(tips)
  }, [search, tips])

  const fetchTips = async () => {
    const { data } = await supabase.from('care_tips').select('*')
    setTips(data || [])
    setFiltered(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return
    await supabase.from('care_tips').delete().eq('id', id)
    fetchTips()
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Cuidados</h1>
        <button onClick={() => navigate('/cuidados/novo')} style={{ padding: '8px 16px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Nova</button>
      </div>
      <input type="text" placeholder="Buscar dicas..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Título</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Texto</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t: any) => (
              <tr key={t.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{t.title}</td>
                <td style={{ padding: '12px 16px' }}>{t.text?.substring(0, 100)}...</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => navigate(`/cuidados/editar/${t.id}`)} style={{ marginRight: '8px', padding: '4px 8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleDelete(t.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Nenhuma dica encontrada</div>}
      </div>
    </div>
  )
}
