import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Posts() {
  const [posts, setPosts] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchPosts() }, [])
  useEffect(() => {
    if (search) setFiltered(posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase())))
    else setFiltered(posts)
  }, [search, posts])

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
    setFiltered(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return
    await supabase.from('posts').delete().eq('id', id)
    fetchPosts()
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Blog</h1>
        <button onClick={() => navigate('/blog/novo')} style={{ padding: '8px 16px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Novo</button>
      </div>
      <input type="text" placeholder="Buscar posts..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Título</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Slug</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Autor</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p: any) => (
              <tr key={p.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{p.title}</td>
                <td style={{ padding: '12px 16px' }}>{p.slug}</td>
                <td style={{ padding: '12px 16px' }}>{p.author}</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => navigate(`/blog/editar/${p.id}`)} style={{ marginRight: '8px', padding: '4px 8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleDelete(p.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Nenhum post encontrado</div>}
      </div>
    </div>
  )
}
