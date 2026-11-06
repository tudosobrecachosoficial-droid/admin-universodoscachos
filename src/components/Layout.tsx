import { Outlet, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type LayoutProps = {
  children?: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
      <aside style={{ width: '256px', background: '#7c3aed', color: 'white', padding: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '32px' }}>Admin Cachos</h1>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/" style={{ display: 'block', padding: '8px 16px', borderRadius: '4px', color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/produtos" style={{ display: 'block', padding: '8px 16px', borderRadius: '4px', color: 'white', textDecoration: 'none' }}>Produtos</Link>
          <Link to="/blog" style={{ display: 'block', padding: '8px 16px', borderRadius: '4px', color: 'white', textDecoration: 'none' }}>Blog</Link>
          <Link to="/glossario" style={{ display: 'block', padding: '8px 16px', borderRadius: '4px', color: 'white', textDecoration: 'none' }}>Glossário</Link>
          <Link to="/quiz" style={{ display: 'block', padding: '8px 16px', borderRadius: '4px', color: 'white', textDecoration: 'none' }}>Quiz</Link>
          <Link to="/rotinas" style={{ display: 'block', padding: '8px 16px', borderRadius: '4px', color: 'white', textDecoration: 'none' }}>Rotinas</Link>
          <Link to="/cuidados" style={{ display: 'block', padding: '8px 16px', borderRadius: '4px', color: 'white', textDecoration: 'none' }}>Cuidados</Link>
        </nav>
        <button onClick={handleLogout} style={{ marginTop: '32px', width: '100%', padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sair
        </button>
      </aside>
      <main style={{ flex: 1, padding: '32px' }}>
        {children || <Outlet />}
      </main>
    </div>
  )
}
