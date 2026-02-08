export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: number
                    name: string
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    barcode: string | null
                    name: string
                    description: string | null
                    cost_price: number
                    sale_price: number
                    stock: number
                    min_stock: number | null
                    category_id: number | null
                    image_url: string | null
                    is_active: boolean | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    barcode?: string | null
                    name: string
                    description?: string | null
                    cost_price?: number
                    sale_price?: number
                    stock?: number
                    min_stock?: number | null
                    category_id?: number | null
                    image_url?: string | null
                    is_active?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    barcode?: string | null
                    name?: string
                    description?: string | null
                    cost_price?: number
                    sale_price?: number
                    stock?: number
                    min_stock?: number | null
                    category_id?: number | null
                    image_url?: string | null
                    is_active?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
            }
            sales: {
                Row: {
                    id: string
                    total_amount: number
                    payment_method: 'CASH' | 'DEBIT' | 'CREDIT' | 'TRANSFER' | 'OTHER'
                    status: 'COMPLETED' | 'CANCELLED' | 'PENDING' | null
                    user_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    total_amount: number
                    payment_method: 'CASH' | 'DEBIT' | 'CREDIT' | 'TRANSFER' | 'OTHER'
                    status?: 'COMPLETED' | 'CANCELLED' | 'PENDING' | null
                    user_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    total_amount?: number
                    payment_method?: 'CASH' | 'DEBIT' | 'CREDIT' | 'TRANSFER' | 'OTHER'
                    status?: 'COMPLETED' | 'CANCELLED' | 'PENDING' | null
                    user_id?: string | null
                    created_at?: string
                }
            },
            sale_items: {
                Row: {
                    id: string
                    sale_id: string
                    product_id: string
                    quantity: number
                    unit_price: number
                    subtotal: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    sale_id: string
                    product_id: string
                    quantity: number
                    unit_price: number
                    subtotal: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    sale_id?: string
                    product_id?: string
                    quantity?: number
                    unit_price?: number
                    subtotal?: number
                    created_at?: string
                }
            }
        }
    }
}
