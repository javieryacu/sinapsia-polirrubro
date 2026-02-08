import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSale } from './saleService'
import { supabase } from '@/lib/supabase'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn(),
        rpc: vi.fn()
    }
}))

describe('SaleService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create a sale successfully and update stock', async () => {
        // Arrange
        const saleItems = [
            { product_id: 'prod-1', quantity: 2, price: 100 },
            { product_id: 'prod-2', quantity: 1, price: 200 }
        ]
        const total = 400
        const paymentMethod = 'CASH'

        const mockSaleData = { id: 'sale-1', total_amount: 400 }

        // Mock responses
        const insertSaleMock = vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockSaleData, error: null })
            })
        })

        const insertItemsMock = vi.fn().mockResolvedValue({ error: null })

        // Mock stock select
        const currentStock = 10
        const selectStockMock = vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { stock: currentStock }, error: null })
            })
        })

        // Mock stock update
        const updateStockMock = vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null })
        })

        // Setup chain
        // @ts-ignore
        supabase.from.mockImplementation((table) => {
            if (table === 'sales') return { insert: insertSaleMock }
            if (table === 'sale_items') return { insert: insertItemsMock }
            if (table === 'products') return { select: selectStockMock, update: updateStockMock }
            return {}
        })

        // Act
        const result = await createSale(saleItems, total, paymentMethod)

        // Assert
        expect(result).toEqual(mockSaleData)
        // 1. Create Sale
        expect(supabase.from).toHaveBeenCalledWith('sales')
        expect(insertSaleMock).toHaveBeenCalled()

        // 2. Create Items
        expect(supabase.from).toHaveBeenCalledWith('sale_items')
        expect(insertItemsMock).toHaveBeenCalled()

        // 3. Update Stock (Fetch then Update for each item)
        expect(supabase.from).toHaveBeenCalledWith('products')
        // We expect select and update to be called for each item
        expect(selectStockMock).toHaveBeenCalledTimes(2)
        expect(updateStockMock).toHaveBeenCalledTimes(2)
    })

    it('should throw error if sale creation fails', async () => {
        // Mock failure
        const insertSaleMock = vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } })
            })
        })

        // @ts-ignore
        supabase.from.mockImplementation(() => ({ insert: insertSaleMock }))

        await expect(createSale([], 0, 'CASH')).rejects.toThrow('DB Error')
    })
})
