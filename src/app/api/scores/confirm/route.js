import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
        }

        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ error: 'Lista di ID non valida' }, { status: 400 });
        }

        // Recupera i punteggi in attesa selezionati
        const pendingScores = await prisma.pendingScoreEvent.findMany({
            where: { id: { in: ids } }
        });

        if (pendingScores.length === 0) {
            return NextResponse.json({ error: 'Nessun punteggio trovato' }, { status: 404 });
        }

        // Creazione dei ScoreEvent reali in una transazione
        await prisma.$transaction([
            prisma.scoreEvent.createMany({
                data: pendingScores.map(ps => ({
                    competitorId: ps.competitorId,
                    bonusMalusId: ps.bonusMalusId,
                    assignedById: ps.assignedById,
                    day: ps.day,
                    createdAt: ps.createdAt, // Manteniamo la data originale di assegnazione
                }))
            }),
            prisma.pendingScoreEvent.deleteMany({
                where: { id: { in: ids } }
            })
        ]);

        return NextResponse.json({ success: true, confirmedCount: pendingScores.length });
    } catch (error) {
        console.error('Error confirming scores:', error);
        return NextResponse.json({ error: 'Errore durante la conferma dei punteggi' }, { status: 500 });
    }
}
