'use client';

import { useState, useMemo } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Search,
  Filter,
  Star,
  Eye,
  Flag,
  Trash2,
  MoreVertical,
  User,
  Calendar,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  customerName: string;
  customerEmail: string;
  businessName: string;
  merchantName: string;
  serviceName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'flagged' | 'hidden';
  isVerified: boolean;
  helpfulVotes: number;
  bookingId: string;
  images?: string[];
  adminResponse?: {
    text: string;
    date: string;
    adminName: string;
  };
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: 'REV-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    businessName: 'Luxe Beauty Spa',
    merchantName: 'Maria Rodriguez',
    serviceName: 'Hydrafacial Treatment',
    rating: 5,
    title: 'Amazing experience!',
    comment: 'Had the most relaxing and rejuvenating facial at Luxe Beauty Spa. Maria and her team are incredibly professional and skilled. My skin looked glowing after the treatment. Will definitely be returning!',
    date: '2024-01-20T15:30:00Z',
    status: 'published',
    isVerified: true,
    helpfulVotes: 12,
    bookingId: 'BK-12345',
    images: ['review1.jpg', 'review2.jpg']
  },
  {
    id: 'REV-002',
    customerName: 'Michael Chen',
    customerEmail: 'michael.c@email.com',
    businessName: 'Urban Hair Studio',
    merchantName: 'James Thompson',
    serviceName: 'Haircut & Style',
    rating: 4,
    title: 'Great haircut!',
    comment: 'James did an excellent job with my haircut. The studio has a modern vibe and the service was professional. Only minor complaint is the wait time was a bit longer than expected.',
    date: '2024-01-19T11:20:00Z',
    status: 'published',
    isVerified: true,
    helpfulVotes: 8,
    bookingId: 'BK-12346'
  },
  {
    id: 'REV-003',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.w@email.com',
    businessName: 'Elite Nail Bar',
    merchantName: 'Sophie Martin',
    serviceName: 'Gel Manicure',
    rating: 3,
    title: 'Average service',
    comment: 'The manicure was okay but nothing special. The nail art was nice but the overall experience was just average. Expected more given the price point.',
    date: '2024-01-18T14:45:00Z',
    status: 'published',
    isVerified: false,
    helpfulVotes: 3,
    bookingId: 'BK-12347'
  },
  {
    id: 'REV-004',
    customerName: 'David Brown',
    customerEmail: 'david.b@email.com',
    businessName: 'Classic Cuts Barbershop',
    merchantName: 'Michael Johnson',
    serviceName: 'Hot Towel Shave',
    rating: 5,
    title: 'Outstanding traditional service',
    comment: 'Michael provided an exceptional hot towel shave experience. The attention to detail and traditional techniques were impressive. This is what a real barbershop should be like!',
    date: '2024-01-17T10:15:00Z',
    status: 'published',
    isVerified: true,
    helpfulVotes: 15,
    bookingId: 'BK-12348',
    adminResponse: {
      text: 'Thank you for the wonderful review! We appreciate your feedback about our traditional services.',
      date: '2024-01-17T16:30:00Z',
      adminName: 'Admin Team'
    }
  },
  {
    id: 'REV-005',
    customerName: 'Lisa Garcia',
    customerEmail: 'lisa.g@email.com',
    businessName: 'Perfect Brows Studio',
    merchantName: 'Amanda Wilson',
    serviceName: 'Microblading',
    rating: 1,
    title: 'Very disappointing',
    comment: 'Extremely unhappy with the microblading service. The results were uneven and not what was promised. When I complained, the staff was unprofessional and rude.',
    date: '2024-01-16T13:20:00Z',
    status: 'flagged',
    isVerified: true,
    helpfulVotes: 6,
    bookingId: 'BK-12349'
  },
  {
    id: 'REV-006',
    customerName: 'Jennifer Lee',
    customerEmail: 'jennifer.l@email.com',
    businessName: 'Zen Wellness Center',
    merchantName: 'Lisa Chen',
    serviceName: 'Deep Tissue Massage',
    rating: 5,
    title: 'Life-changing massage',
    comment: 'Lisa is incredibly skilled and intuitive. The deep tissue massage helped relieve chronic pain I\'ve had for months. The wellness center has a very calming atmosphere.',
    date: '2024-01-15T16:45:00Z',
    status: 'published',
    isVerified: true,
    helpfulVotes: 20,
    bookingId: 'BK-12350'
  },
  {
    id: 'REV-007',
    customerName: 'Robert Taylor',
    customerEmail: 'robert.t@email.com',
    businessName: 'Glow Skin Studio',
    merchantName: 'Dr. Jennifer Park',
    serviceName: 'Chemical Peel',
    rating: 4,
    title: 'Professional treatment',
    comment: 'Dr. Park is very knowledgeable and the chemical peel results were excellent. The clinic is clean and modern. Would recommend for anyone looking for professional skincare.',
    date: '2024-01-14T09:30:00Z',
    status: 'pending',
    isVerified: false,
    helpfulVotes: 0,
    bookingId: 'BK-12351'
  },
  {
    id: 'REV-008',
    customerName: 'Amanda Rodriguez',
    customerEmail: 'amanda.r@email.com',
    businessName: 'Radiant Beauty Lounge',
    merchantName: 'Isabella Garcia',
    serviceName: 'Bridal Makeup',
    rating: 5,
    title: 'Perfect for my wedding!',
    comment: 'Isabella did my bridal makeup and it was absolutely perfect! The makeup lasted all day and looked amazing in photos. She really understood my vision and made me feel beautiful.',
    date: '2024-01-13T12:00:00Z',
    status: 'published',
    isVerified: true,
    helpfulVotes: 18,
    bookingId: 'BK-12352'
  }
];

