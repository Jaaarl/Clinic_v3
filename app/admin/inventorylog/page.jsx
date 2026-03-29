'use client'
import React, { useState, useEffect } from 'react';
import Navbar from "@/app/components/Navbar";
// Custom SVG Icon Components
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>
);

const PackageIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const AlertCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const RefreshIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const InventoryLogComponent = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    itemName: '',
    action: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false
  });

  // Fetch logs from API
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.itemName) params.append('itemName', filters.itemName);
      if (filters.action) params.append('action', filters.action);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/inventory-logs?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      
      const data = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Get detailed changes between previousData and newData
  const getDetailedChanges = (log) => {
    if (!log.previousData || !log.newData) return null;

    const changes = [];
    const prev = log.previousData;
    const curr = log.newData;

    // Check name change
    if (prev.name !== curr.name) {
      changes.push({
        field: 'Name',
        from: prev.name,
        to: curr.name,
        type: 'text'
      });
    }

    // Check quantity change
    if (prev.quantityInStock !== curr.quantityInStock) {
      changes.push({
        field: 'Quantity',
        from: prev.quantityInStock,
        to: curr.quantityInStock,
        type: 'quantity',
        change: curr.quantityInStock - prev.quantityInStock
      });
    }

    // Check price change
    if (prev.price !== curr.price) {
      changes.push({
        field: 'Price',
        from: prev.price,
        to: curr.price,
        type: 'price'
      });
    }

    // Check expiration date change
    if (prev.expirationDate !== curr.expirationDate) {
      changes.push({
        field: 'Expiration',
        from: prev.expirationDate,
        to: curr.expirationDate,
        type: 'date'
      });
    }

    return changes;
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for expiration (date only)
  const formatExpirationDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get action icon and color
  const getActionDisplay = (action) => {
    const displays = {
      CREATE: { icon: PlusIcon, color: 'text-green-600', bg: 'bg-green-100', label: 'Created' },
      UPDATE: { icon: EditIcon, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Updated' },
      DELETE: { icon: TrashIcon, color: 'text-red-600', bg: 'bg-red-100', label: 'Deleted' },
      STOCK_DEDUCTION: { icon: TrendingDownIcon, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Stock Deduction' }
    };
    return displays[action] || { icon: AlertCircleIcon, color: 'text-gray-600', bg: 'bg-gray-100', label: action };
  };

  // Get quantity change indicator
  const getQuantityChangeDisplay = (log) => {
    if (!log.newData || !log.previousData) return null;
    
    const change = log.newData.quantityInStock - log.previousData.quantityInStock;
    if (change === 0) return null;
    
    return (
      <div className={`flex items-center text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change > 0 ? <TrendingUpIcon className="w-4 h-4 mr-1" /> : <TrendingDownIcon className="w-4 h-4 mr-1" />}
        {change > 0 ? '+' : ''}{change}
      </div>
    );
  };

  return (
    <>
      <Navbar/>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Logs</h1>
          <p className="text-gray-600">Track all inventory changes and activities</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Item Name
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Enter item name..."
                  value={filters.itemName}
                  onChange={(e) => handleFilterChange('itemName', e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Type
              </label>
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Actions</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                  <option value="STOCK_DEDUCTION">Stock Deduction</option>
                </select>
              </div>
            </div>

            <div className="min-w-32">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per Page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ inventoryId: '', action: '', page: 1, limit: 20 });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                Showing {logs.length} of {pagination.totalCount} logs
              </span>
            </div>
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircleIcon className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-800">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex items-center justify-center">
              <RefreshIcon className="w-8 h-8 text-blue-500 animate-spin mr-3" />
              <span className="text-gray-600">Loading logs...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Logs Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {logs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <PackageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No logs found matching your criteria</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Changes
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expiration Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Qty
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.map((log) => {
                        const actionDisplay = getActionDisplay(log.action);
                        const Icon = actionDisplay.icon;
                        const changes = getDetailedChanges(log);
                        
                        return (
                          <tr key={log._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`p-2 rounded-full ${actionDisplay.bg} mr-3`}>
                                  <Icon className={`w-4 h-4 ${actionDisplay.color}`} />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {actionDisplay.label}
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {log.inventoryId?.name || log.newData?.name || log.previousData?.name || 'N/A'}
                              </div>
                            </td>
                            
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {changes && changes.length > 0 ? (
                                  <div className="space-y-1">
                                    {changes.map((change, index) => (
                                      <div key={index} className="text-xs">
                                        <span className="font-medium text-gray-600">{change.field}:</span>
                                        {change.type === 'quantity' && (
                                          <span className={`ml-1 ${change.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {change.from} → {change.to} ({change.change > 0 ? '+' : ''}{change.change})
                                          </span>
                                        )}
                                        {change.type === 'price' && (
                                          <span className="ml-1 text-gray-700">
                                            ${change.from} → ${change.to}
                                          </span>
                                        )}
                                        {change.type === 'text' && (
                                          <span className="ml-1 text-gray-700">
                                            {change.from} → {change.to}
                                          </span>
                                        )}
                                        {change.type === 'date' && (
                                          <span className="ml-1 text-gray-700">
                                            {formatExpirationDate(change.from)} → {formatExpirationDate(change.to)}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-xs">No changes</span>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {log.newData?.expirationDate ? formatExpirationDate(log.newData.expirationDate) : 
                                log.previousData?.expirationDate ? formatExpirationDate(log.previousData.expirationDate) : 'N/A'}
                              </div>
                              {(log.newData?.expirationDate || log.previousData?.expirationDate) && (
                                <div className={`text-xs mt-1 ${
                                  new Date(log.newData?.expirationDate || log.previousData?.expirationDate) < new Date() ? 'text-red-500' : 
                                  new Date(log.newData?.expirationDate || log.previousData?.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                  {new Date(log.newData?.expirationDate || log.previousData?.expirationDate) < new Date() ? 'Expired' : 
                                  new Date(log.newData?.expirationDate || log.previousData?.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'Expires Soon' : 'Fresh'}
                                </div>
                              )}
                            </td>
                            
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-900">
                                  {log.newData?.quantityInStock !== undefined ? log.newData.quantityInStock : 'N/A'}
                                </span>
                                {getQuantityChangeDisplay(log)}
                              </div>
                            </td>
                            
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(log.timestamp)}
                              </div>
                            </td>
                            
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {log.reason || '-'}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm border px-6 py-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                        if (pageNum > pagination.totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm border rounded-md ${
                              pageNum === pagination.currentPage
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default InventoryLogComponent;