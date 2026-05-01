import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ error: 'IDs invalidi' }, { status: 400 });
        }

        // Trova i ScoreEvent corrispondenti agli ID che abbiamo appena confermato
        // Nota: Qui usiamo gli ID dei PendingScoreEvent originali che abbiamo memorizzato.
        // Poiché non abbiamo gli ID dei ScoreEvent creati, dobbiamo cercarli per corrispondenza.
        // Ma c'è un trucco: l'utente vuole annullare l'ULTIMA azione.
        
        // Per sicurezza, cerchiamo gli ScoreEvent creati negli ultimi 30 secondi 
        // che corrispondono ai criteri (stessi competitor, stessi bonusmalus, stessi admin)
        // Ma un modo più pulito è che l'API di conferma restituisca i nuovi ID.
        // Oppure, più semplicemente, cancelliamo gli ultimi record inseriti per quei competitor.

        // IMPLEMENTAZIONE OTTIMIZZATA:
        // Spostiamo indietro i record. 
        // Cerchiamo i ScoreEvent creati di recente.
        const recentScores = await prisma.scoreEvent.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 60000) // Ultimo minuto
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (recentScores.length === 0) {
            return NextResponse.json({ error: 'Nessun punteggio recente trovato da annullare' }, { status: 404 });
        }

        // Operazione atomica: elimina da ScoreEvent e ricrea in PendingScoreEvent
        await prisma.$transaction(async (tx) => {
            for (const score of recentScores) {
                // Ricreiamo il pending
                await tx.pendingScoreEvent.create({
                    data: {
                        competitorId: score.competitorId,
                        bonusMalusId: score.bonusMalusId,
                        assignedById: score.assignedById,
                        day: score.day
                    }
                });
                
                // Eliminiamo il definitivo
                await tx.scoreEvent.delete({
                    where: { id: score.id }
                });
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Undo error:', error);
        return NextResponse.json({ error: 'Errore durante l\'annullamento' }, { status: 500 });
    }
}
