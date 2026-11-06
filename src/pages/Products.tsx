import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Produtos</h1>
        <button onClick={() => navigate('/produtos/novo')} style={{ padding: '8px 16px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          + Novo Produto
        </button>
      </div>
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Nome</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Slug</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Destaque</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{product.name}</td>
                <td style={{ padding: '12px 16px' }}>{product.slug}</td>
                <td style={{ padding: '12px 16px' }}>{product.featured ? '✓' : '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => navigate(`/produtos/editar/${product.id}`)} style={{ marginRight: '8px', padding: '4px 8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleDelete(product.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
