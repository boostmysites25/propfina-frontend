import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPropertiesApi } from "../../../utils/api";
import { toast } from "react-hot-toast";
import type { Property, PropertyFilters } from "../../../utils/types";

const AllProperties: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] =
    useState("All Properties");
  const [buildingTypeFilter, setBuildingTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("Date: Newest First");
  
  // Available cities from API response
  const [availableCities, setAvailableCities] = useState<string[]>([]);

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
  }, [
    searchQuery,
    propertyTypeFilter,
    buildingTypeFilter,
    locationFilter,
    sortFilter,
  ]);

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
  const buildingTypeOptions = [
    { label: "All", value: "" },
    { label: "Residential", value: "residential" },
    { label: "Commercial", value: "commercial" },
  ];
  const sortOptions = [
    { label: "Date: Newest First", value: "newest" },
    { label: "Date: Oldest First", value: "oldest" },
    { label: "Price: Low to High", value: "priceHigh" },
    { label: "Price: High to Low", value: "priceLow" },
  ];

  // Prepare API filters
  const apiFilters = useMemo(() => {
    const filters: PropertyFilters = {};
    
    // Add sort filter
    if (sortFilter === "Date: Newest First") filters.sort = "newest";
    else if (sortFilter === "Date: Oldest First") filters.sort = "oldest";
    else if (sortFilter === "Price: Low to High") filters.sort = "priceHigh";
    else if (sortFilter === "Price: High to Low") filters.sort = "priceLow";
    
    // Add city filter - convert to lowercase for API
    if (locationFilter !== "All") filters.city = locationFilter.toLowerCase();
    
    // Add building type filter - convert to lowercase for API
    if (buildingTypeFilter !== "All") filters.buildingType = buildingTypeFilter.toLowerCase();
    
    // Add intent filter - convert to lowercase for API
    if (propertyTypeFilter === "Buy Properties") filters.intent = "buy";
    else if (propertyTypeFilter === "Rent Properties") filters.intent = "rent";
    else if (propertyTypeFilter === "PG Properties") filters.intent = "pg";
    
    return filters;
  }, [sortFilter, locationFilter, buildingTypeFilter, propertyTypeFilter]);

  // Fetch properties from API
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['properties', apiFilters],
    queryFn: () => getAllPropertiesApi(apiFilters),
    onSuccess: (response) => {
      // Extract unique cities from the response
      if (response.data && Array.isArray(response.data)) {
        const cities = [...new Set(response.data.map((property: Property) => 
          property.cityOriginal || property.city || ''
        ))].filter(city => city !== '');
        
        // Sort cities alphabetically
        cities.sort();
        
        setAvailableCities(["All", ...cities]);
      }
    },
    onError: (err) => {
      console.error("Error fetching properties:", err);
      toast.error("Failed to load properties. Please try again.");
    }
  });

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

  // Process properties from API response
  const properties = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return [];
    
    return data.data.map((property: Property) => {
      // Convert timestamp to date string
      const timestamp = property.createdAt?._seconds 
        ? new Date(property.createdAt._seconds * 1000).toISOString() 
        : new Date().toISOString();
      
      // Use the original capitalized values if available
      const propertyType = property.intentOriginal || property.intent || '';
      const buildingType = property.buildingTypeOriginal || property.buildingType || '';
      const location = property.cityOriginal || property.city || '';
      
      return {
        id: property.id,
        name: property.projectName,
        price: `₹${property.price.toLocaleString('en-IN')}`,
        location: location,
        date: timestamp,
        type: propertyType,
        buildingType: buildingType,
        image: property.images && property.images.length > 0 
          ? property.images[0] 
          : "https://readdy.ai/api/search-image?query=Modern%20apartment%20building%20with%20balconies%20and%20large%20windows%2C%20surrounded%20by%20landscaped%20gardens%20and%20walking%20paths.&width=600&height=400&seq=5&orientation=landscape"
      };
    });
  }, [data]);

  // Apply search filter locally (since API doesn't support search)
  const filteredProperties = useMemo(() => {
    if (!searchQuery) return properties;
    
    const query = searchQuery.toLowerCase().trim();
    return properties.filter(property => 
      (property.name && property.name.toLowerCase().includes(query)) ||
      (property.location && property.location.toLowerCase().includes(query))
    );
  }, [properties, searchQuery]);

  // Get current properties for pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

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
                  key={option.label}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBuildingTypeFilter(option.label);
                    setBuildingTypeDropdownOpen(false);
                  }}
                >
                  {option.label}
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
            disabled={isLoading}
          >
            <span>{locationFilter}</span>
            <i className="fas fa-chevron-down ml-2 text-gray-500"></i>
          </button>
          {locationDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              {availableCities.length > 0 ? (
                availableCities.map((option) => (
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
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">Loading cities...</div>
              )}
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
                  key={option.label}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSortFilter(option.label);
                    setSortDropdownOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 text-red-500">
          <i className="fas fa-exclamation-circle text-5xl mb-4"></i>
          <p className="text-xl">Failed to load properties</p>
          <p className="mt-2">Please try again later or contact support</p>
          <button 
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Property Grid/List */}
      {!isLoading && !isError && (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr"
              : "flex flex-col"
          } gap-6 p-4 md:p-6`}
        >
          {filteredProperties.length === 0 ? (
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
                  viewMode === "grid"
                    ? "w-full"
                    : "min-w-[200px] max-w-[200px] h-[150px] rounded-lg"
                }`}
                style={viewMode === "grid" ? { aspectRatio: "16/9" } : {}}
              >
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    // Fallback image if the property image fails to load
                    (e.target as HTMLImageElement).src = "https://readdy.ai/api/search-image?query=Modern%20apartment%20building%20with%20balconies%20and%20large%20windows%2C%20surrounded%20by%20landscaped%20gardens%20and%20walking%20paths.&width=600&height=400&seq=5&orientation=landscape";
                  }}
                />
              </div>

              <div
                className={`p-4 ${viewMode === "list" ? "flex-1 ml-2" : ""}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    {property.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      property.type.toLowerCase().includes("buy") || property.type.toLowerCase().includes("sell")
                        ? "bg-blue-100 text-blue-800"
                        : property.type.toLowerCase().includes("rent")
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
      )}

      {/* Pagination */}
      {!isLoading && !isError && filteredProperties.length > 0 && (
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => {
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
                }
              )}
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
            {Math.min(indexOfLastProperty, filteredProperties.length)} of{" "}
            {filteredProperties.length} properties
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProperties;
