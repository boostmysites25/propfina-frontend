import React, { useState, useEffect } from 'react';

const Users: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);
  
  const allUsers = [
    { id: 1, name: 'John Edward', email: 'johnedward2@gmail.com', phone: 'NA', loginType: 'Email' },
    { id: 2, name: 'Ali Khan', email: 'ali@gmail.com', phone: '+923169275330', loginType: 'Email' },
    { id: 3, name: 'John Eduardo', email: 'john345@gmail.com', phone: 'NA', loginType: 'Email' },
    { id: 4, name: 'Kavita Yadav', email: 'yadavkarita38@gmail.com', phone: '+919876543210', loginType: 'Google' },
    { id: 5, name: 'Aasav Shah', email: 'shahaasav@gmail.com', phone: 'NA', loginType: 'Google' },
    { id: 6, name: 'Muzamil Khan', email: 'muzamilkhan111814@gmail.com', phone: '+923169275329', loginType: 'Email' },
    { id: 7, name: 'Priya Patel', email: 'priya.patel@gmail.com', phone: '+919876543211', loginType: 'Google' },
    { id: 8, name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+919876543212', loginType: 'Email' },
    { id: 9, name: 'Neha Singh', email: 'neha.singh@gmail.com', phone: 'NA', loginType: 'Google' },
    { id: 10, name: 'Vikram Reddy', email: 'vikram.reddy@gmail.com', phone: '+919876543213', loginType: 'Email' },
    { id: 11, name: 'Anjali Gupta', email: 'anjali.gupta@gmail.com', phone: '+919876543214', loginType: 'Google' },
    { id: 12, name: 'Rajesh Khanna', email: 'rajesh.khanna@gmail.com', phone: 'NA', loginType: 'Email' },
    { id: 13, name: 'Sunita Verma', email: 'sunita.verma@gmail.com', phone: '+919876543215', loginType: 'Google' },
    { id: 14, name: 'Amit Kumar', email: 'amit.kumar@gmail.com', phone: '+919876543216', loginType: 'Email' },
    { id: 15, name: 'Deepika Padukone', email: 'deepika@gmail.com', phone: 'NA', loginType: 'Google' },
  ];

  const filteredUsers = allUsers.filter(user => {
    if (activeTab !== 'All' && user.loginType !== activeTab) {
      return false;
    }
    
    if (searchQuery) {
      return (
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleDeleteUser = (id: number) => {
    // In a real application, this would connect to an API to delete the user
    console.log(`Delete user with ID: ${id}`);
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
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button ${
                activeTab === 'All' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('Email')}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button ${
                activeTab === 'Email' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab('Google')}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button ${
                activeTab === 'Google' 
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    <i className="fas fa-search text-4xl mb-3"></i>
                    <p className="text-lg">No users found matching your filters</p>
                    <p className="mt-1 text-sm">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.name === 'Kavita Yadav' ? (
                        <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-medium">
                          K
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
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
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                      user.loginType === 'Email' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.loginType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer !rounded-button whitespace-nowrap"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
          
          {/* Pagination */}
          {filteredUsers.length > 0 && (
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
                  className={`px-3 py-1 mx-1 rounded-md ${
                    currentPage === 1
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
                          className={`px-3 py-1 mx-1 rounded-md ${
                            currentPage === number
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
                  className={`px-3 py-1 mx-1 rounded-md ${
                    currentPage === totalPages
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
    </div>
  );
};

export default Users;
