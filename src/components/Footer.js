import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-title">🌾 Chicco D&apos;Oro</div>
            <p>Parocchia Santa Maria del Carmelo alla Concordia</p>
            <div className="footer-links">
                <Link href="/">Home</Link>
                <Link href="/fantachicco">Fantachicco</Link>
                <Link href="/storia">La Storia</Link>
                <Link href="/contatti">Contatti</Link>
            </div>
            <p style={{ marginTop: 20, fontSize: '0.8rem', opacity: 0.5 }}>
                © 2026 Chicco D&apos;Oro — Tutti i diritti riservati
            </p>
        </footer>
    );
}
