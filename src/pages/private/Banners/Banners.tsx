import React, { useState } from "react";
import FeaturedProperties from "./components/FeaturedProperties";
import RecomendedProperties from "./components/RecommendedProperties";
import RecentlyAddedProperties from "./components/RecentlyAddedProperties";

const Banners: React.FC = () => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: "New Banner",
      recommendedSize: "2000x857 pixels",
      imageUrl:
        "https://readdy.ai/api/search-image?query=modern%20professional%20website%20banner%20with%20abstract%20gradient%20background%20in%20soft%20blue%20and%20gray%20tones%2C%20minimalist%20design%2C%20clean%20layout%2C%20suitable%20for%20corporate%20website%20hero%20section%2C%20high%20resolution%20digital%20art&width=2000&height=857&seq=12345&orientation=landscape",
    },
  ]);

  const [hoveredBannerId, setHoveredBannerId] = useState<number | null>(null);

  const handleMouseEnter = (id: number) => {
    setHoveredBannerId(id);
  };

  const handleMouseLeave = () => {
    setHoveredBannerId(null);
  };

  const handleDelete = (id: number) => {
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Hero Banners</h1>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2 !rounded-button cursor-pointer whitespace-nowrap">
            <i className="fas fa-plus"></i> Add New Banner
          </button>
        </div>

        <div className="space-y-8 mb-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative rounded-lg overflow-hidden bg-gray-50 shadow-sm"
            >
              <div
                className="relative group"
                onMouseEnter={() => handleMouseEnter(banner.id)}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-[460px] object-cover object-top group-hover:brightness-90 transition-all duration-200"
                />

                {hoveredBannerId === banner.id && (
                  <div className="absolute inset-0 flex items-center justify-center gap-4">
                    <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors cursor-pointer !rounded-button whitespace-nowrap">
                      <i className="fas fa-pen text-gray-700"></i>
                    </button>
                    <button
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors cursor-pointer !rounded-button whitespace-nowrap"
                      onClick={() => handleDelete(banner.id)}
                    >
                      <i className="fas fa-trash text-red-500"></i>
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4 p-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {banner.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Recommended size: {banner.recommendedSize}
                </p>
              </div>
            </div>
          ))}

          {banners.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <i className="fas fa-image text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-500 mb-4">No banners available</p>
              <button className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2 !rounded-button cursor-pointer whitespace-nowrap">
                <i className="fas fa-plus"></i> Add New Banner
              </button>
            </div>
          )}
        </div>
        <FeaturedProperties />
        <RecomendedProperties />
        <RecentlyAddedProperties />
      </div>
    </div>
  );
};

export default Banners;
