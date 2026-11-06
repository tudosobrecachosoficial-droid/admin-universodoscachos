import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function GlossaryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ term: '', definition: '', category: '' })

  useEffect(() => { if (id) loadTerm() }, [id])

  const loadTerm = async () => {
    const { data } = await supabase.from('glossary').select('*').eq('id', id).single()
    if (data) setFormData(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (id) await supabase.from('glossary').update(formData).eq('id', id)
      else await supabase.from('glossary').insert(formData)
      navigate('/glossario')
    } catch (error) { alert('Erro: ' + error) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>{id ? 'Editar' : 'Novo'} Termo</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Termo</label>
          <input type="text" value={formData.term} onChange={(e) => setFormData({ ...formData, term: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Definição</label>
          <textarea value={formData.definition} onChange={(e) => setFormData({ ...formData, definition: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', minHeight: '120px' }} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Categoria</label>
          <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 24px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>{loading ? 'Salvando...' : 'Salvar'}</button>
          <button type="button" onClick={() => navigate('/glossario')} style={{ padding: '8px 24px', background: '#d1d5db', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
