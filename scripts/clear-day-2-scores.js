const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Resetting all scores for Day 2...');

    // Delete ALL pending scores (drafts)
    const pending = await prisma.pendingScoreEvent.deleteMany({});
    console.log(`✅ Deleted ${pending.count} pending scores.`);

    // Delete confirmed scores for Day 2 ONLY
    const confirmed = await prisma.scoreEvent.deleteMany({
        where: { day: 2 }
    });
    console.log(`✅ Deleted ${confirmed.count} confirmed scores for Day 2.`);

    // Ensure results are not published
    await prisma.settings.upsert({
        where: { id: 'global' },
        update: { resultsPublished: false },
        create: { id: 'global', resultsPublished: false }
    });

    console.log('🚀 Ready for a clean start of Night 2!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
