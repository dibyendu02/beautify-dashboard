import { NextResponse } from 'next/server';

// Demo services data
const DEMO_SERVICES = [
    {
        _id: '1',
        merchantId: 'merchant_123',
        title: 'Hair Cut & Style',
        description: 'Professional haircut with styling',
        category: 'Hair',
        subCategory: 'Haircut',
        price: 85,
        currency: 'USD',
        duration: 60,
        images: ['/images/haircut.jpg'],
        variants: [],
        isActive: true,
        isPopular: true,
        totalBookings: 156,
        averageRating: 4.8,
        totalReviews: 89,
        tags: ['haircut', 'styling', 'popular'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        _id: '2',
        merchantId: 'merchant_123',
        title: 'Facial Treatment',
        description: 'Deep cleansing facial with massage',
        category: 'Skincare',
        subCategory: 'Facial',
        price: 120,
        currency: 'USD',
        duration: 90,
        images: ['/images/facial.jpg'],
        variants: [],
        isActive: true,
        isPopular: true,
        totalBookings: 98,
        averageRating: 4.9,
        totalReviews: 67,
        tags: ['facial', 'skincare', 'relaxation'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
];

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const service = DEMO_SERVICES.find(s => s._id === id);

        if (!service) {
            return NextResponse.json(
                { success: false, message: 'Service not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: service,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch service' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const serviceIndex = DEMO_SERVICES.findIndex(s => s._id === id);

        if (serviceIndex === -1) {
            return NextResponse.json(
                { success: false, message: 'Service not found' },
                { status: 404 }
            );
        }

        const updatedService = {
            ...DEMO_SERVICES[serviceIndex],
            ...body,
            updatedAt: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            message: 'Service updated successfully',
            data: updatedService,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to update service' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const serviceIndex = DEMO_SERVICES.findIndex(s => s._id === id);

        if (serviceIndex === -1) {
            return NextResponse.json(
                { success: false, message: 'Service not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Service deleted successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to delete service' },
            { status: 500 }
        );
    }
}
