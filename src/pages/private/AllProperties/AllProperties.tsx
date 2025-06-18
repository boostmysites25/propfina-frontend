import React, { useState, useEffect } from "react";

const AllProperties: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] =
    useState("All Properties");
  const [buildingTypeFilter, setBuildingTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("Date: Newest First");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage, setPropertiesPerPage] = useState(8);
  
  // Update properties per page based on view mode
  useEffect(() => {
    setPropertiesPerPage(viewMode === "grid" ? 8 : 5);
    setCurrentPage(1); // Reset to first page when changing view mode
  }, [viewMode]);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, propertyTypeFilter, buildingTypeFilter, locationFilter, sortFilter]);

  // Dropdown states
  const [propertyTypeDropdownOpen, setPropertyTypeDropdownOpen] =
    useState(false);
  const [buildingTypeDropdownOpen, setBuildingTypeDropdownOpen] =
    useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Filter options
  const propertyTypeOptions = [
    "All Properties",
    "Buy Properties",
    "Rent Properties",
    "PG Properties",
  ];
  const buildingTypeOptions = ["All", "Residential", "Commercial"];
  const locationOptions = ["All", "Mumbai", "Chennai", "Bangalore"];
  const sortOptions = [
    "Date: Newest First",
    "Date: Oldest First",
    "Price: Low to High",
    "Price: High to Low",
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setPropertyTypeDropdownOpen(false);
      setBuildingTypeDropdownOpen(false);
      setLocationDropdownOpen(false);
      setSortDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Toggle dropdown and stop propagation to prevent immediate closing
  const toggleDropdown = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setter((prev) => !prev);
  };

  const allProperties = [
    {
      id: 1,
      name: "Aaren Complex",
      price: "₹5,000",
      location: "Mumbai",
      date: "2023-05-15",
      type: "Sell",
      buildingType: "Residential",
      image:
        "https://readdy.ai/api/search-image?query=Luxurious%20modern%20living%20room%20with%20marble%20floors%2C%20large%20windows%20with%20city%20views%2C%20elegant%20furniture%2C%20warm%20lighting%2C%20wooden%20accents%2C%20and%20minimalist%20decor.%20The%20space%20features%20neutral%20colors%2C%20high%20ceilings%20with%20recessed%20lighting%2C%20and%20a%20sophisticated%20atmosphere.&width=600&height=400&seq=1&orientation=landscape",
    },
    {
      id: 2,
      name: "Gandhi nagar",
      price: "₹5,00,00,000",
      location: "Chennai",
      date: "2023-06-20",
      type: "Sell",
      buildingType: "Residential",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20apartment%20building%20exterior%20at%20night%20with%20warm%20lighting%2C%20contemporary%20architecture%2C%20glass%20facades%2C%20and%20elegant%20entrance.%20The%20building%20features%20clean%20lines%2C%20minimalist%20design%20elements%2C%20and%20a%20sophisticated%20urban%20setting.&width=600&height=400&seq=2&orientation=landscape",
    },
    {
      id: 3,
      name: "Vidhaya tower",
      price: "₹5,00,00,000",
      location: "Bangalore",
      date: "2023-07-10",
      type: "Rent",
      buildingType: "Commercial",
      image:
        "https://readdy.ai/api/search-image?query=Luxury%20apartment%20complex%20with%20infinity%20pool%2C%20modern%20architecture%2C%20landscaped%20gardens%2C%20and%20outdoor%20loungers.%20The%20building%20features%20brick%20and%20glass%20facades%2C%20balconies%2C%20and%20a%20serene%20water%20feature%20with%20ambient%20lighting%20creating%20a%20tranquil%20atmosphere.&width=600&height=400&seq=3&orientation=landscape",
    },
    {
      id: 4,
      name: "LK Nest",
      price: "₹56,00,000",
      location: "Mumbai",
      date: "2023-08-05",
      type: "PG",
      buildingType: "Residential",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20luxury%20villa%20with%20clean%20white%20architecture%2C%20large%20glass%20windows%2C%20infinity%20pool%20with%20blue%20water%2C%20multiple%20levels%2C%20outdoor%20terrace%2C%20and%20minimalist%20design%20against%20bright%20blue%20sky%20background.%20The%20property%20features%20contemporary%20styling%20and%20elegant%20outdoor%20living%20spaces.&width=600&height=400&seq=4&orientation=landscape",
    },
    {
      id: 5,
      name: "Sunrise Apartments",
      price: "₹75,00,000",
      location: "Chennai",
      date: "2023-09-12",
      type: "Sell",
      buildingType: "Residential",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20apartment%20building%20with%20balconies%20and%20large%20windows%2C%20surrounded%20by%20landscaped%20gardens%20and%20walking%20paths.&width=600&height=400&seq=5&orientation=landscape",
    },
    {
      id: 6,
      name: "Tech Park Plaza",
      price: "₹1,20,00,000",
      location: "Bangalore",
      date: "2023-07-25",
      type: "Rent",
      buildingType: "Commercial",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20glass%20office%20building%20with%20corporate%20architecture%2C%20reflective%20facades%20and%20professional%20entrance.&width=600&height=400&seq=6&orientation=landscape",
    },
    {
      id: 7,
      name: "Seaside Villa",
      price: "₹2,50,00,000",
      location: "Mumbai",
      date: "2023-08-30",
      type: "Sell",
      buildingType: "Residential",
      image:
        "https://readdy.ai/api/search-image?query=Luxury%20beachfront%20villa%20with%20infinity%20pool%20overlooking%20the%20ocean%2C%20modern%20architecture%20with%20large%20windows.&width=600&height=400&seq=7&orientation=landscape",
    },
    {
      id: 8,
      name: "Student Haven",
      price: "₹12,000",
      location: "Chennai",
      date: "2023-09-05",
      type: "PG",
      buildingType: "Residential",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20student%20accommodation%20with%20shared%20spaces%2C%20study%20areas%20and%20comfortable%20living%20quarters.&width=600&height=400&seq=8&orientation=landscape",
    },
    {
      id: 9,
      name: "Green Valley Homes",
      price: "₹95,00,000",
      location: "Bangalore",
      date: "2023-06-15",
      type: "Sell",
      buildingType: "Residential",
      image:
        "https://readdy.ai/api/search-image?query=Eco-friendly%20residential%20complex%20with%20green%20spaces%2C%20solar%20panels%20and%20sustainable%20architecture.&width=600&height=400&seq=9&orientation=landscape",
    },
    {
      id: 10,
      name: "City Center Mall",
      price: "₹2,00,00,000",
      location: "Mumbai",
      date: "2023-07-20",
      type: "Rent",
      buildingType: "Commercial",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20shopping%20mall%20with%20glass%20atrium%2C%20multiple%20floors%20and%20contemporary%20retail%20spaces.&width=600&height=400&seq=10&orientation=landscape",
    },
    {
      id: 11,
      name: "Scholars Residence",
      price: "₹15,000",
      location: "Chennai",
      date: "2023-08-10",
      type: "PG",
      buildingType: "Residential",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20PG%20accommodation%20with%20furnished%20rooms%2C%20common%20areas%20and%20study%20facilities.&width=600&height=400&seq=11&orientation=landscape",
    },
    {
      id: 12,
      name: "Mountain View Villas",
      price: "₹1,80,00,000",
      location: "Bangalore",
      date: "2023-09-25",
      type: "Sell",
      buildingType: "Residential",
      image:
        "https://readdy.ai/api/search-image?query=Luxury%20villa%20complex%20with%20mountain%20views%2C%20private%20gardens%20and%20contemporary%20architecture.&width=600&height=400&seq=12&orientation=landscape",
    },
  ];

  // Apply filters to properties
  const filteredProperties = allProperties.filter((property) => {
    // Filter by search query
    if (
      searchQuery &&
      !property.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !property.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by property type
    if (propertyTypeFilter !== "All Properties") {
      if (propertyTypeFilter === "Buy Properties" && property.type !== "Sell")
        return false;
      if (propertyTypeFilter === "Rent Properties" && property.type !== "Rent")
        return false;
      if (propertyTypeFilter === "PG Properties" && property.type !== "PG")
        return false;
    }

    // Filter by building type
    if (
      buildingTypeFilter !== "All" &&
      property.buildingType !== buildingTypeFilter
    ) {
      return false;
    }

    // Filter by location
    if (locationFilter !== "All" && property.location !== locationFilter) {
      return false;
    }

    return true;
  });

  // Apply sorting
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortFilter === "Date: Newest First") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortFilter === "Date: Oldest First") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortFilter === "Price: Low to High") {
      return (
        parseFloat(a.price.replace(/[₹,]/g, "")) -
        parseFloat(b.price.replace(/[₹,]/g, ""))
      );
    } else if (sortFilter === "Price: High to Low") {
      return (
        parseFloat(b.price.replace(/[₹,]/g, "")) -
        parseFloat(a.price.replace(/[₹,]/g, ""))
      );
    }
    return 0;
  });
  
  // Get current properties for pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);
  
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
      {/* Header */}
      <header className="sticky top-0 bg-white border-b px-4 md:px-6 lg:px-8 py-4 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            All Properties
          </h1>
          <div className="flex gap-2">
            <button
              className={`p-2 rounded-lg !rounded-button cursor-pointer whitespace-nowrap ${
                viewMode === "grid"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              className={`p-2 rounded-lg !rounded-button cursor-pointer whitespace-nowrap ${
                viewMode === "list"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setViewMode("list")}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 p-4 md:p-6">
        <div className="relative flex-grow min-w-[200px]">
          <input
            type="search"
            placeholder="Search properties..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
        </div>

        {/* Property Type Filter */}
        <div className="relative min-w-[200px]">
          <button
            className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer whitespace-nowrap"
            onClick={(e) => toggleDropdown(setPropertyTypeDropdownOpen, e)}
          >
            <span>{propertyTypeFilter}</span>
            <i className="fas fa-chevron-down ml-2 text-gray-500"></i>
          </button>
          {propertyTypeDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              {propertyTypeOptions.map((option) => (
                <div
                  key={option}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPropertyTypeFilter(option);
                    setPropertyTypeDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Building Type Filter */}
        <div className="relative min-w-[150px]">
          <button
            className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer whitespace-nowrap"
            onClick={(e) => toggleDropdown(setBuildingTypeDropdownOpen, e)}
          >
            <span>{buildingTypeFilter}</span>
            <i className="fas fa-chevron-down ml-2 text-gray-500"></i>
          </button>
          {buildingTypeDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              {buildingTypeOptions.map((option) => (
                <div
                  key={option}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBuildingTypeFilter(option);
                    setBuildingTypeDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="relative min-w-[150px]">
          <button
            className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer whitespace-nowrap"
            onClick={(e) => toggleDropdown(setLocationDropdownOpen, e)}
          >
            <span>{locationFilter}</span>
            <i className="fas fa-chevron-down ml-2 text-gray-500"></i>
          </button>
          {locationDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              {locationOptions.map((option) => (
                <div
                  key={option}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocationFilter(option);
                    setLocationDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sort Filter */}
        <div className="relative min-w-[200px]">
          <button
            className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer whitespace-nowrap"
            onClick={(e) => toggleDropdown(setSortDropdownOpen, e)}
          >
            <span>{sortFilter}</span>
            <i className="fas fa-chevron-down ml-2 text-gray-500"></i>
          </button>
          {sortDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              {sortOptions.map((option) => (
                <div
                  key={option}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSortFilter(option);
                    setSortDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Property Grid/List */}
      <div
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr"
            : "flex flex-col"
        } gap-6 p-4 md:p-6`}
      >
        {sortedProperties.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <i className="fas fa-search text-5xl mb-4"></i>
            <p className="text-xl">No properties found matching your filters</p>
            <p className="mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          currentProperties.map((property) => (
            <div
              key={property.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <div
                className={`relative overflow-hidden ${
                  viewMode === "grid" ? "w-full" : "min-w-[200px] max-w-[200px] h-[150px] rounded-lg"
                }`}
                style={viewMode === "grid" ? { aspectRatio: "16/9" } : {}}
              >
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className={`p-4 ${viewMode === "list" ? "flex-1 ml-2" : ""}`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    {property.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      property.type === "Sell"
                        ? "bg-blue-100 text-blue-800"
                        : property.type === "Rent"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {property.type}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-xl font-bold text-gray-900">
                    {property.price}
                  </p>
                </div>

                <div className="flex items-start mb-2 text-gray-600">
                  <i className="fas fa-map-marker-alt mt-1 mr-2 text-gray-500"></i>
                  <p className="text-sm">{property.location}</p>
                </div>

                <div className="flex items-center mb-4 text-gray-600">
                  <i className="far fa-calendar-alt mr-2 text-gray-500"></i>
                  <p className="text-sm">
                    {new Date(property.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <button className="flex items-center px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg cursor-pointer whitespace-nowrap !rounded-button hover:bg-gray-200 transition-colors">
                    <i className="fas fa-edit mr-1.5"></i>
                    Edit
                  </button>
                  <button className="flex items-center px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg cursor-pointer whitespace-nowrap !rounded-button hover:bg-red-100 transition-colors">
                    <i className="fas fa-trash-alt mr-1.5"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {sortedProperties.length > 0 && (
        <div className="flex justify-center items-center py-6 border-t border-gray-200 mt-4">
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
          
          <div className="ml-4 text-sm text-gray-600">
            Showing {indexOfFirstProperty + 1}-
            {Math.min(indexOfLastProperty, sortedProperties.length)} of{" "}
            {sortedProperties.length} properties
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProperties;
