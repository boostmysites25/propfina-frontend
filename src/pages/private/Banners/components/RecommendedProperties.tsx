import React, { useState } from "react";

const RecomendedProperties: React.FC = () => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Recommended flat",
      type: "buy",
      price: "₹ 53,444",
      location: "F9/2, MUMBAI",
      date: "Invalid Date",
      admin: "admin",
      phone: "1234567876",
      image:
        "https://readdy.ai/api/search-image?query=Luxurious%20modern%20villa%20with%20infinity%20pool%20and%20outdoor%20lounge%20area%2C%20featuring%20large%20glass%20windows%2C%20contemporary%20architecture%2C%20clean%20white%20exterior%2C%20surrounded%20by%20lush%20landscaping%2C%20perfect%20sunny%20day%2C%20high-end%20residential%20property&width=800&height=400&seq=12345&orientation=landscape",
    },
  ]);

  const handleDelete = (id: number) => {
    setProperties(properties.filter((property) => property.id !== id));
  };
  return (
    <div className="px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Recommended Properties
        </h1>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 !rounded-button cursor-pointer whitespace-nowrap">
          <i className="fas fa-plus mr-2"></i>
          Add Recommended Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-60 overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                  {property.title}
                </h3>
                <span className="text-sm text-gray-500">{property.type}</span>
              </div>

              <div className="text-2xl font-semibold mb-4 text-gray-900">
                {property.price}
              </div>

              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-gray-400 w-5"></i>
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="far fa-calendar text-gray-400 w-5"></i>
                  <span>{property.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="far fa-user text-gray-400 w-5"></i>
                  <span>{property.admin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-phone-alt text-gray-400 w-5"></i>
                  <span>{property.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg flex justify-center items-center !rounded-button cursor-pointer whitespace-nowrap">
                  <i className="fas fa-edit mr-2"></i>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="py-2 px-4 bg-red-50 text-red-600 rounded-lg flex justify-center items-center !rounded-button cursor-pointer whitespace-nowrap"
                >
                  <i className="fas fa-trash-alt mr-2"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-sm p-8 text-center">
          <i className="fas fa-home text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Properties Found
          </h3>
          <p className="text-gray-500 mb-6">
            There are no Recommended properties to display.
          </p>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-lg flex items-center gap-2 !rounded-button cursor-pointer whitespace-nowrap">
            <i className="fas fa-plus mr-2"></i>
            Add Your First Property
          </button>
        </div>
      )}
    </div>
  );
};

export default RecomendedProperties;
