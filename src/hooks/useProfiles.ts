import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface Profile {
  id: string
  name: string
  email: string
  role: string
  status: string
  created_at: string
}

export function useProfiles(search: string) {
  return useQuery({
    queryKey: ['profiles', 'list', search],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id, name, email, role, status, created_at')
        .order('created_at', { ascending: false })
        .limit(100)

      if (search.trim()) {
        const term = search.trim().replace(/[%_]/g, '')
        query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Profile[]
    },
  })
}
