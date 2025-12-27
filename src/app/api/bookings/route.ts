import { NextResponse } from 'next/server';

export async function GET() {
    // Static dummy data for bookings
    const bookings = [
        {
            id: 'bk_1',
            customerId: 'cust_1',
            merchantId: 'merch_1',
            serviceId: 'srv_1',
            appointmentDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            status: 'confirmed',
            serviceDetails: {
                title: 'Haircut & Styling',
                duration: 60,
                price: 85,
                currency: 'EUR',
            },
            customerDetails: {
                firstName: 'Sarah',
                lastName: 'Jones',
                email: 'sarah.j@example.com',
                phone: '+1234567890',
            },
            paymentStatus: 'paid',
            totalAmount: 85,
            currency: 'EUR',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: 'bk_2',
            customerId: 'cust_2',
            merchantId: 'merch_1',
            serviceId: 'srv_2',
            appointmentDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            status: 'completed',
            serviceDetails: {
                title: 'Manicure Deluxe',
                duration: 45,
                price: 45,
                currency: 'EUR',
            },
            customerDetails: {
                firstName: 'Emily',
                lastName: 'Wilson',
                email: 'emily.w@example.com',
                phone: '+1987654321',
            },
            paymentStatus: 'paid',
            totalAmount: 45,
            currency: 'EUR',
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: 'bk_3',
            customerId: 'cust_3',
            merchantId: 'merch_1',
            serviceId: 'srv_3',
            appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString(), // In 2 days
            status: 'pending',
            serviceDetails: {
                title: 'Full Body Massage',
                duration: 90,
                price: 120,
                currency: 'EUR',
            },
            customerDetails: {
                firstName: 'Michael',
                lastName: 'Brown',
                email: 'm.brown@example.com',
                phone: '+1122334455',
            },
            paymentStatus: 'pending',
            totalAmount: 120,
            currency: 'EUR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    return NextResponse.json({
        success: true,
        data: bookings,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: bookings.length,
            itemsPerPage: 10,
        },
    });
}
