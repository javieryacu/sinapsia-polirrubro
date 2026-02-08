'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/services/authService'

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await signUp(email, password)
            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Error al registrarse')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Cuenta Creada</h2>
                    <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                        Te hemos enviado un correo de confirmación. Por favor verifícalo para continuar.
                    </p>
                    <Link href="/login" className="btn-primary w-full block text-center">
                        Ir a Iniciar Sesión
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Crear Cuenta</h1>
                    <p className="text-slate-500 text-sm mt-2">Únete a Sinapsia Poli</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-premium"
                            placeholder="usuario@sinapsia.com"
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
                            placeholder="Mínimo 6 caracteres"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-2.5 mt-4"
                    >
                        {loading ? 'Creando...' : 'Registrarse ->'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-600">
                    <Link href="/login" className="hover:text-indigo-400 transition-colors duration-200">
                        Ya tengo una cuenta
                    </Link>
                </p>
            </div>
        </div>
    )
}
