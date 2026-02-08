import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProductForm from './ProductForm'
import { createProduct } from '@/services/productService'

// Mock the service
vi.mock('@/services/productService', () => ({
    createProduct: vi.fn()
}))

describe('ProductForm', () => {
    it('should render all fields', () => {
        render(<ProductForm />)

        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/precio venta/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/stock/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
    })

    it('should call createProduct when form is submitted with valid data', async () => {
        render(<ProductForm />)

        fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Test Product' } })
        fireEvent.change(screen.getByLabelText(/precio venta/i), { target: { value: '100' } })
        fireEvent.change(screen.getByLabelText(/stock/i), { target: { value: '10' } })

        fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

        await waitFor(() => {
            expect(createProduct).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Test Product',
                sale_price: 100,
                stock: 10
            }))
        })
    })
})
