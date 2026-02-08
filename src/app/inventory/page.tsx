import ProductList from '@/components/inventory/ProductList'
import Link from 'next/link'

export default function InventoryPage() {
    return (
        <div className="min-h-screen bg-slate-950">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Inventario</h1>
                        <p className="text-slate-500 mt-1 text-sm">Gestiona tu catálogo de productos y existencias.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/"
                            className="btn-secondary"
                        >
                            Esc
                        </Link>
                        <Link
                            href="/inventory/new"
                            className="btn-primary flex items-center gap-2"
                        >
                            <span className="text-lg leading-none">+</span> Nuevo Producto
                        </Link>
                    </div>
                </div>

                <ProductList />
            </div>
        </div>
    )
}
