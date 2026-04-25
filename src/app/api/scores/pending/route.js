import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        const pendingScores = await prisma.pendingScoreEvent.findMany({
            include: {
                competitor: true,
                bonusMalus: true,
                assignedBy: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ pendingScores });
    } catch (error) {
        console.error('Error fetching pending scores:', error);
        return NextResponse.json({ error: 'Errore' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
        }

        const { competitorId, bonusMalusId } = await request.json();

        if (!competitorId || !bonusMalusId) {
            return NextResponse.json(
                { error: 'Concorrente e bonus/malus sono obbligatori' },
                { status: 400 }
            );
        }

        const pendingScore = await prisma.pendingScoreEvent.create({
            data: {
                competitorId,
                bonusMalusId,
                assignedById: user.userId,
            },
            include: {
                competitor: true,
                bonusMalus: true,
            },
        });

        return NextResponse.json({ pendingScore }, { status: 201 });
    } catch (error) {
        console.error('Error creating pending score:', error);
        return NextResponse.json({ error: 'Errore nell\'assegnazione del punteggio in attesa' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID mancante' }, { status: 400 });
        }

        await prisma.pendingScoreEvent.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting pending score:', error);
        return NextResponse.json({ error: 'Errore nella cancellazione' }, { status: 500 });
    }
}
