'use client'

import { useState } from 'react'
import { createProduct } from '@/services/productService'
import { useRouter } from 'next/navigation'

export default function ProductForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const product = {
            name: formData.get('name') as string,
            sale_price: Number(formData.get('sale_price')),
            stock: Number(formData.get('stock')),
            barcode: formData.get('barcode') as string || null,
        }

        try {
            await createProduct(product)
            setMessage({ text: 'Producto guardado correctamente', type: 'success' })
            e.currentTarget.reset()
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
                <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50">
                    <h2 className="text-lg font-semibold text-white">Detalles del Producto</h2>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Información Básica</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {message && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            <span className="text-lg">{message.type === 'success' ? '✓' : '⚠'}</span>
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-1">
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

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label htmlFor="sale_price" className="text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">Precio</label>
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
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="stock" className="text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">Stock</label>
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
