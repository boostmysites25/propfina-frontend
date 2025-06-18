import React, { useState, useEffect } from "react";

const VisitsAndScheduling: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [visitsPerPage] = useState(5);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate]);

  // Sample data for visits
  const allVisits = [
    {
      id: 1,
      property: "Mumbai Apartment",
      user: { name: "Rahul Sharma", email: "rahul.sharma@example.com" },
      date: "07/02/2025",
      time: "2:10 PM",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20luxury%20apartment%20in%20Mumbai%20with%20panoramic%20city%20views%2C%20bright%20and%20airy%20interior%20with%20large%20windows%2C%20contemporary%20furniture%2C%20and%20elegant%20decor%2C%20professional%20real%20estate%20photography%20with%20soft%20natural%20lighting&width=80&height=60&seq=1&orientation=landscape",
    },
    {
      id: 2,
      property: "Aaren Complex",
      user: { name: "Yash Yadav", email: "yash.yadav@example.com" },
      date: "26/09/2024",
      time: "10:10 AM",
      image:
        "https://readdy.ai/api/search-image?query=Elegant%20luxury%20apartment%20complex%20interior%20with%20marble%20floors%2C%20sophisticated%20lighting%2C%20high%20ceilings%2C%20and%20modern%20architectural%20details%2C%20professional%20real%20estate%20photography%20with%20perfect%20composition%20and%20lighting&width=80&height=60&seq=2&orientation=landscape",
    },
    {
      id: 3,
      property: "Aaren Complex",
      user: { name: "Yash Yadav", email: "yash.yadav@example.com" },
      date: "23/01/2025",
      time: "9:10 AM",
      image:
        "https://readdy.ai/api/search-image?query=Elegant%20luxury%20apartment%20complex%20interior%20with%20marble%20floors%2C%20sophisticated%20lighting%2C%20high%20ceilings%2C%20and%20modern%20architectural%20details%2C%20professional%20real%20estate%20photography%20with%20perfect%20composition%20and%20lighting&width=80&height=60&seq=3&orientation=landscape",
    },
    {
      id: 4,
      property: "Aaren Complex",
      user: { name: "Yash Yadav", email: "yash.yadav@example.com" },
      date: "16/10/2024",
      time: "10:10 AM",
      image:
        "https://readdy.ai/api/search-image?query=Elegant%20luxury%20apartment%20complex%20interior%20with%20marble%20floors%2C%20sophisticated%20lighting%2C%20high%20ceilings%2C%20and%20modern%20architectural%20details%2C%20professional%20real%20estate%20photography%20with%20perfect%20composition%20and%20lighting&width=80&height=60&seq=4&orientation=landscape",
    },
    {
      id: 5,
      property: "Aaren Complex",
      user: { name: "Yash Yadav", email: "yash.yadav@example.com" },
      date: "13/02/2025",
      time: "12:25 PM",
      image:
        "https://readdy.ai/api/search-image?query=Elegant%20luxury%20apartment%20complex%20interior%20with%20marble%20floors%2C%20sophisticated%20lighting%2C%20high%20ceilings%2C%20and%20modern%20architectural%20details%2C%20professional%20real%20estate%20photography%20with%20perfect%20composition%20and%20lighting&width=80&height=60&seq=5&orientation=landscape",
    },
    {
      id: 6,
      property: "Seaside Villa",
      user: { name: "Priya Patel", email: "priya.patel@example.com" },
      date: "05/03/2025",
      time: "3:30 PM",
      image:
        "https://readdy.ai/api/search-image?query=Luxury%20seaside%20villa%20with%20ocean%20view%2C%20modern%20architecture%2C%20infinity%20pool%2C%20and%20elegant%20outdoor%20spaces&width=80&height=60&seq=6&orientation=landscape",
    },
    {
      id: 7,
      property: "Green Valley Homes",
      user: { name: "Amit Kumar", email: "amit.kumar@example.com" },
      date: "12/11/2024",
      time: "11:00 AM",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20eco-friendly%20home%20with%20green%20surroundings%2C%20sustainable%20architecture%2C%20and%20natural%20lighting&width=80&height=60&seq=7&orientation=landscape",
    },
    {
      id: 8,
      property: "City Center Mall",
      user: { name: "Neha Singh", email: "neha.singh@example.com" },
      date: "19/12/2024",
      time: "4:15 PM",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20shopping%20mall%20with%20glass%20facade%2C%20multiple%20floors%2C%20and%20contemporary%20retail%20spaces&width=80&height=60&seq=8&orientation=landscape",
    },
    {
      id: 9,
      property: "Tech Park Plaza",
      user: { name: "Vikram Reddy", email: "vikram.reddy@example.com" },
      date: "08/01/2025",
      time: "10:30 AM",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20office%20building%20with%20glass%20exterior%2C%20corporate%20architecture%2C%20and%20professional%20entrance&width=80&height=60&seq=9&orientation=landscape",
    },
    {
      id: 10,
      property: "Mountain View Villas",
      user: { name: "Anjali Gupta", email: "anjali.gupta@example.com" },
      date: "22/02/2025",
      time: "1:45 PM",
      image:
        "https://readdy.ai/api/search-image?query=Luxury%20villa%20with%20mountain%20views%2C%20contemporary%20architecture%2C%20and%20private%20garden&width=80&height=60&seq=10&orientation=landscape",
    },
    {
      id: 11,
      property: "Riverside Apartments",
      user: { name: "Rajesh Khanna", email: "rajesh.khanna@example.com" },
      date: "14/03/2025",
      time: "9:00 AM",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20apartment%20complex%20by%20the%20river%2C%20with%20balconies%20and%20waterfront%20views&width=80&height=60&seq=11&orientation=landscape",
    },
    {
      id: 12,
      property: "Heritage Homes",
      user: { name: "Sunita Verma", email: "sunita.verma@example.com" },
      date: "30/01/2025",
      time: "5:30 PM",
      image:
        "https://readdy.ai/api/search-image?query=Classic%20architecture%20home%20with%20heritage%20elements%2C%20elegant%20design%2C%20and%20landscaped%20garden&width=80&height=60&seq=12&orientation=landscape",
    },
  ];
  
  // Filter visits based on search query and date range
  const filteredVisits = allVisits.filter((visit) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery || 
      visit.property.toLowerCase().includes(searchLower) ||
      visit.user.name.toLowerCase().includes(searchLower) ||
      visit.user.email.toLowerCase().includes(searchLower);
    
    // Date range filter
    let matchesDateRange = true;
    
    if (startDate && endDate) {
      // Convert date strings to Date objects for comparison
      const visitDate = convertToDate(visit.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      // Set time to beginning/end of day for proper comparison
      startDateObj.setHours(0, 0, 0, 0);
      endDateObj.setHours(23, 59, 59, 999);
      
      matchesDateRange = visitDate >= startDateObj && visitDate <= endDateObj;
    } else if (startDate) {
      const visitDate = convertToDate(visit.date);
      const startDateObj = new Date(startDate);
      startDateObj.setHours(0, 0, 0, 0);
      
      matchesDateRange = visitDate >= startDateObj;
    } else if (endDate) {
      const visitDate = convertToDate(visit.date);
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      
      matchesDateRange = visitDate <= endDateObj;
    }
    
    return matchesSearch && matchesDateRange;
  });
  
  // Helper function to convert DD/MM/YYYY to Date object
  function convertToDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  
  // Get current visits for pagination
  const indexOfLastVisit = currentPage * visitsPerPage;
  const indexOfFirstVisit = indexOfLastVisit - visitsPerPage;
  const currentVisits = filteredVisits.slice(indexOfFirstVisit, indexOfLastVisit);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredVisits.length / visitsPerPage);
  
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Visits & Scheduling
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by email, username or property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="dd-mm-yyyy"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="dd-mm-yyyy"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                  >
                    PROPERTY
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                  >
                    USER INFO
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                  >
                    CONTACT
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                  >
                    DATE
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                  >
                    TIME
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVisits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      <i className="fas fa-search text-4xl mb-3"></i>
                      <p className="text-lg">No visits found matching your filters</p>
                      <p className="mt-1 text-sm">Try adjusting your search criteria</p>
                    </td>
                  </tr>
                ) : (
                  currentVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                          <img
                            className="h-10 w-10 object-cover"
                            src={visit.image}
                            alt={visit.property}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {visit.property}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center mb-1">
                          <i className="far fa-user text-gray-400 mr-2"></i>
                          <span className="text-sm text-gray-500">
                            {visit.user.name || "-"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <i className="far fa-envelope text-gray-400 mr-2"></i>
                          <span className="text-sm text-gray-500">
                            {visit.user.email || "-"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <i className="fas fa-phone text-gray-400"></i>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <i className="far fa-calendar text-gray-400 mr-2"></i>
                        <span className="text-sm text-gray-500">
                          {visit.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <i className="far fa-clock text-gray-400 mr-2"></i>
                        <span className="text-sm text-gray-500">
                          {visit.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-red-500 hover:text-red-700 cursor-pointer !rounded-button whitespace-nowrap">
                        <i className="far fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredVisits.length > 0 && (
            <div className="flex justify-between items-center px-6 py-4 bg-white border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstVisit + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastVisit, filteredVisits.length)}
                </span>{" "}
                of <span className="font-medium">{filteredVisits.length}</span> visits
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

export default VisitsAndScheduling;
