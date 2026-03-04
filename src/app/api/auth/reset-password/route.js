import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token e password sono obbligatori' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'La password deve avere almeno 6 caratteri' },
                { status: 400 }
            );
        }

        // Find the token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken) {
            return NextResponse.json(
                { error: 'Link non valido o già utilizzato' },
                { status: 400 }
            );
        }

        // Check expiration
        if (new Date() > resetToken.expiresAt) {
            // Delete expired token
            await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
            return NextResponse.json(
                { error: 'Il link è scaduto. Richiedi un nuovo reset della password.' },
                { status: 400 }
            );
        }

        // Find user and update password
        const passwordHash = await hashPassword(password);
        await prisma.user.update({
            where: { email: resetToken.email },
            data: { passwordHash },
        });

        // Delete the used token
        await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

        return NextResponse.json({
            message: 'Password reimpostata con successo!',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Errore durante il reset della password' },
            { status: 500 }
        );
    }
}
