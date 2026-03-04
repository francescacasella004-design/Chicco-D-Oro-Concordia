'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ReimpostaPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Link non valido. Richiedi un nuovo reset della password.');
        }
    }, [token]);

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
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => router.push('/login'), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1>🔐 Nuova Password</h1>
                <p>Scegli la tua nuova password</p>
            </div>
            <section className="section">
                <div className="container" style={{ maxWidth: 450 }}>
                    <div className="card">
                        {success ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: 12 }}>
                                    Password reimpostata!
                                </h2>
                                <p style={{ color: 'var(--text-light)', marginBottom: 24, lineHeight: 1.6 }}>
                                    La tua password è stata aggiornata con successo.
                                    Verrai reindirizzato alla pagina di login...
                                </p>
                                <Link href="/login" className="btn btn-primary" style={{ width: '100%' }}>
                                    🚀 Vai al Login
                                </Link>
                            </div>
                        ) : (
                            <>
                                {error && <div className="alert alert-error">{error}</div>}
                                {token ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label className="form-label">Nuova Password</label>
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
                                            <label className="form-label">Conferma Password</label>
                                            <input
                                                type="password"
                                                className="form-input"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Ripeti la nuova password"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                            style={{ width: '100%' }}
                                            disabled={loading}
                                        >
                                            {loading ? 'Aggiornamento...' : '🔐 Reimposta Password'}
                                        </button>
                                    </form>
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <Link href="/password-dimenticata" className="btn btn-primary" style={{ width: '100%' }}>
                                            📧 Richiedi nuovo link
                                        </Link>
                                    </div>
                                )}
                                <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-light)' }}>
                                    <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                                        ← Torna al Login
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default function ReimpostaPasswordPage() {
    return (
        <Suspense fallback={
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ fontSize: '2rem' }}>⏳</div>
                <p style={{ color: 'var(--text-light)', marginTop: 12 }}>Caricamento...</p>
            </div>
        }>
            <ReimpostaPasswordForm />
        </Suspense>
    );
}
