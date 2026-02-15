'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/fantachicco', label: 'Fantachicco' },
        { href: '/storia', label: 'La Storia' },
        { href: '/contatti', label: 'Contatti' },
    ];

    const handleLogout = async () => {
        await logout();
        setMenuOpen(false);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-logo">🌾 Chicco D&apos;Oro</Link>

                    <ul className="navbar-links">
                        {links.map(l => (
                            <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                        ))}
                        {user && (
                            <li><Link href="/squadra">La mia squadra</Link></li>
                        )}
                        {user?.role === 'admin' && (
                            <li><Link href="/admin">⚙️ Admin</Link></li>
                        )}
                    </ul>

                    <div className="navbar-user">
                        {user ? (
                            <>
                                <span className="navbar-user-name">👤 {user.name}</span>
                                <button onClick={handleLogout} className="btn btn-sm btn-secondary">Esci</button>
                            </>
                        ) : (
                            <Link href="/login" className="btn btn-sm btn-primary">Accedi</Link>
                        )}
                    </div>

                    <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </nav>

            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                {links.map(l => (
                    <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</Link>
                ))}
                {user && (
                    <Link href="/squadra" onClick={() => setMenuOpen(false)}>🎯 La mia squadra</Link>
                )}
                {user?.role === 'admin' && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)}>⚙️ Admin</Link>
                )}
                <hr style={{ border: 'none', borderTop: '1px solid #DFE6E9', margin: '8px 0' }} />
                {user ? (
                    <>
                        <span style={{ padding: '14px 20px', fontWeight: 600 }}>👤 {user.name}</span>
                        <a href="#" onClick={handleLogout} style={{ color: '#E17055' }}>Esci</a>
                    </>
                ) : (
                    <Link href="/login" onClick={() => setMenuOpen(false)}>🔑 Accedi / Registrati</Link>
                )}
            </div>
        </>
    );
}
