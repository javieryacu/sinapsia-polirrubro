'use client'

import { useState, useEffect } from 'react'
import { getProducts } from '@/services/productService'
import { createSale } from '@/services/saleService'
import { Database } from '@/types/database.types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

type Product = Database['public']['Tables']['products']['Row']

export default function POSPage() {
    const router = useRouter()
    const { items, addItem, removeItem, clearCart, total } = useCartStore()
    const [products, setProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'DEBIT' | 'CREDIT' | 'TRANSFER' | 'OTHER'>('CASH')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts()
                setProducts(data || [])
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCheckout = async () => {
        if (items.length === 0) return

        try {
            await createSale(
                items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.sale_price,
                    cost_price: item.cost_price
                })),
                total,
                paymentMethod
            )
            clearCart()
            setIsCheckoutModalOpen(false)
            alert('Venta realizada con éxito') // Replace with a nice toast later
        } catch (error) {
            console.error('Error processing sale:', error)
            alert('Error al procesar la venta')
        }
    }

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-200">
            {/* Left Panel: Product Grid */}
            <div className="flex-1 flex flex-col border-r border-slate-800">
                {/* Header / Search */}
                <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex gap-4 items-center">
                    <Link href="/" className="btn-secondary px-3 py-2 text-sm">
                        Inicio
                    </Link>
                    <div className="relative flex-1">
                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input
                            type="text"
                            placeholder="Buscar productos (Código o Nombre)..."
                            className="input-premium pl-10 h-10 bg-slate-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full text-slate-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => addItem({
                                        id: product.id,
                                        name: product.name,
                                        sale_price: product.sale_price,
                                        cost_price: product.cost_price || 0,
                                        stock: product.stock || 0
                                    })}
                                    className="bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-750 rounded-xl p-4 flex flex-col justify-between h-32 transition-all duration-150 active:scale-95 text-left group shadow-lg"
                                >
                                    <div>
                                        <h3 className="font-semibold text-slate-200 text-sm leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1 font-mono">
                                            {product.barcode || '---'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-lg text-emerald-400">
                                            ${product.sale_price}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Cart */}
            <div className="w-96 bg-slate-900 flex flex-col border-l border-slate-800 shadow-2xl">
                <div className="p-5 border-b border-slate-800 bg-slate-900">
                    <h2 className="text-lg font-bold text-white tracking-tight">Orden Actual</h2>
                    <p className="text-slate-500 text-xs mt-1">Ticket #000-000</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 opacity-50">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <p className="text-sm">El carrito está vacío</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                                <div className="flex-1 min-w-0 pr-4">
                                    <h4 className="text-sm font-medium text-slate-200 truncate">{item.name}</h4>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        {item.quantity} x ${item.sale_price}
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <span className="font-bold text-slate-300 text-sm">
                                        ${item.sale_price * item.quantity}
                                    </span>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-slate-600 hover:text-red-400 transition-colors p-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Totals Section */}
                <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-4">
                    <div className="flex justify-between items-center text-slate-400 text-sm">
                        <span>Items</span>
                        <span>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xl font-bold text-white">Total</span>
                        <span className="text-3xl font-bold text-emerald-400">${total}</span>
                    </div>

                    <button
                        onClick={() => items.length > 0 && setIsCheckoutModalOpen(true)}
                        disabled={items.length === 0}
                        className="w-full btn-primary py-4 text-lg font-bold shadow-lg shadow-indigo-900/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cobrar (F5)
                    </button>
                </div>
            </div>

            {/* Checkout Modal */}
            {isCheckoutModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-pulse-subtle">
                        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                            <h3 className="text-lg font-bold text-white">Confirmar Venta</h3>
                            <button onClick={() => setIsCheckoutModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="text-center">
                                <p className="text-slate-400 text-sm mb-1">Monto Total</p>
                                <p className="text-4xl font-bold text-white">${total}</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Método de Pago</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['CASH', 'DEBIT', 'CREDIT', 'TRANSFER', 'OTHER'] as const).map(method => (
                                        <button
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            className={`py-3 px-4 rounded-lg text-sm font-medium border transition-all ${paymentMethod === method
                                                ? 'bg-indigo-600 text-white border-indigo-500 ring-2 ring-indigo-500/20'
                                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                                }`}
                                        >
                                            {method === 'CASH' ? 'Efectivo' :
                                                method === 'DEBIT' ? 'Débito' :
                                                    method === 'CREDIT' ? 'Crédito' :
                                                        method === 'TRANSFER' ? 'Transferencia' : 'Otro'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={() => setIsCheckoutModalOpen(false)}
                                className="flex-1 btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCheckout}
                                className="flex-1 btn-primary"
                            >
                                Confirmar y Cobrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
