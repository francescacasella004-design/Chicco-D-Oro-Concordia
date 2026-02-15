export default function ContattiPage() {
    return (
        <>
            <div className="page-header">
                <h1>📬 Contatti</h1>
                <p>Hai bisogno di aiuto? Contattaci!</p>
            </div>
            <section className="section">
                <div className="container" style={{ maxWidth: 600 }}>
                    <div className="card" style={{ textAlign: 'center', marginBottom: 24 }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⛪</div>
                        <h2 style={{ marginBottom: 8 }}>Parrocchia Santa Maria del Carmelo alla Concordia</h2>
                        <p style={{ color: 'var(--text-light)', lineHeight: 1.8 }}>
                            Fantachicco è un gioco organizzato dalla nostra parrocchia per un evento speciale.
                        </p>
                    </div>

                    <div className="grid grid-2">
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📧</div>
                            <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>Email</h3>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>info@fantachicco.it</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📍</div>
                            <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>Dove siamo</h3>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Parrocchia S. Maria del Carmelo</p>
                        </div>
                    </div>

                    <div className="card" style={{ marginTop: 24, textAlign: 'center' }}>
                        <h3 style={{ marginBottom: 8 }}>❓ Domande frequenti</h3>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ marginBottom: 16 }}>
                                <strong>Quanto costa partecipare?</strong>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Niente! Fantachicco è completamente gratuito.</p>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <strong>Posso modificare la mia squadra?</strong>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Sì, puoi modificare la squadra finché non inizia l&apos;evento.</p>
                            </div>
                            <div>
                                <strong>Come faccio a vedere i miei punti?</strong>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Vai nella sezione Classifica! I punteggi si aggiornano in tempo reale.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
