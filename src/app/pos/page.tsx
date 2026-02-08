'use client'

import { useEffect, useState } from 'react'
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

    const cart = useCartStore()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts()
                setProducts(data || [])
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
            setFilteredProducts([])
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
        setSearchTerm('') // Clear search after adding (optional UX choice)
        // Focus back on input? (TODO)
    }

    const handleCheckoutClick = () => {
        setShowCheckoutModal(true)
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
            alert('Venta realizada con éxito') // Temporary feedback
        } catch (error) {
            console.error(error)
            alert('Error al realizar la venta')
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className="flex h-screen bg-gray-100 relative">
            {/* Modal Overlay */}
            {showCheckoutModal && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                        <h2 className="text-2xl font-bold mb-4">Confirmar Venta</h2>
                        <div className="mb-6">
                            <p className="text-gray-600">Total a Pagar:</p>
                            <p className="text-4xl font-bold text-indigo-700">${cart.total}</p>
                            <p className="text-sm text-gray-500 mt-2">Medio de Pago: Efectivo</p>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowCheckoutModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmSale}
                                disabled={processing}
                                className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {processing ? 'Procesando...' : 'Finalizar Venta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Left: Cart & Totals (60%) */}
            <div className="w-3/5 p-4 flex flex-col">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Punto de Venta</h1>

                {/* Cart Table */}
                <div data-testid="cart-table" className="flex-1 bg-white rounded-lg shadow overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cant.</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cart.items.map(item => (
                                <tr key={item.id}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                    <td className="px-4 py-2 text-center whitespace-nowrap text-sm text-gray-500">
                                        <span className="mx-2 font-bold">{item.quantity}</span>
                                    </td>
                                    <td className="px-4 py-2 text-right whitespace-nowrap text-sm text-gray-500">${item.sale_price}</td>
                                    <td className="px-4 py-2 text-right whitespace-nowrap text-sm font-bold text-gray-900">${item.subtotal}</td>
                                    <td className="px-4 py-2 text-center whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => cart.removeItem(item.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {cart.items.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                        Carrito vacío. Escanee un producto o búsquelo manualmente.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="mt-4 bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-lg">Total a Pagar</span>
                        <span data-testid="pos-total" className="text-4xl font-bold text-indigo-700">${cart.total}</span>
                    </div>
                    <button
                        onClick={handleCheckoutClick}
                        disabled={cart.items.length === 0}
                        className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg text-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        COBRAR (F5)
                    </button>
                </div>
            </div>

            {/* Right: Search & Quick Actions (40%) */}
            <div className="w-2/5 p-4 bg-gray-50 border-l border-gray-200 flex flex-col">
                <div className="mb-4">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Buscar producto (Nombre, Código)..."
                        className="w-full p-4 border-2 border-indigo-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-auto space-y-2">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => handleAddToCart(product)}
                            className="bg-white p-3 rounded shadow hover:bg-indigo-50 cursor-pointer transition flex justify-between items-center group"
                        >
                            <div>
                                <div className="font-bold text-gray-800">{product.name}</div>
                                <div className="text-sm text-gray-500">Stock: {product.stock} | Código: {product.barcode || '-'}</div>
                            </div>
                            <div className="text-lg font-bold text-indigo-600">
                                ${product.sale_price}
                                <button className="ml-4 opacity-0 group-hover:opacity-100 bg-indigo-600 text-white px-3 py-1 rounded text-sm transition">
                                    Agregar
                                </button>
                            </div>
                        </div>
                    ))}
                    {searchTerm && filteredProducts.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">No se encontraron productos.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
