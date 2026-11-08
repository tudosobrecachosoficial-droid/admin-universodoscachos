import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ImageUpload from '../components/ImageUpload'

export default function RoutineForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ day: '', description: '', steps: [], image: '' })

  useEffect(() => { if (id) loadRoutine() }, [id])

  const loadRoutine = async () => {
    const { data } = await supabase.from('routines').select('*').eq('id', id).single()
    if (data) setFormData(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (id) await supabase.from('routines').update(formData).eq('id', id)
      else await supabase.from('routines').insert(formData)
      navigate('/rotinas')
    } catch (error) { alert('Erro: ' + error) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>{id ? 'Editar' : 'Nova'} Rotina</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Dia</label>
          <input type="text" value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Descrição</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', minHeight: '120px' }} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Passos (separados por vírgula)</label>
          <input type="text" value={formData.steps.join(', ')} onChange={(e) => setFormData({ ...formData, steps: e.target.value.split(',').map(s => s.trim()) })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
        </div>
        <ImageUpload value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 24px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>{loading ? 'Salvando...' : 'Salvar'}</button>
          <button type="button" onClick={() => navigate('/rotinas')} style={{ padding: '8px 24px', background: '#d1d5db', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
