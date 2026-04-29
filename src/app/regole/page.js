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
                <h1>📋 Regole e Punteggi</h1>
                <p>Ecco come si guadagnano (o perdono) i punti</p>
            </div>
            <section className="section">
                <div className="container" style={{ maxWidth: 900 }}>
                    {/* Regole generali */}
                    <div className="card" style={{ marginBottom: 28, borderLeft: '5px solid var(--primary)' }}>
                        <h2 style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.3rem' }}>
                            <span>📐</span> Regole generali
                        </h2>
                        <ul style={{ paddingLeft: 24, color: 'var(--text-light)', lineHeight: 2.2, fontSize: '0.95rem' }}>
                            <li>Ogni giocatore sceglie <strong>5 concorrenti</strong> con un budget di <strong>100 crediti</strong></li>
                            <li>Un concorrente viene nominato <strong>capitano</strong> — i suoi punti valgono <strong>x2</strong></li>
                            <li>I punti vengono assegnati dagli organizzatori durante l&apos;evento</li>
                            <li>La classifica si aggiorna in tempo reale</li>
                        </ul>
                    </div>

                    {/* Two-column Bonus / Malus */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {/* BONUS */}
                        <div className="card" style={{ borderTop: '5px solid var(--success)', borderLeft: '3px solid rgba(76, 175, 80, 0.25)' }}>
                            <h3 style={{
                                marginBottom: 20, color: 'var(--success)',
                                display: 'flex', alignItems: 'center', gap: 10,
                                fontSize: '1.4rem', fontFamily: 'var(--font-heading)'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>✅</span> Bonus
                            </h3>
                            {bonusList.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 16 }}>Nessun bonus definito</p>
                            ) : bonusList.map((bm, idx) => (
                                <div key={bm.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px 0',
                                    borderBottom: idx < bonusList.length - 1 ? '1px solid var(--border)' : 'none',
                                }}>
                                    <span style={{ fontSize: '0.9rem', flex: 1, lineHeight: 1.4, paddingRight: 12 }}>{bm.description}</span>
                                    <span className="tag tag-bonus" style={{ marginLeft: 8, whiteSpace: 'nowrap', fontWeight: 700 }}>
                                        +{bm.points} pt
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* MALUS */}
                        <div className="card" style={{ borderTop: '5px solid var(--danger)', borderLeft: '3px solid rgba(211, 47, 47, 0.2)' }}>
                            <h3 style={{
                                marginBottom: 20, color: 'var(--danger)',
                                display: 'flex', alignItems: 'center', gap: 10,
                                fontSize: '1.4rem', fontFamily: 'var(--font-heading)'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>❌</span> Malus
                            </h3>
                            {malusList.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 16 }}>Nessun malus definito</p>
                            ) : malusList.map((bm, idx) => (
                                <div key={bm.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px 0',
                                    borderBottom: idx < malusList.length - 1 ? '1px solid var(--border)' : 'none',
                                }}>
                                    <span style={{ fontSize: '0.9rem', flex: 1, lineHeight: 1.4, paddingRight: 12 }}>{bm.description}</span>
                                    <span className="tag tag-malus" style={{ marginLeft: 8, whiteSpace: 'nowrap', fontWeight: 700 }}>
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
