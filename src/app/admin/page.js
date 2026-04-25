'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('assegna'); // assegna, concorrenti, regole, storico, avvisi

    // Data State
    const [competitors, setCompetitors] = useState([]);
    const [bonusMalus, setBonusMalus] = useState([]);
    const [scoreHistory, setScoreHistory] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [users, setUsers] = useState([]);
    const [pendingScores, setPendingScores] = useState([]);

    // Form State
    const [selectedBonusMalus, setSelectedBonusMalus] = useState('');
    const [scoreType, setScoreType] = useState('bonus'); // 'bonus' or 'malus'
    const [scoreListType, setScoreListType] = useState('standard'); // 'standard' or 'capo'
    const [currentScoreIndex, setCurrentScoreIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
    const [registrationOpen, setRegistrationOpen] = useState(true);
    const [resultsPublished, setResultsPublished] = useState(false);

    // Edit/Delete State
    const [editingItem, setEditingItem] = useState(null); // { type: 'competitor' | 'bonus' | 'announcement', data: ... }

    const [showEditModal, setShowEditModal] = useState(false);
    const [viewingTeam, setViewingTeam] = useState(null); // { userName: string, teamName: string, competitors: [] }

    // New Item State
    const [newCompetitor, setNewCompetitor] = useState({ name: '', type: 'bambino', cost: 10, imageUrl: '' });
    const [newBonusMalus, setNewBonusMalus] = useState({ description: '', points: 0, category: 'base' });
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', pinned: false });

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchData();
        }
    }, [activeTab]);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/login');
        } else if (user?.role === 'admin') {
            fetchData();
        }
    }, [user, authLoading, router]);

    const fetchData = async () => {
        try {
            const [compRes, bmRes, scoreRes, annRes, usersRes, settingsRes, pendingRes] = await Promise.all([
                fetch('/api/competitors', { cache: 'no-store' }),
                fetch('/api/bonus-malus', { cache: 'no-store' }),
                fetch('/api/scores', { cache: 'no-store' }),
                fetch('/api/announcements', { cache: 'no-store' }),
                fetch('/api/users', { cache: 'no-store' }),
                fetch('/api/settings', { cache: 'no-store' }),
                fetch('/api/scores/pending', { cache: 'no-store' })
            ]);

            if (compRes.ok) { const data = await compRes.json(); setCompetitors(data.competitors || []); }
            if (bmRes.ok) { const data = await bmRes.json(); setBonusMalus(data.bonusMalus || []); }
            if (scoreRes.ok) { const data = await scoreRes.json(); setScoreHistory(data.scoreEvents || []); }
            if (annRes.ok) { const data = await annRes.json(); setAnnouncements(data.announcements || []); }
            if (usersRes.ok) { const data = await usersRes.json(); setUsers(data.users || []); }
            if (settingsRes.ok) {
                const data = await settingsRes.json();
                setRegistrationOpen(data.registrationOpen);
                setResultsPublished(data.resultsPublished);
            }
            if (pendingRes && pendingRes.ok) { const data = await pendingRes.json(); setPendingScores(data.pendingScores || []); }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleToggleRegistration = async () => {
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registrationOpen: !registrationOpen })
            });
            if (res.ok) {
                const data = await res.json();
                setRegistrationOpen(data.registrationOpen);
                showMessage('success', data.registrationOpen ? 'Iscrizioni Aperte!' : 'Iscrizioni Chiuse!');
            } else {
                showMessage('error', 'Errore aggiornamento impostazioni');
            }
        } catch (e) {
            showMessage('error', 'Errore di rete');
        }
    };

    const handleAssignScore = async (competitorId) => {
        if (!competitorId || !selectedBonusMalus) {
            showMessage('error', 'Seleziona concorrente e bonus/malus');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/scores/pending', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    competitorId: parseInt(competitorId),
                    bonusMalusId: parseInt(selectedBonusMalus),
                }),
            });
            if (res.ok) {
                showMessage('success', 'Punteggio salvato in attesa di revisione!');
                fetchData(); // Refresh pending scores
            } else {
                const data = await res.json();
                showMessage('error', data.error || 'Errore');
            }
        } catch (e) {
            showMessage('error', 'Errore di rete');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return;

        let endpoint = '';
        if (type === 'competitor') endpoint = `/api/competitors?id=${id}`;
        if (type === 'bonus') endpoint = `/api/bonus-malus?id=${id}`;
        if (type === 'score') endpoint = `/api/scores?id=${id}`;
        if (type === 'announcement') endpoint = `/api/announcements?id=${id}`;
        if (type === 'user') endpoint = `/api/users?id=${id}`;

        try {
            const res = await fetch(endpoint, { method: 'DELETE' });
            if (res.ok) {
                showMessage('success', 'Elemento eliminato');
                fetchData();
            } else {
                showMessage('error', 'Errore eliminazione');
            }
        } catch (e) {
            showMessage('error', 'Errore di rete');
        }
    };

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'player' : 'admin';
        if (!confirm(`Vuoi rendere questo utente un ${newRole === 'admin' ? 'Admin' : 'Giocatore'}?`)) return;

        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, role: newRole }),
            });
            if (res.ok) {
                showMessage('success', 'Ruolo aggiornato con successo');
                fetchData();
            } else {
                showMessage('error', 'Errore aggiornamento ruolo');
            }
        } catch (e) {
            showMessage('error', 'Errore di rete');
        }
    };

    const handleCreate = async (type) => {
        setLoading(true);
        let endpoint = '', body = {};
        if (type === 'competitor') { endpoint = '/api/competitors'; body = newCompetitor; }
        if (type === 'bonus') { endpoint = '/api/bonus-malus'; body = newBonusMalus; }
        if (type === 'announcement') { endpoint = '/api/announcements'; body = newAnnouncement; }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                showMessage('success', 'Creato con successo');
                fetchData();
                // Reset forms
                if (type === 'competitor') setNewCompetitor({ name: '', type: 'bambino', cost: 10, imageUrl: '' });
                if (type === 'bonus') setNewBonusMalus({ description: '', points: 0, category: 'base' });
                if (type === 'announcement') setNewAnnouncement({ title: '', content: '', pinned: false });
            } else {
                showMessage('error', 'Errore creazione');
            }
        } catch (e) {
            showMessage('error', 'Errore di rete');
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (type, item) => {
        setEditingItem({ type, data: { ...item } });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingItem) return;
        setLoading(true);

        let endpoint = '';
        if (editingItem.type === 'competitor') endpoint = '/api/competitors';
        if (editingItem.type === 'bonus') endpoint = '/api/bonus-malus';
        if (editingItem.type === 'announcement') endpoint = '/api/announcements';

        try {
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingItem.data),
            });
            if (res.ok) {
                showMessage('success', 'Modifica salvata');
                setShowEditModal(false);
                setEditingItem(null);
                fetchData();
            } else {
                showMessage('error', 'Errore salvataggio');
            }
        } catch (e) {
            showMessage('error', 'Errore di rete');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmScores = async (ids) => {
        if (!ids || ids.length === 0) return;
        setLoading(true);
        try {
            const res = await fetch('/api/scores/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids }),
            });
            if (res.ok) {
                showMessage('success', `${ids.length} punteggi confermati ufficialmente!`);
                fetchData();
            } else {
                showMessage('error', 'Errore nella conferma');
            }
        } catch (e) {
            showMessage('error', 'Errore di rete');
        } finally {
            setLoading(false);
        }
    };

    const handlePublishResults = async () => {
        const confirmMsg = resultsPublished 
            ? 'Vuoi NASCONDERE la classifica? I punteggi rimarranno confermati.' 
            : 'Stai per pubblicare i risultati finali. Questo confermerà TUTTI i punteggi in attesa e renderà pubblica la classifica. Continuare?';
            
        if (!confirm(confirmMsg)) return;
        
        setLoading(true);
        try {
            // 1. Se stiamo pubblicando, conferma prima tutti i pending
            if (!resultsPublished && pendingScores.length > 0) {
                await fetch('/api/scores/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: pendingScores.map(ps => ps.id) }),
                });
            }
            
            // 2. Aggiorna lo stato di pubblicazione
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resultsPublished: !resultsPublished })
            });
            
            if (res.ok) {
                const data = await res.json();
                setResultsPublished(data.resultsPublished);
                showMessage('success', data.resultsPublished ? 'Risultati Pubblicati!' : 'Risultati Nascosti');
                fetchData();
            }
        } catch (e) {
            showMessage('error', 'Errore di rete');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePending = async (id) => {
        if (!confirm('Eliminare questo punteggio in attesa?')) return;
        try {
            const res = await fetch(`/api/scores/pending?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                showMessage('success', 'Punteggio eliminato');
                fetchData();
            } else {
                showMessage('error', 'Errore eliminazione');
            }
        } catch (e) {
            showMessage('error', 'Errore di rete');
        }
    };

    if (authLoading || (!user || user.role !== 'admin')) return <div className="loading"><div className="spinner"></div></div>;

    const filteredCompetitorsForScoring = competitors
        .filter(c => scoreListType === 'standard' ? c.type !== 'capo_animatore' : c.type === 'capo_animatore')
        .sort((a, b) => a.name.localeCompare(b.name));

    // Ensure index is valid when switching lists
    const validScoreIndex = Math.min(currentScoreIndex, Math.max(0, filteredCompetitorsForScoring.length - 1));
    const currentCompetitorToScore = filteredCompetitorsForScoring[validScoreIndex];

    return (
        <div className="container section">
            <div className="page-header" style={{ marginBottom: 32, borderRadius: 'var(--radius)' }}>
                <h1>🔧 Pannello Organizzatore</h1>
                <p>Gestisci il Fantachicco</p>
            </div>

            {message && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    {message.text}
                </div>
            )}

            <div className="card" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0 }}>Stato Iscrizioni</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>Permetti agli utenti di creare e modificare le squadre.</p>
                </div>
                <button
                    className={`btn ${registrationOpen ? 'btn-danger' : 'btn-success'}`}
                    onClick={handleToggleRegistration}
                >
                    {registrationOpen ? '🔒 Chiudi Iscrizioni' : '🔓 Apri Iscrizioni'}
                </button>
            </div>

            <div className="tabs" style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
                {['assegna', 'organizzatori', 'revisione', 'concorrenti', 'regole', 'storico', 'avvisi'].map(tab => (
                    <button key={tab}
                        className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab(tab)}>
                        {tab === 'organizzatori' ? '👥 Organizzatori' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="card">
                {/* === ASSEGNA PUNTEGGI === */}
                {activeTab === 'assegna' && (
                    <div style={{ paddingBottom: '30vh' }}>
                        <h2 className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>✍️ Assegna Punteggio</span>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'normal', display: 'flex', gap: 10 }}>
                                <label style={{ cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        checked={scoreListType === 'standard'}
                                        onChange={() => { setScoreListType('standard'); setCurrentScoreIndex(0); }}
                                    /> Bambini/Animatori
                                </label>
                                <label style={{ cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        checked={scoreListType === 'capo'}
                                        onChange={() => { setScoreListType('capo'); setCurrentScoreIndex(0); }}
                                    /> Capi Animatori
                                </label>
                            </div>
                        </h2>

                        {currentCompetitorToScore ? (
                            <>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '2px solid var(--border)', marginBottom: 24
                                }}>
                                    <button
                                        className="btn btn-secondary"
                                        disabled={validScoreIndex === 0}
                                        onClick={() => setCurrentScoreIndex(validScoreIndex - 1)}
                                    >
                                        &lt; Prec
                                    </button>

                                    <div style={{ textAlign: 'center' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)' }}>{currentCompetitorToScore.name}</h3>
                                        <span className="tag tag-category" style={{ marginTop: 8 }}>{currentCompetitorToScore.type.replace('_', ' ')}</span>
                                        <div style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                            {validScoreIndex + 1} di {filteredCompetitorsForScoring.length}
                                        </div>
                                    </div>

                                    <button
                                        className="btn btn-secondary"
                                        disabled={validScoreIndex === filteredCompetitorsForScoring.length - 1}
                                        onClick={() => setCurrentScoreIndex(validScoreIndex + 1)}
                                    >
                                        Succ &gt;
                                    </button>
                                </div>
                                <div className="admin-grid" style={{ gridTemplateColumns: '1fr' }}>
                                    <div className="form-group">
                                        <label className="form-label">Tipo di Punteggio</label>
                                        <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <input
                                                    type="radio"
                                                    name="scoreType"
                                                    value="bonus"
                                                    checked={scoreType === 'bonus'}
                                                    onChange={(e) => { setScoreType(e.target.value); setSelectedBonusMalus(''); }}
                                                />
                                                Bonus (+ punti)
                                            </label>
                                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <input
                                                    type="radio"
                                                    name="scoreType"
                                                    value="malus"
                                                    checked={scoreType === 'malus'}
                                                    onChange={(e) => { setScoreType(e.target.value); setSelectedBonusMalus(''); }}
                                                />
                                                Malus (- punti)
                                            </label>
                                        </div>
                                        <select className="admin-select" value={selectedBonusMalus} onChange={(e) => setSelectedBonusMalus(e.target.value)}>
                                            <option value="">Seleziona {scoreType === 'bonus' ? 'un bonus' : 'un malus'}...</option>
                                            {bonusMalus
                                                .filter(bm => scoreType === 'bonus' ? bm.points > 0 : bm.points < 0)
                                                .map(bm => (
                                                    <option key={bm.id} value={bm.id}>{bm.points > 0 ? '+' : ''}{bm.points} - {bm.description}</option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={() => handleAssignScore(currentCompetitorToScore.id)}
                                    disabled={loading || !selectedBonusMalus}
                                    style={{ width: '100%', marginTop: 16 }}
                                >
                                    {loading ? 'Assegnazione...' : `Assegna Punteggio`}
                                </button>
                            </>
                        ) : (
                            <div style={{ padding: 40, textAlign: 'center', background: 'var(--surface)', borderRadius: 12 }}>
                                Nessun concorrente trovato in questa lista.
                            </div>
                        )}
                    </div>
                )}

                {/* === REVISIONE PUNTEGGI === */}
                {activeTab === 'revisione' && (
                    <div>
                        <h2 className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>👀 Revisione Punteggi</span>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => { if (confirm('Svuotare tutti i punteggi in attesa?')) pendingScores.forEach(ps => handleDeletePending(ps.id)) }}
                                    disabled={pendingScores.length === 0}
                                >
                                    🗑️ Svuota Tutto
                                </button>
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleConfirmScores(pendingScores.map(ps => ps.id))}
                                    disabled={pendingScores.length === 0}
                                >
                                    ✅ Conferma Tutti ({pendingScores.length})
                                </button>
                                <button
                                    className={`btn btn-sm ${resultsPublished ? 'btn-secondary' : 'btn-primary'}`}
                                    onClick={handlePublishResults}
                                    style={{fontWeight: 'bold', border: '2px solid white'}}
                                >
                                    {resultsPublished ? '👁️‍🗨️ Nascondi Classifica' : '🚀 Invia i Risultati (LIVE)'}
                                </button>
                            </div>
                        </h2>

                        <p style={{ color: 'var(--text-light)', marginBottom: 20 }}>
                            Questi punteggi sono stati assegnati ma non sono ancora visibili nella classifica.
                            Controllali e confermali per renderli ufficiali.
                        </p>

                        {pendingScores.length > 0 ? (
                            <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                                {Array.from(new Set(pendingScores.map(ps => ps.assignedBy.id))).map(adminId => {
                                    const adminScores = pendingScores.filter(ps => ps.assignedBy.id === adminId);
                                    const adminName = adminScores[0].assignedBy.name;
                                    return (
                                        <div key={adminId} className="card" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                                            <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 15, display: 'flex', justifyContent: 'space-between' }}>
                                                <span>👤 {adminName}</span>
                                                <span className="tag">{adminScores.length}</span>
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                {adminScores.map(ps => (
                                                    <div key={ps.id} className="score-history-item" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
                                                        <div style={{ flex: 1 }}>
                                                            <strong>{ps.competitor.name}</strong>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                                                {ps.bonusMalus.description} ({ps.bonusMalus.points > 0 ? '+' : ''}{ps.bonusMalus.points})
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: 5 }}>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleDeletePending(ps.id)}>🗑️</button>
                                                            <button className="btn btn-sm btn-success" onClick={() => handleConfirmScores([ps.id])}>✅</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ padding: 40, textAlign: 'center', background: 'var(--surface)', borderRadius: 12 }}>
                                Nessun punteggio in attesa di revisione.
                            </div>
                        )}
                    </div>
                )}

                {/* === CONCORRENTI LIST === */}
                {activeTab === 'concorrenti' && (
                    <div>
                        <h2 className="card-title">🎤 Concorrenti</h2>
                        <div style={{ maxHeight: 400, overflowY: 'auto', border: '2px solid var(--border)', borderRadius: 8, marginBottom: 20 }}>
                            {competitors.map(c => (
                                <div key={c.id} className="score-history-item">
                                    <div><strong>{c.name}</strong> <span style={{ fontSize: '0.8em', opacity: 0.7 }}>({c.type})</span> - {c.cost} crediti</div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="btn btn-sm btn-secondary" onClick={() => openEditModal('competitor', c)}>✏️</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete('competitor', c.id)}>🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 className="card-title" style={{ marginTop: 24, fontSize: '1.1rem' }}>Nuovo Concorrente</h3>
                        <div className="admin-grid">
                            <input className="form-input" placeholder="Nome" value={newCompetitor.name} onChange={e => setNewCompetitor({ ...newCompetitor, name: e.target.value })} />
                            <select className="form-input" value={newCompetitor.type} onChange={e => setNewCompetitor({ ...newCompetitor, type: e.target.value })}>
                                <option value="bambino">Bambino</option>
                                <option value="animatore">Animatore</option>
                                <option value="capo_animatore">Capo Animatore</option>
                            </select>
                            <input className="form-input" type="number" placeholder="Costo" value={newCompetitor.cost} onChange={e => setNewCompetitor({ ...newCompetitor, cost: parseInt(e.target.value) })} />
                            <button className="btn btn-primary" onClick={() => handleCreate('competitor')}>Aggiungi</button>
                        </div>
                    </div>
                )}

                {/* === REGOLE LIST === */}
                {activeTab === 'regole' && (
                    <div>
                        <h2 className="card-title">📋 Bonus/Malus</h2>
                        <div style={{ maxHeight: 400, overflowY: 'auto', border: '2px solid var(--border)', borderRadius: 8, marginBottom: 20 }}>
                            {bonusMalus.map(bm => (
                                <div key={bm.id} className="score-history-item">
                                    <div>
                                        <span className={bm.points > 0 ? 'tag tag-bonus' : 'tag tag-malus'}>
                                            {bm.points > 0 ? '+' : ''}{bm.points}
                                        </span> {bm.description}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="btn btn-sm btn-secondary" onClick={() => openEditModal('bonus', bm)}>✏️</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete('bonus', bm.id)}>🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 className="card-title" style={{ marginTop: 24, fontSize: '1.1rem' }}>Nuova Regola</h3>
                        <div className="admin-grid">
                            <input className="form-input" placeholder="Descrizione" value={newBonusMalus.description} onChange={e => setNewBonusMalus({ ...newBonusMalus, description: e.target.value })} />
                            <input className="form-input" type="number" placeholder="Punti" value={newBonusMalus.points} onChange={e => setNewBonusMalus({ ...newBonusMalus, points: parseInt(e.target.value) })} />
                            <input className="form-input" placeholder="Categoria" value={newBonusMalus.category} onChange={e => setNewBonusMalus({ ...newBonusMalus, category: e.target.value })} />
                            <button className="btn btn-primary" onClick={() => handleCreate('bonus')}>Aggiungi</button>
                        </div>
                    </div>
                )}

                {/* === STORICO === */}
                {activeTab === 'storico' && (
                    <div>
                        <h2 className="card-title">📜 Storico Punteggi</h2>
                        <div style={{ maxHeight: 500, overflowY: 'auto', border: '2px solid var(--border)', borderRadius: 8 }}>
                            {scoreHistory.map(event => (
                                <div key={event.id} className="score-history-item">
                                    <div>
                                        <strong>{event.competitor.name}</strong>: {event.bonusMalus.description}
                                        <span style={{ fontWeight: 700, color: event.bonusMalus.points > 0 ? 'var(--success)' : 'var(--danger)', marginLeft: 8 }}>
                                            ({event.bonusMalus.points > 0 ? '+' : ''}{event.bonusMalus.points})
                                        </span>
                                    </div>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete('score', event.id)} title="Elimina assegnazione">🗑️</button>
                                </div>
                            ))}
                            {scoreHistory.length === 0 && <div style={{ padding: 20, textAlign: 'center' }}>Nessun punteggio assegnato</div>}
                        </div>
                    </div>
                )}

                {/* === AVVISI === */}
                {activeTab === 'avvisi' && (
                    <div>
                        <h2 className="card-title">📢 Gestione Avvisi</h2>
                        <div style={{ maxHeight: 400, overflowY: 'auto', border: '2px solid var(--border)', borderRadius: 8, marginBottom: 20 }}>
                            {announcements.map(ann => (
                                <div key={ann.id} className="score-history-item" style={{ display: 'block' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <strong>{ann.title}</strong>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn btn-sm btn-secondary" onClick={() => openEditModal('announcement', ann)}>✏️</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete('announcement', ann.id)}>🗑️</button>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.9em', color: 'var(--text-light)' }}>{ann.content.substring(0, 60)}...</div>
                                    {ann.pinned && <span className="tag tag-category" style={{ marginTop: 4, fontSize: '0.7em' }}>📌 Pinned</span>}
                                </div>
                            ))}
                        </div>

                        <h3 className="card-title" style={{ marginTop: 24, fontSize: '1.1rem' }}>Nuovo Avviso</h3>
                        <div className="form-group">
                            <input className="form-input" style={{ marginBottom: 10 }} placeholder="Titolo" value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} />
                            <textarea className="form-input" style={{ marginBottom: 10, height: 80 }} placeholder="Contenuto" value={newAnnouncement.content} onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} />
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                <input type="checkbox" checked={newAnnouncement.pinned} onChange={e => setNewAnnouncement({ ...newAnnouncement, pinned: e.target.checked })} />
                                Metti in evidenza
                            </label>
                            <button className="btn btn-primary" onClick={() => handleCreate('announcement')}>Pubblica Avviso</button>
                        </div>
                    </div>
                )}

                {/* === ORGANIZZATORI (ex UTENTI) === */}
                {activeTab === 'organizzatori' && (
                    <div>
                        <h2 className="card-title">👥 Gestione Organizzatori</h2>
                        
                        <div className="card" style={{ marginBottom: 24, border: '2px solid var(--primary)', background: 'rgba(var(--primary-rgb), 0.05)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: 15, color: 'var(--primary)' }}>➕ Aggiungi Nuovo Organizzatore</h3>
                            <p style={{fontSize: '0.9rem', marginBottom: 15}}>Crea un account che potrà assegnare punti e gestire il sito.</p>
                            <div className="admin-grid">
                                <input id="newAdminName" className="form-input" placeholder="Nome (es. Admin 2)" />
                                <input id="newAdminEmail" className="form-input" placeholder="Email (es. admin2@fantachicco.it)" />
                                <input id="newAdminPassword" type="password" className="form-input" placeholder="Password" />
                                <button className="btn btn-primary" style={{fontWeight: 'bold'}} onClick={async () => {
                                    const name = document.getElementById('newAdminName').value;
                                    const email = document.getElementById('newAdminEmail').value;
                                    const password = document.getElementById('newAdminPassword').value;
                                    if(!name || !email || !password) return alert('Compila tutti i campi');
                                    
                                    setLoading(true);
                                    try {
                                        const res = await fetch('/api/auth/register', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ name, email, password }),
                                        });
                                        const data = await res.json();
                                        if(res.ok) {
                                            // Ora promuovilo ad admin
                                            const roleRes = await fetch('/api/users', {
                                                method: 'PATCH',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ id: data.id, role: 'admin' }),
                                            });
                                            if(roleRes.ok) {
                                                alert('Organizzatore creato con successo!');
                                                // Svuota i campi
                                                document.getElementById('newAdminName').value = '';
                                                document.getElementById('newAdminEmail').value = '';
                                                document.getElementById('newAdminPassword').value = '';
                                                fetchData();
                                            } else {
                                                alert('Account creato ma errore nella promozione a organizzatore.');
                                            }
                                        } else {
                                            alert('Errore: ' + data.error);
                                        }
                                    } catch(e) { alert('Errore di rete'); }
                                    finally { setLoading(false); }
                                }}>Crea Organizzatore</button>
                            </div>
                        </div>

                        <div style={{ maxHeight: 500, overflowY: 'auto', border: '2px solid var(--border)', borderRadius: 8 }}>
                            {users.map(u => (
                                <div key={u.id} className="score-history-item">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <div><strong>{u.name}</strong> <span style={{ fontSize: '0.8em', opacity: 0.7 }}>({u.role})</span></div>
                                        <div style={{ fontSize: '0.9em' }}>📧 {u.email}</div>
                                        <div style={{ fontSize: '0.9em' }}>🏆 Squadra: <strong>{u.teamName}</strong></div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => setViewingTeam({ userName: u.name, teamName: u.teamName, competitors: u.teamDetails || [] })}
                                            title="Vedi Squadra"
                                        >
                                            👁️ Vedi Squadra
                                        </button>
                                        {u.id !== user.userId && (
                                            <button
                                                className={`btn btn-sm ${u.role === 'admin' ? 'btn-danger' : 'btn-success'}`}
                                                onClick={() => handleToggleRole(u.id, u.role)}
                                                title={u.role === 'admin' ? "Rendi Giocatore" : "Rendi Organizzatore"}
                                            >
                                                {u.role === 'admin' ? '👤 Rendi Giocatore' : '👑 Rendi Organizzatore'}
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete('user', u.id)}
                                            disabled={u.role === 'admin' || u.scoresAssignedCount > 0}
                                            title={u.scoresAssignedCount > 0 ? "Non puoi eliminare chi ha assegnato punteggi" : "Elimina Utente"}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {users.length === 0 && <div style={{ padding: 20, textAlign: 'center' }}>Nessun utente registrato</div>}
                        </div>
                    </div>
                )}
            </div>

            {/* === EDIT MODAL === */}
            {
                showEditModal && editingItem && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
                    }}>
                        <div className="card" style={{ width: '90%', maxWidth: 500 }}>
                            <h2 className="card-title">Modifica Elemento</h2>

                            {editingItem.type === 'competitor' && (
                                <div className="grid" style={{ gap: 16 }}>
                                    <input className="form-input" value={editingItem.data.name} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })} placeholder="Nome" />
                                    <select className="form-input" value={editingItem.data.type} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, type: e.target.value } })}>
                                        <option value="bambino">Bambino</option>
                                        <option value="animatore">Animatore</option>
                                        <option value="capo_animatore">Capo Animatore</option>
                                    </select>
                                    <input className="form-input" type="number" value={editingItem.data.cost} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, cost: parseInt(e.target.value) } })} placeholder="Costo" />
                                </div>
                            )}

                            {editingItem.type === 'bonus' && (
                                <div className="grid" style={{ gap: 16 }}>
                                    <input className="form-input" value={editingItem.data.description} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })} placeholder="Descrizione" />
                                    <input className="form-input" type="number" value={editingItem.data.points} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, points: parseInt(e.target.value) } })} placeholder="Punti" />
                                    <input className="form-input" value={editingItem.data.category} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })} placeholder="Categoria" />
                                </div>
                            )}

                            {editingItem.type === 'announcement' && (
                                <div className="grid" style={{ gap: 16 }}>
                                    <input className="form-input" value={editingItem.data.title} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })} placeholder="Titolo" />
                                    <textarea className="form-input" style={{ height: 100 }} value={editingItem.data.content} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, content: e.target.value } })} placeholder="Contenuto" />
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input type="checkbox" checked={editingItem.data.pinned} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, pinned: e.target.checked } })} />
                                        Pinned
                                    </label>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Annulla</button>
                                <button className="btn btn-primary" onClick={handleUpdate}>Salva Modifiche</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* === VIEW TEAM MODAL === */}
            {viewingTeam && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: 500, maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h2 className="card-title" style={{ margin: 0 }}>🏆 {viewingTeam.teamName}</h2>
                            <button className="btn btn-sm btn-secondary" onClick={() => setViewingTeam(null)}>✕</button>
                        </div>
                        <p style={{ marginBottom: 16, color: 'var(--text-light)' }}>Allenatore: <strong>{viewingTeam.userName}</strong></p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {(viewingTeam.competitors && viewingTeam.competitors.length > 0) ? viewingTeam.competitors.map(c => (
                                <div key={c.id} style={{
                                    padding: '8px 12px',
                                    background: 'var(--background)',
                                    borderRadius: 8,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div>
                                        <strong>{c.name}</strong>
                                        <div style={{ fontSize: '0.8em', opacity: 0.7 }}>{c.type}</div>
                                    </div>
                                    <div style={{ fontWeight: 'bold' }}>{c.cost} cr</div>
                                </div>
                            )) : <p>Nessun giocatore in squadra</p>}
                        </div>

                        <div style={{ marginTop: 24, textAlign: 'right' }}>
                            <button className="btn btn-primary" onClick={() => setViewingTeam(null)}>Chiudi</button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
