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
            <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
                <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm border border-slate-100 text-center">
                    <div className="mb-6 text-green-500">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Registro Exitoso!</h2>
                    <p className="text-slate-600 mb-8 text-sm">
                        Hemos creado tu cuenta. Verifícala si es necesario o inicia sesión.
                    </p>
                    <Link href="/login" className="btn-primary w-full py-3 justify-center">
                        Ir a Iniciar Sesión
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm border border-slate-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Crear Cuenta</h1>
                    <p className="text-slate-500 text-sm mt-2">Únete a Sinapsia Poli</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-premium"
                            placeholder="nombre@ejemplo.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-premium"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 text-lg"
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-600">
                    ¿Ya tienes cuenta? <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    )
}
