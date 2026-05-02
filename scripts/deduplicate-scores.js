const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Deduplicating confirmed scores (ScoreEvent)...');

    // 1. Get all confirmed scores
    const scores = await prisma.scoreEvent.findMany({
        include: {
            competitor: true,
            bonusMalus: true
        }
    });

    console.log(`Found ${scores.length} total scores.`);

    const seen = new Set();
    const toDelete = [];

    for (const score of scores) {
        // Unique key: competitor + bonus/malus + day
        const key = `${score.competitorId}-${score.bonusMalusId}-${score.day}`;
        
        if (seen.has(key)) {
            toDelete.push(score.id);
        } else {
            seen.add(key);
        }
    }

    if (toDelete.length === 0) {
        console.log('✅ No duplicates found in confirmed scores.');
        return;
    }

    console.log(`🗑️ Found ${toDelete.length} duplicates. Deleting...`);

    const deleted = await prisma.scoreEvent.deleteMany({
        where: {
            id: { in: toDelete }
        }
    });

    console.log(`✅ Successfully deleted ${deleted.count} duplicate scores.`);
    console.log('🚀 Leaderboard will now reflect correct unique scores.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
