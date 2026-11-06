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
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-purple-900 text-white p-4">
        <h1 className="text-xl font-bold mb-8">Admin Cachos</h1>
        <nav className="space-y-2">
          <Link to="/" className="block py-2 px-4 rounded hover:bg-purple-800">Dashboard</Link>
          <Link to="/produtos" className="block py-2 px-4 rounded hover:bg-purple-800">Produtos</Link>
          <Link to="/blog" className="block py-2 px-4 rounded hover:bg-purple-800">Blog</Link>
          <Link to="/glossario" className="block py-2 px-4 rounded hover:bg-purple-800">Glossário</Link>
          <Link to="/quiz" className="block py-2 px-4 rounded hover:bg-purple-800">Quiz</Link>
          <Link to="/rotinas" className="block py-2 px-4 rounded hover:bg-purple-800">Rotinas</Link>
          <Link to="/cuidados" className="block py-2 px-4 rounded hover:bg-purple-800">Cuidados</Link>
        </nav>
        <button onClick={handleLogout} className="mt-8 w-full py-2 px-4 bg-red-600 rounded hover:bg-red-700">
          Sair
        </button>
      </aside>
      <main className="flex-1 p-8">
        {children || <Outlet />}
      </main>
    </div>
  )
}
