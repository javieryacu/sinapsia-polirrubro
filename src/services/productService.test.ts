import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createProduct, getProducts } from './productService'
import { supabase } from '@/lib/supabase'

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: vi.fn()
                }))
            }))
        }))
    }
}))

describe('ProductService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create a product successfully', async () => {
        // Arrange
        const newProduct = {
            name: 'Coca Cola 2L',
            sale_price: 2500,
            stock: 10,
            category_id: 1 // Assuming category 1 exists
        }

        const mockResponse = {
            data: { id: 'uuid-123', ...newProduct, is_active: true },
            error: null
        }

        // Setup Mock chain
        const singleMock = vi.fn().mockResolvedValue(mockResponse)
        const selectMock = vi.fn().mockReturnValue({ single: singleMock })
        const insertMock = vi.fn().mockReturnValue({ select: selectMock })
        const fromMock = vi.fn().mockReturnValue({ insert: insertMock })

        // @ts-ignore
        supabase.from.mockImplementation(fromMock)

        // Act
        const result = await createProduct(newProduct)

        // Assert
        expect(result).toEqual(mockResponse.data)
        expect(supabase.from).toHaveBeenCalledWith('products')
        expect(insertMock).toHaveBeenCalledWith(expect.objectContaining(newProduct))
    })

    it('should throw an error if validation fails (negative price)', async () => {
        const invalidProduct = {
            name: 'Invalid',
            sale_price: -100,
            stock: 10
        }

        await expect(createProduct(invalidProduct)).rejects.toThrow('Price cannot be negative')
    })
})

describe('ProductService - getProducts', () => {
    it('should return a list of products', async () => {
        const mockProducts = [
            { id: '1', name: 'Prod A', sale_price: 100, stock: 5 },
            { id: '2', name: 'Prod B', sale_price: 200, stock: 10 }
        ]

        const selectMock = vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockProducts, error: null })
        })

        // @ts-ignore
        supabase.from.mockReturnValue({ select: selectMock })

        const result = await getProducts()
        expect(result).toEqual(mockProducts)
        expect(supabase.from).toHaveBeenCalledWith('products')
    })
})
