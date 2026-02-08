// @ts-nocheck
import { supabase } from '@/lib/supabase'

export interface SaleItemInput {
    product_id: string
    quantity: number
    price: number
    cost_price: number
}

import { Database } from '@/types/database.types'

type PaymentMethod = Database['public']['Tables']['sales']['Insert']['payment_method']

export const createSale = async (items: SaleItemInput[], total: number, paymentMethod: PaymentMethod) => {
    // 1. Create Sale
    const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({ total_amount: total, payment_method: paymentMethod } as any)
        .select()
        .single()

    if (saleError) throw new Error(saleError.message)

    // 2. Create Sale Items
    const saleItemsData = items.map(item => ({
        sale_id: sale.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
        cost_price: item.cost_price,
        subtotal: item.quantity * item.price
    }))

    const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItemsData as any)

    if (itemsError) throw new Error(itemsError.message)

    // 3. Update Stock (Read -> Calculate -> Update)
    for (const item of items) {
        // Get current stock
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single()

        if (fetchError || !product) throw new Error('Error fetching product stock')

        // Update stock
        const newStock = product.stock - item.quantity
        const { error: updateError } = await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', item.product_id)

        if (updateError) throw new Error('Error updating stock')
    }

    return sale
}
