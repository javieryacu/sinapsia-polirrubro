'use client'

import { useEffect, useState } from 'react'
import { getProducts } from '@/services/productService'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState('')
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

    if (isLoading) return (
        <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Inventario</h2>
                <div className="relative w-full sm:w-96">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código..."
                        className="input-premium pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{product.barcode || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">${product.sale_price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{product.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 10
                                            ? 'bg-green-100 text-green-800'
                                            : product.stock > 0
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.stock > 10 ? 'En Stock' : product.stock > 0 ? 'Bajo Stock' : 'Agotado'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div className="text-center p-8 text-slate-500">
                        No se encontraron productos que coincidan con tu búsqueda.
                    </div>
                )}
            </div>
        </div>
    )
}
