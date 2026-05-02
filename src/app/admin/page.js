'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

const RAGAZZE_ANIMATRICI = ['Bruna Baraschini', 'Giorgia Marigliano', 'Eliana', 'Vittoria Femia', 'Paola Fenderico', 'Sara Baraschini', 'Ilaria Salvi'];

const SCALETTA = {
    1: [
        { title: '1 Canzone', participants: ['Giulia Marigliano'], type: 'individual' },
        { title: '2 Canzone', participants: ['Melissa Sorrentino', 'Gioia Capuozzo'], type: 'individual' },
        { title: '3 Canzone', participants: ['Ginevra Ragosta', 'Greta D’Amico'], type: 'individual' },
        { title: '4 Canzone', participants: ['Sara Femia'], type: 'individual' },
        { title: 'Ballo: Ragazze Animatori', participants: RAGAZZE_ANIMATRICI, type: 'group' },
        { title: '5 Canzone', participants: ['Roberto Imperatrice'], type: 'individual' },
        { title: '6 Canzone', participants: ['Simona Loffredo'], type: 'individual' },
        { title: '7 Canzone', participants: ['Alessia Ruocco'], type: 'individual' },
        { title: '8 Canzone', participants: ['Bruna Baraschini'], type: 'individual' },
        { title: 'Sketch: Alessia, Gabriele, Luigi', participants: ['Alessia Ruocco', 'Gabriele Piccolo', 'Luigi Bianco'], type: 'individual' },
        { title: 'Ballo: Gruppo Gaia', participants: ['Gaia Ciccone', 'Aurora Oncia', 'Lavinia Foria', 'Bianca Buonadosa', 'Giuseppe Montella', 'Ambra Girone', 'Giulia Guariniello'], type: 'group' },
        { title: '9 Canzone', participants: ['Conny Barnaba'], type: 'individual' },
        { title: '10 Canzone', participants: ['Ambra Girone'], type: 'individual' },
        { title: '11 Canzone', participants: ['Giorgia Ciccone', 'Mattia Sarpa', 'Mayra Sarpa'], type: 'individual' },
        { title: '12 Canzone', participants: ['Giorgia Marigliano'], type: 'individual' },
        { title: '13 Canzone', participants: ['Lucia De Martino', 'Anna Martone'], type: 'individual' },
        { title: 'Ballo Mary Mola', participants: ['Aurora Gherardi', 'Federica Ruocco', 'Marta Catello', 'Melissa Sorrentino', 'Sophia Calemma', 'Benedetta Bracale', 'Greta D’Amico', 'Gioiavittoria', 'Conny Barnaba', 'Aurora Mazza', 'Gioia Capuozzo', 'Ginevra Ragosta'], type: 'group' },
        { title: '14 Canzone', participants: ['Gaia Ciccone'], type: 'individual' },
        { title: '15 Canzone', participants: ['Luigi Bianco', 'Sasy Ragosta'], type: 'individual' },
        { title: '16 Canzone', participants: ['Aurora Gherardi'], type: 'individual' },
        { title: '17 Canzone', participants: ['Maria Mola'], type: 'individual' },
        { title: 'Sketch Vittoria e Sasy', participants: ['Vittoria De Rosa', 'Sasy Ragosta'], type: 'individual' },
        { title: 'Ballo: Gruppo Ragazze Animatori', participants: RAGAZZE_ANIMATRICI, type: 'group' },
        { title: '18 Canzone', participants: ['Bianca Buonadosa', 'Lavinia Foria'], type: 'individual' },
        { title: '19 Canzone', participants: ['Marta Catello', 'Sophia Calemma'], type: 'individual' },
        { title: '20 Canzone', participants: ['Benedetta Bracale'], type: 'individual' },
        { title: '21 Canzone', participants: ['Eliana'], type: 'individual' },
        { title: 'Ballo Sara Fierro', participants: ['Gaia Ciccone', 'Aurora Oncia', 'Lavinia Foria', 'Bianca Buonadosa', 'Giuseppe Montella', 'Ambra Girone', 'Giulia Guariniello'], type: 'group' },
        { title: '22 Canzone', participants: ['Giuseppe Montella'], type: 'individual' },
        { title: '23 Canzone', participants: ['Vittoria De Rosa'], type: 'individual' },
        { title: '24 Canzone', participants: ['Aurora Oncia'], type: 'individual' },
        { title: '25 Canzone', participants: ['Vittoria Femia'], type: 'individual' },
    ],
    2: [
        { title: 'Presentazione', participants: ['Vincenzo Duca', 'Emanuele Fierro'], type: 'individual' },
        { title: 'Ballo: Ragazze Animatori', participants: RAGAZZE_ANIMATRICI, type: 'group' },
        { title: '1 Canzone', participants: ['Anna Martone', 'Gaia Ciccone', 'Benedetta', 'Suor Barbara'], type: 'individual' },
        { title: '2 Canzone', participants: ['Sasy Ragosta', 'Don Giorgio', 'Piero'], type: 'individual' },
        { title: '3 Canzone', participants: ['Conny Barnaba', 'Giorgia Ciccone'], type: 'individual' },
        { title: 'Sketch', participants: ['Greta De Maria', 'Mariafrancesca Aloise', 'Carmine Raia'], type: 'individual' },
        { title: 'Ballo Mary Mola', participants: ['Mary Mola'], type: 'group' },
        { title: '4 Canzone', participants: ['Roberto Imperatrice', 'Luigi Bianco'], type: 'individual' },
        { title: '5 Canzone', participants: ['Giuseppe Montella', 'Giulia Marigliano', 'Lucia De Martino'], type: 'individual' },
        { title: 'Ballo Sara Fierro', participants: ['Sara Fierro'], type: 'group' },
        { title: '6 Canzone', participants: ['Ilaria Salvi', 'Sara Baraschini'], type: 'individual' },
        { title: '7 Canzone', participants: ['Don Giorgio', 'Don Michele', 'Suor Barbara'], type: 'individual' },
        { title: 'Ballo Sara Fierro', participants: ['Sara Fierro'], type: 'group' },
        { title: '8 Canzone', participants: ['Emanuele Fierro', 'Vittoria Femia', 'Bruna Baraschini'], type: 'individual' },
        { title: '9 Canzone', participants: ['Vittoria De Rosa', 'Eliana Duca'], type: 'individual' },
        { title: '10 Canzone', participants: ['Mayra Sarpa', 'Mattia Sarpa', 'Ilaria Salvi'], type: 'individual' },
        { title: 'Sketch Mamme', participants: ['Lucia De Martino', 'Anna Martone'], type: 'individual' },
        { title: 'Ballo Don Michele', participants: ['Don Michele'], type: 'group' },
        { title: 'Ballo Mary Mola', participants: ['Mary Mola'], type: 'group' },
        { title: '11 Canzone', participants: ['Aurora Oncia', 'Aurora Gherardi', 'Simona Loffredo'], type: 'individual' },
        { title: '12 Canzone', participants: ['Vincenzo Duca', 'Mary Mola', 'Lavinia Foria', 'Bianca'], type: 'individual' },
        { title: '13 Canzone', participants: ['Alessia Ruocco', 'Sara Femia', 'Ambra Girone'], type: 'individual' },
        { title: 'Ballo Ragazze Animatori', participants: RAGAZZE_ANIMATRICI, type: 'group' },
        { title: 'Ballo Mamme', participants: ['Mamme'], type: 'group' },
        { title: 'Sketch', participants: ['Da Definire'], type: 'individual' },
        { title: '14 Canzone', participants: ['Marta Catello', 'Sophia Calemma'], type: 'individual' },
        { title: '15 Canzone', participants: ['Melissa Sorrentino', 'Gioia Capuozzo', 'Don Michele'], type: 'individual' },
        { title: '16 Canzone', participants: ['Giorgia Marigliano', 'Greta D\'Amico', 'Sara Baraschini'], type: 'individual' },
    ]
};

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('scaletta'); // scaletta, organizzatori, revisione, concorrenti, regole, storico, avvisi
    const [selectedPerformance, setSelectedPerformance] = useState(null);
    const [extraSearch, setExtraSearch] = useState('');
    const [lastConfirmedIds, setLastConfirmedIds] = useState([]);

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
    const [bmSearch, setBmSearch] = useState('');
    const [selectedDay, setSelectedDay] = useState(2);
    const [dailyLeaderboard, setDailyLeaderboard] = useState({ 1: [], 2: [] });

    const [competitorRanking, setCompetitorRanking] = useState([]);

    // Edit/Delete State
    const [editingItem, setEditingItem] = useState(null); // { type: 'competitor' | 'bonus' | 'announcement', data: ... }

    const [showEditModal, setShowEditModal] = useState(false);
    const [viewingTeam, setViewingTeam] = useState(null); // { userName: string, teamName: string, competitors: [] }
    const [showAdminDetails, setShowAdminDetails] = useState(false);
    const [userSearch, setUserSearch] = useState('');


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

            if (compRes.ok) { 
                const data = await compRes.json(); 
                setCompetitors(data.competitors || []); 
                setCompetitorRanking((data.competitors || []).sort((a, b) => b.totalPoints - a.totalPoints));
            }
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
            
            // Fetch daily leaderboards and final
            const [lb1Res, lb2Res, lbFinalRes] = await Promise.all([
                fetch('/api/leaderboard?day=1', { cache: 'no-store' }),
                fetch('/api/leaderboard?day=2', { cache: 'no-store' }),
                fetch('/api/leaderboard', { cache: 'no-store' }) // No day = Final
            ]);
            if (lb1Res.ok) { const data = await lb1Res.json(); setDailyLeaderboard(prev => ({ ...prev, 1: data.leaderboard || [] })); }
            if (lb2Res.ok) { const data = await lb2Res.json(); setDailyLeaderboard(prev => ({ ...prev, 2: data.leaderboard || [] })); }
            if (lbFinalRes.ok) { const data = await lbFinalRes.json(); setDailyLeaderboard(prev => ({ ...prev, final: data.leaderboard || [] })); }


        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    // Funzione robusta per trovare un concorrente per nome
    const findCompetitorByName = (name) => {
        if (!name) return null;
        const normalize = (s) => s.toLowerCase().replace(/['’‘`]/g, "'").trim();
        const searchName = normalize(name);
        
        return competitors.find(c => {
            const dbName = normalize(c.name);
            return dbName.includes(searchName) || searchName.includes(dbName);
        });
    };

    const renderBonusMalusList = (isBonus, participants) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {bonusMalus
                    .filter(bm => isBonus ? bm.points > 0 : bm.points < 0)
                    .filter(bm => bm.description.toLowerCase().includes(bmSearch.toLowerCase()))
                    .sort((a, b) => isBonus ? b.points - a.points : a.points - b.points)
                    .map(bm => (
                        <button 
                            key={bm.id} 
                            className="btn btn-secondary btn-sm" 
                            style={{ 
                                width: '100%', 
                                justifyContent: 'flex-start', 
                                textAlign: 'left', 
                                height: 'auto', 
                                padding: '12px 16px', 
                                fontSize: '1rem',
                                borderLeft: `5px solid ${isBonus ? 'var(--success)' : 'var(--danger)'}`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                marginBottom: 4
                            }}
                            onClick={() => {
                                const ids = participants
                                    .map(pName => findCompetitorByName(pName)?.id)
                                    .filter(id => id !== undefined);
                                handleAssignScore(null, bm.id, ids);
                            }}
                        >
                            <span style={{ fontWeight: '900', color: isBonus ? 'var(--success)' : 'var(--danger)', minWidth: '45px', fontSize: '1.2rem' }}>
                                {isBonus ? '+' : ''}{bm.points}
                            </span>
                            <span style={{ marginLeft: 8, fontWeight: '500' }}>{bm.description}</span>
                        </button>
                    ))
                }
            </div>
        );
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

    const handleAssignScore = async (competitorId, bonusMalusId, multiIds = null) => {
        const bmId = bonusMalusId || selectedBonusMalus;
        const ids = multiIds || (competitorId ? [parseInt(competitorId)] : []);
        
        if (ids.length === 0 || !bmId) {
            showMessage('error', 'Seleziona almeno un concorrente e un bonus/malus');
            return;
        }
        
        setLoading(true);
        try {
            const res = await fetch('/api/scores/pending', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    competitorIds: ids,
                    bonusMalusId: parseInt(bmId),
                    day: selectedDay
                }),
            });
            if (res.ok) {
                showMessage('success', ids.length > 1 ? `Punteggi assegnati al gruppo (${ids.length})!` : 'Punteggio aggiunto!');
                setSelectedBonusMalus('');
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
                setLastConfirmedIds(ids); 
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

    const handleUndoConfirmation = async () => {
        if (!lastConfirmedIds.length) return;
        if (!confirm('Vuoi davvero annullare l\'ultima conferma? I punti torneranno provvisori.')) return;
        
        setLoading(true);
        try {
            const res = await fetch('/api/scores/undo-confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: lastConfirmedIds }),
            });
            
            if (res.ok) {
                showMessage('success', 'Conferma annullata! I punti sono di nuovo provvisori.');
                setLastConfirmedIds([]);
                fetchData();
                setActiveTab('scaletta');
            } else {
                const data = await res.json();
                showMessage('error', data.error || 'Impossibile annullare');
            }
        } catch (e) { showMessage('error', 'Errore durante l\'annullamento'); }
        finally { setLoading(false); }
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

    const handleClearAllPending = async () => {
        if (!confirm('VUOI SVUOTARE TUTTA LA REVISIONE? Questa azione non può essere annullata.')) return;
        
        setLoading(true);
        try {
            const res = await fetch('/api/scores/pending/clear', { method: 'POST' });
            if (res.ok) {
                showMessage('success', 'Revisione svuotata!');
                fetchData();
            } else {
                showMessage('error', 'Errore nella pulizia');
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

    const getConsensusScores = () => {
        const admin2 = users.filter(u => u.role === 'admin')[1]; // Il secondo admin nella lista
        const admin2Id = admin2 ? admin2.id : null;

        const groups = {};
        pendingScores.forEach(ps => {
            const key = `${ps.competitorId}-${ps.bonusMalusId}-${ps.day}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(ps);
        });

        return Object.values(groups)
            .filter(group => {
                const uniqueAdmins = new Set(group.map(s => s.assignedById));
                const isMalus = group[0].bonusMalus.points < 0;
                const putByAdmin2 = admin2Id && group.some(s => s.assignedById === admin2Id);

                // Regola: Almeno 2 admin OPPURE è un Malus messo dall'Admin 2
                return uniqueAdmins.size >= 2 || (isMalus && putByAdmin2);
            })
            .map(group => ({
                ...group[0],
                voters: [...new Set(group.map(s => s.assignedBy.name))],
                allIds: group.map(s => s.id)
            }))
            .sort((a, b) => a.competitor.name.localeCompare(b.competitor.name));
    };

    const handleConfirmConsensus = async () => {
        const consensus = getConsensusScores();
        if (consensus.length === 0) return alert("Nessun punteggio ha raggiunto il consenso (almeno 2 admin).");
        
        const allIdsToRemove = consensus.flatMap(c => c.allIds);
        const representativeIds = consensus.map(c => c.id);

        if (!confirm(`Stai per confermare ${consensus.length} punteggi validati. Verranno rimosse ${allIdsToRemove.length} voci totali dalla revisione. Continuare?`)) return;

        setLoading(true);
        try {
            // Confermiamo solo i rappresentanti (per creare 1 ScoreEvent)
            const res = await fetch('/api/scores/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: representativeIds }),
            });

            if (res.ok) {
                // Eliminiamo i restanti duplicati che non sono stati confermati
                const otherIds = allIdsToRemove.filter(id => !representativeIds.includes(id));
                if (otherIds.length > 0) {
                    await Promise.all(otherIds.map(id => 
                        fetch(`/api/scores/pending?id=${id}`, { method: 'DELETE' })
                    ));
                }
                showMessage('success', 'Consenso confermato e pulizia completata!');
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

    const handleConfirmAndPublish = async () => {
        const consensus = getConsensusScores();
        if (consensus.length === 0 && pendingScores.length > 0) {
            if (!confirm("Attenzione: Nessun punteggio ha raggiunto il consenso. Se procedi, i punteggi in sospeso rimarranno tali. Continuare?")) return;
        }

        if (!confirm(`🚀 STAI PER PUBBLICARE I RISULTATI FINALI ONLINE.\n\nOperazioni che verranno eseguite:\n1. Conferma di ${consensus.length} punteggi validati.\n2. Pulizia dei duplicati.\n3. Pubblicazione della classifica ufficiale.\n\nSEI SICURO?`)) return;

        setLoading(true);
        try {
            // 1. Conferma i punteggi consensuali
            if (consensus.length > 0) {
                const representativeIds = consensus.map(c => c.id);
                const allIdsToRemove = consensus.flatMap(c => c.allIds);

                const resConfirm = await fetch('/api/scores/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: representativeIds }),
                });

                if (resConfirm.ok) {
                    const otherIds = allIdsToRemove.filter(id => !representativeIds.includes(id));
                    if (otherIds.length > 0) {
                        await Promise.all(otherIds.map(id => 
                            fetch(`/api/scores/pending?id=${id}`, { method: 'DELETE' })
                        ));
                    }
                }
            }

            // 2. Pubblica i risultati
            const resPublish = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resultsPublished: true })
            });

            if (resPublish.ok) {
                setResultsPublished(true);
                showMessage('success', '🚀 RISULTATI PUBBLICATI ONLINE CON SUCCESSO!');
                fetchData();
                setActiveTab('revisione');
            }
        } catch (e) {
            showMessage('error', 'Errore durante la pubblicazione');
        } finally {
            setLoading(false);
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
                {['scaletta', 'organizzatori', 'revisione', 'concorrenti', 'regole', 'storico', 'avvisi', 'dettaglio_g1'].map(tab => (
                    <button key={tab}
                        className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab(tab)}>
                        {tab === 'organizzatori' ? '👥 Organizzatori' : 
                         tab === 'scaletta' ? '📋 Scaletta' : 
                         tab === 'dettaglio_g1' ? '📊 Dettaglio G1' :
                         tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* === SEZIONE PRESENTATORI SEMPRE VISIBILE === */}
            <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, var(--primary), #6366f1)', color: 'white', position: 'sticky', top: '10px', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button 
                            className={`btn ${activeTab === 'scaletta' ? 'btn-primary' : ''}`}
                            style={{ background: activeTab === 'scaletta' ? 'white' : 'rgba(255,255,255,0.2)', color: activeTab === 'scaletta' ? 'var(--primary)' : 'white', border: '1px solid white', fontWeight: 'bold' }}
                            onClick={() => setActiveTab('scaletta')}
                        >
                            📋 SCALETTA
                        </button>
                        <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.3)' }}></div>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>🎙️ PRESENTATORI:</h3>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {['Vincenzo Duca', 'Anna Martone'].map(name => {
                            const comp = competitors.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
                            const isActive = activeTab === 'assegna' && currentCompetitorToScore?.id === comp?.id;
                            return comp ? (
                                <button 
                                    key={comp.id} 
                                    className="btn" 
                                    style={{ 
                                        background: isActive ? 'white' : 'rgba(255,255,255,0.2)', 
                                        border: '1px solid white', 
                                        color: isActive ? 'var(--primary)' : 'white',
                                        fontWeight: isActive ? 'bold' : 'normal'
                                    }}
                                    onClick={() => {
                                        setActiveTab('scaletta');
                                        setSelectedPerformance({
                                            title: `🎙️ Presentatore: ${name}`,
                                            participants: [name],
                                            type: 'individual'
                                        });
                                    }}
                                >
                                    {name}
                                </button>
                            ) : null;
                        })}
                    </div>
                </div>
            </div>

            <div className="card">
                {activeTab === 'scaletta' && (
                    <div style={{ maxWidth: '100%', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 className="card-title" style={{ margin: 0 }}>📋 Scaletta e Punteggi</h2>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>📅 Giorno:</span>
                                <button className={`btn btn-sm ${selectedDay === 1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedDay(1)}>1</button>
                                <button className={`btn btn-sm ${selectedDay === 2 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedDay(2)}>2</button>
                            </div>
                        </div>
                        
                        <div className="admin-grid" style={{ gridTemplateColumns: '220px 1fr', gap: 24 }}>
                            {/* LISTA SCALETTA */}
                            <div style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: 10, borderRight: '1px solid var(--border)' }}>
                                {/* TASTO EXTRA / TUTTI */}
                                <div 
                                    onClick={() => setSelectedPerformance({ title: '✨ EXTRA / TUTTI', type: 'extra' })}
                                    style={{ 
                                        padding: '12px', 
                                        marginBottom: 12, 
                                        borderRadius: 8, 
                                        cursor: 'pointer',
                                        border: '2px solid var(--primary)',
                                        background: selectedPerformance?.title === '✨ EXTRA / TUTTI' ? 'var(--primary)' : 'rgba(var(--primary-rgb), 0.1)',
                                        color: selectedPerformance?.title === '✨ EXTRA / TUTTI' ? 'white' : 'var(--primary)',
                                        textAlign: 'center',
                                        fontWeight: '900',
                                        fontSize: '0.9rem',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    🔍 EXTRA / TUTTI
                                </div>

                                <div style={{ height: '1px', background: 'var(--border)', marginBottom: 12 }}></div>

                                {SCALETTA[selectedDay]?.map((perf, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setSelectedPerformance(perf)}
                                        style={{ 
                                            padding: '10px 12px', 
                                            marginBottom: 6, 
                                            borderRadius: 8, 
                                            cursor: 'pointer',
                                            border: '1px solid var(--border)',
                                            background: selectedPerformance?.title === perf.title ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--surface)',
                                            borderColor: selectedPerformance?.title === perf.title ? 'var(--primary)' : 'var(--border)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 4
                                        }}
                                    >
                                        <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{perf.title}</div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {perf.participants.join(', ')}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* DETTAGLIO ASSEGNAZIONE */}
                            <div style={{ flex: 1 }}>
                                {selectedPerformance ? (
                                    <div className="card" style={{ border: '2px solid var(--primary)', position: 'sticky', top: 20, maxHeight: '85vh', overflowY: 'auto' }}>
                                        <div style={{ marginBottom: 16 }}>
                                            <h3 style={{ color: 'var(--primary)', margin: 0 }}>{selectedPerformance.title}</h3>
                                            <span className={`tag ${selectedPerformance.type === 'group' ? 'tag-category' : ''}`} style={{ fontSize: '0.75rem', marginTop: 4 }}>
                                                {selectedPerformance.type === 'group' ? 'PUNTEGGIO DI GRUPPO' : 'PUNTEGGI INDIVIDUALI'}
                                            </span>
                                        </div>

                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            placeholder="🔍 Cerca Bonus/Malus..." 
                                            value={bmSearch}
                                            onChange={(e) => setBmSearch(e.target.value)}
                                            style={{ marginBottom: 20 }}
                                        />

                                        {selectedPerformance.type === 'extra' ? (
                                            /* MODALITÀ EXTRA: CERCA TRA TUTTI I CONCORRENTI */
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                                <div style={{ background: 'rgba(var(--primary-rgb), 0.05)', padding: 16, borderRadius: 12 }}>
                                                    <h4 style={{ marginBottom: 12 }}>🔍 Cerca Concorrente Fuori Scaletta:</h4>
                                                    <input 
                                                        type="text" 
                                                        className="form-input" 
                                                        placeholder="Inserisci il nome (es. Giulia...)" 
                                                        value={extraSearch}
                                                        onChange={(e) => setExtraSearch(e.target.value)}
                                                        style={{ marginBottom: 16 }}
                                                    />
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: '200px', overflowY: 'auto', padding: 4 }}>
                                                        {competitors
                                                            .filter(c => c.name.toLowerCase().includes(extraSearch.toLowerCase()))
                                                            .sort((a, b) => a.name.localeCompare(b.name))
                                                            .map(c => (
                                                                <button 
                                                                    key={c.id} 
                                                                    className={`btn btn-sm ${selectedPerformance.participants?.includes(c.name) ? 'btn-primary' : 'btn-secondary'}`}
                                                                    onClick={() => setSelectedPerformance({ ...selectedPerformance, participants: [c.name] })}
                                                                >
                                                                    {c.name}
                                                                </button>
                                                            ))
                                                        }
                                                    </div>
                                                </div>

                                                {selectedPerformance.participants?.[0] && (
                                                    <div style={{ background: 'var(--surface)', padding: 20, borderRadius: 12, border: '2px solid var(--primary)' }}>
                                                        <h4 style={{ marginBottom: 16, color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: 10 }}>
                                                            ✨ Assegna a: {selectedPerformance.participants[0]}
                                                        </h4>
                                                        <div className="grid grid-2" style={{ gap: 16 }}>
                                                            <div>
                                                                <h5 style={{ color: 'var(--success)', marginBottom: 10 }}>🟢 Bonus</h5>
                                                                {renderBonusMalusList(true, [selectedPerformance.participants[0]])}
                                                            </div>
                                                            <div>
                                                                <h5 style={{ color: 'var(--danger)', marginBottom: 10 }}>🔴 Malus</h5>
                                                                {renderBonusMalusList(false, [selectedPerformance.participants[0]])}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : selectedPerformance.type === 'group' ? (
                                            /* MODALITÀ GRUPPO: UNA SOLA LISTA PER TUTTI */
                                            <div style={{ background: 'rgba(var(--primary-rgb), 0.03)', padding: 16, borderRadius: 12 }}>
                                                <h4 style={{ marginBottom: 12, fontSize: '0.9rem' }}>👥 Gruppo: {selectedPerformance.participants.join(', ')}</h4>
                                                <div className="grid grid-2" style={{ gap: 12 }}>
                                                    <div>
                                                        <h5 style={{ color: 'var(--success)', marginBottom: 8, fontSize: '0.8rem' }}>🟢 Bonus Gruppo</h5>
                                                        {renderBonusMalusList(true, selectedPerformance.participants)}
                                                    </div>
                                                    <div>
                                                        <h5 style={{ color: 'var(--danger)', marginBottom: 8, fontSize: '0.8rem' }}>🔴 Malus Gruppo</h5>
                                                        {renderBonusMalusList(false, selectedPerformance.participants)}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* MODALITÀ INDIVIDUALE: UNA LISTA PER OGNI BAMBINO */
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                                {selectedPerformance.participants.map(name => {
                                                    const comp = findCompetitorByName(name);
                                                    
                                                    return (
                                                        <div key={name} style={{ background: 'var(--surface)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
                                                            <h4 style={{ marginBottom: 12, color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                                                                👤 {name} {!comp && <span style={{ color: 'var(--danger)', fontSize: '0.7rem' }}>⚠️ Non trovato</span>}
                                                            </h4>
                                                            <div className="grid grid-2" style={{ gap: 12 }}>
                                                                <div>
                                                                    <h5 style={{ color: 'var(--success)', marginBottom: 8, fontSize: '0.75rem' }}>🟢 Bonus {name.split(' ')[0]}</h5>
                                                                    {renderBonusMalusList(true, [name])}
                                                                </div>
                                                                <div>
                                                                    <h5 style={{ color: 'var(--danger)', marginBottom: 8, fontSize: '0.75rem' }}>🔴 Malus {name.split(' ')[0]}</h5>
                                                                    {renderBonusMalusList(false, [name])}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', borderRadius: 12, opacity: 0.5, minHeight: '300px' }}>
                                        Seleziona un\'esibizione dalla lista a sinistra
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* === REVISIONE PUNTEGGI === */}
                {activeTab === 'revisione' && (
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div className="page-header" style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)', color: 'white', marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px' }}>
                            <div>
                                <h1 style={{ color: 'white', marginBottom: 5 }}>🏁 Revisione Finale e Invio</h1>
                                <p style={{ opacity: 0.9 }}>Controlla la tabella unica e pubblica i risultati online</p>
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid white' }} onClick={() => setActiveTab('scaletta')}>⬅️ Torna Indietro</button>
                                <button
                                    className="btn btn-danger"
                                    style={{ background: '#c0392b', border: 'none' }}
                                    onClick={handleClearAllPending}
                                    disabled={pendingScores.length === 0}
                                >
                                    🗑️ Svuota Tutto
                                </button>
                                <button 
                                    className="btn" 
                                    style={{ background: 'white', color: '#27ae60', fontWeight: '900', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', border: 'none', padding: '10px 25px' }}
                                    onClick={handleConfirmAndPublish}
                                    disabled={loading}
                                >
                                    🚀 PUBBLICA RISULTATI ONLINE
                                </button>
                            </div>
                        </div>

                        {message && (
                            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 24 }}>
                                {message.text}
                            </div>
                        )}

                        <div className="card" style={{ padding: 0, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '2px solid #27ae60' }}>
                            <div style={{ padding: '20px 25px', background: '#f8f9fa', borderBottom: '2px solid #27ae60', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: 0, color: '#27ae60', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    ✨ TABELLA UNICA PUNTEGGI VALIDATI
                                    <span className="tag" style={{ background: '#27ae60', color: 'white' }}>{getConsensusScores().length} Punti Totali</span>
                                </h2>
                                <div style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                                    Regola: consenso 2/3 + Malus Admin 2
                                </div>
                            </div>
                            
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f1f3f5', textAlign: 'left' }}>
                                            <th style={{ padding: '15px 25px', color: '#495057' }}>Concorrente</th>
                                            <th style={{ padding: '15px 25px', color: '#495057' }}>Bonus / Malus</th>
                                            <th style={{ padding: '15px 25px', color: '#495057', textAlign: 'center' }}>Valore</th>
                                            <th style={{ padding: '15px 25px', color: '#495057', textAlign: 'center' }}>Giorno</th>
                                            <th style={{ padding: '15px 25px', color: '#495057' }}>Assegnato da</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getConsensusScores().map((cs, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #e9ecef', background: idx % 2 === 0 ? 'white' : '#fafbfc' }}>
                                                <td style={{ padding: '15px 25px', fontWeight: 'bold', color: 'var(--primary)' }}>{cs.competitor.name}</td>
                                                <td style={{ padding: '15px 25px' }}>{cs.bonusMalus.description}</td>
                                                <td style={{ padding: '15px 25px', textAlign: 'center' }}>
                                                    <span style={{ 
                                                        fontWeight: '900', 
                                                        fontSize: '1.1rem',
                                                        color: cs.bonusMalus.points > 0 ? '#27ae60' : '#e74c3c',
                                                        background: cs.bonusMalus.points > 0 ? '#e8f5e9' : '#fdedec',
                                                        padding: '4px 10px',
                                                        borderRadius: '6px'
                                                    }}>
                                                        {cs.bonusMalus.points > 0 ? '+' : ''}{cs.bonusMalus.points}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '15px 25px', textAlign: 'center' }}>
                                                    <span className="tag" style={{ background: '#dee2e6', color: '#495057' }}>Giorno {cs.day}</span>
                                                </td>
                                                <td style={{ padding: '15px 25px' }}>
                                                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                                        {cs.voters.map(v => (
                                                            <span key={v} style={{ fontSize: '0.7rem', background: '#e9ecef', padding: '2px 8px', borderRadius: '4px', color: '#495057' }}>{v}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {getConsensusScores().length === 0 && (
                                            <tr>
                                                <td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#adb5bd', fontSize: '1.1rem' }}>
                                                    📭 Nessun punteggio validato trovato. Assicurati che almeno 2 admin abbiano segnato lo stesso punto.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div style={{ marginTop: 40, textAlign: 'center' }}>
                            <button 
                                className="btn btn-sm btn-secondary" 
                                onClick={() => setShowAdminDetails(!showAdminDetails)}
                                style={{ background: 'transparent', color: '#666', border: '1px solid #ddd' }}
                            >
                                {showAdminDetails ? '🔼 Nascondi Dettaglio Admin' : '🔽 Mostra Dettaglio Singoli Admin'}
                            </button>
                        </div>

                        {showAdminDetails && (
                            <div style={{ marginTop: 30 }}>
                                <div style={{ marginBottom: 15, opacity: 0.6, fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
                                    Punteggi Inseriti dai singoli Admin (Dettaglio):
                                </div>
                                <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                                    {[1, 2, 3].map(i => {
                                        const admin = users.filter(u => u.role === 'admin')[i-1];
                                        if (!admin && i > 1) return <div key={i} className="card" style={{opacity: 0.5, border: '1px dashed var(--border)', textAlign: 'center', padding: 40}}>Slot Admin {i} Libero</div>;
                                        
                                        const adminId = admin ? admin.id : -1;
                                        const adminName = admin ? admin.name : `Admin ${i}`;
                                        const adminScores = pendingScores.filter(ps => ps.assignedBy.id === adminId);

                                        return (
                                            <div key={i} className="card" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                                                <h3 style={{ fontSize: '0.9rem', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 15, display: 'flex', justifyContent: 'space-between', color: '#444' }}>
                                                    <span>👤 {adminName}</span>
                                                    <span className="tag" style={{background: '#666', color: 'white'}}>{adminScores.length}</span>
                                                </h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '300px', overflowY: 'auto' }}>
                                                    {adminScores.length > 0 ? adminScores.map(ps => (
                                                        <div key={ps.id} className="score-history-item" style={{ padding: '8px 12px', fontSize: '0.75rem', flexDirection: 'column', alignItems: 'flex-start', background: '#f8f9fa' }}>
                                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                                                <strong>{ps.competitor.name}</strong>
                                                                <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>G{ps.day}</span>
                                                            </div>
                                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                                                                <div style={{ fontSize: '0.7rem', color: '#666' }}>
                                                                    {ps.bonusMalus.description} ({ps.bonusMalus.points})
                                                                </div>
                                                                <button className="btn btn-sm btn-danger" style={{padding: '2px 4px', fontSize: '0.6rem'}} onClick={() => handleDeletePending(ps.id)}>🗑️</button>
                                                            </div>
                                                        </div>
                                                    )) : <div style={{textAlign: 'center', padding: 20, opacity: 0.5, fontSize: '0.8rem'}}>Vuoto</div>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: 48 }}>
                            <h2 className="card-title" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                🏆 Classifiche Parziali (Solo Admin)
                            </h2>
                            <p style={{marginBottom: 20, fontSize: '0.9rem', color: 'var(--text-light)'}}>Qui puoi vedere come sarebbe la classifica se confermassi i punti ora. Non visibile ai giocatori.</p>
                            
                            <div className="grid grid-3" style={{ gap: 20 }}>
                                {[1, 2, 'final'].map(day => (
                                    <div key={day} className="card" style={{ background: 'white', border: day === 'final' ? '3px solid var(--primary)' : '1px solid var(--border)' }}>
                                        <h3 style={{ marginBottom: 16, textAlign: 'center', borderBottom: '2px solid var(--border)', paddingBottom: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                                            {day === 'final' ? (
                                                <>
                                                    <span style={{ fontSize: '1.2rem' }}>🏆 Classifica FINALE</span>
                                                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>(Totale: {dailyLeaderboard[day]?.length || 0} squadre)</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>☀️ Classifica Giorno {day}</span>
                                                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>(Totale: {dailyLeaderboard[day]?.length || 0} squadre)</span>
                                                </>
                                            )}
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '800px', overflowY: 'auto', paddingRight: 5 }}>
                                            {dailyLeaderboard[day] && dailyLeaderboard[day].map((team, idx) => (
                                                <div key={team.teamId} style={{ display: 'flex', flexDirection: 'column', padding: '8px 10px', background: idx < 3 ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent', borderRadius: 6, marginBottom: 4, border: idx === 0 && day === 'final' ? '1px solid var(--primary)' : 'none' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '0.85rem' }}>{idx + 1}. <strong>{team.teamName}</strong></span>
                                                        <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>{team.totalPoints} pt</span>
                                                    </div>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginTop: 2 }}>
                                                        👤 {team.competitors.find(c => c.isCaptain)?.name || 'No Cap'}
                                                    </div>
                                                </div>
                                            ))}
                                            {(!dailyLeaderboard[day] || dailyLeaderboard[day].length === 0) && <div style={{textAlign: 'center', opacity: 0.5}}>Ancora nessun dato</div>}
                                        </div>
                                        {day === 'final' && (
                                            <div style={{ marginTop: 20, paddingTop: 15, borderTop: '2px solid var(--border)' }}>
                                                <button 
                                                    className={`btn btn-block ${resultsPublished ? 'btn-secondary' : 'btn-primary'}`}
                                                    onClick={handlePublishResults}
                                                    style={{ fontWeight: '900', fontSize: '0.9rem' }}
                                                >
                                                    {resultsPublished ? '👁️ Nascondi Risultati' : '🚀 PUBBLICA CLASSIFICA LIVE'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: 48 }}>
                            <h2 className="card-title" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                👤 Classifica Singoli Concorrenti (Solo Admin)
                            </h2>
                            <p style={{marginBottom: 20, fontSize: '0.9rem', color: 'var(--text-light)'}}>Punteggi totali accumulati da ogni singolo concorrente.</p>
                            
                            <div className="card" style={{ background: 'white', padding: 0, overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                                        <tr>
                                            <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem' }}>Pos.</th>
                                            <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem' }}>Concorrente</th>
                                            <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem' }}>Tipo</th>
                                            <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '0.85rem' }}>Punti Totali</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {competitorRanking.map((comp, idx) => (
                                            <tr key={comp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '12px 20px', fontSize: '0.9rem' }}>{idx + 1}</td>
                                                <td style={{ padding: '12px 20px', fontWeight: 'bold', fontSize: '0.9rem' }}>{comp.name}</td>
                                                <td style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--text-light)' }}>{comp.type}</td>
                                                <td style={{ padding: '12px 20px', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)' }}>{comp.totalPoints} pt</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 className="card-title" style={{ margin: 0 }}>📜 Storico Punteggi Confermati</h2>
                            <button 
                                className="btn btn-sm btn-secondary" 
                                style={{ background: 'var(--accent)', color: 'white', border: 'none' }}
                                onClick={async () => {
                                    if(!confirm('Vuoi rimuovere tutti i punteggi duplicati (stesso bonus allo stesso bambino)?')) return;
                                    setLoading(true);
                                    try {
                                        const res = await fetch('/api/scores/deduplicate', { method: 'POST' });
                                        if(res.ok) {
                                            alert('Deduplicazione completata con successo!');
                                            fetchData();
                                        } else { alert('Errore durante la deduplicazione'); }
                                    } catch(e) { alert('Errore di rete'); }
                                    finally { setLoading(false); }
                                }}
                            >
                                🧹 Deduplica Punteggi (Rimuovi Doppi)
                            </button>
                        </div>
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
                        <h2 className="card-title">👥 Gestione Organizzatori e Squadre</h2>

                        <div className="card" style={{ marginBottom: 24, border: '2px solid var(--primary)', background: 'rgba(var(--primary-rgb), 0.05)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: 15, color: 'var(--primary)' }}>🔍 Cerca Giocatore o Squadra</h3>
                            <input
                                className="form-input"
                                placeholder="Cerca per nome, email o nome squadra..."
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                                style={{ width: '100%', fontSize: '1.1rem', padding: '12px 20px', borderRadius: 8, border: '2px solid var(--primary)' }}
                            />
                        </div>
                        
                        <div className="card" style={{ marginBottom: 24, padding: '15px 20px', background: '#f8f9fa' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: 10 }}>➕ Aggiungi Nuovo Organizzatore</h3>
                            <div className="admin-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10 }}>
                                <input id="newAdminName" className="form-input" style={{padding: '8px'}} placeholder="Nome" />
                                <input id="newAdminEmail" className="form-input" style={{padding: '8px'}} placeholder="Email" />
                                <input id="newAdminPassword" type="password" className="form-input" style={{padding: '8px'}} placeholder="Password" />
                                <button className="btn btn-primary" onClick={async () => {
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
                                            const roleRes = await fetch('/api/users', {
                                                method: 'PATCH',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ id: data.id, role: 'admin' }),
                                            });
                                            if(roleRes.ok) {
                                                alert('Organizzatore creato con successo!');
                                                document.getElementById('newAdminName').value = '';
                                                document.getElementById('newAdminEmail').value = '';
                                                document.getElementById('newAdminPassword').value = '';
                                                fetchData();
                                            }
                                        }
                                    } catch(e) {} finally { setLoading(false); }
                                }}>Crea</button>
                            </div>
                        </div>

                        <div style={{ maxHeight: 600, overflowY: 'auto', border: '2px solid var(--border)', borderRadius: 8 }}>
                            {users.filter(u => 
                                u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                                u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                                (u.teamName && u.teamName.toLowerCase().includes(userSearch.toLowerCase()))
                            ).map(u => (
                                <div key={u.id} className="score-history-item" style={{ borderLeft: u.role === 'admin' ? '5px solid var(--primary)' : 'none' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <strong>{u.name}</strong>
                                            <span className="tag" style={{ fontSize: '0.65rem', background: u.role === 'admin' ? 'var(--primary)' : '#eee', color: u.role === 'admin' ? 'white' : 'inherit' }}>{u.role}</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>📧 {u.email}</div>
                                        {u.teamName ? (
                                            <div style={{ fontSize: '0.9rem', marginTop: 5, padding: '5px 10px', background: 'rgba(var(--primary-rgb), 0.05)', borderRadius: 4, display: 'inline-block', width: 'fit-content' }}>
                                                🏆 Squadra: <strong>{u.teamName}</strong> 
                                                {u.teamDetails && u.captainId && (
                                                    <span style={{ marginLeft: 10, color: 'var(--primary)', fontWeight: 'bold' }}>
                                                        👑 {u.teamDetails.find(c => c.id === u.captainId)?.name || ''}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>Nessuna squadra creata</div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => setViewingTeam({ userName: u.name, teamName: u.teamName, competitors: u.teamDetails || [], captainId: u.captainId })}
                                            title="Vedi Squadra"
                                        >
                                            👁️
                                        </button>
                                        {u.id !== user.userId && (
                                            <button
                                                className={`btn btn-sm ${u.role === 'admin' ? 'btn-danger' : 'btn-success'}`}
                                                onClick={() => handleToggleRole(u.id, u.role)}
                                                style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                                            >
                                                {u.role === 'admin' ? '👤 Player' : '👑 Admin'}
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
                            {users.length > 0 && users.filter(u => 
                                u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                                u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                                (u.teamName && u.teamName.toLowerCase().includes(userSearch.toLowerCase()))
                            ).length === 0 && (
                                <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>Nessun risultato per "{userSearch}"</div>
                            )}
                            {users.length === 0 && <div style={{ padding: 20, textAlign: 'center' }}>Nessun utente registrato</div>}
                        </div>
                    </div>
                )}

                {/* === DETTAGLIO G1 === */}
                {activeTab === 'dettaglio_g1' && (
                    <div>
                        <h2 className="card-title">📊 Riepilogo Punteggi Prima Serata (Giorno 1)</h2>
                        <p style={{ marginBottom: 24, color: 'var(--text-light)' }}>Tutti i bonus e malus assegnati definitivamente nella serata di ieri.</p>

                        {['bambino', 'animatore', 'capo_animatore'].map(type => {
                            const filteredComp = competitors
                                .filter(c => c.type === type)
                                .map(c => {
                                    const day1ScoresRaw = scoreHistory.filter(s => s.competitorId === c.id && s.day === 1);
                                    
                                    // Deduplica per la visualizzazione
                                    const uniqueScoresMap = new Map();
                                    day1ScoresRaw.forEach(s => {
                                        if (!uniqueScoresMap.has(s.bonusMalusId)) {
                                            uniqueScoresMap.set(s.bonusMalusId, s);
                                        }
                                    });
                                    const day1Scores = Array.from(uniqueScoresMap.values());
                                    
                                    const total = day1Scores.reduce((sum, s) => sum + s.bonusMalus.points, 0);
                                    return { ...c, day1Scores, total };
                                })
                                .sort((a, b) => b.total - a.total);

                            if (filteredComp.length === 0) return null;

                            return (
                                <div key={type} style={{ marginBottom: 40 }}>
                                    <h3 style={{ textTransform: 'capitalize', borderBottom: '2px solid var(--primary)', paddingBottom: 8, marginBottom: 16, color: 'var(--primary)', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{type.replace('_', ' ')}s</span>
                                        <span style={{fontSize: '0.8rem', opacity: 0.6}}>{filteredComp.length} Concorrenti</span>
                                    </h3>
                                    <div className="grid grid-3" style={{ gap: 15 }}>
                                        {filteredComp.map(c => (
                                            <div key={c.id} className="card" style={{ padding: 15, background: 'white', border: '1px solid #eee', position: 'relative', overflow: 'hidden' }}>
                                                {c.total > 0 && <div style={{position: 'absolute', top: -10, right: -10, background: 'var(--success)', width: 40, height: 40, transform: 'rotate(45deg)', opacity: 0.1}}></div>}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, position: 'relative', zIndex: 1 }}>
                                                    <strong style={{fontSize: '0.95rem'}}>{c.name}</strong>
                                                    <span className="tag" style={{ background: c.total >= 0 ? 'var(--success)' : 'var(--danger)', color: 'white', fontWeight: '900', fontSize: '0.85rem' }}>
                                                        {c.total > 0 ? '+' : ''}{c.total}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                    {c.day1Scores.length > 0 ? c.day1Scores.map((s, idx) => (
                                                        <div key={idx} style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', opacity: 0.8, padding: '3px 0', borderBottom: '1px solid #f5f5f5' }}>
                                                            <span style={{flex: 1, paddingRight: 5}}>• {s.bonusMalus.description}</span>
                                                            <span style={{ fontWeight: 'bold', color: s.bonusMalus.points > 0 ? 'var(--success)' : 'var(--danger)' }}>
                                                                {s.bonusMalus.points > 0 ? '+' : ''}{s.bonusMalus.points}
                                                            </span>
                                                        </div>
                                                    )) : <div style={{ fontSize: '0.7rem', opacity: 0.4, fontStyle: 'italic' }}>Nessun punto assegnato</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
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
                                    <div style={{
                                        padding: '12px',
                                        background: c.id === viewingTeam.captainId ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--background)',
                                        borderRadius: 8,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: c.id === viewingTeam.captainId ? '2px solid var(--primary)' : '1px solid var(--border)',
                                        position: 'relative'
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <strong>{c.name}</strong>
                                                {c.id === viewingTeam.captainId && <span className="tag tag-bonus" style={{ fontSize: '0.6rem', padding: '2px 4px' }}>👑 CAPITANO</span>}
                                            </div>
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
