import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'

type LayoutProps = {
  children?: React.ReactNode
}

type NavLinkProps = {
  to: string
  children: React.ReactNode
  icon: string
  isActive: boolean
}

function NavLink({ to, children, icon, isActive }: NavLinkProps) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '12px',
        color: 'white',
        textDecoration: 'none',
        background: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.04)',
        border: isActive ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
        boxShadow: isActive ? '0 8px 18px rgba(15, 23, 42, 0.15)' : 'none',
        transition: 'all 0.2s ease',
        fontWeight: isActive ? '700' : '500',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          e.currentTarget.style.borderColor = 'transparent'
        }
      }}
    >
      <span style={{ fontSize: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px' }}>{icon}</span>
      {children}
    </Link>
  )
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [isCompact, setIsCompact] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 900 : false)

  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < 900)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.body.style.background = darkMode ? '#111827' : '#f9fafb'
    document.body.style.color = darkMode ? '#f9fafb' : '#111827'
  }, [darkMode])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc', flexDirection: isCompact ? 'column' : 'row' }}>
      <aside style={{
        width: isCompact ? '100%' : '290px',
        background: 'linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%)',
        color: 'white',
        padding: isCompact ? '18px 18px 14px' : '24px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(91, 33, 182, 0.24)',
        borderRight: isCompact ? 'none' : '1px solid rgba(255,255,255,0.12)',
      }}>
        <div style={{ marginBottom: isCompact ? '18px' : '26px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', marginBottom: '12px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}>
            ✨
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.03em' }}>Admin Cachos</h1>
          <p style={{ fontSize: '14px', opacity: 0.82, margin: 0 }}>Universo dos Cachos</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: isCompact ? 'row' : 'column', gap: '8px', flex: 1, flexWrap: isCompact ? 'wrap' : 'nowrap' }}>
          <NavLink to="/" icon="📊" isActive={location.pathname === '/'}>Dashboard</NavLink>
          <NavLink to="/produtos" icon="📦" isActive={location.pathname.startsWith('/produtos')}>Produtos</NavLink>
          <NavLink to="/blog" icon="📝" isActive={location.pathname.startsWith('/blog')}>Blog</NavLink>
          <NavLink to="/glossario" icon="📖" isActive={location.pathname.startsWith('/glossario')}>Glossário</NavLink>
          <NavLink to="/quiz" icon="❓" isActive={location.pathname.startsWith('/quiz')}>Quiz</NavLink>
          <NavLink to="/rotinas" icon="📅" isActive={location.pathname.startsWith('/rotinas')}>Rotinas</NavLink>
          <NavLink to="/cuidados" icon="💡" isActive={location.pathname.startsWith('/cuidados')}>Cuidados</NavLink>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.14)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span>{darkMode ? '☀️' : '🌙'}</span> {darkMode ? 'Modo Claro' : 'Modo Escuro'}
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.95)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 1)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.95)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span>🚪</span> Sair
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto', minWidth: 0, padding: isCompact ? '20px 16px' : '32px' }}>
        {children || <Outlet />}
      </main>
    </div>
  )
}
