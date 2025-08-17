import React, { FC } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const TablePagination: FC<TablePaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const renderPaginationItems = () => {
    const items = [];
    if (currentPage > 1) {
      items.push(
        <PaginationItem key='prev'>
          <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} className='cursor-pointer' />
        </PaginationItem>
      );
    }

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => onPageChange(1)} className='cursor-pointer'>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key='ellipsis1'>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => onPageChange(i)} isActive={i === currentPage} className='cursor-pointer'>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key='ellipsis2'>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => onPageChange(totalPages)} className='cursor-pointer'>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages) {
      items.push(
        <PaginationItem key='next'>
          <PaginationNext onClick={() => onPageChange(currentPage + 1)} className='cursor-pointer' />
        </PaginationItem>
      );
    }

    return items;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>{renderPaginationItems()}</PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
