'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Scissors, 
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Star,
  SortAsc,
  SortDesc,
  Grid,
  List
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'booking' | 'customer' | 'service';
  title: string;
  subtitle: string;
  description?: string;
  status?: string;
  date?: string;
  time?: string;
  price?: number;
  rating?: number;
  avatar?: string;
  phone?: string;
  email?: string;
  lastVisit?: string;
  category?: string;
}

// Demo search results data
const demoResults: SearchResult[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Sarah Johnson',
    subtitle: 'Hair Cut & Color',
    description: 'Balayage highlights with trim',
    status: 'confirmed',
    date: '2024-10-05',
    time: '2:00 PM',
    price: 180,
    phone: '+1 (555) 123-4567',
    avatar: 'SJ'
  },
  {
    id: '2',
    type: 'customer',
    title: 'Maria Garcia',
    subtitle: 'Regular Customer',
    description: 'VIP client - Monthly appointments',
    phone: '+1 (555) 234-5678',
    email: 'maria.garcia@email.com',
    lastVisit: '2024-09-28',
    rating: 5,
    avatar: 'MG'
  },
  {
    id: '3',
    type: 'service',
    title: 'Deep Cleansing Facial',
    subtitle: 'Facial Treatments',
    description: 'Advanced facial treatment for deep pore cleansing',
    price: 120,
    category: 'Skincare',
    rating: 4.8
  },
  {
    id: '4',
    type: 'booking',
    title: 'Emma Wilson',
    subtitle: 'Manicure & Pedicure',
    description: 'Gel manicure with nail art',
    status: 'pending',
    date: '2024-10-06',
    time: '11:00 AM',
    price: 85,
    phone: '+1 (555) 345-6789',
    avatar: 'EW'
  },
  {
    id: '5',
    type: 'customer',
    title: 'Jessica Brown',
    subtitle: 'New Customer',
    description: 'First time visit scheduled',
    phone: '+1 (555) 456-7890',
    email: 'jessica.brown@email.com',
    lastVisit: 'Never',
    rating: 0,
    avatar: 'JB'
  },
  {
    id: '6',
    type: 'service',
    title: 'Brazilian Blowout',
    subtitle: 'Hair Treatments',
    description: 'Keratin treatment for smooth, frizz-free hair',
    price: 250,
    category: 'Hair Care',
    rating: 4.9
  }
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'booking' | 'customer' | 'service'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'name' | 'price'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [loading, setLoading] = useState(false);

  // Simulate search
  useEffect(() => {
    if (query) {
      setLoading(true);
      setTimeout(() => {
        const filtered = demoResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          result.description?.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setLoading(false);
      }, 500);
    } else {
      setResults([]);
    }
  }, [query]);

  // Filter and sort results
  useEffect(() => {
    let filtered = results;
    
    // Apply filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(result => result.type === activeFilter);
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          const dateA = a.date ? new Date(a.date) : new Date(0);
          const dateB = b.date ? new Date(b.date) : new Date(0);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case 'price':
          comparison = (a.price || 0) - (b.price || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredResults(filtered);
  }, [results, activeFilter, sortBy, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.history.pushState({}, '', `/merchant/search?q=${encodeURIComponent(searchQuery.trim())}`);
      const filtered = demoResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'customer':
        return <User className="w-5 h-5 text-green-500" />;
      case 'service':
        return <Scissors className="w-5 h-5 text-purple-500" />;
      default:
        return <Search className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Results</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings, customers, services..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'all', label: 'All Results', count: results.length },
              { id: 'booking', label: 'Bookings', count: results.filter(r => r.type === 'booking').length },
              { id: 'customer', label: 'Customers', count: results.filter(r => r.type === 'customer').length },
              { id: 'service', label: 'Services', count: results.filter(r => r.type === 'service').length }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevance">Relevance</option>
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="price">Price</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 border-l border-gray-300 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      ) : filteredResults.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredResults.map((result) => (
            <div
              key={result.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'p-6' : 'p-4'
              }`}
            >
              {viewMode === 'list' ? (
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(result.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {result.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {result.status && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                        )}
                        {result.price && (
                          <span className="text-green-600 font-semibold">
                            ${result.price}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{result.subtitle}</p>
                    {result.description && (
                      <p className="text-sm text-gray-500 mt-1">{result.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      {result.date && result.time && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {result.date} at {result.time}
                        </div>
                      )}
                      {result.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {result.phone}
                        </div>
                      )}
                      {result.rating && result.rating > 0 && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {result.rating}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {getTypeIcon(result.type)}
                    {result.status && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-1">{result.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{result.subtitle}</p>
                  
                  {result.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{result.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    {result.price && (
                      <span className="text-green-600 font-semibold">${result.price}</span>
                    )}
                    {result.rating && result.rating > 0 && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {result.rating}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We couldn't find anything matching "{query}". Try adjusting your search terms or browse by category.
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Enter a search term above to find bookings, customers, or services in your account.
          </p>
        </div>
      )}

      {/* Results Summary */}
      {filteredResults.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Showing {filteredResults.length} of {results.length} results
          {query && ` for "${query}"`}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}