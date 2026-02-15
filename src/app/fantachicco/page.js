'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

export default function FantachiccoPage() {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('info');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab && sections.find(s => s.id === tab)) {
            setActiveSection(tab);
        }
    }, []);

    const sections = [
        { id: 'info', label: '🏠 Fantachicco', icon: '🎮' },
        { id: 'come-si-gioca', label: '📖 Come si gioca', icon: '📖' },
        { id: 'classifica', label: '🏆 Classifica', icon: '🏆' },
        { id: 'regole', label: '📋 Regole', icon: '📋' },
    ];

    return (
        <>
            {/* Hero */}
            <section className="hero" style={{ minHeight: '35vh' }}>
                <span className="hero-emoji">🎤</span>
                <h1 className="hero-title">Fantachicco</h1>
                <p className="hero-subtitle">
                    Il fantasy game della parrocchia! Scegli i tuoi concorrenti e scala la classifica.
                </p>
                {user ? (
                    <Link href="/squadra" className="btn btn-lg" style={{ background: 'white', color: '#E8531E' }}>
                        🎯 La mia squadra
                    </Link>
                ) : (
                    <div className="hero-buttons">
                        <Link href="/registrazione" className="btn btn-lg" style={{ background: 'white', color: '#E8531E' }}>
                            🚀 Partecipa ora!
                        </Link>
                        <Link href="/login" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', border: '2px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)' }}>
                            🔑 Accedi
                        </Link>
                    </div>
                )}
            </section>

            {/* Tabs navigazione interna */}
            <div style={{
                background: 'white',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 64,
                zIndex: 90,
                overflowX: 'auto',
            }}>
                <div className="container" style={{ display: 'flex', gap: 0, padding: 0 }}>
                    {sections.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSection(s.id)}
                            style={{
                                padding: '14px 20px',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeSection === s.id ? '3px solid var(--primary)' : '3px solid transparent',
                                color: activeSection === s.id ? 'var(--primary)' : 'var(--text-light)',
                                fontWeight: activeSection === s.id ? 700 : 500,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s',
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* SEZIONE: Info Fantachicco */}
            {activeSection === 'info' && <InfoSection user={user} />}
            {activeSection === 'come-si-gioca' && <ComeSiGiocaSection />}
            {activeSection === 'classifica' && <ClassificaSection />}
            {activeSection === 'regole' && <RegoleSection />}
        </>
    );
}

