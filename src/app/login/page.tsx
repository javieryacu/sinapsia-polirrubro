'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/services/authService'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await signIn(email, password)
            // Use window.location.href to force a full reload and ensure middleware picks up the new session cookie
            window.location.href = '/'
        } catch (err: any) {
            setError(err.message || 'Credenciales incorrectas')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Iniciar Sesión</h1>
                    <p className="text-slate-500 text-sm mt-2">Bienvenido de nuevo a Sinapsia</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-premium"
                            placeholder="usuario@sinapsia.com"
                            autoFocus
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-premium"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-2.5 mt-4"
                    >
                        {loading ? 'Verificando...' : 'Entrar ->'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-600">
                    <Link href="/signup" className="hover:text-indigo-400 transition-colors duration-200">
                        Crear una cuenta nueva
                    </Link>
                </p>
            </div>
        </div>
    )
}
