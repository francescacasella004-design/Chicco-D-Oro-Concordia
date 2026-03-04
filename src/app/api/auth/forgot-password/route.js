import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email è obbligatoria' },
                { status: 400 }
            );
        }

        // Always respond with success (don't reveal if email exists)
        const successResponse = NextResponse.json({
            message: 'Se l\'email è registrata, riceverai un link per reimpostare la password.',
        });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return successResponse;
        }

        // Delete any existing tokens for this email
        await prisma.passwordResetToken.deleteMany({ where: { email } });

        // Generate secure token
        const token = crypto.randomBytes(32).toString('hex');

        // Save token with 1 hour expiry
        await prisma.passwordResetToken.create({
            data: {
                token,
                email,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            },
        });

        // Send email
        await sendPasswordResetEmail(email, token);

        return successResponse;
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Errore durante l\'invio dell\'email' },
            { status: 500 }
        );
    }
}
