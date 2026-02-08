import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react' // act is still useful for state updates
import { useCartStore } from './cartStore'

describe('CartStore', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart()
    })

    it('should start empty', () => {
        const state = useCartStore.getState()
        expect(state.items).toEqual([])
        expect(state.total).toBe(0)
    })

    it('should add item', () => {
        const product = { id: '1', name: 'Test', sale_price: 100, stock: 10 }

        useCartStore.getState().addItem(product)

        const state = useCartStore.getState()
        expect(state.items).toHaveLength(1)
        expect(state.items[0]).toEqual({ ...product, quantity: 1, subtotal: 100 })
        expect(state.total).toBe(100)
    })

    it('should increment quantity if item exists', () => {
        const product = { id: '1', name: 'Test', sale_price: 100, stock: 10 }

        useCartStore.getState().addItem(product)
        useCartStore.getState().addItem(product)

        const state = useCartStore.getState()
        expect(state.items).toHaveLength(1)
        expect(state.items[0].quantity).toBe(2)
        expect(state.items[0].subtotal).toBe(200)
        expect(state.total).toBe(200)
    })

    it('should remove item', () => {
        const product = { id: '1', name: 'Test', sale_price: 100, stock: 10 }

        useCartStore.getState().addItem(product)
        useCartStore.getState().removeItem('1')

        const state = useCartStore.getState()
        expect(state.items).toHaveLength(0)
        expect(state.total).toBe(0)
    })
})
