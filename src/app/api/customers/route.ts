import { NextResponse } from 'next/server';

export async function GET() {
    const customers = [
        {
            id: 'cust_1',
            email: 'sarah.j@example.com',
            firstName: 'Sarah',
            lastName: 'Jones',
            phone: '+1234567890',
            role: 'customer',
            isActive: true,
            isVerified: true,
            createdAt: '2023-12-01T00:00:00.000Z',
            updatedAt: '2023-12-01T00:00:00.000Z',
        },
        {
            id: 'cust_2',
            email: 'emily.w@example.com',
            firstName: 'Emily',
            lastName: 'Wilson',
            phone: '+1987654321',
            role: 'customer',
            isActive: true,
            isVerified: true,
            createdAt: '2023-11-15T00:00:00.000Z',
            updatedAt: '2023-11-15T00:00:00.000Z',
        },
        {
            id: 'cust_3',
            email: 'm.brown@example.com',
            firstName: 'Michael',
            lastName: 'Brown',
            phone: '+1122334455',
            role: 'customer',
            isActive: true,
            isVerified: true,
            createdAt: '2024-01-10T00:00:00.000Z',
            updatedAt: '2024-01-10T00:00:00.000Z',
        },
    ];

    return NextResponse.json({
        success: true,
        data: customers,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: customers.length,
            itemsPerPage: 10,
        },
    });
}
