import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
    try {
        const settings = await prisma.settings.findUnique({ where: { id: 'global' } });
        const resultsPublished = settings?.resultsPublished || false;

        // Se non sono pubblicati, permetti la visione solo se l'utente è admin
        // (Per semplicità qui carichiamo sempre ma potremmo filtrare)
        
        const { searchParams } = new URL(request.url);
        const day = searchParams.get('day');

        // Get all teams with their competitors and captain
        const teams = await prisma.team.findMany({
            where: {
                user: {
                    role: { not: 'admin' }
                }
            },
            include: {
                user: { select: { name: true, email: true } },
                competitors: {
                    include: {
                        competitor: {
                            include: {
                                scores: {
                                    where: day ? { day: parseInt(day) } : {},
                                    include: { bonusMalus: true },
                                },
                            },
                        },
                    },
                },
                captain: true,
            },
        });

        // Calculate scores for each team
        let leaderboard = teams.map((team) => {
            let totalPoints = 0;
            const competitorDetails = team.competitors.map((tc) => {
                const comp = tc.competitor;
                const compPoints = comp.scores.reduce((sum, s) => sum + s.bonusMalus.points, 0);
                const isCaptain = team.captainId === comp.id;
                const finalPoints = isCaptain ? compPoints * 2 : compPoints;
                totalPoints += finalPoints;

                return {
                    id: comp.id,
                    name: comp.name,
                    type: comp.type,
                    points: compPoints,
                    isCaptain,
                    finalPoints,
                };
            });

            return {
                teamId: team.id,
                teamName: team.name,
                teamImageUrl: team.imageUrl,
                playerName: team.user.name,
                playerEmail: team.user.email,
                totalPoints,
                competitors: competitorDetails,
            };
        });

        // Sort by total points descending
        leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

        // Assign Rank handling ties
        let currentRank = 0;
        let lastPoints = null;
        let skipped = 0;

        leaderboard = leaderboard.map((team, index) => {
            if (team.totalPoints !== lastPoints) {
                currentRank += 1 + skipped;
                skipped = 0;
            } else {
                skipped += 1;
            }
            lastPoints = team.totalPoints;
            return { ...team, rank: currentRank };
        });

        return NextResponse.json({ leaderboard, resultsPublished });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ error: 'Errore nel recupero classifica' }, { status: 500 });
    }
}
