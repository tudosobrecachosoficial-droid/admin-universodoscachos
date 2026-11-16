/* oxlint-disable react(incompatible-library) */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { getRecord, saveRecord } from '../lib/api'
import { postSchema } from '../lib/schema'
import { slugify, todayISO } from '../lib/slug'
import ImageUpload from '../components/ImageUpload'
import RichTextEditor from '../components/RichTextEditor'
import { toast } from '../lib/toast'

type PostFormValues = z.infer<typeof postSchema>

type PostSection = NonNullable<PostFormValues['sections']>[number]

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

const createSection = (): PostSection => ({
  heading: '',
  paragraphs: [''],
  list: [],
  quote: '',
})

const normalizeTags = (value: string) => value
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const sectionsToHtml = (sections: PostSection[] = []) => sections.map((section) => {
  const heading = section.heading.trim() ? `<h2>${escapeHtml(section.heading.trim())}</h2>` : ''
  const paragraphs = section.paragraphs
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
  const listItems = section.list
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('')
  const list = listItems ? `<ul>${listItems}</ul>` : ''
  const quote = section.quote.trim() ? `<blockquote><p>${escapeHtml(section.quote.trim())}</p></blockquote>` : ''

  return `${heading}${paragraphs}${list}${quote}`
}).join('')

