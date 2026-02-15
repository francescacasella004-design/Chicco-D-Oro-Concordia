import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Get all teams with their competitors and captain
        const teams = await prisma.team.findMany({
            include: {
                user: { select: { name: true } },
                competitors: {
                    include: {
                        competitor: {
                            include: {
                                scores: {
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
        const leaderboard = teams.map((team) => {
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
                playerName: team.user.name,
                totalPoints,
                competitors: competitorDetails,
            };
        });

        // Sort by total points descending
        leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ error: 'Errore nel recupero classifica' }, { status: 500 });
    }
}
