import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProductList from './ProductList'
import { getProducts } from '@/services/productService'

// Mock service
vi.mock('@/services/productService', () => ({
    getProducts: vi.fn()
}))

describe('ProductList', () => {
    const mockProducts = [
        { id: '1', name: 'Coca Cola', barcode: '123', sale_price: 1500, stock: 10 },
        { id: '2', name: 'Pepsi', barcode: '456', sale_price: 1400, stock: 5 }
    ]

    it('should render products', async () => {
        // @ts-ignore
        getProducts.mockResolvedValue(mockProducts)

        render(<ProductList />)

        await waitFor(() => {
            expect(screen.getByText('Coca Cola')).toBeInTheDocument()
            expect(screen.getByText('Pepsi')).toBeInTheDocument()
        })
    })

    it('should filter products by search', async () => {
        // @ts-ignore
        getProducts.mockResolvedValue(mockProducts)

        render(<ProductList />)

        await waitFor(() => {
            expect(screen.getByText('Coca Cola')).toBeInTheDocument()
        })

        const searchInput = screen.getByPlaceholderText(/buscar/i)
        fireEvent.change(searchInput, { target: { value: 'Coca' } })

        expect(screen.getByText('Coca Cola')).toBeInTheDocument()
        expect(screen.queryByText('Pepsi')).not.toBeInTheDocument()
    })
})
