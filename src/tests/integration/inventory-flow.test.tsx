import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProductForm from '@/components/inventory/ProductForm'
import ProductList from '@/components/inventory/ProductList'
import { createProduct, getProducts } from '@/services/productService'

// Mock services
vi.mock('@/services/productService', () => ({
    createProduct: vi.fn(),
    getProducts: vi.fn()
}))

describe('Inventory Integration Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should refresh product list after adding a new product (Logical Flow)', async () => {
        // 1. Initial State: Empty list
        // @ts-ignore
        getProducts.mockResolvedValue([])

        const { unmount } = render(<ProductList />)
        expect(screen.queryByText('Nuevo Producto Test')).not.toBeInTheDocument()
        unmount() // Unmount to simulate page navigation or component refresh

        // 2. User creates product
        // @ts-ignore
        createProduct.mockResolvedValue({ id: '123', name: 'Nuevo Producto Test', sale_price: 100 })

        render(<ProductForm />)

        fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Nuevo Producto Test' } })
        fireEvent.change(screen.getByLabelText(/precio venta/i), { target: { value: '100' } })
        fireEvent.change(screen.getByLabelText(/stock/i), { target: { value: '10' } })

        fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

        await waitFor(() => {
            expect(createProduct).toHaveBeenCalledWith(expect.objectContaining({ name: 'Nuevo Producto Test' }))
        })

        // 3. User goes back to list (Simulate Refetch)
        // @ts-ignore
        getProducts.mockResolvedValue([{ id: '123', name: 'Nuevo Producto Test', sale_price: 100, stock: 10 }])

        render(<ProductList />)

        await waitFor(() => {
            expect(screen.getByText('Nuevo Producto Test')).toBeInTheDocument()
        })
    })
})
