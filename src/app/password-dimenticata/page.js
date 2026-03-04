'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PasswordDimenticataPage() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSent(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1>🔑 Password Dimenticata</h1>
                <p>Riceverai un&apos;email per reimpostare la password</p>
            </div>
            <section className="section">
                <div className="container" style={{ maxWidth: 450 }}>
                    <div className="card">
                        {sent ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📧</div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: 12 }}>
                                    Controlla la tua email!
                                </h2>
                                <p style={{ color: 'var(--text-light)', marginBottom: 24, lineHeight: 1.6 }}>
                                    Se l&apos;email <strong style={{ color: 'var(--primary)' }}>{email}</strong> è registrata,
                                    riceverai un link per reimpostare la password.
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24 }}>
                                    ⏰ Il link scade tra 1 ora
                                </p>
                                <Link href="/login" className="btn btn-primary" style={{ width: '100%' }}>
                                    ← Torna al Login
                                </Link>
                            </div>
                        ) : (
                            <>
                                {error && <div className="alert alert-error">{error}</div>}
                                <p style={{ color: 'var(--text-light)', marginBottom: 20, fontSize: '0.95rem' }}>
                                    Inserisci l&apos;email con cui ti sei registrato. Ti invieremo un link per reimpostare la password.
                                </p>
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
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        style={{ width: '100%' }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Invio in corso...' : '📧 Invia Link di Reset'}
                                    </button>
                                </form>
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
