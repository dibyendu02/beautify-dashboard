import { NextResponse } from 'next/server';

// Demo merchant profile data
const DEMO_MERCHANT_PROFILE = {
    id: 'merchant_123',
    userId: 'user_123',
    businessName: 'Beautify Demo Salon',
    description: 'Premium beauty and wellness services in the heart of the city. Specializing in hair styling, skincare, and spa treatments.',
    email: 'merchant@beautify.com',
    phone: '+1 (555) 123-4567',
    address: {
        street: '123 Beauty Lane',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        zipCode: '94102',
        coordinates: {
            latitude: 37.7749,
            longitude: -122.4194,
        },
    },
    contactInfo: {
        phone: '+1 (555) 123-4567',
        email: 'merchant@beautify.com',
        website: 'https://beautifydemo.com',
        socialMedia: {
            facebook: 'https://facebook.com/beautifydemo',
            instagram: 'https://instagram.com/beautifydemo',
            twitter: 'https://twitter.com/beautifydemo',
        },
    },
    businessHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '20:00', closed: false },
        friday: { open: '09:00', close: '20:00', closed: false },
        saturday: { open: '10:00', close: '17:00', closed: false },
        sunday: { open: '00:00', close: '00:00', closed: true },
    },
    images: [
        '/images/salon-1.jpg',
        '/images/salon-2.jpg',
        '/images/salon-3.jpg',
    ],
    categories: ['Hair Salon', 'Spa', 'Beauty'],
    averageRating: 4.8,
    totalReviews: 247,
    isVerified: true,
    isActive: true,
    isFeatured: true,
    isVIP: false,
    currency: 'USD',
    acceptedPaymentMethods: ['Credit Card', 'Debit Card', 'Cash', 'Apple Pay'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
};

export async function GET() {
    try {
        return NextResponse.json({
            success: true,
            data: DEMO_MERCHANT_PROFILE,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch merchant profile' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        // Merge updates with existing profile
        const updatedProfile = {
            ...DEMO_MERCHANT_PROFILE,
            ...body,
            updatedAt: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to update merchant profile' },
            { status: 500 }
        );
    }
}
