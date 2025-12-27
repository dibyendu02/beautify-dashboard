import { NextResponse } from 'next/server';

export async function GET() {
    // Static dummy data for dashboard stats
    const stats = {
        totalBookings: 124,
        totalRevenue: 15430,
        totalServices: 12,
        averageRating: 4.8,
        pendingBookings: 5,
        completedBookings: 98,
        cancelledBookings: 8,
        recentBookings: [
            {
                id: 'bk-001',
                customer: { name: 'Sarah Jones', email: 'sarah@example.com' },
                service: 'Haircut & Styling',
                date: new Date().toISOString(),
                amount: 85,
                status: 'confirmed',
            },
            {
                id: 'bk-002',
                customer: { name: 'Mike Smith', email: 'mike@example.com' },
                service: 'Beard Trim',
                date: new Date(Date.now() - 86400000).toISOString(),
                amount: 35,
                status: 'completed',
            },
            {
                id: 'bk-003',
                customer: { name: 'Emily Wilson', email: 'emily@example.com' },
                service: 'Manicure',
                date: new Date(Date.now() - 172800000).toISOString(),
                amount: 45,
                status: 'completed',
            },
        ],
        recentReviews: [
            {
                id: 'rv-001',
                customer: 'Alice B.',
                rating: 5,
                comment: 'Great service!',
                date: new Date().toISOString(),
            },
        ],
        monthlyRevenue: [
            { month: 'Jan', revenue: 4500, bookings: 45 },
            { month: 'Feb', revenue: 5200, bookings: 52 },
            { month: 'Mar', revenue: 4800, bookings: 48 },
            { month: 'Apr', revenue: 6100, bookings: 61 },
            { month: 'May', revenue: 5900, bookings: 59 },
            { month: 'Jun', revenue: 7500, bookings: 75 },
        ],
    };

    return NextResponse.json({
        success: true,
        data: stats,
    });
}
