import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 4 }}>
                <img src="/solochicco.png" alt="Chicco" style={{ height: 40, width: 'auto' }} />
                <span className="footer-title" style={{ marginBottom: 0, background: 'linear-gradient(180deg, #F5B731, #D4A017)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none' }}>Chicco D&apos;Oro</span>
            </div>
            <p>Parrocchia Concordia</p>
            <div className="footer-links">
                <Link href="/">Home</Link>
                <Link href="/fantachicco">Fantachicco</Link>
                <Link href="/contatti">Contatti</Link>
            </div>
            <p style={{ marginTop: 20, fontSize: '0.8rem', opacity: 0.5 }}>
                © 2026 Chicco D&apos;Oro — Tutti i diritti riservati
            </p>
        </footer>
    );
}
