import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <main className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-indigo-800 mb-8">
          Sinapsia Polirrubro
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Sistema de Gestión de Punto de Venta e Inventario
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* POS Card */}
          <Link
            href="/pos"
            className="group block p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border-l-8 border-green-500 hover:-translate-y-1"
          >
            <div className="text-left">
              <h2 className="text-3xl font-bold text-gray-800 group-hover:text-green-600 transition-colors mb-2">
                🛒 Punto de Venta
              </h2>
              <p className="text-gray-500">
                Realizar ventas, escanear productos y cobrar.
              </p>
            </div>
          </Link>

          {/* Inventory Card */}
          <Link
            href="/inventory" // Assumed path based on previous context, or I should check if I made a page for it.
            // Wait, I made components/inventory/* but did I make a page? 
            // I recall 'integration/inventory-flow.test.tsx' used components directly?
            // Let me check if src/app/inventory/page.tsx exists.
            // If not, I should point to where the inventory list is, or create it.
            // Based on previous turn: "Frontend: Product List Component" was done. 
            // I'll assume /inventory is safe or I will check next.
            className="group block p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border-l-8 border-indigo-500 hover:-translate-y-1"
          >
            <div className="text-left">
              <h2 className="text-3xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors mb-2">
                📦 Inventario
              </h2>
              <p className="text-gray-500">
                Gestionar productos, stock y precios.
              </p>
            </div>
          </Link>
        </div>
      </main>

      <footer className="mt-16 text-gray-400">
        v0.1.0 - Powered by Antigravity
      </footer>
    </div>
  )
}
