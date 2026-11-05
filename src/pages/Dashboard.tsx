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

  useEffect(() => {
    const fetchStats = async () => {
      const [products, posts, glossary, quiz, routines, care] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('glossary').select('*', { count: 'exact', head: true }),
        supabase.from('quiz_questions').select('*', { count: 'exact', head: true }),
        supabase.from('routines').select('*', { count: 'exact', head: true }),
        supabase.from('care_tips').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        products: products.count || 0,
        posts: posts.count || 0,
        glossary: glossary.count || 0,
        quiz: quiz.count || 0,
        routines: routines.count || 0,
        care: care.count || 0
      })
    }

    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Produtos</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.products}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Posts</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.posts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Glossário</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.glossary}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Quiz</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.quiz}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Rotinas</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.routines}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Cuidados</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.care}</p>
        </div>
      </div>
    </div>
  )
}
