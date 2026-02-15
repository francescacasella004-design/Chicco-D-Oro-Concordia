export default function StoriaPage() {
    return (
        <>
            <div className="page-header" style={{ background: 'linear-gradient(135deg, #E8531E, #F2C12E)' }}>
                <h1>📜 La Storia del Chicco D&apos;Oro</h1>
                <p>Un viaggio attraverso gli anni del nostro evento</p>
            </div>

            <section className="section">
                <div className="container" style={{ maxWidth: 750 }}>

                    {/* Introduzione */}
                    <div className="card" style={{ marginBottom: 32, borderLeft: '4px solid #E8531E' }}>
                        <h2 style={{ marginBottom: 12 }}>🌾 Come è nato il Chicco D&apos;Oro</h2>
                        <p style={{ color: 'var(--text-light)', lineHeight: 1.9 }}>
                            Il Chicco D&apos;Oro è un evento nato dalla passione e dalla creatività della comunità
                            parrocchiale di Santa Maria del Carmelo alla Concordia. Fin dal primo anno, l&apos;idea
                            era semplice ma potente: creare un momento di festa, condivisione e divertimento
                            per tutti — bambini, ragazzi, famiglie e animatori.
                        </p>
                        <p style={{ color: 'var(--text-light)', lineHeight: 1.9, marginTop: 16 }}>
                            Quello che è iniziato come un piccolo spettacolo parrocchiale si è trasformato negli
                            anni in un vero e proprio appuntamento atteso da tutta la comunità. Ogni edizione porta
                            nuove sorprese, nuovi talenti e soprattutto tanti sorrisi.
                        </p>
                        <p style={{ color: 'var(--text-light)', lineHeight: 1.9, marginTop: 16 }}>
                            Il nome &quot;Chicco D&apos;Oro&quot; rappresenta il valore di ogni singola persona della nostra
                            comunità: piccola come un chicco, ma preziosa come l&apos;oro. Insieme, questi chicchi
                            formano qualcosa di grande e speciale.
                        </p>
                    </div>

                    {/* Timeline */}
                    <h2 className="section-title">📅 Le Edizioni</h2>
                    <p className="section-subtitle">Ogni anno una nuova avventura</p>

                    <div className="steps">
                        <div className="step">
                            <div className="step-number" style={{ background: 'linear-gradient(135deg, #E8531E, #F2C12E)' }}>1</div>
                            <div className="step-content">
                                <h3>Prima Edizione</h3>
                                <p>L&apos;inizio di tutto. Un piccolo palco, tanta emozione e la nascita di una tradizione che dura ancora oggi.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number" style={{ background: 'linear-gradient(135deg, #E8531E, #F2C12E)' }}>2</div>
                            <div className="step-content">
                                <h3>Seconda Edizione</h3>
                                <p>Più partecipanti, più entusiasmo. L&apos;evento cresce e coinvolge sempre più famiglie della parrocchia.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number" style={{ background: 'linear-gradient(135deg, #E8531E, #F2C12E)' }}>3</div>
                            <div className="step-content">
                                <h3>Terza Edizione</h3>
                                <p>Nuove idee, nuovi format e la nascita del Fantachicco — il fantasy game che accompagna l&apos;evento!</p>
                            </div>
                        </div>
                    </div>

                    {/* Galleria placeholder */}
                    <div style={{ marginTop: 48 }}>
                        <h2 className="section-title">📸 Galleria</h2>
                        <p className="section-subtitle">I momenti più belli delle edizioni passate</p>
                        <div className="grid grid-3">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="card" style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    background: `linear-gradient(135deg, hsl(${i * 40}, 70%, 95%), hsl(${i * 40 + 30}, 70%, 90%))`,
                                }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>
                                        {['📷', '🎤', '🎭', '🎶', '🎉', '⭐'][i - 1]}
                                    </div>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: 0 }}>
                                        Foto/video in arrivo
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quote */}
                    <div className="card" style={{
                        marginTop: 40,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(225, 112, 85, 0.05), rgba(253, 203, 110, 0.05))',
                        borderLeft: '4px solid #F2C12E',
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: 12 }}>💛</div>
                        <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.8 }}>
                            &quot;Ogni chicco è prezioso. Insieme, formiamo qualcosa di straordinario.&quot;
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
