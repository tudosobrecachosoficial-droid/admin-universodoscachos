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
    if (!confirm('Tem certeza que deseja deletar este post?')) return
    setLoading(true)
    await supabase.from('posts').delete().eq('id', id)
    fetchPosts()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Carregando posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>Blog</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Gerencie todos os artigos do blog</p>
        </div>
        <button
          onClick={() => navigate('/blog/novo')}
          style={{
            padding: '12px 24px',
            background: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#6d28d9'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#7c3aed'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <span>➕</span> Novo Post
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="🔍 Buscar posts por título..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 20px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#7c3aed'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Título</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Slug</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Autor</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p: any, index: number) => (
              <tr
                key={p.id}
                style={{
                  borderTop: index === 0 ? 'none' : '1px solid #e5e7eb',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white'
                }}
              >
                <td style={{ padding: '16px 20px', color: '#1f2937', fontWeight: '500' }}>{p.title}</td>
                <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '14px' }}>{p.slug}</td>
                <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '14px' }}>{p.author}</td>
                <td style={{ padding: '16px 20px' }}>
                  <button
                    onClick={() => navigate(`/blog/editar/${p.id}`)}
                    style={{
                      marginRight: '8px',
                      padding: '8px 16px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#059669'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#10b981'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      padding: '8px 16px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#dc2626'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ef4444'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    🗑️ Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '64px 32px', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
            <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>Nenhum post encontrado</p>
            <p style={{ fontSize: '14px' }}>Tente buscar com outro termo ou adicione um novo post</p>
          </div>
        )}
      </div>
    </div>
  )
}
