import ProductList from '@/components/inventory/ProductList'
import Link from 'next/link'

export default function InventoryPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestión de Inventario</h1>
                        <p className="text-slate-500 mt-1">Administra tu catálogo de productos y existencias.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="/"
                            className="btn-secondary"
                        >
                            ← Volver al Inicio
                        </Link>
                        <Link
                            href="/inventory/new" // Assumed route, need to verify if this page exists or needs creation
                            className="btn-primary"
                        >
                            + Nuevo Producto
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <ProductList />
                </div>
            </div>
        </div>
    )
}
