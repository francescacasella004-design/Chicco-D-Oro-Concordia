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

        return NextResponse.json({ 
            registrationOpen: settings.registrationOpen,
            resultsPublished: settings.resultsPublished || false
        });
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

        const data = await request.json();
        
        const updateData = {};
        if (data.registrationOpen !== undefined) updateData.registrationOpen = data.registrationOpen;
        if (data.resultsPublished !== undefined) updateData.resultsPublished = data.resultsPublished;

        const settings = await prisma.settings.upsert({
            where: { id: 'global' },
            update: updateData,
            create: { id: 'global', ...updateData },
        });

        return NextResponse.json({ 
            registrationOpen: settings.registrationOpen,
            resultsPublished: settings.resultsPublished 
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Errore aggiornamento impostazioni' }, { status: 500 });
    }
}
