import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            include: {
                team: {
                    include: {
                        competitors: {
                            include: { competitor: true }
                        }
                    }
                },
                scoreEvents: { select: { id: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Map to a cleaner structure
        const safeUsers = users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            teamName: u.team?.name || 'Nessuna Squadra',
            teamDetails: u.team?.competitors.map(tc => tc.competitor) || [],
            scoresAssignedCount: u.scoreEvents.length,
            createdAt: u.createdAt
        }));

        return NextResponse.json({ users: safeUsers });
    } catch (error) {
        return NextResponse.json({ error: 'Errore caricamento utenti' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const admin = await getUserFromRequest(request);
        if (!admin || admin.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id'));

        if (!id) {
            return NextResponse.json({ error: 'ID obbligatorio' }, { status: 400 });
        }

        if (id === admin.id) {
            return NextResponse.json({ error: 'Non puoi eliminarti da solo!' }, { status: 400 });
        }

        // Check if user exists and has relations
        const userToDelete = await prisma.user.findUnique({
            where: { id },
            include: { team: true }
        });

        if (!userToDelete) {
            return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
        }

        // Prisma transaction to ensure clean cleanup
        await prisma.$transaction(async (tx) => {
            // 1. Delete Team if exists (Cascade handles TeamCompetitor)
            if (userToDelete.team) {
                await tx.team.delete({ where: { id: userToDelete.team.id } });
            }

            // 2. Delete User
            // Note: If user has assigned scores (ScoreEvent), this might fail if we don't handle it.
            // For now, if they are simple players, this is fine. 
            // If they are admins who worked, DB constraints will block this, which is SAFE.
            await tx.user.delete({ where: { id } });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        if (error.code === 'P2003') {
            return NextResponse.json({ error: 'Impossibile eliminare: questo utente ha assegnato dei punteggi.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Errore cancellazione utente' }, { status: 500 });
    }
}
