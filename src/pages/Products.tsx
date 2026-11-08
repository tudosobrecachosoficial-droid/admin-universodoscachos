import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteRecord, listRecords } from '../lib/api'
import { toast } from '../lib/toast'

type ProductRecord = {
  id: string
  name: string
  slug: string
  price?: number | string
  category?: string
  category_label?: string
  categoryLabel?: string
  affiliateLink?: string
  affiliate_link?: string
  featured?: boolean
  image?: string
}

const getAffiliateLinkValue = (product: Partial<ProductRecord>) => {
  return product.affiliateLink?.trim() || product.affiliate_link?.trim() || ''
}

const getCategoryValue = (product: Partial<ProductRecord>) => {
  return product.categoryLabel?.trim() || product.category?.trim() || product.category_label?.trim() || 'Sem categoria'
}

const formatPrice = (value?: number | string) => {
  if (value === null || value === undefined || value === '') return 'Preço não informado'

  const numericValue = Number(String(value).replace(/[R$\s.]/g, '').replace(',', '.'))

  if (!Number.isFinite(numericValue)) return 'Preço não informado'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue)
}

function ProductTable({
  products,
  search,
  filter,
  onDeleteComplete,
  navigate,
}: {
  products: ProductRecord[]
  search: string
  filter: 'all' | 'featured' | 'no-link'
  onDeleteComplete: () => void
  navigate: ReturnType<typeof useNavigate>
}) {
  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return products.filter((product) => {
      const affiliateLink = getAffiliateLinkValue(product)
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'featured'
            ? Boolean(product.featured)
            : !affiliateLink

      if (!matchesFilter) return false

      if (!normalizedSearch) return true

      const searchableText = `${product.name ?? ''} ${product.slug ?? ''} ${getCategoryValue(product)}`.toLowerCase()
      return searchableText.includes(normalizedSearch)
    })
  }, [products, search, filter])

  if (!filteredProducts.length) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px dashed #d1d5db',
        padding: '32px 24px',
        textAlign: 'center',
        color: '#6b7280',
      }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
        <h3 style={{ margin: '0 0 8px', color: '#1f2937', fontSize: '20px' }}>Nenhum produto encontrado</h3>
        <p style={{ margin: 0 }}>Tente outro termo de busca ou adicione um novo produto ao catálogo.</p>
      </div>
    )
  }

  return (
    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f9fafb' }}>
          <tr>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Produto</th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Slug</th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preço</th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Link</th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Destaque</th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => {
            const affiliateLink = getAffiliateLinkValue(product)

            return (
            <tr
              key={product.id}
              style={{
                borderTop: index === 0 ? 'none' : '1px solid #e5e7eb',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
              }}
            >
              <td style={{ padding: '16px 20px', color: '#1f2937' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                  ) : (
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📦</div>
                  )}
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{product.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>
                      {getCategoryValue(product)}
                    </div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '14px' }}>{product.slug}</td>
              <td style={{ padding: '16px 20px', color: '#1f2937', fontWeight: '600' }}>{formatPrice(product.price)}</td>
              <td style={{ padding: '16px 20px' }}>
                {affiliateLink ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => window.open(affiliateLink, '_blank', 'noopener,noreferrer')}
                      style={{
                        alignSelf: 'flex-start',
                        border: '1px solid #ddd6fe',
                        background: '#f5f3ff',
                        color: '#6d28d9',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      Comprar agora
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(affiliateLink)
                          toast.success('Link do afiliado copiado!')
                        } catch {
                          toast.error('Não foi possível copiar o link.')
                        }
                      }}
                      style={{
                        alignSelf: 'flex-start',
                        border: '1px solid #e5e7eb',
                        background: 'white',
                        color: '#374151',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      Copiar link
                    </button>
                  </div>
                ) : (
                  <span style={{ color: '#9ca3af', fontSize: '12px' }}>Sem link</span>
                )}
              </td>
              <td style={{ padding: '16px 20px' }}>
                {product.featured ? (
                  <span style={{ padding: '4px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>✓ Sim</span>
                ) : (
                  <span style={{ padding: '4px 12px', background: '#f3f4f6', color: '#6b7280', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Não</span>
                )}
              </td>
              <td style={{ padding: '16px 20px' }}>
                <button
                  onClick={() => navigate(`/produtos/editar/${product.id}`)}
                  style={{
                    marginRight: '8px',
                    padding: '8px 16px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#059669'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#10b981'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={async () => {
                    if (!window.confirm('Tem certeza que deseja deletar este produto?')) return
                    try {
                      await deleteRecord('products', product.id)
                      toast.success('Produto removido com sucesso!')
                      onDeleteComplete()
                    } catch (error) {
                      toast.error(`Erro ao deletar: ${error instanceof Error ? error.message : error}`)
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#dc2626'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ef4444'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  🗑️ Excluir
                </button>
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function Products() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'featured' | 'no-link'>('all')
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      try {
        setLoading(true)
        const nextProducts = await listRecords<ProductRecord>('products', 'created_at', false)
        if (!isMounted) return
        setProducts(nextProducts)
      } catch (error) {
        if (!isMounted) return
        setProducts([])
        toast.error(`Erro ao carregar produtos: ${error instanceof Error ? error.message : error}`)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void fetchProducts()

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  const totalProducts = products.length
  const featuredProducts = products.filter((product) => product.featured).length
  const productsWithAffiliateLink = products.filter((product) => getAffiliateLinkValue(product)).length

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Carregando produtos...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '16px',
          flexWrap: 'wrap',
          padding: '24px 26px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(255,255,255,0.95))',
          border: '1px solid rgba(124,58,237,0.12)',
          boxShadow: '0 18px 40px rgba(91,33,182,0.08)',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '999px', background: 'rgba(124,58,237,0.08)', color: '#6d28d9', fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Catálogo
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1f2937', marginBottom: '4px', letterSpacing: '-0.03em' }}>Produtos</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Gerencie todos os produtos do catálogo com links de afiliado e destaque comercial.</p>
        </div>
        <button
          onClick={() => navigate('/produtos/novo')}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: '0 16px 30px rgba(109, 40, 217, 0.22)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 18px 34px rgba(109, 40, 217, 0.28)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 16px 30px rgba(109, 40, 217, 0.22)'
          }}
        >
          <span>➕</span> Novo Produto
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'linear-gradient(180deg, rgba(245,243,255,0.9), rgba(255,255,255,1))', borderRadius: '16px', padding: '16px', border: '1px solid #ddd6fe', boxShadow: '0 12px 25px rgba(124,58,237,0.08)' }}>
          <div style={{ color: '#6d28d9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Total</div>
          <div style={{ marginTop: '8px', fontSize: '28px', fontWeight: '800', color: '#1f2937', letterSpacing: '-0.04em' }}>{totalProducts}</div>
        </div>
        <div style={{ background: 'linear-gradient(180deg, rgba(236,253,245,0.9), rgba(255,255,255,1))', borderRadius: '16px', padding: '16px', border: '1px solid #a7f3d0', boxShadow: '0 12px 25px rgba(16,185,129,0.08)' }}>
          <div style={{ color: '#065f46', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Destaques</div>
          <div style={{ marginTop: '8px', fontSize: '28px', fontWeight: '800', color: '#1f2937', letterSpacing: '-0.04em' }}>{featuredProducts}</div>
        </div>
        <div style={{ background: 'linear-gradient(180deg, rgba(255,247,237,0.9), rgba(255,255,255,1))', borderRadius: '16px', padding: '16px', border: '1px solid #fed7aa', boxShadow: '0 12px 25px rgba(245,158,11,0.08)' }}>
          <div style={{ color: '#9a5b00', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Links</div>
          <div style={{ marginTop: '8px', fontSize: '28px', fontWeight: '800', color: '#1f2937', letterSpacing: '-0.04em' }}>{productsWithAffiliateLink}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'featured', label: 'Destaques' },
          { key: 'no-link', label: 'Sem link' },
        ].map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setFilter(option.key as 'all' | 'featured' | 'no-link')}
            style={{
              padding: '8px 14px',
              borderRadius: '999px',
              border: filter === option.key ? '1px solid #7c3aed' : '1px solid #e5e7eb',
              background: filter === option.key ? '#f5f3ff' : 'white',
              color: filter === option.key ? '#6d28d9' : '#4b5563',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: filter === option.key ? '0 10px 22px rgba(124,58,237,0.12)' : 'none',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por nome, slug ou categoria..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 20px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#7c3aed'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      <ProductTable
        products={products}
        search={search}
        filter={filter}
        onDeleteComplete={() => setRefreshKey((value) => value + 1)}
        navigate={navigate}
      />
    </div>
  )
}
