import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Glossary() {
  const [terms, setTerms] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchTerms() }, [])
  useEffect(() => {
    if (search) setFiltered(terms.filter(t => t.term.toLowerCase().includes(search.toLowerCase())))
    else setFiltered(terms)
  }, [search, terms])

  const fetchTerms = async () => {
    const { data } = await supabase.from('glossary').select('*').order('term')
    setTerms(data || [])
    setFiltered(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return
    await supabase.from('glossary').delete().eq('id', id)
    fetchTerms()
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Glossário</h1>
        <button onClick={() => navigate('/glossario/novo')} style={{ padding: '8px 16px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Novo</button>
      </div>
      <input type="text" placeholder="Buscar termos..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Termo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Definição</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t: any) => (
              <tr key={t.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{t.term}</td>
                <td style={{ padding: '12px 16px' }}>{t.definition?.substring(0, 100)}...</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => navigate(`/glossario/editar/${t.id}`)} style={{ marginRight: '8px', padding: '4px 8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleDelete(t.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Nenhum termo encontrado</div>}
      </div>
    </div>
  )
}
