import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const staticEmail = process.env.STATIC_EMAIL;
        const staticPassword = process.env.STATIC_PASSWORD;

        if (!staticEmail || !staticPassword) {
            console.error('Static credentials not configured in environment variables');
            return NextResponse.json(
                { success: false, message: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (email === staticEmail && password === staticPassword) {
            // Return a dummy user and token
            return NextResponse.json({
                success: true,
                data: {
                    user: {
                        id: 'merchant_123',
                        email: staticEmail,
                        firstName: 'Demo',
                        lastName: 'Merchant',
                        role: 'merchant',
                        businessName: 'Beautify Demo Salon',
                    },
                    token: 'dummy_jwt_token_123456789',
                },
            });
        }

        return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Invalid request format' },
            { status: 400 }
        );
    }
}
