import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return

      setIsAuthenticated(Boolean(data.session))
      setLoading(false)
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      setIsAuthenticated(Boolean(session))
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

  return <>{children}</>
}
