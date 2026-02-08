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
            // Optional: Redirect back to inventory after success
            // setTimeout(() => router.push('/inventory'), 1500)
        } catch (error) {
            setMessage({ text: 'Error al guardar el producto', type: 'error' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Registrar Nuevo Producto</h2>
                <p className="text-sm text-slate-500 mt-1">Ingresa los detalles del artículo para agregarlo al inventario.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {message && (
                    <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        <span>{message.type === 'success' ? '✅' : '❌'}</span>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Nombre del Producto</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="Ej. Coca Cola 1.5L"
                            className="input-premium"
                        />
                    </div>

                    <div>
                        <label htmlFor="barcode" className="block text-sm font-semibold text-slate-700 mb-2">Código de Barras (Opcional)</label>
                        <input
                            type="text"
                            id="barcode"
                            name="barcode"
                            placeholder="Escanear o ingresar código..."
                            className="input-premium font-mono text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="sale_price" className="block text-sm font-semibold text-slate-700 mb-2">Precio de Venta</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                <input
                                    type="number"
                                    id="sale_price"
                                    name="sale_price"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="input-premium pl-8"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-semibold text-slate-700 mb-2">Stock Inicial</label>
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

                <div className="pt-6 flex gap-4 border-t border-slate-100 mt-6">
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
                        className="btn-primary w-full"
                    >
                        {isLoading ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                </div>
            </form>
        </div>
    )
}
