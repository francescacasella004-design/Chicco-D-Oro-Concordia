import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || 'file:./dev.db',
        },
    },
});

async function main() {
    console.log('🚀 Configurazione Concorrenti e Scaletta...');

    // 1. Definiamo tutti i concorrenti con i loro ruoli reali
    const competitors = [
        // BAMBINI
        { name: 'Giulia Marigliano', type: 'bambino', cost: 15 },
        { name: 'Melissa Sorrentino', type: 'bambino', cost: 15 },
        { name: 'Gioia Capuozzo', type: 'bambino', cost: 15 },
        { name: 'Ginevra Ragosta', type: 'bambino', cost: 15 },
        { name: 'Greta D’Amico', type: 'bambino', cost: 15 },
        { name: 'Roberto Imperatrice', type: 'bambino', cost: 15 },
        { name: 'Simona Loffredo', type: 'bambino', cost: 15 },
        { name: 'Alessia Ruocco', type: 'bambino', cost: 15 },
        { name: 'Gabriele Piccolo', type: 'bambino', cost: 15 },
        { name: 'Luigi Bianco', type: 'bambino', cost: 15 },
        { name: 'Gaia Ciccone', type: 'bambino', cost: 15 },
        { name: 'Aurora Oncia', type: 'bambino', cost: 15 },
        { name: 'Lavinia Foria', type: 'bambino', cost: 15 },
        { name: 'Bianca Buonadosa', type: 'bambino', cost: 15 },
        { name: 'Giuseppe Montella', type: 'bambino', cost: 15 },
        { name: 'Ambra Girone', type: 'bambino', cost: 15 },
        { name: 'Giulia Guariniello', type: 'bambino', cost: 15 },
        { name: 'Conny Barnaba', type: 'bambino', cost: 15 },
        { name: 'Giorgia Ciccone', type: 'bambino', cost: 15 },
        { name: 'Mattia Sarpa', type: 'bambino', cost: 15 },
        { name: 'Mayra Sarpa', type: 'bambino', cost: 15 },
        { name: 'Aurora Gherardi', type: 'bambino', cost: 15 },
        { name: 'Federica Ruocco', type: 'bambino', cost: 15 },
        { name: 'Marta Catello', type: 'bambino', cost: 15 },
        { name: 'Sophia Calemma', type: 'bambino', cost: 15 },
        { name: 'Benedetta Bracale', type: 'bambino', cost: 15 },
        { name: 'Gioiavittoria', type: 'bambino', cost: 15 },
        { name: 'Aurora Mazza', type: 'bambino', cost: 15 },
        { name: 'Sasy Ragosta', type: 'bambino', cost: 15 },
        { name: 'Vittoria De Rosa', type: 'bambino', cost: 15 },

        // ANIMATORI
        { name: 'Sara Femia', type: 'animatore', cost: 20 },
        { name: 'Bruna Barashini', type: 'animatore', cost: 20 },
        { name: 'Giorgia Marigliano', type: 'animatore', cost: 20 },
        { name: 'Eliana', type: 'animatore', cost: 20 },
        { name: 'Vittoria Femia', type: 'animatore', cost: 20 },

        // CAPI ANIMATORI
        { name: 'Lucia De Martino', type: 'capo_animatore', cost: 25 },
        { name: 'Anna Martone', type: 'capo_animatore', cost: 25 },
        { name: 'Maria Mola', type: 'capo_animatore', cost: 25 },
        { name: 'Vincenzo Duca', type: 'capo_animatore', cost: 25 },
    ];

    // Pulizia precauzionale (opzionale, ma utile per evitare doppioni se lo script viene rieseguito)
    // NB: In produzione non cancelleremmo tutto, ma qui stiamo configurando l'evento
    console.log('🧹 Pulizia concorrenti esistenti...');
    await prisma.pendingScoreEvent.deleteMany();
    await prisma.scoreEvent.deleteMany();
    await prisma.teamCompetitor.deleteMany();
    await prisma.competitor.deleteMany();

    console.log('📥 Inserimento concorrenti...');
    for (const c of competitors) {
        await prisma.competitor.create({ data: c });
    }

    console.log(`✅ ${competitors.length} concorrenti inseriti con successo!`);
}

main()
    .catch((e) => {
        console.error('❌ Errore:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
