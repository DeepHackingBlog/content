export const CATEGORIES = {
  certifications: {
    id: 'certifications',
    color: 'bg-pink-700',
    nameKey: 'categories.certifications',
  },
  linux: {
    id: 'linux',
    color: 'bg-rose-700',
    nameKey: 'categories.linux',
  },
  windows: {
    id: 'windows',
    color: 'bg-sky-600',
    nameKey: 'categories.windows',
  },
  'active-directory': {
    id: 'active-directory',
    color: 'bg-violet-700',
    nameKey: 'categories.activeDirectory',
  },
  web: {
    id: 'web',
    color: 'bg-cyan-700',
    nameKey: 'categories.web',
  },
  'mobile-pentesting': {
    id: 'mobile-pentesting',
    color: 'bg-emerald-700',
    nameKey: 'categories.mobilePentesting',
  },
  tools: {
    id: 'tools',
    color: 'bg-slate-700',
    nameKey: 'categories.tools',
  },
  osint: {
    id: 'osint',
    color: 'bg-teal-700',
    nameKey: 'categories.osint',
  },
  'low-level': {
    id: 'low-level',
    color: 'bg-red-700',
    nameKey: 'categories.lowLevel',
  },
  'portswigger-labs': {
    id: 'portswigger-labs',
    color: 'bg-orange-700',
    nameKey: 'categories.portswiggerLabs',
  },
  miscellaneous: {
    id: 'miscellaneous',
    color: 'bg-gray-700',
    nameKey: 'categories.miscellaneous',
  },
} as const

export type CategoryId = keyof typeof CATEGORIES

export type CategoryInfo = (typeof CATEGORIES)[CategoryId]

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[]

export const CATEGORY_COLORS = Object.values(CATEGORIES).map((cat) => cat.color)

export function getCategoryInfo(categoryId: string): CategoryInfo | null {
  return CATEGORIES[categoryId as CategoryId] || null
}

export function getCategoryColor(categoryId: string): string {
  const category = getCategoryInfo(categoryId)
  return category?.color || 'bg-gray-500'
}

export function getCategoryNameKey(categoryId: string): string {
  const category = getCategoryInfo(categoryId)
  return category?.nameKey || 'categories.unknown'
}

export function isValidCategory(categoryId: string): boolean {
  return categoryId in CATEGORIES
}

export function getAllCategories(): CategoryInfo[] {
  return Object.values(CATEGORIES)
}