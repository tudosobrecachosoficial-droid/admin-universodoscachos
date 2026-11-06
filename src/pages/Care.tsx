import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Care() {
  const [tips, setTips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTips()
  }, [])

  const fetchTips = async () => {
    const { data } = await supabase.from('care_tips').select('*')
    setTips(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return
    await supabase.from('care_tips').delete().eq('id', id)
    fetchTips()
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cuidados</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          + Nova Dica
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Título</th>
              <th className="px-6 py-3 text-left">Texto</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tips.map((t: any) => (
              <tr key={t.id} className="border-t">
                <td className="px-6 py-4">{t.title}</td>
                <td className="px-6 py-4">{t.text?.substring(0, 100)}...</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800">
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
