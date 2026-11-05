import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Glossary() {
  const [terms, setTerms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTerms()
  }, [])

  const fetchTerms = async () => {
    const { data } = await supabase.from('glossary').select('*').order('term')
    setTerms(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return
    await supabase.from('glossary').delete().eq('id', id)
    fetchTerms()
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Glossário</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          + Novo Termo
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Termo</th>
              <th className="px-6 py-3 text-left">Definição</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((term: any) => (
              <tr key={term.id} className="border-t">
                <td className="px-6 py-4">{term.term}</td>
                <td className="px-6 py-4">{term.definition?.substring(0, 100)}...</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(term.id)} className="text-red-600 hover:text-red-800">
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
