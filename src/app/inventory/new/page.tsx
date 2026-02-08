import ProductForm from '@/components/inventory/ProductForm'
import Link from 'next/link'

export default function NewProductPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <Link href="/inventory" className="text-indigo-600 hover:text-indigo-800 transition font-medium flex items-center gap-1">
                        ← Volver al Inventario
                    </Link>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Agregar Nuevo Producto</h1>
                    <p className="text-slate-500 mt-2">Amplía tu catálogo registrando nuevos artículos.</p>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-3xl">
                        <ProductForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
