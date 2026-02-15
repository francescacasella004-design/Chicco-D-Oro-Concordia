'use client';
import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistrazionePage() {
    const { register } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('La password deve avere almeno 6 caratteri');
            return;
        }

        if (password !== confirmPassword) {
            setError('Le password non coincidono');
            return;
        }

        setLoading(true);
        try {
            await register(email, password, name);
            router.push('/squadra');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1>🎉 Registrati</h1>
                <p>Unisciti a Fantachicco e inizia a giocare!</p>
            </div>
            <section className="section">
                <div className="container" style={{ maxWidth: 450 }}>
                    <div className="card">
                        {error && <div className="alert alert-error">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Il tuo nome</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Come ti chiami?"
                                    required
                                />
                            </div>
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
                                    placeholder="Minimo 6 caratteri"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Conferma password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Ripeti la password"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Registrazione...' : '🚀 Crea account'}
                            </button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-light)' }}>
                            Hai già un account?{' '}
                            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Accedi qui</Link>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
