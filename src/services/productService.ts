// @ts-nocheck
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

type ProductInsert = Database['public']['Tables']['products']['Insert']

export const createProduct = async (product: ProductInsert) => {
    // 1. Validation
    if (product.sale_price !== undefined && product.sale_price < 0) {
        throw new Error('Price cannot be negative')
    }
    if (product.cost_price !== undefined && product.cost_price < 0) {
        throw new Error('Cost price cannot be negative')
    }

    // 2. Insert to DB
    const { data, error } = await supabase
        .from('products')
        .insert(product as any)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export const getProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')

    if (error) {
        throw new Error(error.message)
    }

    return data
}
