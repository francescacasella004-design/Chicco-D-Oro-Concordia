'use client';
import { useState, useEffect } from 'react';

export default function ClassificaPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedTeam, setExpandedTeam] = useState(null);

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 15000);
        return () => clearInterval(interval);
    }, []);

    async function fetchLeaderboard() {
        try {
            const res = await fetch('/api/leaderboard');
            const data = await res.json();
            setLeaderboard(data.leaderboard || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const getRankClass = (index) => {
        if (index === 0) return 'top-1';
        if (index === 1) return 'top-2';
        if (index === 2) return 'top-3';
        return '';
    };

    const getMedal = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return '';
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <>
            <div className="page-header">
                <h1>🏆 Classifica</h1>
                <p>Aggiornamento automatico ogni 15 secondi</p>
            </div>
            <section className="section">
                <div className="container" style={{ maxWidth: 700 }}>
                    {leaderboard.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <h3>Nessuna squadra ancora</h3>
                            <p>La classifica si popolerà quando i giocatori creeranno le loro squadre!</p>
                        </div>
                    ) : (
                        leaderboard.map((entry, index) => (
                            <div key={entry.teamId}>
                                <div
                                    className={`leaderboard-item ${getRankClass(index)}`}
                                    onClick={() => setExpandedTeam(expandedTeam === entry.teamId ? null : entry.teamId)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="leaderboard-rank">
                                        {getMedal(index) || (index + 1)}
                                    </div>
                                    <div className="leaderboard-info">
                                        <div className="leaderboard-team">{entry.teamName}</div>
                                        <div className="leaderboard-player">di {entry.playerName}</div>
                                    </div>
                                    <div className="leaderboard-points">{entry.totalPoints} pt</div>
                                </div>
                                {expandedTeam === entry.teamId && (
                                    <div className="card" style={{ marginBottom: 12, marginTop: -4, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                                        <h4 style={{ marginBottom: 12, fontSize: '0.95rem', color: 'var(--text-light)' }}>Concorrenti:</h4>
                                        {entry.competitors.map(comp => (
                                            <div key={comp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                                                <span>
                                                    {comp.isCaptain && '👑 '}{comp.name}
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 6 }}>({comp.type})</span>
                                                </span>
                                                <span style={{ fontWeight: 700, color: comp.finalPoints >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                                    {comp.finalPoints > 0 ? '+' : ''}{comp.finalPoints} pt
                                                    {comp.isCaptain && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', marginLeft: 4 }}>x2</span>}
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
        </>
    );
}