// Generate more reviews for pagination testing
for (let i = 9; i <= 35; i++) {
  const ratings = [1, 2, 3, 4, 5];
  const statuses = ['published', 'pending', 'flagged', 'hidden'];
  const services = ['Facial', 'Haircut', 'Manicure', 'Massage', 'Waxing'];
  const businesses = ['Beauty Spa', 'Hair Studio', 'Nail Bar', 'Wellness Center', 'Skin Clinic'];
  
  mockReviews.push({
    id: `REV-${i.toString().padStart(3, '0')}`,
    customerName: `Customer ${i}`,
    customerEmail: `customer${i}@email.com`,
    businessName: `${businesses[Math.floor(Math.random() * businesses.length)]} ${i}`,
    merchantName: `Merchant ${i}`,
    serviceName: `${services[Math.floor(Math.random() * services.length)]} Service`,
    rating: ratings[Math.floor(Math.random() * ratings.length)],
    title: `Review ${i} Title`,
    comment: `This is review comment ${i}. The service was ${ratings[Math.floor(Math.random() * ratings.length)] >= 4 ? 'excellent' : 'okay'} and I ${ratings[Math.floor(Math.random() * ratings.length)] >= 4 ? 'would' : 'might'} recommend it to others.`,
    date: new Date(2024, 0, Math.floor(Math.random() * 30 + 1), Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    isVerified: Math.random() > 0.3,
    helpfulVotes: Math.floor(Math.random() * 25),
    bookingId: `BK-${12340 + i}`
  });
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch = 
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === '' || review.status === selectedStatus;
      const matchesRating = selectedRating === '' || review.rating === parseInt(selectedRating);
      
      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, searchTerm, selectedStatus, selectedRating]);

  // Calculate paginated data
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReviews.slice(startIndex, endIndex);
  }, [filteredReviews, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleStatusUpdate = (reviewId: string, newStatus: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: newStatus as any } : review
    ));
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDeleteReview = () => {
    if (reviewToDelete) {
      setReviews(prev => prev.filter(review => review.id !== reviewToDelete));
      setReviewToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const cancelDeleteReview = () => {
    setReviewToDelete(null);
    setShowDeleteModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      case 'hidden':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-4 h-4',
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        )}
      />
    ));
  };

  const statusCounts = {
    published: reviews.filter(r => r.status === 'published').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    flagged: reviews.filter(r => r.status === 'flagged').length,
    hidden: reviews.filter(r => r.status === 'hidden').length,
  };

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Customer Reviews</h1>
            <p className="text-black mt-1">Manage and moderate customer reviews and ratings</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              Export Reviews
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <TrendingUp className="w-4 h-4 mr-2 text-white" />
              <p className="text-white">Analytics</p>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Total Reviews</p>
                <p className="text-2xl font-bold text-blue-600">{reviews.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Published</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.published}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Flagged</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.flagged}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Avg Rating</p>
                <p className="text-2xl font-bold text-purple-600">{averageRating.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by customer, business, or review content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-black bg-white"
                />
              </div>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-black bg-white"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-black bg-white"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Review</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Business</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Rating</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReviews.map((review) => (
                  <tr key={review.id} className="border-b border-slate-100 hover:bg-slate-50 align-top">
                    <td className="py-4 px-4 align-top">
                      <div className="max-w-md">
                        <h3 className="font-semibold text-black">{review.title}</h3>
                        <p className="text-sm text-black mt-1 line-clamp-2">{review.comment}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xs text-black">{new Date(review.date).toLocaleDateString()}</span>
                          {review.isVerified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          )}
                          {review.helpfulVotes > 0 && (
                            <span className="inline-flex items-center text-xs text-gray-600">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {review.helpfulVotes}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div>
                        <p className="font-medium text-black">{review.customerName}</p>
                        <p className="text-sm text-black">{review.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div>
                        <p className="font-medium text-black">{review.businessName}</p>
                        <p className="text-sm text-black">{review.serviceName}</p>
                        <p className="text-xs text-black mt-1">by {review.merchantName}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="text-sm font-medium text-black ml-2">{review.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                          getStatusColor(review.status)
                        )}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setShowModal(true);
                          }}
                          className="p-2 text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="View Review Details"
                        >
                          <Eye className="w-4 h-4 text-gray-800" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(review.id, 'flagged')}
                          className="p-2 text-gray-800 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                          title="Flag Review"
                        >
                          <Flag className="w-4 h-4 text-gray-800" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-2 text-gray-800 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4 text-gray-800" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedReviews.length === 0 && filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">No reviews found</h3>
              <p className="text-black">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredReviews.length > itemsPerPage && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredReviews.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              showItemsPerPageSelector={true}
              showTotalItems={true}
              showPageNumbers={true}
              itemsPerPageOptions={[5, 10, 25, 50]}
              className="justify-between"
            />
          </div>
        )}

        {/* Review Detail Modal */}
        {showModal && selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" onClick={() => setShowModal(false)} />
            
            <div className="bg-white rounded-lg shadow-2xl transform transition-all max-w-4xl w-full max-h-[90vh] overflow-hidden relative z-10">
              <div className="flex flex-col h-full">
                <div className="bg-white px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-black">
                      Review Details - {selectedReview.id}
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-black hover:text-gray-600"
                    >
                      <X className="w-6 h-6 text-black" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-black mb-3">Review Information</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <label className="font-medium text-black">Title:</label>
                          <p className="text-black">{selectedReview.title}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Comment:</label>
                          <p className="text-black">{selectedReview.comment}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Rating:</label>
                          <div className="flex items-center space-x-1">
                            {renderStars(selectedReview.rating)}
                            <span className="font-medium text-black ml-2">{selectedReview.rating}/5</span>
                          </div>
                        </div>
                        <div>
                          <label className="font-medium text-black">Date:</label>
                          <p className="text-black">{new Date(selectedReview.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Helpful Votes:</label>
                          <p className="text-black">{selectedReview.helpfulVotes}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-black mb-3">Customer & Business</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <label className="font-medium text-black">Customer:</label>
                          <p className="text-black">{selectedReview.customerName}</p>
                          <p className="text-black">{selectedReview.customerEmail}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Business:</label>
                          <p className="text-black">{selectedReview.businessName}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Service:</label>
                          <p className="text-black">{selectedReview.serviceName}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Merchant:</label>
                          <p className="text-black">{selectedReview.merchantName}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Booking ID:</label>
                          <p className="text-black">{selectedReview.bookingId}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Verified:</label>
                          <p className="text-black">{selectedReview.isVerified ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedReview.adminResponse && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-black mb-3">Admin Response</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-black">{selectedReview.adminResponse.text}</p>
                        <p className="text-xs text-gray-600 mt-2">
                          By {selectedReview.adminResponse.adminName} on {new Date(selectedReview.adminResponse.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-slate-50 px-6 py-4 flex justify-between space-x-3">
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => handleStatusUpdate(selectedReview.id, 'published')}
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <p className="text-green-600">Publish</p>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleStatusUpdate(selectedReview.id, 'flagged')}
                      className="border-orange-600 text-orange-600 hover:bg-orange-50"
                    >
                      <p className="text-orange-600">Flag</p>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleStatusUpdate(selectedReview.id, 'hidden')}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <p className="text-red-600">Hide</p>
                    </Button>
                  </div>
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    <p className="text-gray-700">Close</p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Delete Review</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this review? This will permanently remove the review and all associated data.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={cancelDeleteReview}
                  >
                    <p className="text-gray-700">Cancel</p>
                  </Button>
                  <Button
                    onClick={confirmDeleteReview}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <p className="text-white">Delete Review</p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}