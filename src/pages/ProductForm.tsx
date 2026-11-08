/* oxlint-disable react(incompatible-library) */
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRecord, saveRecord } from '../lib/api'
import ImageUpload from '../components/ImageUpload'
import { toast } from '../lib/toast'

const slugify = (value: string) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80)

const productSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do produto.'),
  slug: z.string().trim().min(1, 'Informe o slug.').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use apenas letras minúsculas, números e hífens.'),
  categoryLabel: z.string().trim().max(80, 'A categoria deve ter no máximo 80 caracteres.').default(''),
  price: z.string().trim().default('').refine((value) => {
    if (!value) return true

    const normalizedValue = value
      .replace(/R\$\s?/gi, '')
      .replace(/\./g, '')
      .replace(',', '.')

    const numericValue = Number(normalizedValue)
    return Number.isFinite(numericValue) && numericValue >= 0
  }, 'Informe um preço válido.'),
  affiliateLink: z.string().trim().min(1, 'Informe o link de afiliado do produto.').url('Informe uma URL válida do link de afiliado.'),
  featured: z.boolean(),
  image: z.string(),
})

type ProductFormValues = z.infer<typeof productSchema>

type ProductRecordFromDb = ProductFormValues & {
  price: string | number
  category?: string
  category_label?: string
  categoryLabel?: string
  affiliateLink?: string
  affiliate_link?: string
}

const getAffiliateLinkValue = (product?: Partial<ProductRecordFromDb>) => {
  if (!product) return ''
  return product.affiliateLink?.trim() || product.affiliate_link?.trim() || ''
}

const getCategoryValue = (product?: Partial<ProductRecordFromDb>) => {
  if (!product) return ''
  return product.categoryLabel?.trim() || product.category?.trim() || product.category_label?.trim() || ''
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  // oxlint-disable-next-line react(incompatible-library)
  const { register, handleSubmit, reset, watch, setValue, getValues, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', slug: '', categoryLabel: '', price: '', affiliateLink: '', featured: false, image: '' },
  })

  const nameValue = watch('name')

  useEffect(() => {
    if (!nameValue) return

    const generatedSlug = slugify(nameValue)
    const currentSlug = getValues('slug')

    if (!currentSlug || currentSlug === generatedSlug || currentSlug === slugify(currentSlug)) {
      setValue('slug', generatedSlug, { shouldValidate: true, shouldDirty: true })
    }
  }, [nameValue, getValues, setValue])

  useEffect(() => {
    if (!id) return
    getRecord<ProductRecordFromDb>('products', id)
      .then((product) => reset({
        name: product.name || '',
        slug: product.slug || '',
        categoryLabel: getCategoryValue(product),
        price: String(product.price || ''),
        affiliateLink: getAffiliateLinkValue(product),
        featured: Boolean(product.featured),
        image: product.image || '',
      }))
      .catch((error: unknown) => toast.error(`Erro ao carregar produto: ${error instanceof Error ? error.message : error}`))
  }, [id, reset])

  const onSubmit = async (formData: ProductFormValues) => {
    try {
      const affiliateLink = formData.affiliateLink.trim()
      const categoryValue = formData.categoryLabel.trim()
      const normalizedData = {
        ...formData,
        slug: slugify(formData.slug),
        categoryLabel: categoryValue,
        category: categoryValue,
        category_label: categoryValue,
        affiliateLink,
        price: formData.price
          ? formData.price
              .replace(/R\$\s?/gi, '')
              .replace(/\./g, '')
              .replace(',', '.')
          : '',
      }

      try {
        await saveRecord('products', normalizedData, id)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        const isColumnMismatch = /affiliate(Link|_link)|column .*affiliate|category(Label|_label)|column .*category/i.test(message)

        if (!isColumnMismatch) throw error

        const fallbackData = {
          ...normalizedData,
          categoryLabel: undefined,
          category: categoryValue,
          category_label: categoryValue,
          affiliateLink: undefined,
          affiliate_link: affiliateLink,
        }

        await saveRecord('products', fallbackData, id)
      }

      toast.success(id ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!')
      navigate('/produtos')
    } catch (error) {
      toast.error(`Erro ao salvar: ${error instanceof Error ? error.message : error}`)
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    color: '#111827',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: '24px', maxWidth: '940px', margin: '0 auto' }}>
      <div
        style={{
          marginBottom: '28px',
          padding: '24px 28px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(255,255,255,0.95) 48%, rgba(216,180,254,0.18))',
          border: '1px solid rgba(124,58,237,0.12)',
          boxShadow: '0 22px 45px rgba(91, 33, 182, 0.08)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '999px', background: 'rgba(124,58,237,0.08)', color: '#6d28d9', fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {id ? 'Edição' : 'Cadastro'}
        </div>
        <h1 style={{ fontSize: '34px', fontWeight: '800', color: '#111827', margin: '14px 0 8px', letterSpacing: '-0.04em' }}>
          {id ? 'Editar produto' : 'Novo produto'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
          {id ? 'Atualize os dados, imagem e link de afiliado deste item do catálogo.' : 'Cadastre um novo produto com imagem, preço e link de divulgação.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '22px', background: 'rgba(255,255,255,0.92)', borderRadius: '24px', padding: '28px', border: '1px solid rgba(148,163,184,0.2)', boxShadow: '0 18px 45px rgba(15,23,42,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Nome</label>
            <input
              type="text"
              {...register('name')}
              placeholder="Nome do produto"
              style={fieldStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#7c3aed'
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            {errors.name && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.name.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Slug</label>
            <input
              type="text"
              {...register('slug')}
              placeholder="nome-do-produto"
              style={fieldStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#7c3aed'
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            {errors.slug && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.slug.message}</p>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Categoria</label>
            <input
              type="text"
              {...register('categoryLabel')}
              placeholder="Ex: finalizadores, kits, shampoos"
              style={fieldStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#7c3aed'
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            {errors.categoryLabel && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.categoryLabel.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Preço</label>
            <input
              type="text"
              {...register('price')}
              placeholder="R$ 0,00"
              style={fieldStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#7c3aed'
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            {errors.price && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.price.message}</p>}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Link de afiliado (Shopee)</label>
          <input
            type="url"
            {...register('affiliateLink')}
            placeholder="https://shope.ee/..."
            style={fieldStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#7c3aed'
              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          {errors.affiliateLink && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.affiliateLink.message}</p>}
        </div>

        <ImageUpload
          value={watch('image')}
          onChange={(url) => setValue('image', url, { shouldDirty: true })}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 18px', background: 'linear-gradient(180deg, rgba(245,243,255,0.8), rgba(255,255,255,0.9))', borderRadius: '16px', border: '1px solid rgba(124,58,237,0.12)' }}>
          <input
            type="checkbox"
            id="featured"
            {...register('featured')}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#7c3aed' }}
          />
          <label htmlFor="featured" style={{ cursor: 'pointer', fontWeight: '600', color: '#374151' }}>Marcar como destaque no catálogo</label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
          <button
            type="button"
            onClick={() => navigate('/produtos')}
            style={{
              padding: '12px 22px',
              background: '#ffffff',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '700',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff'
            }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 28px',
              background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: '700',
              transition: 'all 0.2s ease',
              boxShadow: isSubmitting ? 'none' : '0 16px 30px rgba(109, 40, 217, 0.22)',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 18px 34px rgba(109, 40, 217, 0.28)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 16px 30px rgba(109, 40, 217, 0.22)'
              }
            }}
          >
            {isSubmitting ? 'Salvando...' : id ? 'Atualizar produto' : 'Salvar produto'}
          </button>
        </div>
      </form>
    </div>
  )
}
