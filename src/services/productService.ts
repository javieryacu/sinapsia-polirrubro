import { supabase } from '@/lib/supabase'
import { Database } from '../../types/database.types'

type ProductInsert = Database['public']['Tables']['products']['Insert']

export const createProduct = async (product: ProductInsert) => {
    // 1. Validation
    if (product.sale_price !== undefined && product.sale_price < 0) {
        throw new Error('Price cannot be negative')
    }

    // 2. Insert to DB
    const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return data
}
