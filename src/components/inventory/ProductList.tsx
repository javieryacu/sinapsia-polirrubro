'use client'

import { useEffect, useState } from 'react'
import { getProducts } from '@/services/productService'
import { Database } from '@/types/database.types'
import Skeleton from '@/components/ui/Skeleton'

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        className="input-premium pl-10 bg-slate-800/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-slate-700/50">
                    <thead className="bg-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-slate-700/50">
                        {isLoading ? (
                            // Skeleton Loading State
                            [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                                    <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-20 ml-auto" /></td>
                                </tr>
                            ))
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-700/30 transition-colors duration-150 group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200 group-hover:text-white">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{product.barcode || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-300">${product.sale_price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{product.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full border ${product.stock > 10
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : product.stock > 0
                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {product.stock > 10 ? 'En Stock' : product.stock > 0 ? 'Bajo' : 'Agotado'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}

                        {!isLoading && filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No se encontraron productos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
