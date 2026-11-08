import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type LayoutProps = {
  children?: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const NavLink = ({ to, children, icon }: { to: string; children: React.ReactNode; icon: string }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
    return (
      <Link
        to={to}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '8px',
          color: 'white',
          textDecoration: 'none',
          background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
          transition: 'all 0.2s',
          fontWeight: isActive ? '600' : '400'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent'
          }
        }}
      >
        <span style={{ fontSize: '20px' }}>{icon}</span>
        {children}
      </Link>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <aside style={{
        width: '280px',
        background: 'linear-gradient(180deg, #7c3aed 0%, #6d28d9 100%)',
        color: 'white',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>Admin Cachos</h1>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>Universo dos Cachos</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <NavLink to="/" icon="📊">Dashboard</NavLink>
          <NavLink to="/produtos" icon="📦">Produtos</NavLink>
          <NavLink to="/blog" icon="📝">Blog</NavLink>
          <NavLink to="/glossario" icon="📖">Glossário</NavLink>
          <NavLink to="/quiz" icon="❓">Quiz</NavLink>
          <NavLink to="/rotinas" icon="📅">Rotinas</NavLink>
          <NavLink to="/cuidados" icon="💡">Cuidados</NavLink>
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: '24px',
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(220, 38, 38, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(220, 38, 38, 1)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.9)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <span>🚪</span> Sair
        </button>
      </aside>

      <main style={{ flex: 1, overflow: 'auto' }}>
        {children || <Outlet />}
      </main>
    </div>
  )
}
