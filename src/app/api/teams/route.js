import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
        }

        const team = await prisma.team.findUnique({
            where: { userId: user.userId },
            include: {
                competitors: { include: { competitor: true } },
                captain: true,
            },
        });

        return NextResponse.json({ team });
    } catch (error) {
        console.error('Error fetching team:', error);
        return NextResponse.json({ error: 'Errore nel recupero squadra' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
        }

        const { name, competitorIds, captainId } = await request.json();

        if (!name || !competitorIds || competitorIds.length !== 5) {
            return NextResponse.json(
                { error: 'Serve un nome squadra e 5 concorrenti' },
                { status: 400 }
            );
        }

        if (!competitorIds.includes(captainId)) {
            return NextResponse.json(
                { error: 'Il capitano deve far parte della squadra' },
                { status: 400 }
            );
        }

        // Check budget
        const competitors = await prisma.competitor.findMany({
            where: { id: { in: competitorIds } },
        });

        const totalCost = competitors.reduce((sum, c) => sum + c.cost, 0);
        const BUDGET = 100;

        if (totalCost > BUDGET) {
            return NextResponse.json(
                { error: `Budget superato! Costo: ${totalCost}/${BUDGET}` },
                { status: 400 }
            );
        }

        // Delete existing team if any
        const existingTeam = await prisma.team.findUnique({
            where: { userId: user.userId },
        });
        if (existingTeam) {
            await prisma.teamCompetitor.deleteMany({ where: { teamId: existingTeam.id } });
            await prisma.team.delete({ where: { id: existingTeam.id } });
        }

        const team = await prisma.team.create({
            data: {
                name,
                userId: user.userId,
                captainId,
                competitors: {
                    create: competitorIds.map((competitorId) => ({ competitorId })),
                },
            },
            include: {
                competitors: { include: { competitor: true } },
                captain: true,
            },
        });

        return NextResponse.json({ team }, { status: 201 });
    } catch (error) {
        console.error('Error creating team:', error);
        return NextResponse.json({ error: 'Errore nella creazione della squadra' }, { status: 500 });
    }
}
