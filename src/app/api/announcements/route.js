import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
        });
        return NextResponse.json({ announcements });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nel caricamento avvisi' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
        }
        const { title, content, pinned } = await request.json();
        if (!title || !content) {
            return NextResponse.json({ error: 'Titolo e contenuto obbligatori' }, { status: 400 });
        }
        const announcement = await prisma.announcement.create({
            data: { title, content, pinned: pinned || false },
        });

        // --- TRIGGER PUSH NOTIFICATIONS ---
        try {
            const webPush = require('web-push');

            // Configura le chiavi (meglio spostare questo in un lib/push.js se cresce)
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
            const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:dev@fantachicco.local';

            if (vapidPublicKey && vapidPrivateKey) {
                webPush.setVapidDetails(
                    vapidSubject,
                    vapidPublicKey,
                    vapidPrivateKey
                );

                // Recupera tutte le sottoscrizioni
                const subscriptions = await prisma.pushSubscription.findMany();

                const payload = JSON.stringify({
                    title: `Nuovo Avviso: ${title}`,
                    body: content.length > 50 ? content.substring(0, 50) + '...' : content,
                    url: '/avvisi', // Link da aprire
                    icon: '/icon-192x192.png'
                });

                // Invia a tutti (in parallelo ma senza bloccare la risposta API)
                // Usiamo Promise.allSettled per non fermarci se uno fallisce
                Promise.allSettled(subscriptions.map(sub => {
                    const pushConfig = {
                        endpoint: sub.endpoint,
                        keys: { p256dh: sub.p256dh, auth: sub.auth }
                    };
                    return webPush.sendNotification(pushConfig, payload).catch(err => {
                        if (err.statusCode === 410 || err.statusCode === 404) {
                            // Subscription expired check
                            return prisma.pushSubscription.delete({ where: { id: sub.id } });
                        }
                        throw err;
                    });
                })).catch(err => console.error('Push error:', err));
            }
        } catch (pushError) {
            console.error('Failed to trigger push notifications:', pushError);
            // Non blocchiamo la risposta: l'avviso è stato creato comunque
        }
        // ----------------------------------

        return NextResponse.json({ announcement }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nella creazione avviso' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
        }
        const { id, title, content, pinned } = await request.json();
        if (!id || !title || !content) {
            return NextResponse.json({ error: 'Dati incompleti' }, { status: 400 });
        }
        const announcement = await prisma.announcement.update({
            where: { id: parseInt(id) },
            data: { title, content, pinned: pinned || false },
        });
        return NextResponse.json({ announcement });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nella modifica' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id'));
        if (!id) {
            return NextResponse.json({ error: 'ID obbligatorio' }, { status: 400 });
        }
        await prisma.announcement.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nella cancellazione' }, { status: 500 });
    }
}
