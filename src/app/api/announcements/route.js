import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
        });
        return NextResponse.json({ announcements });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nel caricamento avvisi' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
        }
        const { title, content, pinned } = await request.json();
        if (!title || !content) {
            return NextResponse.json({ error: 'Titolo e contenuto obbligatori' }, { status: 400 });
        }
        const announcement = await prisma.announcement.create({
            data: { title, content, pinned: pinned || false },
        });
        return NextResponse.json({ announcement }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nella creazione avviso' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
        }
        const { id, title, content, pinned } = await request.json();
        if (!id || !title || !content) {
            return NextResponse.json({ error: 'Dati incompleti' }, { status: 400 });
        }
        const announcement = await prisma.announcement.update({
            where: { id: parseInt(id) },
            data: { title, content, pinned: pinned || false },
        });
        return NextResponse.json({ announcement });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nella modifica' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id'));
        if (!id) {
            return NextResponse.json({ error: 'ID obbligatorio' }, { status: 400 });
        }
        await prisma.announcement.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nella cancellazione' }, { status: 500 });
    }
}
