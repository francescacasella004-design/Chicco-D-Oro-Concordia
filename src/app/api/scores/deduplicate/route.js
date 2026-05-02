import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
        }

        // 1. Prendi tutti i punteggi confermati
        const scores = await prisma.scoreEvent.findMany();

        const seen = new Set();
        const toDelete = [];

        for (const score of scores) {
            // Chiave unica: competitor + bonus/malus + day
            const key = `${score.competitorId}-${score.bonusMalusId}-${score.day}`;
            
            if (seen.has(key)) {
                toDelete.push(score.id);
            } else {
                seen.add(key);
            }
        }

        if (toDelete.length > 0) {
            await prisma.scoreEvent.deleteMany({
                where: {
                    id: { in: toDelete }
                }
            });
        }

        return NextResponse.json({ 
            message: 'Deduplicazione completata', 
            deletedCount: toDelete.length 
        });
    } catch (error) {
        console.error('Error deduplicating scores:', error);
        return NextResponse.json({ error: 'Errore durante la deduplicazione' }, { status: 500 });
    }
}