const readingTimeForContent = (sections: PostSection[] = [], content = '') => {
  const contentText = content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ')
  const text = contentText.trim() ? contentText : sections.reduce((sum, section) => {
    const paragraphs = section.paragraphs.join(' ')
    const list = section.list.join(' ')
    const quote = section.quote || ''
    const heading = section.heading || ''
    return `${sum} ${heading} ${paragraphs} ${list} ${quote}`
  }, '')
  return Math.max(1, Math.round(countWords(text) / 200))
}

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, reset, watch, setValue, getValues, formState: { errors, isSubmitting } } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      slug: '',
      title: '',
      seoTitle: '',
      seoDescription: '',
      subtitle: '',
      category: '',
      tags: [],
      author: 'Redação Universo dos Cachos',
      date: todayISO(),
      readingTime: 1,
      featured: false,
      excerpt: '',
      content: '',
      image: '',
      sections: [createSection()],
      published: false,
    },
  })

  const titleValue = watch('title')
  const descriptionValue = watch('seoDescription') ?? ''
  const contentValue = watch('content') ?? ''
  const sectionsValue = watch('sections') ?? []
  const authorValue = watch('author') ?? 'Redação Universo dos Cachos'

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

    getRecord<Record<string, unknown>>('posts', id)
      .then((post) => {
        const nextSections = Array.isArray(post.sections) && post.sections.length
          ? post.sections.map((section: Record<string, unknown>) => ({
              heading: String(section?.heading ?? ''),
              paragraphs: Array.isArray(section?.paragraphs) ? section.paragraphs.map((item) => String(item ?? '')) : [''],
              list: Array.isArray(section?.list) ? section.list.map((item) => String(item ?? '')) : [],
              quote: String(section?.quote ?? ''),
            }))
          : [createSection()]
        const nextContent = String(post.content || sectionsToHtml(nextSections))

        reset({
          slug: String(post.slug ?? ''),
          title: String(post.title ?? ''),
          seoTitle: String(post.seoTitle ?? ''),
          seoDescription: String(post.seoDescription ?? ''),
          subtitle: String(post.subtitle ?? ''),
          category: String(post.category ?? ''),
          tags: Array.isArray(post.tags) ? post.tags.map((tag) => String(tag)) : [],
          author: String(post.author ?? authorValue),
          date: String(post.date ?? todayISO()),
          readingTime: Number(post.readingTime) || readingTimeForContent(nextSections, nextContent),
          featured: Boolean(post.featured),
          excerpt: String(post.excerpt ?? ''),
          content: nextContent,
          image: String(post.image ?? ''),
          sections: nextSections,
          published: Boolean(post.published),
        })
      })
      .catch((error: unknown) => toast.error(`Erro ao carregar post: ${error instanceof Error ? error.message : error}`))
  }, [authorValue, id, reset])

  const seoDescriptionCount = descriptionValue.length

  const updateSection = (index: number, patch: Partial<PostSection>) => {
    const nextSections = [...(sectionsValue || [])]
    nextSections[index] = { ...nextSections[index], ...patch }
    setValue('sections', nextSections, { shouldDirty: true })
  }

  const addSection = () => {
    setValue('sections', [...(sectionsValue || []), createSection()], { shouldDirty: true })
  }

  const removeSection = (index: number) => {
    if (sectionsValue.length === 1) {
      setValue('sections', [createSection()], { shouldDirty: true })
      return
    }

    setValue('sections', sectionsValue.filter((_, currentIndex) => currentIndex !== index), { shouldDirty: true })
  }

  const moveSection = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= sectionsValue.length) return

    const nextSections = [...sectionsValue]
    const [section] = nextSections.splice(index, 1)
    nextSections.splice(nextIndex, 0, section)
    setValue('sections', nextSections, { shouldDirty: true })
  }

  const handleAutoReadingTime = () => {
    setValue('readingTime', readingTimeForContent(sectionsValue, contentValue), { shouldDirty: true })
  }

  const onSubmit = async (formData: PostFormValues) => {
    try {
      const normalizedSections = (formData.sections ?? []).map((section) => ({
        heading: String(section.heading ?? '').trim(),
        paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs.map((paragraph) => String(paragraph ?? '').trim()).filter(Boolean) : [],
        list: Array.isArray(section.list) ? section.list.map((item) => String(item ?? '').trim()).filter(Boolean) : [],
        quote: String(section.quote ?? '').trim(),
      }))
      const normalizedContent = formData.content.trim()

      const normalizedData = {
        ...formData,
        slug: slugify(formData.slug),
        category: formData.category.trim(),
        tags: normalizeTags((formData.tags ?? []).join(', ')),
        author: formData.author.trim() || 'Redação Universo dos Cachos',
        date: formData.date || todayISO(),
        readingTime: Number(formData.readingTime) || readingTimeForContent(normalizedSections, normalizedContent),
        excerpt: formData.excerpt.trim(),
        content: normalizedContent,
        seoTitle: formData.seoTitle.trim(),
        seoDescription: formData.seoDescription.trim(),
        subtitle: formData.subtitle.trim(),
        sections: normalizedSections,
        published: Boolean(formData.published),
      }

      await saveRecord('posts', normalizedData, id)
      toast.success(id ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!')
      navigate('/blog')
    } catch (error) {
      toast.error(`Erro ao salvar: ${error instanceof Error ? error.message : error}`)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', padding: '24px 28px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(255,255,255,0.95) 48%, rgba(216,180,254,0.18))', border: '1px solid rgba(124,58,237,0.12)', boxShadow: '0 22px 45px rgba(91, 33, 182, 0.08)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '999px', background: 'rgba(124,58,237,0.08)', color: '#6d28d9', fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{id ? 'Edição' : 'Cadastro'}</div>
        <h1 style={{ fontSize: '34px', fontWeight: '800', color: '#111827', margin: '14px 0 8px', letterSpacing: '-0.04em' }}>{id ? 'Editar artigo' : 'Novo artigo'}</h1>
        <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>{id ? 'Atualize todo o conteúdo e os dados de SEO do artigo.' : 'Crie um artigo completo, com texto, SEO e seções do conteúdo.'}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '22px', background: '#fff', borderRadius: '24px', padding: '28px', border: '1px solid rgba(148,163,184,0.2)', boxShadow: '0 18px 45px rgba(15,23,42,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Título</label>
            <input type="text" {...register('title')} placeholder="Título do artigo" style={fieldStyle} />
            {errors.title && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.title.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Slug</label>
            <input type="text" {...register('slug')} placeholder="titulo-do-artigo" style={fieldStyle} />
            {errors.slug && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.slug.message}</p>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Subtítulo</label>
            <input type="text" {...register('subtitle')} placeholder="Linha de apoio do artigo" style={fieldStyle} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Autor</label>
            <input type="text" {...register('author')} placeholder="Redação Universo dos Cachos" style={fieldStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Categoria</label>
            <input type="text" {...register('category')} placeholder="Beleza e rotina" style={fieldStyle} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Data</label>
            <input type="date" {...register('date')} style={fieldStyle} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Leitura (min)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" min={1} {...register('readingTime', { valueAsNumber: true })} style={{ ...fieldStyle, flex: 1 }} />
              <button type="button" onClick={handleAutoReadingTime} style={{ border: '1px solid #ddd6fe', background: '#f5f3ff', color: '#6d28d9', borderRadius: '12px', padding: '0 14px', cursor: 'pointer', fontWeight: 700 }}>Calcular</button>
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Tags</label>
          <input type="text" value={(watch('tags') ?? []).join(', ')} onChange={(event) => setValue('tags', normalizeTags(event.target.value), { shouldDirty: true })} placeholder="cachos, cabelo, rotina" style={fieldStyle} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Resumo do artigo</label>
          <textarea {...register('excerpt')} placeholder="Resumo rápido para listagem e prévias" style={{ ...fieldStyle, minHeight: '110px' }} />
          {errors.excerpt && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.excerpt.message}</p>}
        </div>

        <div>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontWeight: '700', color: '#374151', fontSize: '15px' }}>Texto completo do artigo</label>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px' }}>Escreva e formate o conteúdo que será exibido na página do artigo.</p>
          </div>
          <RichTextEditor content={contentValue} onChange={(content) => setValue('content', content, { shouldDirty: true, shouldValidate: true })} />
          {errors.content && <p role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>{errors.content.message}</p>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>SEO: título</label>
          <input type="text" {...register('seoTitle')} placeholder="Título para o buscador" style={fieldStyle} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>SEO: descrição</label>
          <textarea {...register('seoDescription')} placeholder="Descrição para a página do artigo" style={{ ...fieldStyle, minHeight: '90px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
            <span>Ideal: até 155 caracteres</span>
            <strong>{seoDescriptionCount}/155</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '16px 18px', background: 'linear-gradient(180deg, rgba(245,243,255,0.8), rgba(255,255,255,0.9))', borderRadius: '16px', border: '1px solid rgba(124,58,237,0.12)' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Publicação</div>
            <div style={{ fontWeight: '700', color: '#111827' }}>{watch('published') ? 'Publicado' : 'Rascunho'}</div>
          </div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '700', color: '#374151' }}>
            <input type="checkbox" checked={watch('published') ?? false} onChange={(event) => setValue('published', event.target.checked, { shouldDirty: true })} />
            Publicar agora
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 18px', background: 'linear-gradient(180deg, rgba(245,243,255,0.8), rgba(255,255,255,0.9))', borderRadius: '16px', border: '1px solid rgba(124,58,237,0.12)' }}>
          <input type="checkbox" id="featured" checked={watch('featured') ?? false} onChange={(event) => setValue('featured', event.target.checked, { shouldDirty: true })} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#7c3aed' }} />
          <label htmlFor="featured" style={{ cursor: 'pointer', fontWeight: '600', color: '#374151' }}>Marcar como destaque</label>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#111827' }}>Conteúdo do artigo</h2>
            <button type="button" onClick={addSection} style={{ border: '1px solid #c4b5fd', background: '#f5f3ff', color: '#6d28d9', borderRadius: '10px', padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}>+ Adicionar seção</button>
          </div>

          <div style={{ display: 'grid', gap: '18px' }}>
            {sectionsValue.map((section, index) => (
              <div key={`section-${index}`} style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '18px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '14px', color: '#374151' }}>Seção {index + 1}</strong>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => moveSection(index, -1)} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer' }}>↑</button>
                    <button type="button" onClick={() => moveSection(index, 1)} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer' }}>↓</button>
                    {sectionsValue.length > 1 && (
                      <button type="button" onClick={() => removeSection(index)} style={{ border: '1px solid #fecaca', background: '#fff1f2', color: '#be123c', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer' }}>Remover</button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '14px' }}>
                  <input
                    type="text"
                    value={section.heading ?? ''}
                    onChange={(event) => updateSection(index, { heading: event.target.value })}
                    placeholder="Título da seção"
                    style={fieldStyle}
                  />

                  {(section.paragraphs ?? []).map((paragraph, paragraphIndex) => (
                    <textarea
                      key={`paragraph-${index}-${paragraphIndex}`}
                      value={paragraph}
                      onChange={(event) => {
                        const nextParagraphs = [...(section.paragraphs ?? [])]
                        nextParagraphs[paragraphIndex] = event.target.value
                        updateSection(index, { paragraphs: nextParagraphs })
                      }}
                      placeholder="Parágrafo da seção"
                      style={{ ...fieldStyle, minHeight: '90px' }}
                    />
                  ))}

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => updateSection(index, { paragraphs: [...(section.paragraphs ?? []), ''] })}
                      style={{ border: '1px solid #d1d5db', background: '#fff', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      + Parágrafo
                    </button>
                  </div>

                  <textarea
                    value={section.quote ?? ''}
                    onChange={(event) => updateSection(index, { quote: event.target.value })}
                    placeholder="Citação (opcional)"
                    style={{ ...fieldStyle, minHeight: '70px' }}
                  />

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Lista (um item por linha)</label>
                    <textarea
                      value={(section.list ?? []).join('\n')}
                      onChange={(event) => updateSection(index, { list: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })}
                      placeholder="- item 1\n- item 2"
                      style={{ ...fieldStyle, minHeight: '90px' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ImageUpload value={watch('image') ?? ''} alt={watch('title') || 'Imagem do artigo'} onChange={(url) => setValue('image', url, { shouldDirty: true })} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
          <button type="button" onClick={() => navigate('/blog')} style={{ padding: '12px 22px', background: '#ffffff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', transition: 'all 0.2s ease' }}>Cancelar</button>
          <button type="submit" disabled={isSubmitting} style={{ padding: '12px 28px', background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: '700', transition: 'all 0.2s ease', boxShadow: isSubmitting ? 'none' : '0 16px 30px rgba(109, 40, 217, 0.22)' }}>{isSubmitting ? 'Salvando...' : id ? 'Atualizar artigo' : 'Salvar artigo'}</button>
        </div>
      </form>
    </div>
  )
}
