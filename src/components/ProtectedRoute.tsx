import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return

      const session = data.session
      const role = session?.user?.app_metadata?.role
      setIsAuthenticated(Boolean(session))
      setIsAdmin(role === 'admin')
      setLoading(false)
    }

    void syncSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      const role = session?.user?.app_metadata?.role
      setIsAuthenticated(Boolean(session))
      setIsAdmin(role === 'admin')
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Validando sessão...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: '24px' }}>
        <div style={{ maxWidth: '420px', width: '100%', background: '#fff', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '32px', textAlign: 'center', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)' }}>
          <div style={{ fontSize: '44px', marginBottom: '16px' }}>🚫</div>
          <h1 style={{ margin: '0 0 12px', color: '#111827', fontSize: '28px' }}>Acesso restrito</h1>
          <p style={{ margin: '0 0 20px', color: '#4b5563', fontSize: '16px' }}>
            Esta área do painel é exclusiva para administradores.
          </p>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut()
              navigate('/login', { replace: true })
            }}
            style={{
              width: '100%',
              background: '#7c3aed',
              border: 'none',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 16px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Sair
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
