import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        const competitors = await prisma.competitor.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json({ competitors });
    } catch (error) {
        console.error('Error fetching competitors:', error);
        return NextResponse.json({ error: 'Errore nel recupero concorrenti' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
        }

        const { name, type, cost, imageUrl } = await request.json();

        if (!name || !type) {
            return NextResponse.json({ error: 'Nome e tipo sono obbligatori' }, { status: 400 });
        }

        const competitor = await prisma.competitor.create({
            data: { name, type, cost: cost || 10, imageUrl },
        });

        return NextResponse.json({ competitor }, { status: 201 });
    } catch (error) {
        console.error('Error creating competitor:', error);
        return NextResponse.json({ error: 'Errore nella creazione del concorrente' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
        }

        const { id, name, type, cost, imageUrl } = await request.json();

        if (!id || !name || !type) {
            return NextResponse.json({ error: 'Dati incompleti' }, { status: 400 });
        }

        const competitor = await prisma.competitor.update({
            where: { id: parseInt(id) },
            data: { name, type, cost: cost || 10, imageUrl },
        });

        return NextResponse.json({ competitor });
    } catch (error) {
        console.error('Error updating competitor:', error);
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

        await prisma.competitor.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting competitor:', error);
        return NextResponse.json({ error: 'Errore nella cancellazione' }, { status: 500 });
    }
}
