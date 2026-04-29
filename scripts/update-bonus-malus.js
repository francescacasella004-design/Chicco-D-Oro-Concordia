import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Aggiornamento Bonus/Malus con i dati reali...');

    // Prima elimina i vecchi score events collegati ai bonus/malus
    // per evitare errori di foreign key
    const existingBM = await prisma.bonusMalus.findMany();
    if (existingBM.length > 0) {
        const bmIds = existingBM.map(bm => bm.id);
        await prisma.scoreEvent.deleteMany({
            where: { bonusMalusId: { in: bmIds } }
        });
        console.log('🗑️  Score events collegati eliminati');
    }

    // Elimina tutti i bonus/malus vecchi
    await prisma.bonusMalus.deleteMany();
    console.log('🗑️  Vecchi bonus/malus eliminati');

    // === BONUS REALI ===
    const bonusData = [
        { description: 'Suona uno strumento durante l\'esibizione', points: 80, category: 'bonus' },
        { description: 'Il pubblico urla il suo nome', points: 50, category: 'bonus' },
        { description: 'Indossa un fiore arancione', points: 50, category: 'bonus' },
        { description: 'Canto con Ballerini', points: 50, category: 'bonus' },
        { description: 'Crea una storia social dove tagghi la parrocchia e usi #Fantachicco2026. NB: vale solo una volta e nei giorni precedenti all\'inizio dello spettacolo (prima del 2 maggio)', points: 50, category: 'bonus' },
        { description: 'Esibizione con "costume a tema"', points: 40, category: 'bonus' },
        { description: 'Coinvolge il pubblico', points: 30, category: 'bonus' },
        { description: 'Inchino con mano sul cuore', points: 30, category: 'bonus' },
        { description: 'Invita uno dei Don sul palco', points: 30, category: 'bonus' },
        { description: 'Dedica l\'esibizione', points: 25, category: 'bonus' },
        { description: 'Esibirsi con un guanto', points: 20, category: 'bonus' },
        { description: 'Indossa occhiali da sole', points: 20, category: 'bonus' },
        { description: 'Spolvera la propria spalla', points: 20, category: 'bonus' },
        { description: 'Saluta la mamma', points: 15, category: 'bonus' },
        { description: 'Abbraccia il conduttore', points: 10, category: 'bonus' },
    ];

    // === MALUS REALI ===
    const malusData = [
        { description: 'Esce senza salutare', points: -30, category: 'malus' },
        { description: 'Dice la parola "Fantachicco" sul palco', points: -30, category: 'malus' },
        { description: 'Non saluta la Giuria del Fantachicco', points: -30, category: 'malus' },
        { description: 'Cade il microfono', points: -20, category: 'malus' },
        { description: 'Dimentica il testo della canzone', points: -20, category: 'malus' },
        { description: 'Dimentica i passi del ballo', points: -20, category: 'malus' },
        { description: 'Il presentatore sbaglia il nome del brano', points: -15, category: 'malus' },
        { description: 'Inciampa', points: -15, category: 'malus' },
    ];

    const allData = [...bonusData, ...malusData];

    for (const bm of allData) {
        await prisma.bonusMalus.create({ data: bm });
    }

    console.log(`✅ ${bonusData.length} bonus creati`);
    console.log(`✅ ${malusData.length} malus creati`);
    console.log(`\n🎉 Totale: ${allData.length} regole bonus/malus inserite!`);
}

main()
    .catch((e) => {
        console.error('❌ Errore:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
