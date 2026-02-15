import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Inizio seed database Supabase...');

    // Pulisci tutto
    await prisma.scoreEvent.deleteMany();
    await prisma.teamCompetitor.deleteMany();
    await prisma.team.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.bonusMalus.deleteMany();
    await prisma.competitor.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️  Tabelle pulite');

    // ===== ADMIN =====
    const adminHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: { email: 'admin@fantachicco.it', passwordHash: adminHash, name: 'Organizzatore', role: 'admin' },
    });
    console.log('👤 Admin creato: admin@fantachicco.it / admin123');

    // ===== GIOCATORI DI ESEMPIO =====
    const playerHash = await bcrypt.hash('password123', 10);
    const players = [];
    const playerNames = [
        { email: 'maria.rossi@example.com', name: 'Maria Rossi' },
        { email: 'luca.bianchi@example.com', name: 'Luca Bianchi' },
        { email: 'giulia.verdi@example.com', name: 'Giulia Verdi' },
        { email: 'marco.ferrari@example.com', name: 'Marco Ferrari' },
        { email: 'anna.romano@example.com', name: 'Anna Romano' },
    ];
    for (const p of playerNames) {
        const user = await prisma.user.create({
            data: { email: p.email, passwordHash: playerHash, name: p.name, role: 'player' },
        });
        players.push(user);
    }
    console.log('👥 5 giocatori creati');

    // ===== CONCORRENTI =====
    const competitorData = [
        // Bambini
        { name: 'Sofia Greco', type: 'bambino', cost: 25 },
        { name: 'Lorenzo Conti', type: 'bambino', cost: 22 },
        { name: 'Emma Rizzo', type: 'bambino', cost: 20 },
        { name: 'Alessandro Gallo', type: 'bambino', cost: 18 },
        { name: 'Beatrice Lombardi', type: 'bambino', cost: 15 },
        { name: 'Tommaso Moretti', type: 'bambino', cost: 15 },
        { name: 'Aurora Barbieri', type: 'bambino', cost: 12 },
        { name: 'Gabriele Costa', type: 'bambino', cost: 12 },
        { name: 'Chiara Fontana', type: 'bambino', cost: 10 },
        { name: 'Matteo Esposito', type: 'bambino', cost: 10 },
        { name: 'Giorgia Serra', type: 'bambino', cost: 8 },
        { name: 'Francesco Marini', type: 'bambino', cost: 8 },
        { name: 'Martina Leone', type: 'bambino', cost: 6 },
        { name: 'Davide Pellegrini', type: 'bambino', cost: 6 },
        { name: 'Sara Colombo', type: 'bambino', cost: 5 },
        // Animatori
        { name: 'Don Marco', type: 'animatore', cost: 30 },
        { name: 'Valentina Ricci', type: 'animatore', cost: 28 },
        { name: 'Andrea Martini', type: 'animatore', cost: 25 },
        { name: 'Federica Bruno', type: 'animatore', cost: 22 },
        { name: 'Simone De Luca', type: 'animatore', cost: 20 },
        { name: 'Elisa Mancini', type: 'animatore', cost: 18 },
        { name: 'Nicola Testa', type: 'animatore', cost: 16 },
        { name: 'Roberta Grassi', type: 'animatore', cost: 14 },
        { name: 'Daniele Fabbri', type: 'animatore', cost: 12 },
        { name: 'Laura Vitale', type: 'animatore', cost: 10 },
        { name: 'Paolo Santoro', type: 'animatore', cost: 10 },
        { name: 'Claudia Caruso', type: 'animatore', cost: 8 },
        { name: 'Giuseppe Ferrara', type: 'animatore', cost: 8 },
        { name: 'Monica Rinaldi', type: 'animatore', cost: 6 },
        { name: 'Roberto Gatti', type: 'animatore', cost: 5 },
    ];

    const competitors = [];
    for (const c of competitorData) {
        const comp = await prisma.competitor.create({ data: c });
        competitors.push(comp);
    }
    console.log(`🎤 ${competitors.length} concorrenti creati`);

    // ===== BONUS / MALUS =====
    const bmData = [
        { description: 'Esibizione perfetta', points: 25, category: 'base' },
        { description: 'Buona esibizione', points: 15, category: 'base' },
        { description: 'Esibizione nella media', points: 5, category: 'base' },
        { description: 'Standing ovation del pubblico', points: 20, category: 'pubblico' },
        { description: 'Applausi scroscianti', points: 10, category: 'pubblico' },
        { description: 'Pubblico distratto', points: -5, category: 'pubblico' },
        { description: 'Momento comico memorabile', points: 15, category: 'speciale' },
        { description: 'Improvvisazione geniale', points: 20, category: 'speciale' },
        { description: 'Costume originale', points: 10, category: 'stile' },
        { description: 'Look coordinato col tema', points: 5, category: 'stile' },
        { description: 'Interazione col pubblico', points: 10, category: 'intrattenimento' },
        { description: 'Ballo scatenato', points: 15, category: 'intrattenimento' },
        { description: 'Dimenticato il testo', points: -10, category: 'errore' },
        { description: 'Stonatura clamorosa', points: -15, category: 'errore' },
        { description: 'Caduta sul palco', points: -5, category: 'errore' },
    ];

    const bonusMalus = [];
    for (const bm of bmData) {
        const rule = await prisma.bonusMalus.create({ data: bm });
        bonusMalus.push(rule);
    }
    console.log(`📋 ${bonusMalus.length} regole bonus/malus create`);

    // ===== SQUADRE DI ESEMPIO =====
    const teamConfigs = [
        { name: 'I Magnifici 5', playerIdx: 0, members: [0, 3, 7, 15, 24], captainIdx: 0 },
        { name: 'Dream Team Chicco', playerIdx: 1, members: [1, 5, 10, 17, 22], captainIdx: 17 },
        { name: 'Le Stelle del Carmelo', playerIdx: 2, members: [2, 6, 11, 19, 28], captainIdx: 2 },
        { name: 'Squadra Azzurra', playerIdx: 3, members: [4, 8, 14, 20, 26], captainIdx: 20 },
        { name: 'I Chicchi d\'Oro', playerIdx: 4, members: [9, 12, 16, 21, 29], captainIdx: 16 },
    ];

    const teams = [];
    for (const tc of teamConfigs) {
        const team = await prisma.team.create({
            data: {
                name: tc.name,
                userId: players[tc.playerIdx].id,
                captainId: competitors[tc.captainIdx].id,
                competitors: {
                    create: tc.members.map(idx => ({ competitorId: competitors[idx].id })),
                },
            },
        });
        teams.push(team);
    }
    console.log(`🏆 ${teams.length} squadre create`);

    // ===== PUNTEGGI DI ESEMPIO =====
    const scoreAssignments = [
        // Sofia Greco — ottima esibizione
        { compIdx: 0, bmIdx: 0, desc: 'Esibizione perfetta' },
        { compIdx: 0, bmIdx: 3, desc: 'Standing ovation' },
        { compIdx: 0, bmIdx: 8, desc: 'Costume originale' },
        // Lorenzo Conti
        { compIdx: 1, bmIdx: 1, desc: 'Buona esibizione' },
        { compIdx: 1, bmIdx: 4, desc: 'Applausi scroscianti' },
        // Emma Rizzo
        { compIdx: 2, bmIdx: 0, desc: 'Esibizione perfetta' },
        { compIdx: 2, bmIdx: 7, desc: 'Improvvisazione geniale' },
        // Alessandro Gallo — qualche errore
        { compIdx: 3, bmIdx: 2, desc: 'Nella media' },
        { compIdx: 3, bmIdx: 12, desc: 'Dimenticato il testo' },
        // Beatrice Lombardi
        { compIdx: 4, bmIdx: 1, desc: 'Buona esibizione' },
        { compIdx: 4, bmIdx: 10, desc: 'Interazione pubblico' },
        // Tommaso Moretti
        { compIdx: 5, bmIdx: 6, desc: 'Momento comico' },
        { compIdx: 5, bmIdx: 11, desc: 'Ballo scatenato' },
        // Don Marco — protagonista!
        { compIdx: 15, bmIdx: 0, desc: 'Esibizione perfetta' },
        { compIdx: 15, bmIdx: 3, desc: 'Standing ovation' },
        { compIdx: 15, bmIdx: 7, desc: 'Improvvisazione geniale' },
        { compIdx: 15, bmIdx: 11, desc: 'Ballo scatenato' },
        // Valentina Ricci
        { compIdx: 16, bmIdx: 1, desc: 'Buona esibizione' },
        { compIdx: 16, bmIdx: 8, desc: 'Costume originale' },
        // Andrea Martini — errori
        { compIdx: 17, bmIdx: 2, desc: 'Nella media' },
        { compIdx: 17, bmIdx: 13, desc: 'Stonatura clamorosa' },
        // Simone De Luca
        { compIdx: 19, bmIdx: 1, desc: 'Buona esibizione' },
        { compIdx: 19, bmIdx: 6, desc: 'Momento comico' },
        // Aurora Barbieri
        { compIdx: 6, bmIdx: 0, desc: 'Esibizione perfetta' },
        { compIdx: 6, bmIdx: 4, desc: 'Applausi' },
        // Nicola Testa
        { compIdx: 21, bmIdx: 1, desc: 'Buona esibizione' },
        // Laura Vitale
        { compIdx: 24, bmIdx: 2, desc: 'Nella media' },
        { compIdx: 24, bmIdx: 9, desc: 'Look coordinato' },
    ];

    for (const sa of scoreAssignments) {
        await prisma.scoreEvent.create({
            data: {
                competitorId: competitors[sa.compIdx].id,
                bonusMalusId: bonusMalus[sa.bmIdx].id,
                assignedById: admin.id,
            },
        });
    }
    console.log(`⭐ ${scoreAssignments.length} punteggi assegnati`);

    // ===== AVVISI =====
    await prisma.announcement.createMany({
        data: [
            {
                title: '🎉 Iscrizioni Fantachicco aperte!',
                content: 'Le iscrizioni al Fantachicco sono ufficialmente aperte! Registratevi sul sito e create la vostra squadra dei sogni. Avete 100 crediti per scegliere 5 concorrenti. Buona fortuna!',
                pinned: true,
            },
            {
                title: '📅 Data evento confermata',
                content: 'L\'evento Chicco D\'Oro si terrà sabato 15 marzo nella sala della parrocchia. Le esibizioni inizieranno alle ore 16:00. Vi aspettiamo numerosi!',
                pinned: true,
            },
            {
                title: '🏆 Premi per i vincitori',
                content: 'Quest\'anno ci saranno premi speciali per le prime 3 squadre classificate! Il primo premio sarà una sorpresa... restate sintonizzati!',
                pinned: false,
            },
        ],
    });
    console.log('📢 3 avvisi creati');

    console.log('\n✅ Seed completato con successo!');
    console.log('   Admin: admin@fantachicco.it / admin123');
    console.log('   Giocatori: password123 (tutti)');
}

main()
    .catch((e) => { console.error('❌ Errore:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
