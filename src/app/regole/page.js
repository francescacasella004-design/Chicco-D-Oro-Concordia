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

    const categories = [...new Set(bonusMalus.map(bm => bm.category))];
    const categoryLabels = {
        base: '⭐ Base',
        pubblico: '👏 Pubblico',
        speciale: '🌟 Speciale',
        stile: '👗 Stile',
        intrattenimento: '🎭 Intrattenimento',
        errore: '❌ Errore',
    };

    return (
        <>
            <div className="page-header">
                <h1>📋 Regole del gioco</h1>
                <p>Tutti i bonus e malus del Fantachicco</p>
            </div>
            <section className="section">
                <div className="container" style={{ maxWidth: 700 }}>
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

                    {/* Bonus/Malus by category */}
                    {categories.map(cat => (
                        <div key={cat} className="card" style={{ marginBottom: 16 }}>
                            <h3 style={{ marginBottom: 16 }}>{categoryLabels[cat] || cat}</h3>
                            {bonusMalus
                                .filter(bm => bm.category === cat)
                                .map(bm => (
                                    <div key={bm.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: '0.95rem' }}>{bm.description}</span>
                                        <span className={`tag ${bm.points >= 0 ? 'tag-bonus' : 'tag-malus'}`}>
                                            {bm.points > 0 ? '+' : ''}{bm.points} pt
                                        </span>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
