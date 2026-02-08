import ProductForm from '@/components/inventory/ProductForm'

export default function NewProductPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Gestión de Inventario</h1>
            <ProductForm />
        </div>
    )
}
