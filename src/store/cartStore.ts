import { create } from 'zustand'

export interface CartItem {
    id: string
    name: string
    sale_price: number
    cost_price: number
    stock: number
    quantity: number
    subtotal: number
}

interface CartState {
    items: CartItem[]
    total: number
    addItem: (product: { id: string, name: string, sale_price: number, cost_price: number, stock: number }) => void
    removeItem: (productId: string) => void
    clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    total: 0,
    addItem: (product) => set((state) => {
        console.log('addItem called', product)
        const existingItem = state.items.find(item => item.id === product.id)
        let newItems: CartItem[]

        if (existingItem) {
            newItems = state.items.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.sale_price }
                    : item
            )
        } else {
            newItems = [...state.items, { ...product, quantity: 1, subtotal: product.sale_price }]
        }

        const newTotal = newItems.reduce((sum, item) => sum + item.subtotal, 0)
        return { items: newItems, total: newTotal }
    }),
    removeItem: (productId) => set((state) => {
        const newItems = state.items.filter(item => item.id !== productId)
        const newTotal = newItems.reduce((sum, item) => sum + item.subtotal, 0)
        return { items: newItems, total: newTotal }
    }),
    clearCart: () => set({ items: [], total: 0 })
}))
