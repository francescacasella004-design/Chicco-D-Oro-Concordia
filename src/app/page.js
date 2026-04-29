'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data.announcements || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* HERO con Logo */}
      <section className="hero" style={{ minHeight: '50vh' }}>
        <img src="/solochicco.png" alt="Chicco D'Oro" style={{ width: 'clamp(80px, 20vw, 140px)', marginBottom: 8 }} />
        <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.8rem)' }}>
          Chicco D&apos;Oro
        </h1>
        <p className="hero-subtitle" style={{ maxWidth: 520 }}>
          L&apos;evento della Parrocchia Concordia
        </p>
        <div className="hero-buttons">
          <Link href="/fantachicco" className="btn btn-lg" style={{ background: 'white', color: '#D4A017' }}>
            🎮 Gioca a Fantachicco
          </Link>
        </div>
      </section>

      {/* AVVISI */}
      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 className="section-title">📢 Avvisi e Novità</h2>
          <p className="section-subtitle">Tutte le ultime notizie sull&apos;evento</p>

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : announcements.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
              <h3 style={{ marginBottom: 8, color: 'var(--text-light)' }}>Nessun avviso per ora</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Torna a trovarci per le ultime novità sull&apos;evento!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {announcements.map(a => (
                <div key={a.id} className="card" style={{
                  borderLeft: a.pinned ? '4px solid var(--primary)' : '4px solid transparent',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                      {a.pinned && <span style={{ marginRight: 6 }}>📌</span>}
                      {a.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: 12 }}>
                      {new Date(a.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-light)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {a.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info rapida */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="grid grid-2">
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⛪</div>
              <h3 style={{ marginBottom: 8 }}>L&apos;evento</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
                Un evento speciale organizzato dalla nostra parrocchia per tutta la comunità.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎮</div>
              <h3 style={{ marginBottom: 8 }}>Fantachicco</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
                Il fantasy game dell&apos;evento! Crea la tua squadra e scala la classifica.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Sponsor */}
      <section className="section" style={{ background: '#f9fafb', borderTop: '1px solid #eee', paddingBottom: '40px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 32, color: 'var(--text)' }}>
            Sponsor ufficiali Chicco d&apos;Oro 2026
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', alignItems: 'center' }}>
            {/* 
              Tenta prima di caricare il file .jpg, se non lo trova prova con il formato .png
            */}
            <img 
              src="/fratelli frenna.png" 
              onError={(e) => { e.currentTarget.src = "/fratelli frenna.jpg"; e.currentTarget.onerror = null; }} 
              alt="I Fratelli Frenna" 
              style={{ maxHeight: '120px', maxWidth: '200px', objectFit: 'contain', borderRadius: '8px' }} 
            />
            <img 
              src="/gpoint.png" 
              onError={(e) => { e.currentTarget.src = "/gpoint.jpg"; e.currentTarget.onerror = null; }} 
              alt="Gpoint" 
              style={{ maxHeight: '120px', maxWidth: '200px', objectFit: 'contain', borderRadius: '8px' }} 
            />
            <img 
              src="/bottone.png" 
              onError={(e) => { e.currentTarget.src = "/bottone.jpg"; e.currentTarget.onerror = null; }} 
              alt="Gennaro Bottone" 
              style={{ maxHeight: '120px', maxWidth: '200px', objectFit: 'contain', borderRadius: '8px' }} 
            />
          </div>
        </div>
      </section>
    </>
  );
}
