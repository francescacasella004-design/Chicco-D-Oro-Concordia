import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        let settings = await prisma.settings.findUnique({
            where: { id: 'global' },
        });

        // Initialize if not exists
        if (!settings) {
            settings = await prisma.settings.create({
                data: { id: 'global', registrationOpen: true }
            });
        }

        return NextResponse.json({ registrationOpen: settings.registrationOpen });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Errore nel recupero impostazioni' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
        }

        const { registrationOpen } = await request.json();

        const settings = await prisma.settings.upsert({
            where: { id: 'global' },
            update: { registrationOpen },
            create: { id: 'global', registrationOpen },
        });

        return NextResponse.json({ registrationOpen: settings.registrationOpen });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Errore aggiornamento impostazioni' }, { status: 500 });
    }
}
