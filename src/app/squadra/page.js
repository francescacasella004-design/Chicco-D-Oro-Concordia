'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

export default function SquadraPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [competitors, setCompetitors] = useState([]);
    const [team, setTeam] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [captainId, setCaptainId] = useState(null);
    const [teamName, setTeamName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const BUDGET = 100;

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchData();
        }
    }, [user, authLoading]);

    async function fetchData() {
        try {
            const [compRes, teamRes] = await Promise.all([
                fetch('/api/competitors'),
                fetch('/api/teams'),
            ]);
            const compData = await compRes.json();
            const teamData = await teamRes.json();
            setCompetitors(compData.competitors || []);
            if (teamData.team) {
                setTeam(teamData.team);
                setTeamName(teamData.team.name);
                setSelectedIds(teamData.team.competitors.map(tc => tc.competitor.id));
                setCaptainId(teamData.team.captainId);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const totalCost = competitors
        .filter(c => selectedIds.includes(c.id))
        .reduce((sum, c) => sum + c.cost, 0);

    const toggleCompetitor = (id) => {
        setError('');
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
            if (captainId === id) setCaptainId(null);
        } else {
            if (selectedIds.length >= 5) {
                setError('Puoi selezionare massimo 5 concorrenti!');
                return;
            }
            const newCost = totalCost + competitors.find(c => c.id === id).cost;
            if (newCost > BUDGET) {
                setError('Budget superato!');
                return;
            }
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');
        if (!teamName.trim()) { setError('Inserisci un nome per la squadra'); return; }
        if (selectedIds.length !== 5) { setError('Devi selezionare esattamente 5 concorrenti'); return; }
        if (!captainId) { setError('Scegli un capitano!'); return; }

        setSaving(true);
        try {
            const res = await fetch('/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: teamName, competitorIds: selectedIds, captainId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setTeam(data.team);
            setSuccess('Squadra salvata con successo! 🎉');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    const bambini = competitors.filter(c => c.type === 'bambino');
    const animatori = competitors.filter(c => c.type === 'animatore');

    return (
        <>
            <div className="page-header">
                <h1>🎯 La mia squadra</h1>
                <p>Scegli 5 concorrenti e nomina il capitano</p>
            </div>
            <section className="section">
                <div className="container">
                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    {/* Team Name */}
                    <div className="card" style={{ marginBottom: 24 }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Nome della squadra</label>
                            <input
                                type="text"
                                className="form-input"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                placeholder="Es: I Campioni, Team Rocket..."
                            />
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="card" style={{ marginBottom: 24 }}>
                        <div className="budget-text">
                            <span>Budget utilizzato: {totalCost}/{BUDGET}</span>
                            <span>Selezionati: {selectedIds.length}/5</span>
                        </div>
                        <div className="budget-bar">
                            <div
                                className={`budget-fill ${totalCost > BUDGET ? 'over' : ''}`}
                                style={{ width: `${Math.min((totalCost / BUDGET) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Bambini */}
                    <h2 style={{ marginBottom: 16, fontSize: '1.4rem' }}>👦 Bambini</h2>
                    <div className="grid grid-3" style={{ marginBottom: 32 }}>
                        {bambini.map(c => (
                            <div
                                key={c.id}
                                className={`competitor-card ${selectedIds.includes(c.id) ? 'selected' : ''} ${captainId === c.id ? 'captain' : ''}`}
                                onClick={() => toggleCompetitor(c.id)}
                            >
                                {captainId === c.id && <div className="competitor-badge">👑</div>}
                                <div className="competitor-avatar">{c.name.charAt(0)}</div>
                                <div className="competitor-name">{c.name}</div>
                                <div className="competitor-type">bambino</div>
                                <div className="competitor-cost">{c.cost} crediti</div>
                                {selectedIds.includes(c.id) && captainId !== c.id && (
                                    <button
                                        className="btn btn-sm btn-accent"
                                        style={{ marginTop: 8, width: '100%' }}
                                        onClick={(e) => { e.stopPropagation(); setCaptainId(c.id); }}
                                    >
                                        👑 Fai capitano
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Animatori */}
                    <h2 style={{ marginBottom: 16, fontSize: '1.4rem' }}>🎭 Animatori</h2>
                    <div className="grid grid-3" style={{ marginBottom: 32 }}>
                        {animatori.map(c => (
                            <div
                                key={c.id}
                                className={`competitor-card ${selectedIds.includes(c.id) ? 'selected' : ''} ${captainId === c.id ? 'captain' : ''}`}
                                onClick={() => toggleCompetitor(c.id)}
                            >
                                {captainId === c.id && <div className="competitor-badge">👑</div>}
                                <div className="competitor-avatar" style={{ background: 'var(--gradient-warm)' }}>{c.name.charAt(0)}</div>
                                <div className="competitor-name">{c.name}</div>
                                <div className="competitor-type">animatore</div>
                                <div className="competitor-cost">{c.cost} crediti</div>
                                {selectedIds.includes(c.id) && captainId !== c.id && (
                                    <button
                                        className="btn btn-sm btn-accent"
                                        style={{ marginTop: 8, width: '100%' }}
                                        onClick={(e) => { e.stopPropagation(); setCaptainId(c.id); }}
                                    >
                                        👑 Fai capitano
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Save */}
                    <div style={{ textAlign: 'center' }}>
                        <button
                            className="btn btn-lg btn-primary"
                            onClick={handleSave}
                            disabled={saving || selectedIds.length !== 5 || !captainId || !teamName.trim()}
                        >
                            {saving ? 'Salvataggio...' : '💾 Salva squadra'}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
