'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [metrics, setMetrics] = useState({
    total_sales: 0,
    total_cost: 0,
    net_profit: 0,
    transaction_count: 0
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data, error } = await supabase.rpc('get_daily_measures')
      if (data) setMetrics(data as any)
    }
    fetchMetrics()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <main className="max-w-4xl w-full space-y-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
            Sinapsia <span className="text-indigo-400">Polirrubro</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            Sistema Integral de Gestión
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {/* POS Card */}
          <Link
            href="/pos"
            className="group block p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 ease-out text-left"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-200">
                🛒
              </div>
              <h2 className="text-2xl font-semibold text-white group-hover:text-indigo-400 transition-colors">
                Punto de Venta
              </h2>
            </div>
            <p className="text-slate-400 text-base leading-relaxed">
              Interfaz optimizada para ventas rápidas. Control de caja y facturación eficiente.
            </p>
          </Link>

          {/* Inventory Card */}
          <Link
            href="/inventory"
            className="group block p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 ease-out text-left"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-200">
                📦
              </div>
              <h2 className="text-2xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                Inventario
              </h2>
            </div>
            <p className="text-slate-400 text-base leading-relaxed">
              Gestión centralizada de productos. Control de stock, precios y categorías.
            </p>
          </Link>
        </div>
      </main >

      <footer className="mt-20 text-slate-600 text-xs font-mono uppercase tracking-wider">
        v0.1.0 • Antigravity System
      </footer>
    </div >
  )
}
