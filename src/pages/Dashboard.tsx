/* oxlint-disable react(set-state-in-effect) */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

type StatCardProps = {
  title: string
  count: number
  color: string
  icon: string
  loading: boolean
}

function StatCard({ title, count, color, icon, loading }: StatCardProps) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.9))',
      borderRadius: '18px',
      padding: '24px',
      boxShadow: '0 14px 40px rgba(17,24,39,0.08)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 18px 45px rgba(17,24,39,0.12)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 14px 40px rgba(17,24,39,0.08)'
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>{icon}</div>
        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</div>
      </div>
      <div style={{ fontSize: '38px', fontWeight: '800', color: '#111827', letterSpacing: '-0.04em', marginBottom: '4px' }}>
        {loading ? '...' : count}
      </div>
      <div style={{ fontSize: '13px', color: '#6b7280' }}>itens cadastrados</div>
    </div>
  )
}

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

  const fetchStats = useCallback(async () => {
    const [products, posts, glossary, quiz, routines, care] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('glossary').select('*', { count: 'exact', head: true }),
      supabase.from('quiz_questions').select('*', { count: 'exact', head: true }),
      supabase.from('routines').select('*', { count: 'exact', head: true }),
      supabase.from('care_tips').select('*', { count: 'exact', head: true })
    ])

    // oxlint-disable-next-line react(set-state-in-effect)
    setStats({
      products: products.count || 0,
      posts: posts.count || 0,
      glossary: glossary.count || 0,
      quiz: quiz.count || 0,
      routines: routines.count || 0,
      care: care.count || 0
    })
    // oxlint-disable-next-line react(set-state-in-effect)
    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchStats()
  }, [fetchStats])

  const totalItems = useMemo(
    () => stats.products + stats.posts + stats.glossary + stats.quiz + stats.routines + stats.care,
    [stats],
  )

  return (
    <div style={{ padding: '8px 0' }}>
      <div
        style={{
          marginBottom: '30px',
          padding: '28px 26px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(255,255,255,0.9) 45%, rgba(216,180,254,0.14))',
          border: '1px solid rgba(124, 58, 237, 0.12)',
          boxShadow: '0 24px 60px rgba(91, 33, 182, 0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(167,139,250,0.28), transparent 30%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '999px', background: 'rgba(124,58,237,0.08)', color: '#6d28d9', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
            Dashboard premium
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#111827', margin: '0 0 8px', letterSpacing: '-0.04em' }}>
            Visão geral do conteúdo
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0, maxWidth: '720px' }}>
            Painel administrativo com métricas do Universo dos Cachos, organizado para gestão de catálogo, conteúdo e campanhas.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '22px',
        marginBottom: '28px'
      }}>
        <StatCard title="Produtos" count={stats.products} color="#7c3aed" icon="📦" loading={loading} />
        <StatCard title="Posts" count={stats.posts} color="#10b981" icon="📝" loading={loading} />
        <StatCard title="Glossário" count={stats.glossary} color="#f59e0b" icon="📖" loading={loading} />
        <StatCard title="Quiz" count={stats.quiz} color="#3b82f6" icon="❓" loading={loading} />
        <StatCard title="Rotinas" count={stats.routines} color="#ec4899" icon="📅" loading={loading} />
        <StatCard title="Cuidados" count={stats.care} color="#8b5cf6" icon="💡" loading={loading} />
      </div>

      <div style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.9))',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 18px 45px rgba(17,24,39,0.08)'
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '20px', letterSpacing: '-0.02em' }}>
          📊 Resumo Geral
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '18px 16px', background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(124,58,237,0.02))', borderRadius: '14px', border: '1px solid rgba(124,58,237,0.08)' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#7c3aed', marginBottom: '6px' }}>
              {loading ? '...' : totalItems}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total de Itens</div>
          </div>
          <div style={{ padding: '18px 16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))', borderRadius: '14px', border: '1px solid rgba(16,185,129,0.08)' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#10b981', marginBottom: '6px' }}>
              {loading ? '...' : stats.posts}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Artigos Publicados</div>
          </div>
          <div style={{ padding: '18px 16px', background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))', borderRadius: '14px', border: '1px solid rgba(245,158,11,0.08)' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#f59e0b', marginBottom: '6px' }}>
              {loading ? '...' : stats.glossary}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Termos no Glossário</div>
          </div>
        </div>
      </div>
    </div>
  )
}
