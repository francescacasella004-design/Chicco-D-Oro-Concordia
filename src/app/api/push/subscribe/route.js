import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const subscription = await request.json();

        if (!subscription || !subscription.endpoint) {
            return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
        }

        // Save to DB (upsert to avoid duplicates if endpoint exists)
        const savedSubscription = await prisma.pushSubscription.upsert({
            where: { endpoint: subscription.endpoint },
            update: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
            create: {
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
        });

        return NextResponse.json({ success: true, id: savedSubscription.id });
    } catch (error) {
        console.error('Error saving subscription:', error);
        return NextResponse.json({ error: 'Internal User Error' }, { status: 500 });
    }
}
