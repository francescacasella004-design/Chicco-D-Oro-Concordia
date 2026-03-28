'use client';
import { useState, useEffect } from 'react';

export default function RegolePage() {
    const [bonusMalus, setBonusMalus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRules() {
            try {
                const res = await fetch('/api/bonus-malus');
                const data = await res.json();
                setBonusMalus(data.bonusMalus || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchRules();
    }, []);

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    const bonusList = bonusMalus.filter(bm => bm.points >= 0).sort((a, b) => b.points - a.points);
    const malusList = bonusMalus.filter(bm => bm.points < 0).sort((a, b) => a.points - b.points);

    return (
        <>
            <div className="page-header">
                <h1>📋 Regole del gioco</h1>
                <p>Tutti i bonus e malus del Fantachicco</p>
            </div>
            <section className="section">
                <div className="container" style={{ maxWidth: 900 }}>
                    {/* General Rules */}
                    <div className="card" style={{ marginBottom: 24 }}>
                        <h2 className="card-title">🎮 Come funziona il punteggio</h2>
                        <ul style={{ paddingLeft: 20, color: 'var(--text-light)', lineHeight: 2 }}>
                            <li>Ogni giocatore sceglie <strong>5 concorrenti</strong> con un budget di <strong>100 crediti</strong></li>
                            <li>Un concorrente viene scelto come <strong>capitano</strong>: i suoi punti valgono <strong>doppio! (x2)</strong></li>
                            <li>Durante l&apos;evento, gli organizzatori assegnano <strong>bonus e malus</strong> ai concorrenti</li>
                            <li>Il punteggio della squadra è la <strong>somma dei punti</strong> di tutti i concorrenti</li>
                            <li>Vince chi ha il <strong>punteggio più alto</strong> alla fine dell&apos;evento!</li>
                        </ul>
                    </div>

                    {/* Two-column Bonus / Malus */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        {/* BONUS */}
                        <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
                            <h3 style={{ marginBottom: 16, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '1.5rem' }}>✅</span> Bonus
                            </h3>
                            {bonusList.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 16 }}>Nessun bonus definito</p>
                            ) : bonusList.map(bm => (
                                <div key={bm.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px 0', borderBottom: '1px solid var(--border)'
                                }}>
                                    <span style={{ fontSize: '0.9rem', flex: 1 }}>{bm.description}</span>
                                    <span className="tag tag-bonus" style={{ marginLeft: 8, whiteSpace: 'nowrap' }}>
                                        +{bm.points} pt
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* MALUS */}
                        <div className="card" style={{ borderTop: '4px solid var(--danger)' }}>
                            <h3 style={{ marginBottom: 16, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '1.5rem' }}>❌</span> Malus
                            </h3>
                            {malusList.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 16 }}>Nessun malus definito</p>
                            ) : malusList.map(bm => (
                                <div key={bm.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px 0', borderBottom: '1px solid var(--border)'
                                }}>
                                    <span style={{ fontSize: '0.9rem', flex: 1 }}>{bm.description}</span>
                                    <span className="tag tag-malus" style={{ marginLeft: 8, whiteSpace: 'nowrap' }}>
                                        {bm.points} pt
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
