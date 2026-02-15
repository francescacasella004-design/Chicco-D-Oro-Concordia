'use client';
import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            if (user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/squadra');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1>🔑 Accedi</h1>
                <p>Entra nel tuo account Fantachicco</p>
            </div>
            <section className="section">
                <div className="container" style={{ maxWidth: 450 }}>
                    <div className="card">
                        {error && <div className="alert alert-error">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="la-tua@email.it"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="La tua password"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Accesso in corso...' : '🚀 Accedi'}
                            </button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-light)' }}>
                            Non hai un account?{' '}
                            <Link href="/registrazione" style={{ color: 'var(--primary)', fontWeight: 600 }}>Registrati qui</Link>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
