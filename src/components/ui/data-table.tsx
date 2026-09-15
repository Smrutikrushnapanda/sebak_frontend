'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
  LuSearch,
  LuArrowUpDown,
  LuArrowUp,
  LuArrowDown,
  LuInbox,
} from 'react-icons/lu';

export interface Column<T> {
  key: string;
  header: string | React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  extraHeaderActions?: React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchFilter,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  emptyMessage = 'No matching records found',
  emptyIcon,
  extraHeaderActions,
  keyExtractor,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter Data
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase().trim();

    if (searchFilter) {
      return data.filter((item) => searchFilter(item, q));
    }

    return data.filter((item) => {
      return Object.values(item).some((val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === 'object') return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [data, searchQuery, searchFilter]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      return sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, validPage, pageSize]);

  const startIndex = sortedData.length === 0 ? 0 : (validPage - 1) * pageSize + 1;
  const endIndex = Math.min(validPage * pageSize, sortedData.length);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handlePageSizeChange = (val: string) => {
    setPageSize(Number(val));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <LuSearch className="absolute left-3.5 top-2.5 h-4 w-4 text-orange-500" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200 focus:bg-white focus:border-orange-400 rounded-xl transition-colors"
          />
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {extraHeaderActions}
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <span className="text-slate-500 font-bold">Rows:</span>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-18 text-xs bg-slate-50 border-slate-200 font-bold rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)} className="text-xs">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fff8f3] border-b border-orange-100/70 text-[#f97316] font-extrabold uppercase text-[11px] tracking-wider">
              <tr>
                {columns.map((col) => {
                  const isSorted = sortKey === col.key;
                  return (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`px-5 py-3.5 select-none ${
                        col.sortable ? 'cursor-pointer hover:bg-orange-100/50 transition-colors' : ''
                      } ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'} ${
                        col.className || ''
                      }`}
                    >
                      <div
                        className={`flex items-center gap-1.5 ${
                          col.align === 'center'
                            ? 'justify-center'
                            : col.align === 'right'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <span>{col.header}</span>
                        {col.sortable && (
                          <span className="text-orange-400">
                            {isSorted ? (
                              sortOrder === 'asc' ? (
                                <LuArrowUp className="w-3.5 h-3.5 text-[#f97316] font-bold" />
                              ) : (
                                <LuArrowDown className="w-3.5 h-3.5 text-[#f97316] font-bold" />
                              )
                            ) : (
                              <LuArrowUpDown className="w-3 h-3 opacity-60 hover:opacity-100" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => {
                  const globalIdx = (validPage - 1) * pageSize + idx;
                  const rowKey = keyExtractor ? keyExtractor(row, globalIdx) : row.id || globalIdx;
                  return (
                    <tr
                      key={rowKey}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`px-5 py-3.5 align-middle ${
                            col.align === 'center'
                              ? 'text-center'
                              : col.align === 'right'
                              ? 'text-right'
                              : 'text-left'
                          } ${col.className || ''}`}
                        >
                          {col.render ? col.render(row, globalIdx) : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {emptyIcon || <LuInbox className="w-10 h-10 text-slate-300 stroke-[1.5]" />}
                      <p className="text-sm font-semibold text-slate-600">{emptyMessage}</p>
                      {searchQuery && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery('')}
                          className="text-xs mt-2 border-slate-200 hover:bg-slate-50 rounded-xl"
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 bg-white text-xs text-slate-600">
          <div className="font-semibold text-slate-500">
            Showing <span className="font-extrabold text-slate-900">{startIndex}</span> to{' '}
            <span className="font-extrabold text-slate-900">{endIndex}</span> of{' '}
            <span className="font-extrabold text-slate-900">{sortedData.length}</span> entries
          </div>

          <div className="flex items-center space-x-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage(1)}
              title="First Page"
            >
              <LuChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              title="Previous Page"
            >
              <LuChevronLeft className="w-4 h-4" />
            </Button>

            {/* Page number indicators */}
            <div className="flex items-center space-x-1.5 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 5) return true;
                  if (p === 1 || p === totalPages) return true;
                  return Math.abs(p - validPage) <= 1;
                })
                .map((p, idx, arr) => {
                  const showEllipsisBefore = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsisBefore && <span className="px-1 text-slate-400">...</span>}
                      <Button
                        variant={p === validPage ? 'default' : 'outline'}
                        size="sm"
                        className={`h-8 min-w-8 px-2.5 font-extrabold text-xs rounded-lg ${
                          p === validPage
                            ? 'bg-[#f97316] text-white hover:bg-[#ea580c] shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </Button>
                    </React.Fragment>
                  );
                })}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              title="Next Page"
            >
              <LuChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              title="Last Page"
            >
              <LuChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
