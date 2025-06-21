import React, { useState, useEffect } from 'react';
import { getUsersApi, deleteUserApi } from '../../../utils/api';
import type { User } from '../../../utils/types';
import ConfirmationModal from '../../../components/ConfirmationModal';
import UserModal from '../../../components/UserModal';

const Users: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // User modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = activeTab !== 'All' ? { loginType: activeTab } : undefined;
        const response = await getUsersApi(params);
        setAllUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
        // Fallback to empty array if API fails
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [activeTab]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const filteredUsers = allUsers.filter(user => {
    if (searchQuery) {
      return (
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return true;
  });

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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

  // Open confirmation modal before deleting
  const handleDeleteUser = (id: string) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Handle the actual deletion after confirmation
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteUserApi(userToDelete);

      // After successful deletion, refresh the user list
      const params = activeTab !== 'All' ? { loginType: activeTab } : undefined;
      const response = await getUsersApi(params);
      setAllUsers(response.data);

      // Show success message (optional)
      // You could add a toast notification here

    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again later.');
    } finally {
      // Close the modal and reset states
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setDeleteLoading(false);
    }
  };

  // Cancel deletion
  const cancelDeleteUser = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Handle user click to open modal
  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  // Close user modal
  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  const getInitials = (name: string) => {
    return name.split(' ')[0][0].toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Users</h1>
          <div className="w-full md:w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border-none rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('All')}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button ${activeTab === 'All'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('Email')}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button ${activeTab === 'Email'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab('Google')}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button ${activeTab === 'Google'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Google
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    <i className="fas fa-spinner fa-spin text-4xl mb-3"></i>
                    <p className="text-lg">Loading users...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    <i className="fas fa-exclamation-triangle text-4xl mb-3 text-red-500"></i>
                    <p className="text-lg text-red-500">{error}</p>
                    <p className="mt-1 text-sm">Please try again later</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    <i className="fas fa-search text-4xl mb-3"></i>
                    <p className="text-lg">No users found matching your filters</p>
                    <p className="mt-1 text-sm">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleUserClick(user)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.username === 'Kavita Yadav' ? (
                          <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-medium">
                            K
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                            {getInitials(user.username)}
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-xs text-gray-500">Click to view details</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="far fa-envelope mr-2 text-gray-400"></i>
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${user.loginType === 'Email'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {user.loginType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user.id);
                        }}
                        disabled={deleteLoading}
                        className={`text-red-500 hover:text-red-700 cursor-pointer !rounded-button whitespace-nowrap ${deleteLoading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>

          {/* Pagination */}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastUser, filteredUsers.length)}
                </span>{" "}
                of <span className="font-medium">{filteredUsers.length}</span> users
              </div>

              <nav className="flex items-center">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 mx-1 rounded-md ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                <div className="flex">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                    // Show limited page numbers with ellipsis
                    if (
                      number === 1 ||
                      number === totalPages ||
                      (number >= currentPage - 1 && number <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-3 py-1 mx-1 rounded-md ${currentPage === number
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                          {number}
                        </button>
                      );
                    } else if (
                      (number === currentPage - 2 && currentPage > 3) ||
                      (number === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={number} className="px-2 py-1 mx-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 mx-1 rounded-md ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText={deleteLoading ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        onConfirm={confirmDeleteUser}
        onCancel={cancelDeleteUser}
      />

      {/* User Details Modal */}
      <UserModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        onClose={closeUserModal}
      />
    </div>
  );
};

export default Users;
