import Link from 'next/link';
import { Share, Menu } from 'lucide-react';
import NotificationButton from '@/components/NotificationButton';

export const metadata = {
    title: 'Scarica l\'App - Fantachicco',
};

export default function InstallPage() {
    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
            <div className="card" style={{ textAlign: 'center' }}>
                <h1 className="hero-title" style={{ marginBottom: '20px', color: 'var(--primary)' }}>
                    Scarica Fantachicco!
                </h1>

                <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-light)' }}>
                    Fantachicco è una <strong>Web App</strong>. Non serve passare dallo store: installala direttamente da qui in 2 secondi!
                </p>

                <div style={{ textAlign: 'left', marginBottom: '40px' }}>

                    {/* iOS Instructions */}
                    <div style={{ marginBottom: '30px', padding: '20px', background: 'var(--bg)', borderRadius: 'var(--radius)', border: '2px solid var(--border)' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)', marginBottom: '15px' }}>
                            🍎 Per iPhone (iOS)
                        </h2>
                        <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                            <li>Tocca il tasto <strong>Condividi</strong> <Share size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> nella barra in basso.</li>
                            <li>Scorri e seleziona <strong>"Aggiungi alla schermata Home"</strong>.</li>
                            <li>Clicca su <strong>Aggiungi</strong> in alto a destra.</li>
                        </ol>
                    </div>

                    {/* Android Instructions */}
                    <div style={{ padding: '20px', background: 'var(--bg)', borderRadius: 'var(--radius)', border: '2px solid var(--border)' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)', marginBottom: '15px' }}>
                            🤖 Per Android
                        </h2>
                        <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                            <li>Tocca il <strong>Menu</strong> (tre puntini) <Menu size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> in alto a destra.</li>
                            <li>Seleziona <strong>"Installa app"</strong> o <strong>"Aggiungi a schermata Home"</strong>.</li>
                            <li>Conferma cliccando su <strong>Installa</strong>.</li>
                        </ol>
                    </div>

                </div>

                <div style={{ marginBottom: '40px', padding: '20px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '2px solid var(--primary)' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>🔔 Resta Aggiornato!</h2>
                    <p style={{ marginBottom: '15px' }}>Ricevi una notifica sul telefono quando esce un nuovo avviso o bonus!</p>
                    <NotificationButton />
                </div>

                <Link href="/" className="btn btn-secondary">
                    Torna alla Home
                </Link>
            </div>
        </div>
    );
}
