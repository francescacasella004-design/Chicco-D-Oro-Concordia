import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
        }

        // Eliminiamo tutti i punteggi in attesa (revisione)
        await prisma.pendingScoreEvent.deleteMany({});

        return NextResponse.json({ message: 'Revisione svuotata con successo' });
    } catch (error) {
        console.error('Error clearing pending scores:', error);
        return NextResponse.json({ error: 'Errore durante la pulizia' }, { status: 500 });
    }
}