/* ===== INFO ===== */
function InfoSection({ user }) {
    return (
        <section className="section">
            <div className="container">
                <h2 className="section-title">Cos&apos;è Fantachicco?</h2>
                <p className="section-subtitle">
                    Un gioco ispirato al Fantasanremo, ambientato nell&apos;evento della nostra parrocchia!
                </p>
                <div className="grid grid-3">
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>👥</div>
                        <h3 style={{ marginBottom: 8 }}>Scegli la squadra</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
                            Seleziona 5 concorrenti tra bambini e animatori, rispettando il budget.
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⭐</div>
                        <h3 style={{ marginBottom: 8 }}>Guadagna punti</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
                            I tuoi concorrenti guadagnano bonus (o malus!) durante le esibizioni.
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏆</div>
                        <h3 style={{ marginBottom: 8 }}>Scala la classifica</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
                            Segui i punteggi in tempo reale e conquista il primo posto!
                        </p>
                    </div>
                </div>

                {/* Steps rapidi */}
                <div style={{ marginTop: 48 }}>
                    <h2 className="section-title">Come funziona?</h2>
                    <p className="section-subtitle">In 4 semplici passi</p>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Registrati</h3>
                                <p>Crea il tuo account in pochi secondi</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Scegli i concorrenti</h3>
                                <p>Forma la tua squadra di 5 con un budget di 100 crediti</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Nomina il capitano</h3>
                                <p>Il capitano fa punti doppi! Scegli con saggezza</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Goditi lo spettacolo</h3>
                                <p>Segui l&apos;evento e guarda la classifica aggiornarsi!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    {!user && (
                        <Link href="/registrazione" className="btn btn-lg btn-primary">
                            🚀 Registrati gratis
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ===== COME SI GIOCA ===== */
function ComeSiGiocaSection() {
    return (
        <section className="section">
            <div className="container" style={{ maxWidth: 700 }}>
                <h2 className="section-title">📖 Come si gioca</h2>
                <p className="section-subtitle">Tutto quello che devi sapere per partecipare</p>
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
                            <p>Hai un budget di <strong>100 crediti</strong> per scegliere <strong>5 concorrenti</strong> tra bambini e animatori. Ogni concorrente ha un costo diverso!</p>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>Scegli il tuo capitano 👑</h3>
                            <p>Uno dei 5 concorrenti sarà il tuo <strong>capitano</strong>. I suoi punti valgono <strong>il doppio</strong>!</p>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h3>Segui l&apos;evento</h3>
                            <p>Gli organizzatori assegneranno <strong>bonus</strong> e <strong>malus</strong> ai concorrenti durante le esibizioni.</p>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">5</div>
                        <div className="step-content">
                            <h3>Guarda la classifica</h3>
                            <p>La classifica si aggiorna in tempo reale! Controlla come va la tua squadra.</p>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(232,83,30,0.06), rgba(242,193,46,0.06))' }}>
                    <h3 style={{ marginBottom: 8 }}>💡 Consigli strategici</h3>
                    <ul style={{ textAlign: 'left', paddingLeft: 20, color: 'var(--text-light)', lineHeight: 2 }}>
                        <li>Non spendere tutto il budget su pochi concorrenti costosi</li>
                        <li>Mischia bambini e animatori per una squadra equilibrata</li>
                        <li>Il capitano giusto può fare tutta la differenza!</li>
                        <li>Guarda le regole per capire come si guadagnano i punti</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}

/* ===== CLASSIFICA ===== */
import { useEffect } from 'react';

function ClassificaSection() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    const fetchLeaderboard = () => {
        fetch('/api/leaderboard')
            .then(res => res.json())
            .then(data => setLeaderboard(data.leaderboard || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 15000);
        return () => clearInterval(interval);
    }, []);

    const medals = ['🥇', '🥈', '🥉'];

    return (
        <section className="section">
            <div className="container" style={{ maxWidth: 700 }}>
                <h2 className="section-title">🏆 Classifica</h2>
                <p className="section-subtitle">Aggiornamento automatico ogni 15 secondi</p>

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : leaderboard.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏟️</div>
                        <h3 style={{ color: 'var(--text-light)' }}>Nessuna squadra ancora</h3>
                        <p style={{ color: 'var(--text-muted)' }}>La classifica apparirà quando i giocatori creeranno le loro squadre!</p>
                    </div>
                ) : (
                    leaderboard.map((team, idx) => (
                        <div key={team.teamId} className="leaderboard-item" onClick={() => setExpanded(expanded === team.teamId ? null : team.teamId)} style={{ cursor: 'pointer' }}>
                            <div className="leaderboard-rank">
                                {idx < 3 ? <span style={{ fontSize: '1.5rem' }}>{medals[idx]}</span> : <span>{idx + 1}</span>}
                            </div>
                            <div className="leaderboard-info">
                                <strong>{team.teamName}</strong>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{team.playerName}</span>
                            </div>
                            <div className="leaderboard-score">{team.totalScore} pt</div>

                            {expanded === team.teamId && team.competitors && (
                                <div style={{ width: '100%', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                                    {team.competitors.map(c => (
                                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.85rem' }}>
                                            <span>{c.isCaptain ? '👑 ' : ''}{c.name}</span>
                                            <span style={{ color: c.points >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                                {c.points > 0 ? '+' : ''}{c.points} pt
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

/* ===== REGOLE ===== */
function RegoleSection() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/bonus-malus')
            .then(res => res.json())
            .then(data => setRules(data.bonusMalus || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const categories = [...new Set(rules.map(r => r.category))];

    return (
        <section className="section">
            <div className="container" style={{ maxWidth: 700 }}>
                <h2 className="section-title">📋 Regole e Punteggi</h2>
                <p className="section-subtitle">Ecco come si guadagnano (o perdono) i punti</p>

                {/* Regole generali */}
                <div className="card" style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 12 }}>📐 Regole generali</h3>
                    <ul style={{ paddingLeft: 20, color: 'var(--text-light)', lineHeight: 2 }}>
                        <li>Ogni giocatore sceglie <strong>5 concorrenti</strong> con un budget di <strong>100 crediti</strong></li>
                        <li>Un concorrente viene nominato <strong>capitano</strong> — i suoi punti valgono <strong>x2</strong></li>
                        <li>I punti vengono assegnati dagli organizzatori durante l&apos;evento</li>
                        <li>La classifica si aggiorna in tempo reale</li>
                    </ul>
                </div>

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : categories.map(cat => (
                    <div key={cat} className="card" style={{ marginBottom: 16 }}>
                        <h3 style={{ marginBottom: 12, textTransform: 'capitalize' }}>
                            {cat === 'base' && '🎵 '}
                            {cat === 'pubblico' && '👏 '}
                            {cat === 'speciale' && '⭐ '}
                            {cat === 'stile' && '👗 '}
                            {cat === 'intrattenimento' && '🎭 '}
                            {cat === 'errore' && '❌ '}
                            {cat}
                        </h3>
                        {rules.filter(r => r.category === cat).map(r => (
                            <div key={r.id} className="score-history-item">
                                <span>{r.description}</span>
                                <span className={`tag ${r.points >= 0 ? 'tag-bonus' : 'tag-malus'}`}>
                                    {r.points > 0 ? '+' : ''}{r.points} pt
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}
