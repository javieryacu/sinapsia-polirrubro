import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import POSPage from '@/app/pos/page'
import { getProducts } from '@/services/productService'
import { createSale } from '@/services/saleService'
import { useCartStore } from '@/store/cartStore'

// Mock services
vi.mock('@/services/productService', () => ({
    getProducts: vi.fn()
}))

vi.mock('@/services/saleService', () => ({
    createSale: vi.fn()
}))

vi.mock('next/link', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

describe('POS Page Integration', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart()
        vi.clearAllMocks()
    })

    it('should complete a full sale flow', async () => {
        // Arrange
        const mockProducts = [
            { id: 'p1', name: 'Coca Cola', sale_price: 100, stock: 10, barcode: '111' }
        ]
        // @ts-ignore
        getProducts.mockResolvedValue(mockProducts)
        // @ts-ignore
        createSale.mockResolvedValue({ id: 'sale-1', total: 100 })

        render(<POSPage />)

        // 1. Add Product
        await waitFor(() => expect(getProducts).toHaveBeenCalled())
        const searchInput = screen.getByPlaceholderText(/buscar/i)
        fireEvent.change(searchInput, { target: { value: 'Coca' } })

        const addBtn = await screen.findByRole('button', { name: /agregar/i })
        fireEvent.click(addBtn)

        expect(screen.getByTestId('pos-total')).toHaveTextContent('$100')

        // 2. Click Cobrar
        const checkoutBtn = screen.getByText(/cobrar/i)
        fireEvent.click(checkoutBtn)

        // 3. Confirm in Modal (assuming simple confirmation for now or mock the modal interactions if complex)
        // Let's assume hitting Cobrar immediately triggers sale for this MVP step, 
        // OR a modal appears. Let's verify if 'Confirmar' appears.

        // If we implement a modal, we need to find it.
        // Let's assume we will implement a simple window.confirm or a custom modal.
        // Ideally custom modal.

        const confirmBtn = await screen.findByText(/finalizar venta/i)
        fireEvent.click(confirmBtn)

        // 4. Verify Service Call
        await waitFor(() => {
            expect(createSale).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ product_id: 'p1', quantity: 1, price: 100 })
                ]),
                100,
                'CASH' // default payment method
            )
        })

        // 5. Verify Cart Cleared
        expect(screen.getByTestId('pos-total')).toHaveTextContent('$0')
        expect(screen.getByText(/carrito vacío/i)).toBeInTheDocument()
    })
})
