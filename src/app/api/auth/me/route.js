import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
    const user = getUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user });
}

export async function POST() {
    const response = NextResponse.json({ message: 'Logout effettuato' });
    response.cookies.set('fantachicco-token', '', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });
    return response;
}
