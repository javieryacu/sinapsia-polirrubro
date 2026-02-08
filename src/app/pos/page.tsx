'use client'

import { useEffect, useState, useRef } from 'react'
import { getProducts } from '@/services/productService'
import { useCartStore } from '@/store/cartStore'
import { Database } from '@/types/database.types'
import { createSale } from '@/services/saleService'

type Product = Database['public']['Tables']['products']['Row']

export default function POSPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [showCheckoutModal, setShowCheckoutModal] = useState(false)
    const [processing, setProcessing] = useState(false)

    // Focus ref for search input
    const searchInputRef = useRef<HTMLInputElement>(null)

    const cart = useCartStore()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts()
                setProducts(data || [])
                setFilteredProducts(data || [])
            } catch (error) {
                console.error('Failed to load products', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [])

    useEffect(() => {
        if (!searchTerm) {
            setFilteredProducts(products)
            return
        }
        const lower = searchTerm.toLowerCase()
        const results = products.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            p.barcode?.toLowerCase().includes(lower)
        )
        setFilteredProducts(results)
    }, [searchTerm, products])

    const handleAddToCart = (product: Product) => {
        cart.addItem(product)
        setSearchTerm('')
        // Optionally keep focus or let user browse
        searchInputRef.current?.focus()
    }

    const handleConfirmSale = async () => {
        setProcessing(true)
        try {
            const saleItems = cart.items.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.sale_price
            }))

            await createSale(saleItems, cart.total, 'CASH')

            cart.clearCart()
            setShowCheckoutModal(false)
            // Ideally use a toast here
            alert('¡Venta Exitosa!')
        } catch (error) {
            console.error(error)
            alert('Error al procesar la venta.')
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
            {/* LEFT: Product Grid & Search (70%) */}
            <div className="w-[70%] flex flex-col p-6 border-r border-slate-200">

                {/* Header & Search */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                        Punto de Venta
                    </h1>
                    <div className="w-1/2 relative">
                        <input
                            ref={searchInputRef}
                            autoFocus
                            type="text"
                            placeholder="Buscar productos (Nombre, Código)..."
                            className="input-premium pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-5 h-5 absolute left-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto pr-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <span className="text-slate-400">Cargando catálogo...</span>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            <p>No se encontraron productos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => handleAddToCart(product)}
                                    className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col overflow-hidden active:scale-95"
                                >
                                    {/* Placeholder Image Area */}
                                    <div className="h-32 bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50/30 transition-colors">
                                        {/* If we had images, <img /> goes here */}
                                        <span className="text-4xl">📦</span>
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mb-3">
                                            Cod: {product.barcode || 'N/A'}
                                        </p>
                                        <div className="mt-auto flex justify-between items-center">
                                            <span className="text-lg font-bold text-indigo-600">
                                                ${product.sale_price}
                                            </span>
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                Stock: {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Cart Panel (30%) */}
            <div className="w-[30%] bg-white flex flex-col shadow-xl z-10">
                <div className="p-6 bg-slate-50 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span>🛒</span> Carrito Actual
                    </h2>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.items.length === 0 ? (
                        <div className="text-center text-slate-400 mt-10">
                            <p className="mb-2">El carrito está vacío</p>
                            <p className="text-sm">Selecciona productos del panel izquierdo.</p>
                        </div>
                    ) : (
                        cart.items.map(item => (
                            <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <div className="flex-1">
                                    <h4 className="font-medium text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                                    <div className="text-xs text-slate-500 mt-1">
                                        ${item.sale_price} x {item.quantity}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-slate-900">
                                        ${item.subtotal}
                                    </span>
                                    <button
                                        onClick={() => cart.removeItem(item.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Totals */}
                <div className="p-6 bg-slate-50 border-t border-slate-200">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-slate-500 text-sm font-medium">Total a Pagar</span>
                        <span className="text-3xl font-extrabold text-indigo-700">
                            ${cart.total}
                        </span>
                    </div>

                    <button
                        onClick={() => setShowCheckoutModal(true)}
                        disabled={cart.items.length === 0}
                        className="w-full btn-primary py-4 text-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        PROCESAR COMPRA
                    </button>
                </div>
            </div>

            {/* CHECKOUT MODAL */}
            {showCheckoutModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all scale-100">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">Confirmar Pago</h3>
                            <p className="text-slate-500">Resumen de la transacción</p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-6 mb-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-600">Total</span>
                                <span className="font-bold text-lg text-slate-800">${cart.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Método</span>
                                <span className="font-medium text-slate-800">Efectivo</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowCheckoutModal(false)}
                                className="btn-secondary py-3"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmSale}
                                disabled={processing}
                                className="btn-primary py-3 bg-green-600 hover:bg-green-700 shadow-green-200"
                            >
                                {processing ? 'Procesando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
