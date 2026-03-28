import Link from 'next/link';

export default function ComeSiGiocaPage() {
    return (
        <>
            <div className="page-header">
                <h1>📖 Come si gioca</h1>
                <p>Tutto quello che devi sapere per partecipare al Fantachicco</p>
            </div>
            <section className="section">
                <div className="container" style={{ maxWidth: 700 }}>
                    <div className="steps" style={{ marginBottom: 40 }}>
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Crea il tuo account</h3>
                                <p>Registrati con il tuo nome e una email. Ci vuole meno di un minuto!</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Forma la tua squadra</h3>
                                <p>Hai un budget di <strong>100 crediti</strong> per scegliere <strong>5 concorrenti</strong> tra bambini, animatori e capi animatori. Ogni concorrente ha un costo diverso: i più forti costano di più!</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Scegli il tuo capitano 👑</h3>
                                <p>Uno dei 5 concorrenti sarà il tuo <strong>capitano</strong>. I suoi punti valgono <strong>il doppio</strong>! Scegli con attenzione chi pensi farà meglio durante l&apos;evento.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Segui l&apos;evento</h3>
                                <p>Durante le esibizioni, gli organizzatori assegneranno <strong>bonus</strong> e <strong>malus</strong> ai concorrenti in base a quello che succede sul palco.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <h3>Guarda la classifica</h3>
                                <p>La classifica si aggiorna in tempo reale! Controlla come va la tua squadra e tifa per i tuoi concorrenti.</p>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(108,92,231,0.05), rgba(0,206,201,0.05))' }}>
                        <h3 style={{ marginBottom: 8 }}>💡 Consigli strategici</h3>
                        <ul style={{ textAlign: 'left', paddingLeft: 20, color: 'var(--text-light)', lineHeight: 2 }}>
                            <li>Non spendere tutto il budget su pochi concorrenti costosi</li>
                            <li>Mischia bambini, animatori e capi animatori per una squadra equilibrata</li>
                            <li>Il capitano giusto può fare tutta la differenza!</li>
                            <li>Guarda le regole per capire come si guadagnano i punti</li>
                        </ul>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <Link href="/registrazione" className="btn btn-lg btn-primary">🚀 Inizia a giocare!</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
