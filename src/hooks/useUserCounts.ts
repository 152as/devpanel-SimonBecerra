import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useUserCounts() {
  return useQuery({
    queryKey: ['profiles', 'counts'],
    queryFn: async () => {
      const [totalRes, activeRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      ])

      if (totalRes.error) throw totalRes.error
      if (activeRes.error) throw activeRes.error

      return { total: totalRes.count ?? 0, active: activeRes.count ?? 0 }
    },
  })
}
