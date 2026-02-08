import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

type Category = Database['public']['Tables']['categories']['Row']

export const getCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        throw new Error(error.message)
    }

    return data || []
}
