'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';

export default function ClassificaPage() {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedTeam, setExpandedTeam] = useState(null);
    const [resultsPublished, setResultsPublished] = useState(false);
    const [viewDay, setViewDay] = useState('total'); // 'total', '1', '2'

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 15000);
        return () => clearInterval(interval);
    }, [viewDay]);

    async function fetchLeaderboard() {
        try {
            const url = viewDay === 'total' ? '/api/leaderboard' : `/api/leaderboard?day=${viewDay}`;
            const res = await fetch(url);
            const data = await res.json();
            setLeaderboard(data.leaderboard || []);
            setResultsPublished(data.resultsPublished || false);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const getRankClass = (rank) => {
        if (rank === 1) return 'top-1';
        if (rank === 2) return 'top-2';
        if (rank === 3) return 'top-3';
        return '';
    };

    const getMedal = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return '';
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <>
            <div className="page-header">
                <h1>🏆 Classifica</h1>
                <p>{resultsPublished ? 'Risultati Finali' : (user?.role === 'admin' ? '👀 Anteprima Admin' : 'Aggiornamento automatico ogni 15 secondi')}</p>
            </div>
            
            {(resultsPublished || user?.role === 'admin') && (
                <div className="container" style={{ maxWidth: 700, marginTop: 24, marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <button className={`btn btn-sm ${viewDay === 'total' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewDay('total')}>Totale</button>
                        <button className={`btn btn-sm ${viewDay === '1' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewDay('1')}>Giorno 1</button>
                        <button className={`btn btn-sm ${viewDay === '2' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewDay('2')}>Giorno 2</button>
                    </div>
                </div>
            )}

            <section className="section">
                <div className="container" style={{ maxWidth: 700 }}>
                    {!resultsPublished ? (
                        <div className="container" style={{ maxWidth: 600 }}>
                            <div className="card" style={{ textAlign: 'center', marginBottom: 24, padding: 20 }}>
                                <div style={{ fontSize: '2rem', marginBottom: 12 }}>📋</div>
                                <h3 style={{ margin: 0 }}>Elenco Squadre Partecipanti</h3>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: 8 }}>
                                    I punteggi verranno mostrati ufficialmente al termine dell'evento!
                                </p>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[...leaderboard]
                                    .sort((a, b) => a.teamName.localeCompare(b.teamName))
                                    .map((entry) => (
                                        <div key={entry.teamId} className="leaderboard-item" style={{ cursor: 'default' }}>
                                            <div className="leaderboard-rank" style={{ opacity: 0.5, fontSize: '0.8rem' }}>
                                                #
                                            </div>
                                            <div className="leaderboard-info">
                                                <div className="leaderboard-team">{entry.teamName}</div>
                                                <div className="leaderboard-player">
                                                    <span>di <strong>{entry.playerName}</strong></span>
                                                </div>
                                            </div>
                                            <div className="leaderboard-points" style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                                                pt
                                            </div>
                                        </div>
                                    ))
                                }
                                {leaderboard.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
                                        Nessuna squadra ancora registrata.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <h3>Nessuna squadra ancora</h3>
                            <p>La classifica si popolerà quando i risultati verranno confermati!</p>
                        </div>
                    ) : (
                        leaderboard.map((entry) => (
                            <div key={entry.teamId}>
                                <div
                                    className={`leaderboard-item ${getRankClass(entry.rank)}`}
                                    onClick={() => setExpandedTeam(expandedTeam === entry.teamId ? null : entry.teamId)}
                                    style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                >
                                    <div className="leaderboard-rank">
                                        {getMedal(entry.rank) || entry.rank}
                                    </div>
                                    <div className="leaderboard-info">
                                        <div className="leaderboard-team">{entry.teamName}</div>
                                        <div className="leaderboard-player">
                                            <span>di <strong>{entry.playerName}</strong></span>
                                            <span style={{fontSize: '0.8rem', opacity: 0.7, marginLeft: 8}}>({entry.playerEmail})</span>
                                        </div>
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
