import { useState } from 'react'
import { supabase, supabaseConfigError } from '../lib/supabase'
import { toast } from '../lib/toast'

interface ImageUploadProps {
  value?: string
  alt?: string
  onChange: (url: string) => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const getStorageBucketName = () => import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'images'

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result))
  reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.' ))
  reader.readAsDataURL(file)
})

const resizeImageToWebp = async (file: File) => {
  const imageSource = await readFileAsDataUrl(file)
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Arquivo de imagem inválido.'))
    img.src = imageSource
  })

  const maxWidth = 1600
  const scale = Math.min(1, maxWidth / image.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.width * scale))
  canvas.height = Math.max(1, Math.round(image.height * scale))

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Não foi possível processar a imagem.')
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((nextBlob) => {
      if (!nextBlob) {
        reject(new Error('Não foi possível converter a imagem.'))
        return
      }
      resolve(nextBlob)
    }, 'image/webp', 0.85)
  })

  return new File([blob], `${crypto.randomUUID()}.webp`, { type: 'image/webp' })
}

export default function ImageUpload({ value, alt = 'Preview da imagem', onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('A imagem deve ser JPEG, PNG, WebP ou AVIF.')
      e.target.value = ''
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('A imagem deve ter no máximo 5 MB.')
      e.target.value = ''
      return
    }

    if (supabaseConfigError) {
      toast.error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para habilitar uploads.')
      e.target.value = ''
      return
    }

    setUploading(true)
    setProgress('Preparando imagem...')

    try {
      const convertedFile = await resizeImageToWebp(file)
      const bucket = getStorageBucketName()
      const path = `${crypto.randomUUID()}.webp`
      setProgress('Enviando imagem...')

      const { error } = await supabase.storage.from(bucket).upload(path, convertedFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/webp',
      })

      if (error) {
        throw error
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      onChange(data.publicUrl)
      setProgress('Imagem enviada com sucesso.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tente novamente.'
      toast.error(`Erro ao fazer upload: ${message}`)
      setProgress('')
    } finally {
      e.target.value = ''
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div style={{ display: 'grid', gap: '16px', padding: '18px', borderRadius: '18px', background: 'linear-gradient(180deg, rgba(245,243,255,0.8), rgba(255,255,255,0.9))', border: '1px solid rgba(124, 58, 237, 0.12)' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>URL da imagem</label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#ffffff', color: '#111827', fontSize: '15px', outline: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box' }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#7c3aed'
            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>Ou fazer upload</label>
        <input
          type="file"
          accept=".jpeg,.jpg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px dashed #c4b5fd', background: '#f8f5ff', color: '#4b5563', fontSize: '15px', boxSizing: 'border-box' }}
        />
        {uploading && <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '13px' }}>{progress || 'Enviando imagem...'}</p>}
      </div>

      {value && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '14px', padding: '12px' }}>
          <img src={value} alt={alt} style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e5e7eb' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Preview</div>
            <div style={{ fontWeight: '600', color: '#111827', marginTop: '4px' }}>Imagem atual</div>
          </div>
          <button type="button" onClick={handleRemove} style={{ border: '1px solid #fecaca', background: '#fff1f2', color: '#be123c', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', fontWeight: 700 }}>
            Remover imagem
          </button>
        </div>
      )}
    </div>
  )
}
