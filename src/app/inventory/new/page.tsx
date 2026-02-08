import ProductForm from '@/components/inventory/ProductForm'
import Link from 'next/link'

export default function NewProductPage() {
    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4">
            <div className="max-w-2xl mx-auto mb-8">
                <Link href="/inventory" className="text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium flex items-center gap-1 mb-6">
                    ← Volver al Inventario
                </Link>

                <h1 className="text-2xl font-bold text-white tracking-tight">Nuevo Producto</h1>
            </div>

            <ProductForm />
        </div>
    )
}
