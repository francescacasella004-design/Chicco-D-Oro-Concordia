import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        const bonusMalus = await prisma.bonusMalus.findMany({
            orderBy: [{ category: 'asc' }, { points: 'desc' }],
        });
        return NextResponse.json({ bonusMalus });
    } catch (error) {
        console.error('Error fetching bonus/malus:', error);
        return NextResponse.json({ error: 'Errore' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
        }

        const { description, points, category } = await request.json();

        if (!description || points === undefined || !category) {
            return NextResponse.json({ error: 'Tutti i campi sono obbligatori' }, { status: 400 });
        }

        const bonusMalus = await prisma.bonusMalus.create({
            data: { description, points, category },
        });

        return NextResponse.json({ bonusMalus }, { status: 201 });
    } catch (error) {
        console.error('Error creating bonus/malus:', error);
        return NextResponse.json({ error: 'Errore nella creazione' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
        }

        const { id, description, points, category } = await request.json();

        if (!id || !description || points === undefined || !category) {
            return NextResponse.json({ error: 'Dati incompleti' }, { status: 400 });
        }

        const bonusMalus = await prisma.bonusMalus.update({
            where: { id: parseInt(id) },
            data: { description, points, category },
        });

        return NextResponse.json({ bonusMalus });
    } catch (error) {
        console.error('Error updating bonus/malus:', error);
        return NextResponse.json({ error: 'Errore nella modifica' }, { status: 500 });
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

        await prisma.bonusMalus.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting bonus/malus:', error);
        return NextResponse.json({ error: 'Errore nella cancellazione' }, { status: 500 });
    }
}
