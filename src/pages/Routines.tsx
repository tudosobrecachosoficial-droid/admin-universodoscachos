import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Routines() {
  const [routines, setRoutines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoutines()
  }, [])

  const fetchRoutines = async () => {
    const { data } = await supabase.from('routines').select('*')
    setRoutines(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return
    await supabase.from('routines').delete().eq('id', id)
    fetchRoutines()
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rotinas</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          + Nova Rotina
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Dia</th>
              <th className="px-6 py-3 text-left">Descrição</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {routines.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="px-6 py-4">{r.day}</td>
                <td className="px-6 py-4">{r.description?.substring(0, 100)}...</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-800">
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
