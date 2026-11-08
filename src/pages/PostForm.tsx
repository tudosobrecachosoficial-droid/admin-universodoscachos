/* oxlint-disable react(incompatible-library) */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { getRecord, saveRecord } from '../lib/api'
import RichTextEditor from '../components/RichTextEditor'
import ImageUpload from '../components/ImageUpload'
import { toast } from '../lib/toast'

const slugify = (value: string) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80)

const postSchema = z.object({
  title: z.string().trim().min(1, 'Informe o título do post.'),
  slug: z.string().trim().min(1, 'Informe o slug.').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use apenas letras minúsculas, números e hífens.'),
  category: z.string().trim().default(''),
  author: z.string().trim().min(1, 'Informe o autor.'),
  excerpt: z.string().trim().min(1, 'Informe o resumo do post.').max(220, 'O resumo deve ter no máximo 220 caracteres.'),
  content: z.string().trim().min(1, 'Informe o conteúdo do post.'),
  image: z.string().default(''),
  featured: z.boolean().default(false),
})

type PostFormValues = z.infer<typeof postSchema>

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  // oxlint-disable-next-line react(incompatible-library)
  const { register, handleSubmit, reset, watch, setValue, getValues, formState: { errors, isSubmitting } } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      slug: '',
      category: '',
      author: 'Redação Universo dos Cachos',
      excerpt: '',
      content: '',
      image: '',
      featured: false,
    },
  })

  const titleValue = watch('title')

  useEffect(() => {
    if (!titleValue) return

    const generatedSlug = slugify(titleValue)
    const currentSlug = getValues('slug')

    if (!currentSlug || currentSlug === generatedSlug || currentSlug === slugify(currentSlug)) {
      setValue('slug', generatedSlug, { shouldValidate: true, shouldDirty: true })
    }
  }, [titleValue, getValues, setValue])

  useEffect(() => {
    if (!id) return

    getRecord<PostFormValues>('posts', id)
      .then((post) => reset({
        title: post.title || '',
        slug: post.slug || '',
        category: post.category || '',
        author: post.author || 'Redação Universo dos Cachos',
        excerpt: post.excerpt || '',
        content: post.content || '',
        image: post.image || '',
        featured: Boolean(post.featured),
      }))
      .catch((error: unknown) => toast.error(`Erro ao carregar post: ${error instanceof Error ? error.message : error}`))
  }, [id, reset])

  const onSubmit = async (formData: PostFormValues) => {
    try {
      const normalizedData = {
        ...formData,
        slug: slugify(formData.slug),
        excerpt: formData.excerpt.trim(),
      }

      await saveRecord('posts', normalizedData, id)
      toast.success(id ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!')
      navigate('/blog')
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
      <div style={{ marginBottom: '28px', padding: '24px 28px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(255,255,255,0.95) 48%, rgba(216,180,254,0.18))', border: '1px solid rgba(124,58,237,0.12)', boxShadow: '0 22px 45px rgba(91, 33, 182, 0.08)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '999px', background: 'rgba(124,58,237,0.08)', color: '#6d28d9', fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{id ? 'Edição' : 'Cadastro'}</div>
        <h1 style={{ fontSize: '34px', fontWeight: '800', color: '#111827', margin: '14px 0 8px', letterSpacing: '-0.04em' }}>{id ? 'Editar post' : 'Novo post'}</h1>
        <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>{id ? 'Atualize as informações deste artigo.' : 'Crie um novo artigo para o blog com visual premium.'}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '22px', background: 'rgba(255,255,255,0.92)', borderRadius: '24px', padding: '28px', border: '1px solid rgba(148,163,184,0.2)', boxShadow: '0 18px 45px rgba(15,23,42,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Título</label>
            <input type="text" {...register('title')} placeholder="Título do artigo" style={fieldStyle} onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)' }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }} />
            {errors.title && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.title.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Slug</label>
            <input type="text" {...register('slug')} placeholder="titulo-do-artigo" style={fieldStyle} onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)' }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }} />
            {errors.slug && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.slug.message}</p>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Categoria</label>
            <input type="text" {...register('category')} placeholder="Categoria do artigo" style={fieldStyle} onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)' }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Autor</label>
            <input type="text" {...register('author')} placeholder="Autor do artigo" style={fieldStyle} onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)' }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }} />
            {errors.author && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.author.message}</p>}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Resumo</label>
          <textarea {...register('excerpt')} placeholder="Breve resumo do artigo" style={{ ...fieldStyle, minHeight: '100px' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)' }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }} />
          {errors.excerpt && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.excerpt.message}</p>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Conteúdo</label>
          <RichTextEditor content={watch('content') ?? ''} onChange={(content) => setValue('content', content, { shouldDirty: true })} />
          {errors.content && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.content.message}</p>}
        </div>

        <ImageUpload value={watch('image') ?? ''} onChange={(url) => setValue('image', url, { shouldDirty: true })} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 18px', background: 'linear-gradient(180deg, rgba(245,243,255,0.8), rgba(255,255,255,0.9))', borderRadius: '16px', border: '1px solid rgba(124,58,237,0.12)' }}>
          <input type="checkbox" id="featured" checked={watch('featured')} onChange={(e) => setValue('featured', e.target.checked, { shouldDirty: true })} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#7c3aed' }} />
          <label htmlFor="featured" style={{ cursor: 'pointer', fontWeight: '600', color: '#374151' }}>Marcar como destaque</label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
          <button type="button" onClick={() => navigate('/blog')} style={{ padding: '12px 22px', background: '#ffffff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', transition: 'all 0.2s ease' }}>Cancelar</button>
          <button type="submit" disabled={isSubmitting} style={{ padding: '12px 28px', background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: '700', transition: 'all 0.2s ease', boxShadow: isSubmitting ? 'none' : '0 16px 30px rgba(109, 40, 217, 0.22)' }}>{isSubmitting ? 'Salvando...' : id ? 'Atualizar post' : 'Salvar post'}</button>
        </div>
      </form>
    </div>
  )
}
