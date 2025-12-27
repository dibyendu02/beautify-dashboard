import { NextResponse } from 'next/server';

// Demo bookings data
const DEMO_BOOKINGS = [
    {
        _id: '1',
        customerId: 'cust_1',
        merchantId: 'merchant_123',
        serviceId: 'service_1',
        customer: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com', phone: '+1 555-0101' },
        service: { name: 'Hair Cut & Style', duration: 60, price: 85, currency: 'USD' },
        scheduledDate: '2024-01-15T10:00:00Z',
        status: 'confirmed',
        totalAmount: 85,
        currency: 'USD',
        paymentStatus: 'paid',
        notes: 'Customer prefers layers',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
    },
    {
        _id: '2',
        customerId: 'cust_2',
        merchantId: 'merchant_123',
        serviceId: 'service_2',
        customer: { firstName: 'Emma', lastName: 'Davis', email: 'emma@example.com', phone: '+1 555-0102' },
        service: { name: 'Facial Treatment', duration: 90, price: 120, currency: 'USD' },
        scheduledDate: '2024-01-14T14:30:00Z',
        status: 'completed',
        totalAmount: 120,
        currency: 'USD',
        paymentStatus: 'paid',
        createdAt: '2024-01-09T00:00:00Z',
        updatedAt: '2024-01-14T15:00:00Z',
    },
];

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const booking = DEMO_BOOKINGS.find(b => b._id === id);

        if (!booking) {
            return NextResponse.json(
                { success: false, message: 'Booking not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: booking,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch booking' },
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
        const bookingIndex = DEMO_BOOKINGS.findIndex(b => b._id === id);

        if (bookingIndex === -1) {
            return NextResponse.json(
                { success: false, message: 'Booking not found' },
                { status: 404 }
            );
        }

        const updatedBooking = {
            ...DEMO_BOOKINGS[bookingIndex],
            ...body,
            updatedAt: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            message: 'Booking updated successfully',
            data: updatedBooking,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to update booking' },
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
        const bookingIndex = DEMO_BOOKINGS.findIndex(b => b._id === id);

        if (bookingIndex === -1) {
            return NextResponse.json(
                { success: false, message: 'Booking not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Booking deleted successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to delete booking' },
            { status: 500 }
        );
    }
}
