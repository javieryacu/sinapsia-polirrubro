import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signIn, signUp, signOut } from './authService'
import { supabase } from '@/lib/supabase'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
            signUp: vi.fn(),
            signOut: vi.fn(),
            getSession: vi.fn()
        }
    }
}))

describe('Auth Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should sign in successfully', async () => {
        const mockData = { user: { id: '1', email: 'test@test.com' }, session: {} }
        // @ts-ignore
        supabase.auth.signInWithPassword.mockResolvedValue({ data: mockData, error: null })

        const result = await signIn('test@test.com', 'password')
        expect(result).toEqual(mockData)
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'test@test.com',
            password: 'password'
        })
    })

    it('should throw error on sign in failure', async () => {
        // @ts-ignore
        supabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: { message: 'Invalid login' } })

        await expect(signIn('test@test.com', 'wrong')).rejects.toThrow('Invalid login')
    })

    it('should sign up successfully', async () => {
        const mockData = { user: { id: '2', email: 'new@test.com' }, session: null }
        // @ts-ignore
        supabase.auth.signUp.mockResolvedValue({ data: mockData, error: null })

        const result = await signUp('new@test.com', 'password')
        expect(result).toEqual(mockData)
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
            email: 'new@test.com',
            password: 'password'
        })
    })

    it('should sign out successfully', async () => {
        // @ts-ignore
        supabase.auth.signOut.mockResolvedValue({ error: null })
        await signOut()
        expect(supabase.auth.signOut).toHaveBeenCalled()
    })
})
