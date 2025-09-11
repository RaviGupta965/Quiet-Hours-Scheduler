'use client'
import { useState } from 'react'
import { signIn } from '@/app/utils/Auth'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/app/lib/supabase_client'
export default function SigninPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const handleSignin = async () => {
        if (!email || !password) {
            alert('All fields are required!')
            return
        }

        setLoading(true)
        const { data, error } = await signIn(email, password) // <-- should be signUp for register
        setLoading(false)

        if (error) {
            alert(error.message)
        } else {
            const session = data.session;

            // Adding access token to supabase client
            if (session?.access_token && session?.refresh_token) {
                await supabaseClient.auth.setSession({
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                })
            }

            alert('Signin successful!')
            router.push('/')
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left section with gradient + text */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center text-white p-10">
                <div className="max-w-md">
                    <h1 className="text-4xl font-bold mb-4">Welcome Back Champ</h1>
                    <p className="text-lg opacity-90">
                        We Helps You to grind in Silence...
                    </p>
                </div>
            </div>

            {/* Right section with signup form */}
            <div className="flex flex-1 items-center justify-center bg-gray-50 p-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Login</h2>

                    <div className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button
                            onClick={handleSignin}
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>

                    <p className="text-sm text-center text-gray-500 mt-6">
                        Don't have an Account?{' '}
                        <a href="/auth/sign-up" className="text-indigo-600 hover:underline font-medium">
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
