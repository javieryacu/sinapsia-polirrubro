'use client'

import { useState, useEffect } from 'react'
import { createProduct } from '@/services/productService'
import { getCategories } from '@/services/categoryService'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database.types'

type Category = Database['public']['Tables']['categories']['Row']

export default function ProductForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)
    const [categories, setCategories] = useState<Category[]>([])

    // Profit Calculation State
    const [salePrice, setSalePrice] = useState<number | ''>('')
    const [costPrice, setCostPrice] = useState<number | ''>('')

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories()
                setCategories(data)
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchCategories()
    }, [])

    const profitMargin = (salePrice !== '' && costPrice !== '' && Number(salePrice) > 0)
        ? ((Number(salePrice) - Number(costPrice)) / Number(salePrice)) * 100
        : 0

    const profitAmount = (salePrice !== '' && costPrice !== '')
        ? Number(salePrice) - Number(costPrice)
        : 0

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const product = {
            name: formData.get('name') as string,
            sale_price: Number(formData.get('sale_price')),
            cost_price: Number(formData.get('cost_price')),
            stock: Number(formData.get('stock')),
            min_stock: Number(formData.get('min_stock')) || null,
            barcode: formData.get('barcode') as string || null,
            category_id: Number(formData.get('category_id')) || null,
            description: formData.get('description') as string || null,
        }

        try {
            await createProduct(product)
            setMessage({ text: 'Producto guardado correctamente', type: 'success' })
            e.currentTarget.reset()
            setSalePrice('')
            setCostPrice('')
        } catch (error: any) {
            console.error(error)
            setMessage({ text: error.message || 'Error al guardar el producto', type: 'error' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Detalles del Producto</h2>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Información Básica & Costos</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Ganancia Estimada</div>
                        <div className={`text-lg font-bold ${profitAmount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            ${profitAmount.toFixed(2)} <span className="text-xs opacity-70">({profitMargin.toFixed(1)}%)</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {message && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            <span className="text-lg">{message.type === 'success' ? '✓' : '⚠'}</span>
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name - Full Width */}
                        <div className="md:col-span-2 space-y-1">
                            <label htmlFor="name" className="text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                placeholder="Ej. Coca Cola 1.5L"
                                className="input-premium"
                                autoFocus
                            />
                        </div>

                        {/* Barcode */}
                        <div className="space-y-1">
                            <label htmlFor="barcode" className="text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">Código de Barras</label>
                            <input
                                type="text"
                                id="barcode"
                                name="barcode"
                                placeholder="Escanear..."
                                className="input-premium font-mono"
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                            <label htmlFor="category_id" className="text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">Categoría</label>
                            <select
                                id="category_id"
                                name="category_id"
                                required
                                className="input-premium appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%20stroke%3D%22%2394a3b8%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_0.5rem_center]"
                            >
                                <option value="" disabled selected>Seleccionar...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Cost Price */}
                        <div className="space-y-1">
                            <label htmlFor="cost_price" className="text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">Costo</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-500">$</span>
                                <input
                                    type="number"
                                    id="cost_price"
                                    name="cost_price"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="input-premium pl-7"
                                    value={costPrice}
                                    onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* Sale Price */}
                        <div className="space-y-1">
                            <label htmlFor="sale_price" className="text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">Precio Venta</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-500">$</span>
                                <input
                                    type="number"
                                    id="sale_price"
                                    name="sale_price"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="input-premium pl-7"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="space-y-1">
                            <label htmlFor="stock" className="text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">Stock Actual</label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                required
                                min="0"
                                placeholder="0"
                                className="input-premium"
                            />
                        </div>

                        {/* Min Stock */}
                        <div className="space-y-1">
                            <label htmlFor="min_stock" className="text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">Stock Mínimo</label>
                            <input
                                type="number"
                                id="min_stock"
                                name="min_stock"
                                min="0"
                                placeholder="Ej. 5"
                                className="input-premium"
                            />
                        </div>
                    </div>

                    <div className="pt-8 flex gap-4 border-t border-slate-800 mt-8">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn-secondary w-full"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex justify-center items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Guardando...
                                </>
                            ) : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
