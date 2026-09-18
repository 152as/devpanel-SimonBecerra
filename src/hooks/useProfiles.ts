import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface Profile {
  id: string
  name: string
  email: string
  role: string
  status: string
  created_at: string
}

interface UseProfilesParams {
  search: string
  page: number
  pageSize: number
}

export function useProfiles({ search, page, pageSize }: UseProfilesParams) {
  return useQuery({
    queryKey: ['profiles', 'list', search, page, pageSize],
    queryFn: async () => {
      const from = page * pageSize
      const to = from + pageSize - 1

      let query = supabase
        .from('profiles')
        .select('id, name, email, role, status, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (search.trim()) {
        const term = search.trim().replace(/[%_]/g, '')
        query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%`)
      }

      const { data, error, count } = await query
      if (error) throw error
      return { rows: data as Profile[], count: count ?? 0 }
    },
    placeholderData: keepPreviousData,
  })
}
