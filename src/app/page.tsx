import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-indigo-600 skew-y-3 transform -translate-y-20 z-0"></div>

      <main className="max-w-5xl w-full text-center space-y-10 relative z-10">
        <div className="text-white mb-16">
          <h1 className="text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            Sinapsia Polirrubro
          </h1>
          <p className="text-2xl text-indigo-100 font-light">
            Sistema Integral de Gestión
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {/* POS Card */}
          <Link
            href="/pos"
            className="group block p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-slate-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="text-left relative z-10">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <span className="text-4xl group-hover:text-white transition-colors">🛒</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-800 group-hover:text-green-600 transition-colors mb-4">
                Punto de Venta
              </h2>
              <p className="text-slate-500 text-lg">
                Realizar ventas rápidas, control de caja y facturación.
              </p>
            </div>
          </Link>

          {/* Inventory Card */}
          <Link
            href="/inventory"
            className="group block p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-slate-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="text-left relative z-10">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <span className="text-4xl group-hover:text-white transition-colors">📦</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-4">
                Inventario
              </h2>
              <p className="text-slate-500 text-lg">
                Gestión de productos, control de stock y precios.
              </p>
            </div>
          </Link>
        </div>
      </main>

      <footer className="mt-20 text-slate-400 text-sm font-medium">
        v0.1.0 • Powered by Antigravity
      </footer>
    </div>
  )
}
