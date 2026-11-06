import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          + Novo Produto
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-left">Slug</th>
              <th className="px-6 py-3 text-left">Destaque</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id} className="border-t">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.slug}</td>
                <td className="px-6 py-4">{product.featured ? '✓' : '-'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
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
