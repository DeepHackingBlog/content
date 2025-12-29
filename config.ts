import { defineCollection, z } from 'astro:content'
import { CATEGORY_IDS } from '@content/categories'
import { LANG_VALUES } from '@i18n/languages'

const LANG_ENUM = z.enum(LANG_VALUES)

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    publishedDate: z.date(),
    updatedDate: z.date().optional(),
    image: z.string().url().optional(),
    description: z.string().optional(),
    categories: z.array(z.enum(CATEGORY_IDS as [string, ...string[]])).min(1),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    lang: LANG_ENUM.default('es'),
  }),
})

const authors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    bio: z.string().optional(),
    avatar: z.string().url().optional(),
    website: z.string().url().optional(),
    github: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    lang: LANG_ENUM.default('es'),
  }),
})

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    lang: LANG_ENUM.optional(),
  }),
})

export const collections = {
  posts,
  authors,
  pages,
}