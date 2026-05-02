import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Inizio controllo punteggi in revisione...');

    // 1. Recupera tutti i punteggi in attesa
    const pendingScores = await prisma.pendingScoreEvent.findMany({
        include: {
            competitor: true,
            bonusMalus: true,
            assignedBy: { select: { name: true } }
        }
    });

    console.log(`📊 Totale punteggi in revisione: ${pendingScores.length}`);

    if (pendingScores.length === 0) {
        console.log('✅ Nessun punteggio in revisione da controllare.');
        return;
    }

    // 2. Raggruppa per concorrente, bonus/malus e giorno
    // Chiave: competitorId-bonusMalusId-day
    const groups = {};

    pendingScores.forEach(score => {
        const key = `${score.competitorId}-${score.bonusMalusId}-${score.day}`;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(score);
    });

    const toDelete = [];
    const toKeep = [];

    let countRemovedNoConsensus = 0;
    let countRemovedDuplicates = 0;

    for (const key in groups) {
        const group = groups[key];
        
        // Identifica gli admin unici che hanno assegnato questo specifico bonus
        const uniqueAdmins = new Set(group.map(s => s.assignedById));
        const adminCount = uniqueAdmins.size;

        const firstScore = group[0];
        const compName = firstScore.competitor.name;
        const bmDesc = firstScore.bonusMalus.description;

        if (adminCount < 2) {
            // MANCANZA DI CONSENSO: Solo 1 admin (o 0?) ha messo questo punto
            // Eliminiamo tutti gli ingressi in questo gruppo
            group.forEach(s => toDelete.push(s.id));
            countRemovedNoConsensus += group.length;
            // console.log(`❌ Rimosso (no consenso): ${compName} - ${bmDesc} (Giorno ${firstScore.day}) - Admin: ${[...uniqueAdmins].length}`);
        } else {
            // CONSENSO RAGGIUNTO: Almeno 2 admin diversi hanno messo il punto
            // Teniamo solo UNO di questi ingressi per evitare di triplicare i punti
            
            // Ordiniamo per data per tenere il primo inserito (o uno a caso)
            const sortedGroup = group.sort((a, b) => a.id - b.id);
            toKeep.push(sortedGroup[0].id);
            
            // Tutti gli altri sono duplicati da eliminare
            for (let i = 1; i < sortedGroup.length; i++) {
                toDelete.push(sortedGroup[i].id);
                countRemovedDuplicates++;
            }
            // console.log(`✅ Confermato Consensus: ${compName} - ${bmDesc} (Giorno ${firstScore.day}) - Admin: ${adminCount}`);
        }
    }

    if (toDelete.length > 0) {
        console.log(`\n🧹 Pulizia in corso...`);
        
        // Eseguiamo l'eliminazione
        await prisma.pendingScoreEvent.deleteMany({
            where: {
                id: { in: toDelete }
            }
        });

        console.log(`✅ Pulizia completata!`);
        console.log(`   - Rimosse per mancanza consenso (< 2 admin): ${countRemovedNoConsensus}`);
        console.log(`   - Rimosse come duplicati (consensus raggiunto): ${countRemovedDuplicates}`);
        console.log(`   - Totale rimosse: ${toDelete.length}`);
        
        const remaining = await prisma.pendingScoreEvent.count();
        console.log(`\n📈 Punteggi rimasti pronti per l'invio: ${remaining}`);
    } else {
        console.log('\n✅ Tutto in ordine! Non sono state trovate anomalie.');
    }
}

main()
    .catch((e) => {
        console.error('❌ Errore durante l\'esecuzione:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
