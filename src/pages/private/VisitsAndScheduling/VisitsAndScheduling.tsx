import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVisitsApi, deleteVisitApi, sendVisitConfirmationApi } from "../../../utils/api";
import type { Visit } from "../../../utils/types";

const VisitsAndScheduling: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState<Visit | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [visitsPerPage] = useState(5);

  const queryClient = useQueryClient();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate]);

  // Fetch visits using React Query
  const { data: visits = [], isLoading, isError, error } = useQuery<Visit[]>({
    queryKey: ["visits", { search: searchQuery, startDate, endDate }],
    queryFn: async () => {
      const filters: any = {};
      if (searchQuery) filters.search = searchQuery;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      console.log('Sending filters to API:', filters);
      const response = await getVisitsApi(filters);
      console.log('Received visits from API:', response.data.length);
      return response.data;
    },
  });

  // Delete visit mutation
  const deleteVisitMutation = useMutation({
    mutationFn: deleteVisitApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      setDeleteModalOpen(false);
      setVisitToDelete(null);
    },
    onError: (error) => {
      console.error("Failed to delete visit:", error);
    },
  });

  // Send email confirmation mutation
  const sendEmailMutation = useMutation({
    mutationFn: sendVisitConfirmationApi,
    onSuccess: (data) => {
      console.log("Email confirmation result:", data);
      alert("Visit confirmation email sent successfully!");
    },
    onError: (error) => {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again.");
    },
  });

  // Helper function to format date
  const formatDate = (date: Date | string): string => {
    if (typeof date === 'string') {
      return date;
    }
    return date.toLocaleDateString('en-GB');
  };

  // Helper function to format time
  const formatTime = (time: string | undefined): string => {
    if (!time) return 'Not specified';
    return time;
  };

  // Handle delete click
  const handleDeleteClick = (visit: Visit) => {
    setVisitToDelete(visit);
    setDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (visitToDelete) {
      deleteVisitMutation.mutate(visitToDelete.id);
    }
  };

  // Handle send email confirmation
  const handleSendEmail = (visit: Visit) => {
    if (visit.userEmail && visit.userEmail.trim() !== '') {
      sendEmailMutation.mutate(visit.id);
    } else {
      alert('No email address found for this visit');
    }
  };

  // Get current visits for pagination
  const indexOfLastVisit = currentPage * visitsPerPage;
  const indexOfFirstVisit = indexOfLastVisit - visitsPerPage;
  const currentVisits = visits.slice(indexOfFirstVisit, indexOfLastVisit);

  // Calculate total pages
  const totalPages = Math.ceil(visits.length / visitsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <main className="flex-1 p-5 transition-all duration-300">
      {/* Header */}
      <div className="hidden md:flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Visits & Scheduling
        </h2>
      </div>

      {/* Mobile Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6 md:hidden">
        Visits & Scheduling
      </h2>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by property, user name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchQuery || startDate || endDate) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchQuery("");
                setStartDate("");
                setEndDate("");
              }}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          <p className="mt-4 text-gray-600">Loading visits...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error loading visits</p>
          <p className="text-sm">{(error as Error)?.message || "Please try again later"}</p>
        </div>
      )}

      {/* Content */}
      {!isLoading && !isError && (
        <>
          {/* Results Summary */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstVisit + 1}-{Math.min(indexOfLastVisit, visits.length)} of {visits.length} visits
              </p>
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>

          {/* Visits List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {currentVisits.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">
                  <i className="fas fa-calendar-times"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No visits found</h3>
                <p className="text-gray-500">
                  {searchQuery || startDate || endDate
                    ? "Try adjusting your search filters"
                    : "No visits have been scheduled yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-6 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700 uppercase tracking-wider min-w-[900px]">
                  <div className="min-w-[250px]">PROPERTY</div>
                  <div className="min-w-[120px]">USER INFO</div>
                  <div className="min-w-[150px]">CONTACT</div>
                  <div className="min-w-[100px]">DATE</div>
                  <div className="min-w-[80px]">TIME</div>
                  <div className="min-w-[100px]">ACTIONS</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {currentVisits.map((visit) => (
                    <div key={visit.id} className="grid grid-cols-6 gap-6 px-6 py-4 hover:bg-gray-50 transition-colors items-center min-w-[900px]">
                      {/* Property Column */}
                      <div className="flex items-center space-x-3 min-w-[250px]">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          {visit.propertyImage && visit.propertyImage.trim() !== '' ? (
                            <img
                              src={visit.propertyImage}
                              alt={visit.propertyName || "Property"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector('.fallback-icon')) {
                                  const fallback = document.createElement('div');
                                  fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-gray-100';
                                  fallback.innerHTML = '<i class="fas fa-building text-gray-400 text-lg"></i>';
                                  parent.appendChild(fallback);
                                }
                              }}
                              onLoad={() => {
                                console.log('Image loaded successfully:', visit.propertyImage?.substring(0, 50) + '...');
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <i className="fas fa-building text-gray-400 text-lg"></i>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {visit.propertyName || "Unknown Property"}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {visit.propertyAddress || "Address not available"}
                          </p>
                        </div>
                      </div>

                      {/* User Info Column */}
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-user text-gray-400"></i>
                        <span className="text-sm text-gray-900">
                          {visit.userName || "Unknown User"}
                        </span>
                      </div>

                      {/* Contact Column */}
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-envelope text-gray-400"></i>
                        <span className="text-sm text-gray-600 truncate max-w-32">
                          {visit.userEmail || "No email"}
                        </span>
                      </div>

                      {/* Date Column */}
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-calendar text-gray-400"></i>
                        <span className="text-sm text-gray-900">
                          {formatDate(visit.date)}
                        </span>
                      </div>

                      {/* Time Column */}
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-clock text-gray-400"></i>
                        <span className="text-sm text-gray-900">
                          {formatTime(visit.time)}
                        </span>
                      </div>

                      {/* Actions Column */}
                      <div className="flex items-center space-x-2">
                        {/* Send Email Button */}
                        <button
                          onClick={() => handleSendEmail(visit)}
                          disabled={sendEmailMutation.isPending || !visit.userEmail || visit.userEmail.trim() === ''}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={visit.userEmail && visit.userEmail.trim() !== '' ? "Send visit confirmation email" : "No email address available"}
                        >
                          {sendEmailMutation.isPending ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fas fa-envelope"></i>
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteClick(visit)}
                          disabled={deleteVisitMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete visit"
                        >
                          {deleteVisitMutation.isPending ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fas fa-trash"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 text-sm rounded-md ${currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && visitToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Visit
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the visit for "{visitToDelete.propertyName}"
              scheduled by {visitToDelete.userName}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleteVisitMutation.isPending}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteVisitMutation.isPending}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteVisitMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default VisitsAndScheduling;
