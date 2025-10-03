'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  showItemsPerPageSelector?: boolean;
  showTotalItems?: boolean;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
  className?: string;
  itemsPerPageOptions?: number[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startItem: number;
  endItem: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const usePagination = (
  totalItems: number,
  itemsPerPage: number,
  currentPage: number
): PaginationInfo => {
  return useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      startItem,
      endItem,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    };
  }, [totalItems, itemsPerPage, currentPage]);
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPageSelector = true,
  showTotalItems = true,
  showPageNumbers = true,
  maxPageNumbers = 5,
  className,
  itemsPerPageOptions = [10, 25, 50, 100],
}) => {
  const paginationInfo = usePagination(totalItems, itemsPerPage, currentPage);
  const { totalPages, startItem, endItem, hasNext, hasPrevious, totalItems: computedTotalItems } = paginationInfo;

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxPageNumbers) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end page numbers
      let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
      const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage + 1 < maxPageNumbers) {
        startPage = Math.max(1, endPage - maxPageNumbers + 1);
      }
      
      // Add first page and ellipsis if needed
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis and last page if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages, maxPageNumbers]);

  // Don't render if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4', className)}>
      {/* Items info and items per page selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {showTotalItems && (
          <div className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{(startItem || 0).toLocaleString()}</span>
            {' '}to{' '}
            <span className="font-medium">{(endItem || 0).toLocaleString()}</span>
            {' '}of{' '}
            <span className="font-medium">{(computedTotalItems || 0).toLocaleString()}</span>
            {' '}results
          </div>
        )}
        
        {showItemsPerPageSelector && (
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="items-per-page" className="text-gray-700">
              Show:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-gray-700">items</span>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <nav className="flex items-center gap-1">
        {/* First page button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevious}
          className="hidden sm:flex"
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Previous</span>
        </Button>

        {/* Page numbers */}
        {showPageNumbers && (
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers.map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? 'primary' : 'outline'}
                size="sm"
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={page === '...'}
                className={cn(
                  'min-w-[2.5rem]',
                  page === '...' && 'cursor-default hover:bg-white border-transparent'
                )}
                aria-label={typeof page === 'number' ? `Go to page ${page}` : undefined}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Button>
            ))}
          </div>
        )}

        {/* Current page indicator for mobile */}
        <div className="sm:hidden flex items-center px-3 py-1 text-sm text-gray-700">
          <span className="font-medium">{currentPage}</span>
          <span className="mx-1">of</span>
          <span className="font-medium">{totalPages}</span>
        </div>

        {/* Next page button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
          className="hidden sm:flex"
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
};

export default Pagination;