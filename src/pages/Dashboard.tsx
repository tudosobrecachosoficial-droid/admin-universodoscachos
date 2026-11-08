import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    posts: 0,
    glossary: 0,
    quiz: 0,
    routines: 0,
    care: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const [products, posts, glossary, quiz, routines, care] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('glossary').select('*', { count: 'exact', head: true }),
      supabase.from('quiz_questions').select('*', { count: 'exact', head: true }),
      supabase.from('routines').select('*', { count: 'exact', head: true }),
      supabase.from('care_tips').select('*', { count: 'exact', head: true })
    ])

    setStats({
      products: products.count || 0,
      posts: posts.count || 0,
      glossary: glossary.count || 0,
      quiz: quiz.count || 0,
      routines: routines.count || 0,
      care: care.count || 0
    })
    setLoading(false)
  }

  const Card = ({ title, count, color, icon }: { title: string; count: number; color: string; icon: string }) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
    }}
    >
      <div style={{ fontSize: '48px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
        {loading ? '...' : count}
      </div>
      <div style={{ fontSize: '14px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </div>
    </div>
  )

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Visão geral do conteúdo do Universo dos Cachos
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <Card title="Produtos" count={stats.products} color="#7c3aed" icon="📦" />
        <Card title="Posts" count={stats.posts} color="#10b981" icon="📝" />
        <Card title="Glossário" count={stats.glossary} color="#f59e0b" icon="📖" />
        <Card title="Quiz" count={stats.quiz} color="#3b82f6" icon="❓" />
        <Card title="Rotinas" count={stats.routines} color="#ec4899" icon="📅" />
        <Card title="Cuidados" count={stats.care} color="#8b5cf6" icon="💡" />
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
          📊 Resumo Geral
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>
              {loading ? '...' : stats.products + stats.posts + stats.glossary + stats.quiz + stats.routines + stats.care}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total de Itens</div>
          </div>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
              {loading ? '...' : stats.posts}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Artigos Publicados</div>
          </div>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
              {loading ? '...' : stats.glossary}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Termos no Glossário</div>
          </div>
        </div>
      </div>
    </div>
  )
}
