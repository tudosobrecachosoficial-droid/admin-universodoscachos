import { supabase } from './supabase'

type QueryData = Record<string, unknown>

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message

  if (error && typeof error === 'object') {
    const maybeMessage = 'message' in error ? error.message : undefined
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) return maybeMessage

    try {
      return JSON.stringify(error)
    } catch {
      return 'Erro desconhecido ao acessar o banco de dados.'
    }
  }

  if (typeof error === 'string' && error.trim()) return error

  return 'Erro desconhecido ao acessar o banco de dados.'
}

export async function listRecords<T>(table: string, orderBy?: string, ascending = true): Promise<T[]> {
  let query = supabase.from(table).select('*')
  if (orderBy) query = query.order(orderBy, { ascending })

  const { data, error } = await query
  if (error) throw new Error(toErrorMessage(error))
  return (data ?? []) as T[]
}

export async function getRecord<T>(table: string, id: string): Promise<T> {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
  if (error) throw new Error(toErrorMessage(error))
  return data as T
}

export async function saveRecord(table: string, record: QueryData, id?: string): Promise<void> {
  const result = id
    ? await supabase.from(table).update(record).eq('id', id)
    : await supabase.from(table).insert(record)
  if (result.error) throw new Error(toErrorMessage(result.error))
}

export async function deleteRecord(table: string, id: string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw new Error(toErrorMessage(error))
}
