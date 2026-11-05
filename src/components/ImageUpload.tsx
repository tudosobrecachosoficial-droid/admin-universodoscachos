import { useState } from 'react'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      // TODO: Implementar upload para Supabase Storage
      // Por enquanto, converte para URL local temporária
      const url = URL.createObjectURL(file)
      onChange(url)
    } catch (error) {
      alert('Erro ao fazer upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium mb-1">URL da Imagem</label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Ou fazer upload</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {uploading && <p className="text-sm text-gray-500">Enviando...</p>}
      </div>
      {value && (
        <div className="mt-2">
          <img src={value} alt="Preview" className="w-32 h-32 object-cover rounded" />
        </div>
      )}
    </div>
  )
}
