import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { toast } from '../lib/toast'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
}

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  return Boolean(url && anonKey && !url.includes('your-project') && !anonKey.includes('your-anon-key'))
}

const getStorageBucketName = () => import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'images'

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem válido.')
      e.target.value = ''
      return
    }

    if (!isSupabaseConfigured()) {
      toast.error('Configure VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY e o bucket de imagens no arquivo .env para habilitar upload.')
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      const extension = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'image'
      const path = `${crypto.randomUUID()}.${extension}`
      const bucket = getStorageBucketName()
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      })
      if (error) {
        const message = error.message.toLowerCase()
        if (message.includes('bucket') || message.includes('policy') || message.includes('not found') || message.includes('row-level')) {
          throw new Error('Bucket de imagens não encontrado ou sem permissão de upload. Crie um bucket público chamado images no Supabase Storage e permita uploads para usuários autenticados.')
        }
        throw error
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      onChange(data.publicUrl)
      e.target.value = ''
    } catch (error) {
      const message = error instanceof Error ? error.message : 'tente novamente.'
      toast.error(`Erro ao fazer upload: ${message}`)
    } finally {
      setUploading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
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
    <div style={{ display: 'grid', gap: '16px', padding: '18px', borderRadius: '18px', background: 'linear-gradient(180deg, rgba(245,243,255,0.8), rgba(255,255,255,0.9))', border: '1px solid rgba(124, 58, 237, 0.12)' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>URL da imagem</label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          style={inputStyle}
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
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px dashed #c4b5fd',
            background: '#f8f5ff',
            color: '#4b5563',
            fontSize: '15px',
            boxSizing: 'border-box',
          }}
        />
        {uploading && <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '13px' }}>Enviando imagem...</p>}
      </div>

      {value && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '14px', padding: '12px' }}>
          <img src={value} alt="Preview do produto" style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e5e7eb' }} />
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Preview</div>
            <div style={{ fontWeight: '600', color: '#111827', marginTop: '4px' }}>Imagem atual</div>
          </div>
        </div>
      )}
    </div>
  )
}
