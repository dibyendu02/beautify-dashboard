import { NextResponse } from 'next/server';

// Demo customers data
const DEMO_CUSTOMERS = [
    {
        _id: 'cust_1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@example.com',
        phone: '+1 555-0101',
        avatar: null,
        totalBookings: 12,
        totalSpent: 1240,
        lastVisit: '2024-01-15T10:00:00Z',
        createdAt: '2023-06-15T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        _id: 'cust_2',
        firstName: 'Emma',
        lastName: 'Davis',
        email: 'emma@example.com',
        phone: '+1 555-0102',
        avatar: null,
        totalBookings: 8,
        totalSpent: 890,
        lastVisit: '2024-01-14T14:30:00Z',
        createdAt: '2023-08-20T00:00:00Z',
        updatedAt: '2024-01-14T14:30:00Z',
    },
];

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const customer = DEMO_CUSTOMERS.find(c => c._id === id);

        if (!customer) {
            return NextResponse.json(
                { success: false, message: 'Customer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: customer,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch customer' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const customerIndex = DEMO_CUSTOMERS.findIndex(c => c._id === id);

        if (customerIndex === -1) {
            return NextResponse.json(
                { success: false, message: 'Customer not found' },
                { status: 404 }
            );
        }

        const updatedCustomer = {
            ...DEMO_CUSTOMERS[customerIndex],
            ...body,
            updatedAt: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            message: 'Customer updated successfully',
            data: updatedCustomer,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to update customer' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const customerIndex = DEMO_CUSTOMERS.findIndex(c => c._id === id);

        if (customerIndex === -1) {
            return NextResponse.json(
                { success: false, message: 'Customer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Customer deleted successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to delete customer' },
            { status: 500 }
        );
    }
}
