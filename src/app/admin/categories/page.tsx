'use client';

import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  Eye,
  EyeOff,
  Settings,
  Palette,
  X,
  Sparkles,
  Scissors,
  Hand,
  Heart,
  Droplets,
  Crown,
  Flower2,
  Star,
  Snowflake,
  User,
  LucideIcon
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';

interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  serviceCount?: number;
}

interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
}

// Icon mapping for categories
const categoryIcons: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  scissors: Scissors,
  hand: Hand,
  heart: Heart,
  droplets: Droplets,
  crown: Crown,
  flower: Flower2,
  star: Star,
  snowflake: Snowflake,
  user: User,
  eye: Eye,
};

// Mock categories data
const mockCategories: Category[] = [
  {
    _id: 'cat-001',
    name: 'Facial Treatments',
    description: 'Professional facial care and skin treatments',
    icon: 'sparkles',
    color: '#ec4899',
    isActive: true,
    sortOrder: 1,
    serviceCount: 25,
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:22:00Z'
  },
  {
    _id: 'cat-002',
    name: 'Hair Services',
    description: 'Hair cutting, styling, and coloring services',
    icon: 'scissors',
    color: '#3b82f6',
    isActive: true,
    sortOrder: 2,
    serviceCount: 32,
    createdAt: '2023-01-15T10:31:00Z',
    updatedAt: '2024-01-18T09:15:00Z'
  },
  {
    _id: 'cat-003',
    name: 'Nail Care',
    description: 'Manicure, pedicure, and nail art services',
    icon: 'hand',
    color: '#f59e0b',
    isActive: true,
    sortOrder: 3,
    serviceCount: 18,
    createdAt: '2023-01-15T10:32:00Z',
    updatedAt: '2024-01-19T16:45:00Z'
  },
  {
    _id: 'cat-004',
    name: 'Massage Therapy',
    description: 'Therapeutic and relaxation massage treatments',
    icon: 'heart',
    color: '#10b981',
    isActive: true,
    sortOrder: 4,
    serviceCount: 14,
    createdAt: '2023-01-15T10:33:00Z',
    updatedAt: '2024-01-17T11:30:00Z'
  },
  {
    _id: 'cat-005',
    name: 'Makeup Services',
    description: 'Professional makeup application and lessons',
    icon: 'sparkles',
    color: '#8b5cf6',
    isActive: true,
    sortOrder: 5,
    serviceCount: 12,
    createdAt: '2023-01-20T14:15:00Z',
    updatedAt: '2024-01-16T13:20:00Z'
  },
  {
    _id: 'cat-006',
    name: 'Eyebrow & Lash',
    description: 'Eyebrow shaping, microblading, and lash extensions',
    icon: 'eye',
    color: '#ef4444',
    isActive: true,
    sortOrder: 6,
    serviceCount: 15,
    createdAt: '2023-02-01T09:45:00Z',
    updatedAt: '2024-01-15T10:10:00Z'
  },
  {
    _id: 'cat-007',
    name: 'Body Treatments',
    description: 'Body wraps, scrubs, and spa treatments',
    icon: 'flower',
    color: '#06b6d4',
    isActive: true,
    sortOrder: 7,
    serviceCount: 20,
    createdAt: '2023-02-05T11:20:00Z',
    updatedAt: '2024-01-14T15:55:00Z'
  },
  {
    _id: 'cat-008',
    name: 'Skincare',
    description: 'Advanced skincare treatments and consultations',
    icon: 'droplets',
    color: '#84cc16',
    isActive: true,
    sortOrder: 8,
    serviceCount: 22,
    createdAt: '2023-02-10T16:30:00Z',
    updatedAt: '2024-01-13T12:40:00Z'
  },
  {
    _id: 'cat-009',
    name: 'Wellness',
    description: 'Holistic wellness and alternative therapies',
    icon: 'snowflake',
    color: '#6366f1',
    isActive: false,
    sortOrder: 9,
    serviceCount: 8,
    createdAt: '2023-03-01T08:15:00Z',
    updatedAt: '2024-01-12T09:25:00Z'
  },
  {
    _id: 'cat-010',
    name: 'Men\'s Grooming',
    description: 'Specialized grooming services for men',
    icon: 'user',
    color: '#dc2626',
    isActive: true,
    sortOrder: 10,
    serviceCount: 16,
    createdAt: '2023-03-15T13:45:00Z',
    updatedAt: '2024-01-11T14:30:00Z'
  },
  {
    _id: 'cat-011',
    name: 'Bridal Services',
    description: 'Complete bridal beauty packages',
    icon: 'crown',
    color: '#fbbf24',
    isActive: true,
    sortOrder: 11,
    serviceCount: 9,
    createdAt: '2023-04-01T10:00:00Z',
    updatedAt: '2024-01-10T16:15:00Z'
  },
  {
    _id: 'cat-012',
    name: 'Teen Services',
    description: 'Age-appropriate beauty services for teenagers',
    icon: 'star',
    color: '#f472b6',
    isActive: false,
    sortOrder: 12,
    serviceCount: 5,
    createdAt: '2023-04-20T15:30:00Z',
    updatedAt: '2024-01-09T11:45:00Z'
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon: '',
    color: '#6366f1',
    sortOrder: 0,
  });

  const iconOptions = [
    'sparkles', 'scissors', 'hand', 'heart', 'droplets', 'crown',
    'flower', 'star', 'snowflake', 'user', 'eye'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        // Update existing category
        setCategories(prev => prev.map(cat => 
          cat._id === editingCategory._id 
            ? {
                ...cat,
                ...formData,
                updatedAt: new Date().toISOString()
              }
            : cat
        ));
      } else {
        // Add new category
        const newCategory: Category = {
          _id: `cat-${Date.now()}`,
          ...formData,
          isActive: true,
          serviceCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCategories(prev => [...prev, newCategory]);
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#6366f1',
      sortOrder: category.sortOrder,
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleToggleStatus = async (categoryId: string) => {
    try {
      setCategories(prev => prev.map(cat => 
        cat._id === categoryId 
          ? { ...cat, isActive: !cat.isActive, updatedAt: new Date().toISOString() }
          : cat
      ));
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: '#6366f1',
      sortOrder: 0,
    });
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginate filtered categories
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const activeCategories = categories.filter(cat => cat.isActive).length;
  const totalServices = categories.reduce((sum, cat) => sum + (cat.serviceCount || 0), 0);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black">Service Categories</h1>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Service Categories</h1>
            <p className="text-black mt-1">Manage categories for beauty services</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            className="border-black text-black hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2 text-black" />
            <p className="text-black">Add Category</p>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Total Categories</p>
                <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Active Categories</p>
                <p className="text-2xl font-bold text-green-600">{activeCategories}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Total Services</p>
                <p className="text-2xl font-bold text-purple-600">{totalServices}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-black bg-white"
              />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedCategories.map((category) => (
            <div key={category._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  {category.icon && (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: category.color + '20', color: category.color }}
                    >
                      {(() => {
                        const IconComponent = categoryIcons[category.icon];
                        return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
                      })()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-black truncate">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-black mt-1 line-clamp-2">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleStatus(category._id)}
                    className={`p-2 rounded-lg transition-colors duration-200 border ${
                      category.isActive 
                        ? 'text-blue-700 bg-blue-100 border-blue-300 hover:bg-blue-200' 
                        : 'text-gray-500 bg-gray-100 border-gray-300 hover:bg-gray-200'
                    }`}
                    title={category.isActive ? 'Click to deactivate' : 'Click to activate'}
                  >
                    {category.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <div className="relative group">
                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button
                        onClick={() => handleEdit(category)}
                        className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <Edit2 className="w-3 h-3 mr-2 text-gray-700" />
                        <p className="text-gray-700">Edit</p>
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <Trash2 className="w-3 h-3 mr-2 text-red-600" />
                        <p className="text-red-600">Delete</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{category.serviceCount || 0} services</span>
                <span className={`px-2 py-1 rounded-full ${
                  category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">No categories found</h3>
            <p className="text-black">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Create your first service category to get started.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredCategories.length > itemsPerPage && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredCategories.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              showItemsPerPageSelector={true}
              showTotalItems={true}
              showPageNumbers={true}
              maxPageNumbers={7}
              itemsPerPageOptions={[8, 12, 24, 48]}
            />
          </div>
        )}

        {/* Category Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden relative z-10">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-black">
                    {editingCategory ? 'Edit Category' : 'Add Category'}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Facial Treatments"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-black bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the category..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-black bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Icon
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {iconOptions.map((iconKey) => {
                        const IconComponent = categoryIcons[iconKey];
                        return (
                          <button
                            key={iconKey}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: iconKey })}
                            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center hover:bg-gray-50 ${
                              formData.icon === iconKey ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                            }`}
                          >
                            {IconComponent && <IconComponent className="w-5 h-5 text-gray-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="#6366f1"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-black bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-black bg-white"
                    />
                  </div>
                </form>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                  className="flex-1"
                >
                  <p className="text-gray-700">Cancel</p>
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  variant="outline"
                  className="flex-1"
                >
                  <p className="text-gray-700">{isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}</p>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}