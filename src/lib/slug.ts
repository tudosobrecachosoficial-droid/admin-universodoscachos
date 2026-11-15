export const slugify = (value: string) => value
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80)

export const todayISO = () => new Date().toISOString().slice(0, 10)

export const parseBRL = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') return 0

  const clean = String(value)
    .replace(/[^0-9,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')

  const parsed = Number.parseFloat(clean)
  return Number.isFinite(parsed) ? parsed : 0
}

export const formatBRL = (value: string | number | null | undefined) => {
  const numeric = typeof value === 'number' ? value : parseBRL(value)

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric)
}
