import { z } from 'zod'

export const curlOptions = ['2A', '2B', '2C', '3A', '3B', '3C', '4A', '4B', '4C'] as const
export type CurlType = (typeof curlOptions)[number]

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do produto.'),
  slug: z.string().trim().min(1, 'Informe o slug do produto.'),
  brand: z.string().trim().default(''),
  categorySlug: z.string().trim().default(''),
  categoryLabel: z.string().trim().default(''),
  curls: z.array(z.string()).default([]),
  need: z.string().trim().default(''),
  price: z.string().trim().default(''),
  promoPrice: z.string().trim().default(''),
  store: z.string().trim().default(''),
  affiliateUrl: z.string().trim().default(''),
  featured: z.boolean().default(false),
  updatedAt: z.string().trim().default(''),
  summary: z.string().trim().default(''),
  image: z.string().trim().default(''),
  gallery: z.array(z.string().url('URL da galeria inválida')).default([]),
  sections: z.array(z.object({
    heading: z.string().trim().default(''),
    paragraphs: z.array(z.string().trim()).default([]),
  })).default([]),
})

export const postSchema = z.object({
  slug: z.string().trim().min(1, 'Informe o slug do post.'),
  title: z.string().trim().min(1, 'Informe o título do post.'),
  seoTitle: z.string().trim().default(''),
  seoDescription: z.string().trim().default(''),
  subtitle: z.string().trim().default(''),
  category: z.string().trim().default(''),
  categorySlug: z.string().trim().default(''),
  tags: z.array(z.string().trim()).default([]),
  author: z.string().trim().default('Redação Universo dos Cachos'),
  date: z.string().trim().default(''),
  readingTime: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  excerpt: z.string().trim().default(''),
  content: z.string().trim().refine(
    (content) => content.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;|&#xA0;/gi, ' ').trim().length > 0,
    'Informe o conteúdo do artigo.',
  ),
  image: z.string().trim().default(''),
  sections: z.array(z.object({
    heading: z.string().trim().default(''),
    paragraphs: z.array(z.string().trim()).default([]),
    list: z.array(z.string().trim()).default([]),
    quote: z.string().trim().default(''),
  })).default([]),
  productSlugs: z.array(z.string().trim()).default([]),
  published: z.boolean().default(false),
})

export const glossarySchema = z.object({
  slug: z.string().trim().min(1, 'Informe o slug do termo.'),
  term: z.string().trim().min(1, 'Informe o termo.'),
  letter: z.string().trim().regex(/^[A-Z]$/, 'Use uma letra maiúscula.'),
  short: z.string().trim().max(160, 'O texto curto deve ter no máximo 160 caracteres.').default(''),
  long: z.string().trim().default(''),
  definition: z.string().trim().default(''),
  category: z.string().trim().default(''),
  codes: z.array(z.string().trim()).default([]),
  postSlugs: z.array(z.string().trim()).default([]),
})

export const quizOptionSchema = z.object({
  id: z.string().trim().min(1, 'ID da opção obrigatório.'),
  label: z.string().trim().min(1, 'Informe o texto da opção.'),
  scores: z.record(z.string(), z.number().finite()).default({}),
})

export const quizQuestionSchema = z.object({
  slug: z.string().trim().min(1, 'Informe o slug da pergunta.'),
  question: z.string().trim().min(1, 'Informe a pergunta.'),
  helper: z.string().trim().default(''),
  weight: z.number().int().nonnegative().default(1),
  options: z.array(quizOptionSchema).min(2, 'Informe pelo menos duas opções.'),
  correct: z.any().optional(),
  explanation: z.string().trim().default(''),
})

export const routineSchema = z.object({
  slug: z.string().trim().min(1, 'Informe o slug da rotina.'),
  day: z.string().trim().default(''),
  title: z.string().trim().min(1, 'Informe o título da rotina.'),
  text: z.string().trim().default(''),
  description: z.string().trim().default(''),
  curlType: z.string().trim().default('todos'),
  steps: z.array(z.string().trim()).default([]),
  image: z.string().trim().default(''),
})

export const careTipSchema = z.object({
  slug: z.string().trim().min(1, 'Informe o slug do cuidado.'),
  num: z.string().trim().default(''),
  title: z.string().trim().min(1, 'Informe o título do cuidado.'),
  text: z.string().trim().default(''),
  image: z.string().trim().default(''),
})

export type ProductFormValues = z.infer<typeof productSchema>
export type PostFormValues = z.infer<typeof postSchema>
export type GlossaryFormValues = z.infer<typeof glossarySchema>
export type QuizQuestionFormValues = z.infer<typeof quizQuestionSchema>
export type RoutineFormValues = z.infer<typeof routineSchema>
export type CareTipFormValues = z.infer<typeof careTipSchema>
