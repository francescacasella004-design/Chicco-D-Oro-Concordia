import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        const scoreEvents = await prisma.scoreEvent.findMany({
            include: {
                competitor: true,
                bonusMalus: true,
                assignedBy: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
        return NextResponse.json({ scoreEvents });
    } catch (error) {
        console.error('Error fetching scores:', error);
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

        const scoreEvent = await prisma.scoreEvent.create({
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

        return NextResponse.json({ scoreEvent }, { status: 201 });
    } catch (error) {
        console.error('Error creating score event:', error);
        return NextResponse.json({ error: 'Errore nell\'assegnazione del punteggio' }, { status: 500 });
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

        await prisma.scoreEvent.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting score event:', error);
        return NextResponse.json({ error: 'Errore nella cancellazione' }, { status: 500 });
    }
}
