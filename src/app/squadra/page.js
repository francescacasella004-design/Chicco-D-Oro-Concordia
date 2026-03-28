'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

export default function SquadraPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Name, 2: Selection
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ type: '', title: '', message: '' });

    // Restored State
    const [competitors, setCompetitors] = useState([]);
    const [team, setTeam] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [captainId, setCaptainId] = useState(null);
    const [teamName, setTeamName] = useState('');
    const [teamImageUrl, setTeamImageUrl] = useState('/solochicco.png');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
                setTeamImageUrl(teamData.team.imageUrl || '/solochicco.png');
                setSelectedIds(teamData.team.competitors.map(tc => tc.competitor.id));
                setCaptainId(teamData.team.captainId);
                setStep(3); // If team exists, go directly to read-only view
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
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
            if (captainId === id) setCaptainId(null);
        } else {
            if (selectedIds.length >= 5) {
                showFeedback('error', 'Attenzione', 'Puoi selezionare massimo 5 concorrenti!');
                return;
            }

            const compToAdd = competitors.find(c => c.id === id);
            const selectedComps = competitors.filter(c => selectedIds.includes(c.id));

            const numBambini = selectedComps.filter(c => c.type === 'bambino').length;
            const numAnimatori = selectedComps.filter(c => c.type === 'animatore').length;
            const numCapi = selectedComps.filter(c => c.type === 'capo_animatore').length;

            if (compToAdd.type === 'bambino' && numBambini >= 3) {
                showFeedback('error', 'Limite Raggiunto', 'Puoi selezionare al massimo 3 bambini!');
                return;
            }
            if (compToAdd.type === 'animatore' && numAnimatori >= 1) {
                showFeedback('error', 'Limite Raggiunto', 'Puoi selezionare al massimo 1 animatore!');
                return;
            }
            if (compToAdd.type === 'capo_animatore' && numCapi >= 1) {
                showFeedback('error', 'Limite Raggiunto', 'Puoi selezionare al massimo 1 capo animatore!');
                return;
            }

            const newCost = totalCost + compToAdd.cost;
            if (newCost > BUDGET) {
                showFeedback('error', 'Budget Superato', 'Non hai abbastanza Chicchi!');
                return;
            }
            setSelectedIds([...selectedIds, id]);
        }
    };

    const showFeedback = (type, title, message) => {
        setModalContent({ type, title, message });
        setShowModal(true);
    };

    const handleNextStep = () => {
        if (!teamName.trim()) {
            showFeedback('error', 'Nome Mancante', 'Inserisci un nome per la tua squadra!');
            return;
        }
        setStep(2);
    };

    const handleSave = async () => {
        if (!teamName.trim()) { showFeedback('error', 'Errore', 'Inserisci un nome per la squadra'); return; }
        if (selectedIds.length !== 5) { showFeedback('error', 'Rosa Incompleta', 'Devi selezionare esattamente 5 concorrenti'); return; }
        if (!captainId) { showFeedback('error', 'Capitano Mancante', 'Scegli un capitano per la tua squadra!'); return; }

        setSaving(true);
        try {
            const res = await fetch('/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: teamName, imageUrl: teamImageUrl, competitorIds: selectedIds, captainId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setTeam(data.team);
            setStep(3); // Go to read-only view after creation
            showFeedback('success', 'Evviva! 🎉', 'La tua squadra è stata creata con successo!');
        } catch (err) {
            showFeedback('error', 'Errore', err.message);
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    const bambini = competitors.filter(c => c.type === 'bambino');
    const animatori = competitors.filter(c => c.type === 'animatore');
    const capiAnimatori = competitors.filter(c => c.type === 'capo_animatore');

    const getEmojiSvgUrl = (emoji) => {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    };

    const presetImages = [
        { url: '/solochicco.png', label: 'Chicco' },
        { url: getEmojiSvgUrl('🚀'), label: 'Razzo' },
        { url: getEmojiSvgUrl('🎤'), label: 'Microfono' },
        { url: getEmojiSvgUrl('🩰'), label: 'Danza' },
        { url: getEmojiSvgUrl('🎭'), label: 'Teatro' }
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showFeedback('error', 'File troppo grande', 'L\'immagine deve essere massimo di 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setTeamImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1>🎯 La mia squadra</h1>
                <p>Crea la formazione vincente!</p>
            </div>
            <section className="section">
                <div className="container">

                    {/* STEP 1: TEAM NAME */}
                    {step === 1 && (
                        <div className="card" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: 40 }}>
                            <h2 className="card-title" style={{ justifyContent: 'center' }}>Come si chiamerà la tua squadra?</h2>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: 24 }}
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder="Es: I Campioni..."
                                />
                            </div>

                            <h3 style={{ marginBottom: 16 }}>Scegli il tuo logo</h3>
                            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
                                {presetImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            width: 70, height: 70, borderRadius: '50%', cursor: 'pointer',
                                            border: teamImageUrl === img.url ? '4px solid var(--primary)' : '4px solid transparent',
                                            padding: 4, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                        onClick={() => setTeamImageUrl(img.url)}
                                        title={img.label}
                                    >
                                        <img src={img.url} alt={img.label} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '50%' }} />
                                    </div>
                                ))}
                                {/* Custom Upload Info */}
                                <div style={{ width: '100%', marginTop: 16 }}>
                                    <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                                        📷 Carica tua immagine...
                                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>

                            {teamImageUrl && (
                                <div style={{ marginBottom: 32 }}>
                                    <p>Logo scelto:</p>
                                    <img src={teamImageUrl} alt="Logo Scelto" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
                                </div>
                            )}

                            <button className="btn btn-lg btn-primary" onClick={handleNextStep}>
                                Avanti ➡️
                            </button>
                        </div>
                    )}

                    {/* STEP 2: SELECTION */}
                    {step === 2 && (
                        <>
                            {/* Sticky Budget Bar */}
                            <div style={{
                                position: 'sticky',
                                top: 70, // Adjust based on header height
                                zIndex: 100,
                                background: 'white',
                                padding: '16px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                marginBottom: 24,
                                border: '2px solid var(--primary)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                                    <div>Squadra: <span style={{ color: 'var(--primary)' }}>{teamName}</span></div>
                                    <button className="btn btn-sm btn-secondary" onClick={() => setStep(1)} title="Modifica Nome">✏️</button>
                                </div>

                                <div className="budget-text" style={{ marginTop: 8 }}>
                                    <span>Chicchi: {BUDGET - totalCost} rimanenti</span>
                                    <span>Giocatori: {selectedIds.length}/5</span>
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
                                        <div className="competitor-cost">{c.cost} Chicchi</div>
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
                                        <div className="competitor-cost">{c.cost} Chicchi</div>
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

                            {/* Capi Animatori */}
                            {capiAnimatori.length > 0 && (
                                <>
                                    <h2 style={{ marginBottom: 16, fontSize: '1.4rem' }}>⭐ Capi Animatori</h2>
                                    <div className="grid grid-3" style={{ marginBottom: 32 }}>
                                        {capiAnimatori.map(c => (
                                            <div
                                                key={c.id}
                                                className={`competitor-card ${selectedIds.includes(c.id) ? 'selected' : ''} ${captainId === c.id ? 'captain' : ''}`}
                                                onClick={() => toggleCompetitor(c.id)}
                                            >
                                                {captainId === c.id && <div className="competitor-badge">👑</div>}
                                                <div className="competitor-avatar" style={{ background: 'linear-gradient(135deg, #F5B731, #D4A017)' }}>{c.name.charAt(0)}</div>
                                                <div className="competitor-name">{c.name}</div>
                                                <div className="competitor-type">capo animatore</div>
                                                <div className="competitor-cost">{c.cost} Chicchi</div>
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
                                </>
                            )}

                            {/* Save */}
                            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                                <button
                                    className="btn btn-lg btn-primary"
                                    onClick={handleSave}
                                    style={{ transform: 'scale(1.1)' }}
                                    disabled={saving || selectedIds.length !== 5 || !captainId || !teamName.trim()}
                                >
                                    {saving ? 'Salvataggio...' : '💾 Salva squadra'}
                                </button>
                            </div>
                        </>
                    )}

                    {/* STEP 3: READ-ONLY VIEW */}
                    {step === 3 && team && (
                        <div style={{ maxWidth: 800, margin: '0 auto' }}>
                            <div className="card" style={{ textAlign: 'center', marginBottom: 32, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {team.imageUrl && (
                                    <img src={team.imageUrl} alt="Team Logo" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid white', marginBottom: 16, backgroundColor: '#fff' }} />
                                )}
                                <h1 style={{ fontSize: '2.5rem', marginBottom: 8, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{team.name}</h1>
                                <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>La tua squadra ufficiale per il Fantachicco!</p>
                            </div>

                            <h2 style={{ marginBottom: 16 }}>I tuoi campioni</h2>
                            <div className="grid grid-3">
                                {team.competitors.map(tc => {
                                    const isCaptain = tc.competitor.id === team.captainId;
                                    return (
                                        <div key={tc.competitor.id} className={`competitor-card selected ${isCaptain ? 'captain' : ''}`} style={{ cursor: 'default' }}>
                                            {isCaptain && <div className="competitor-badge" style={{ transform: 'scale(1.2)' }}>👑</div>}
                                            <div className="competitor-avatar" style={{
                                                background: tc.competitor.type === 'capo_animatore' ? 'linear-gradient(135deg, #F5B731, #D4A017)' :
                                                    tc.competitor.type === 'animatore' ? 'var(--gradient-warm)' : 'var(--gradient-primary)'
                                            }}>
                                                {tc.competitor.name.charAt(0)}
                                            </div>
                                            <div className="competitor-name">{tc.competitor.name}</div>
                                            <div className="competitor-type">{tc.competitor.type.replace('_', ' ')}</div>
                                            {isCaptain && <div style={{ marginTop: 8, fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>CAPITANO (Punti x2)</div>}
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ marginTop: 40, textAlign: 'center' }}>
                                <button className="btn btn-secondary" onClick={() => router.push('/fantachicco?tab=classifica')}>
                                    🏆 Vai alla Classifica
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </section>

            {/* === FEEDBACK MODAL === */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: 400, textAlign: 'center', animation: 'popIn 0.3s ease' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>
                            {modalContent.type === 'success' ? '🎉' : '⚠️'}
                        </div>
                        <h2 className="card-title" style={{ justifyContent: 'center', color: modalContent.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
                            {modalContent.title}
                        </h2>
                        <p style={{ marginBottom: 24, fontSize: '1.1rem' }}>{modalContent.message}</p>
                        <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                            Ho capito
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
