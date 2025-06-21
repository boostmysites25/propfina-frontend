import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getAllCitiesApi,
  getAllPropertiesApi,
  saveBannerCustomizationApi,
  getBannerCustomizationApi,
  uploadHeroBannerApi,
  getHeroBannerApi,
  deleteHeroBannerApi,
  initializeCollectionsApi,
} from "../../../utils/api";
import { uploadImage } from "../../../utils/uploadImage";

interface Property {
  id: string;
  _id?: string;
  projectName: string;
  title?: string;
  type?: string;
  intent: string;
  price: number;
  city: string;
  location?: string;
  locality: string;
  createdAt:
  | {
    _seconds: number;
    _nanoseconds: number;
  }
  | string;
  images?: string[];
  photos?: string[];
  buildingType: string;
  propertyType?: string;
  bhk?: string;
  // Add other property fields as needed
}

interface HeroBanner {
  id?: string;
  city: string;
  image: string;
  title: string;
  updatedAt?: Date;
}

interface PropertySectionProps {
  title: string;
  properties: Property[];
  selectedCity: string;
  onAddProperty: () => void;
  onRemoveProperty: (propertyId: string) => void;
  onRemoveMultiple: (propertyIds: string[]) => void;
}

const PropertySection: React.FC<PropertySectionProps> = ({
  title,
  properties,
  selectedCity,
  onAddProperty,
  onRemoveProperty,
  onRemoveMultiple,
}) => {
  const [selectedForRemoval, setSelectedForRemoval] = useState<string[]>([]);
  const [selectAllForRemoval, setSelectAllForRemoval] = useState(false);

  // Handle checkbox for removal selection
  const handleRemovalCheckbox = (propertyId: string) => {
    setSelectedForRemoval((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  // Handle select all for removal
  const handleSelectAllForRemoval = () => {
    if (selectAllForRemoval) {
      setSelectedForRemoval([]);
    } else {
      setSelectedForRemoval(properties.map((p) => p.id || p._id));
    }
    setSelectAllForRemoval(!selectAllForRemoval);
  };

  // Handle bulk removal
  const handleBulkRemoval = () => {
    onRemoveMultiple(selectedForRemoval);
    setSelectedForRemoval([]);
    setSelectAllForRemoval(false);
  };
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {title} - {selectedCity}
          </h2>
          <span className="text-sm text-gray-500">
            ({properties.length}/10)
          </span>
        </div>
        <div className="flex items-center gap-3">
          {properties.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectAllForRemoval}
                  onChange={handleSelectAllForRemoval}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
              {selectedForRemoval.length > 0 && (
                <button
                  onClick={handleBulkRemoval}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors text-sm"
                >
                  <i className="fas fa-trash"></i>
                  Remove ({selectedForRemoval.length})
                </button>
              )}
            </>
          )}
          <button
            onClick={onAddProperty}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <i className="fas fa-plus"></i>
            Add Property
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          // Get the first available image
          const imageUrl =
            property.images && property.images.length > 0
              ? property.images[0]
              : property.photos && property.photos.length > 0
                ? property.photos[0]
                : null;

          // Format the creation date
          const createdDate =
            typeof property.createdAt === "string"
              ? new Date(property.createdAt)
              : property.createdAt._seconds
                ? new Date(property.createdAt._seconds * 1000)
                : new Date();

          return (
            <div
              key={property.id || property._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative ${selectedForRemoval.includes(property.id || property._id)
                ? "ring-2 ring-red-500"
                : ""
                }`}
            >
              <div className="absolute top-2 right-2 z-10">
                <input
                  type="checkbox"
                  checked={selectedForRemoval.includes(
                    property.id || property._id
                  )}
                  onChange={() =>
                    handleRemovalCheckbox(property.id || property._id)
                  }
                  className="w-5 h-5 text-red-600 border-2 border-white bg-white rounded shadow-lg"
                />
              </div>
              <div className="relative h-48 overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={property.projectName || property.title || "Property"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://readdy.ai/api/search-image?query=modern%20apartment%20building&width=400&height=300&seq=1&orientation=landscape";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <i className="fas fa-image text-4xl text-gray-400"></i>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {property.intent || property.type || property.buildingType}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {property.projectName ||
                    property.title ||
                    "Untitled Property"}
                </h3>
                <div className="text-xl font-semibold text-gray-900 mb-3">
                  ₹ {property.price.toLocaleString()}
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <i className="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                  <span className="text-sm">
                    {property.locality || property.location || property.city}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <i className="far fa-calendar text-gray-400 mr-2"></i>
                  <span className="text-sm">
                    {createdDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      onRemoveProperty(property.id || property._id)
                    }
                    className="w-full py-2 px-3 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100 transition-colors"
                  >
                    <i className="fas fa-trash mr-1"></i>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {properties.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <i className="fas fa-home text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Properties Added
          </h3>
          <p className="text-gray-500 mb-4">
            Add properties to display in the {title.toLowerCase()} section.
          </p>
          <button
            onClick={onAddProperty}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <i className="fas fa-plus"></i>
            Add Property
          </button>
        </div>
      )}
    </div>
  );
};

const Banners: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showCityModal, setShowCityModal] = useState(true);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [cityProperties, setCityProperties] = useState<Property[]>([]);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [modalType, setModalType] = useState<
    "featured" | "recommended" | "recent" | ""
  >("");

  // State for selected properties for each section
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [recommendedProperties, setRecommendedProperties] = useState<
    Property[]
  >([]);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);

  // Flag to prevent loading from backend after any user action
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Multi-select state for property modal
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Hero Banner State
  const [heroBanner, setHeroBanner] = useState<HeroBanner | null>(null);
  const [showHeroBannerModal, setShowHeroBannerModal] = useState(false);
  const [heroBannerForm, setHeroBannerForm] = useState({
    image: "",
    title: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [banners, setBanners] = useState([]);

  const [hoveredBannerId, setHoveredBannerId] = useState<number | null>(null);

  // Fetch cities from API (backend now filters cities with properties)
  const citiesQuery = useQuery({
    queryKey: ["cities"],
    queryFn: getAllCitiesApi,
  });

  // Fetch properties for selected city
  const propertiesQuery = useQuery({
    queryKey: ["properties", selectedCity],
    queryFn: () => getAllPropertiesApi({ city: selectedCity }),
    enabled: !!selectedCity,
  });

  // Fetch existing banner customization for the city
  const bannerCustomizationQuery = useQuery({
    queryKey: ["bannerCustomization", selectedCity],
    queryFn: () => getBannerCustomizationApi(selectedCity),
    enabled: !!selectedCity,
    retry: false, // Don't retry if no customization exists (404 is expected)
    retryOnMount: false,
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: false, // Don't refetch when network reconnects
    staleTime: Infinity, // Consider data always fresh
    gcTime: Infinity, // Keep in cache forever
  });

  // Save banner customization mutation
  const saveBannerMutation = useMutation({
    mutationFn: saveBannerCustomizationApi,
    onSuccess: () => {
      toast.success("Banner customization saved successfully!");
      // Set flag to prevent loading from backend
      setHasUserInteracted(true);
      // Don't refetch to avoid overriding current state - the save was successful
      // bannerCustomizationQuery.refetch();
    },
    onError: (error: any) => {
      toast.error(
        `Failed to save banner customization: ${error.response?.status || "Unknown error"
        }`
      );
    },
  });

  // Hero Banner queries and mutations
  const heroBannerQuery = useQuery({
    queryKey: ["heroBanner", selectedCity],
    queryFn: () => getHeroBannerApi(selectedCity),
    enabled: !!selectedCity && !hasUserInteracted,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const uploadHeroBannerMutation = useMutation({
    mutationFn: ({
      city,
      data,
    }: {
      city: string;
      data: { image: string; title: string };
    }) => uploadHeroBannerApi(city, data),
    onSuccess: () => {
      toast.success("Hero banner updated successfully!");
      setShowHeroBannerModal(false);
      // Clean up file states
      setSelectedFile(null);
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl("");
      heroBannerQuery.refetch();
    },
    onError: (error) => {
      console.error("Error uploading hero banner:", error);
      toast.error("Failed to update hero banner");
    },
  });

  // Initialize collections mutation
  const initializeCollectionsMutation = useMutation({
    mutationFn: initializeCollectionsApi,
    onSuccess: () => {
      toast.success("Firebase collections initialized successfully!");
    },
    onError: (error: any) => {
      toast.error(
        `Failed to initialize collections: ${error.response?.status || "Unknown error"
        }`
      );
    },
  });

  // Update available cities when cities data changes
  useEffect(() => {
    if (citiesQuery.data?.data && Array.isArray(citiesQuery.data.data)) {
      const cities = [...citiesQuery.data.data].sort();
      setAvailableCities(cities);
    }
  }, [citiesQuery.data]);

  // Update city properties when properties data changes
  useEffect(() => {
    if (
      propertiesQuery.data?.data &&
      Array.isArray(propertiesQuery.data.data)
    ) {
      console.log("Properties data:", propertiesQuery.data.data);
      setCityProperties(propertiesQuery.data.data);
    }
  }, [propertiesQuery.data]);

  // Load saved banner customization when city changes
  useEffect(() => {
    console.log("🔄 Frontend: useEffect triggered - Banner customization query status:", {
      isLoading: bannerCustomizationQuery.isLoading,
      isError: bannerCustomizationQuery.isError,
      hasData: !!bannerCustomizationQuery.data,
      dataPath: bannerCustomizationQuery.data?.data?.data ? "EXISTS" : "MISSING",
      error: bannerCustomizationQuery.error?.message,
      hasUserInteracted: hasUserInteracted,
    });
    console.log("🏘️ Frontend: City properties count:", cityProperties.length);

    // Don't load from backend if user has interacted (to prevent overriding local changes)
    if (hasUserInteracted) {
      console.log("🚫 Frontend: Skipping backend load - user has made changes");
      return;
    }

    // Only process if we have city properties and the query is not loading
    if (cityProperties.length > 0 && !bannerCustomizationQuery.isLoading) {
      if (bannerCustomizationQuery.data?.data?.data) {
        const savedCustomization = bannerCustomizationQuery.data.data.data;
        console.log("📥 Frontend: Loading saved customization from backend:", savedCustomization);

        // Debug: Log the saved property IDs vs available property IDs
        console.log("🔍 Saved property IDs:", {
          featured: savedCustomization.featuredProperties || [],
          recommended: savedCustomization.recommendedProperties || [],
          recent: savedCustomization.recentProperties || [],
        });

        console.log(
          "🔍 Available property IDs in cityProperties:",
          cityProperties.map((p) => ({
            id: p.id,
            _id: p._id,
            name: p.projectName,
          }))
        );

        // Filter properties that still exist in the current city's properties
        const filteredFeatured = (savedCustomization.featuredProperties || [])
          .map((propId: string) => {
            const found = cityProperties.find(
              (p) => (p.id || p._id) === propId
            );
            if (!found) {
              console.log(
                `⚠️ Featured property ID ${propId} not found in cityProperties`
              );
            }
            return found;
          })
          .filter(Boolean);

        const filteredRecommended = (
          savedCustomization.recommendedProperties || []
        )
          .map((propId: string) => {
            const found = cityProperties.find(
              (p) => (p.id || p._id) === propId
            );
            if (!found) {
              console.log(
                `⚠️ Recommended property ID ${propId} not found in cityProperties`
              );
            }
            return found;
          })
          .filter(Boolean);

        const filteredRecent = (savedCustomization.recentProperties || [])
          .map((propId: string) => {
            const found = cityProperties.find(
              (p) => (p.id || p._id) === propId
            );
            if (!found) {
              console.log(
                `⚠️ Recent property ID ${propId} not found in cityProperties`
              );
            }
            return found;
          })
          .filter(Boolean);

        console.log("Filtered properties:", {
          filteredFeatured,
          filteredRecommended,
          filteredRecent,
        });

        console.log("🔄 Frontend: Setting properties from backend data:", {
          featured: filteredFeatured.length,
          recommended: filteredRecommended.length,
          recent: filteredRecent.length,
        });

        setFeaturedProperties(filteredFeatured);
        setRecommendedProperties(filteredRecommended);
        setRecentProperties(filteredRecent);
      } else {
        // No saved customization found - this is normal for new cities
        // Arrays are already cleared in handleCitySelect, so no need to do anything
        console.log("❌ Frontend: No saved customization found for city:", selectedCity);
      }
    }
  }, [
    // Removed bannerCustomizationQuery.data to prevent useEffect from triggering when query data changes
    // This prevents the old data from overriding our local state after a successful save
    bannerCustomizationQuery.isLoading,
    cityProperties,
    selectedCity,
    hasUserInteracted,
  ]);

  // Load hero banner when city changes (only if user hasn't interacted)
  useEffect(() => {
    if (hasUserInteracted) {
      console.log("🚫 Frontend: Skipping hero banner load - user has interacted");
      return;
    }

    if (heroBannerQuery.data?.data) {
      setHeroBanner(heroBannerQuery.data.data);
    } else {
      setHeroBanner(null);
    }
  }, [heroBannerQuery.data, hasUserInteracted]);

  // Handle cities API error
  useEffect(() => {
    if (citiesQuery.isError && citiesQuery.error) {
      console.error("Error fetching cities:", citiesQuery.error);
      toast.error("Failed to load cities. Please try again.");
    }
  }, [citiesQuery.isError, citiesQuery.error]);

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityModal(false);
    // Clear current properties when switching cities so they don't interfere with loading
    setFeaturedProperties([]);
    setRecommendedProperties([]);
    setRecentProperties([]);
    // Clear hero banner state
    setHeroBanner(null);
    // Reset interaction flag when changing cities
    setHasUserInteracted(false);
  };

  const handleChangeCityClick = () => {
    setShowCityModal(true);
  };

  const handleMouseEnter = (id: number) => {
    setHoveredBannerId(id);
  };

  const handleMouseLeave = () => {
    setHoveredBannerId(null);
  };

  const handleDelete = (id: number) => {
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  const handleAddProperty = (type: "featured" | "recommended" | "recent") => {
    setModalType(type);
    setSelectedPropertyIds([]);
    setSelectAll(false);
    setShowPropertyModal(true);
  };

  // Handle individual property checkbox
  const handlePropertyCheckbox = (propertyId: string) => {
    setSelectedPropertyIds((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : prev.length < 10
          ? [...prev, propertyId]
          : prev
    );
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPropertyIds([]);
    } else {
      const availableIds = cityProperties
        .filter((p) => {
          const currentProps =
            modalType === "featured"
              ? featuredProperties
              : modalType === "recommended"
                ? recommendedProperties
                : recentProperties;
          return !currentProps.find(
            (existing) => (existing.id || existing._id) === (p.id || p._id)
          );
        })
        .slice(0, 10)
        .map((p) => p.id || p._id);
      setSelectedPropertyIds(availableIds);
    }
    setSelectAll(!selectAll);
  };

  // Handle adding selected properties
  const handleAddSelectedProperties = () => {
    // Mark that user has interacted to prevent backend reload
    setHasUserInteracted(true);

    const propertiesToAdd = cityProperties.filter((p) =>
      selectedPropertyIds.includes(p.id || p._id)
    );

    switch (modalType) {
      case "featured":
        const newFeatured = [...featuredProperties, ...propertiesToAdd].slice(
          0,
          10
        );
        setFeaturedProperties(newFeatured);
        break;
      case "recommended":
        const newRecommended = [
          ...recommendedProperties,
          ...propertiesToAdd,
        ].slice(0, 10);
        setRecommendedProperties(newRecommended);
        break;
      case "recent":
        const newRecent = [...recentProperties, ...propertiesToAdd].slice(
          0,
          10
        );
        setRecentProperties(newRecent);
        break;
    }

    toast.success(
      `${propertiesToAdd.length} properties added to ${modalType} section`
    );
    setShowPropertyModal(false);
    setSelectedPropertyIds([]);
    setSelectAll(false);
  };

  const handleRemoveProperty = (
    propertyId: string,
    section: "featured" | "recommended" | "recent"
  ) => {
    // Mark that user has interacted to prevent backend reload
    setHasUserInteracted(true);

    switch (section) {
      case "featured":
        setFeaturedProperties(
          featuredProperties.filter((p) => (p.id || p._id) !== propertyId)
        );
        break;
      case "recommended":
        setRecommendedProperties(
          recommendedProperties.filter((p) => (p.id || p._id) !== propertyId)
        );
        break;
      case "recent":
        setRecentProperties(
          recentProperties.filter((p) => (p.id || p._id) !== propertyId)
        );
        break;
    }
    toast.success(`Property removed from ${section} section`);
  };

  const handleRemoveMultiple = (
    propertyIds: string[],
    section: "featured" | "recommended" | "recent"
  ) => {
    // Mark that user has interacted to prevent backend reload
    setHasUserInteracted(true);

    switch (section) {
      case "featured":
        setFeaturedProperties(
          featuredProperties.filter((p) => !propertyIds.includes(p.id || p._id))
        );
        break;
      case "recommended":
        setRecommendedProperties(
          recommendedProperties.filter(
            (p) => !propertyIds.includes(p.id || p._id)
          )
        );
        break;
      case "recent":
        setRecentProperties(
          recentProperties.filter((p) => !propertyIds.includes(p.id || p._id))
        );
        break;
    }
    toast.success(
      `${propertyIds.length} properties removed from ${section} section`
    );
  };

  // Save banner customization
  const handleSaveBannerCustomization = () => {
    const data = {
      city: selectedCity,
      featuredProperties: featuredProperties.map((p) => p.id || p._id),
      recommendedProperties: recommendedProperties.map((p) => p.id || p._id),
      recentProperties: recentProperties.map((p) => p.id || p._id),
    };
    console.log("🚀 Frontend: Saving banner customization for", selectedCity, "with", {
      featured: data.featuredProperties.length,
      recommended: data.recommendedProperties.length,
      recent: data.recentProperties.length,
    }, "properties");
    saveBannerMutation.mutate(data);
  };

  // Debug function to check if data was saved
  const handleDebugLoad = async () => {
    try {
      const result = await getBannerCustomizationApi(selectedCity);
      console.log("🔍 Debug load result:", result.data);
      toast.success("Check console for saved data");
    } catch (error) {
      console.log("🔍 Debug load error (expected if no data saved):", error);
      toast.info("No saved data found (check console)");
    }
  };

  // Hero Banner Handlers
  const handleHeroBannerEdit = () => {
    if (heroBanner) {
      setHeroBannerForm({ image: heroBanner.image, title: heroBanner.title });
      setPreviewUrl(heroBanner.image);
    } else {
      setHeroBannerForm({ image: "", title: "" });
      setPreviewUrl("");
    }
    setSelectedFile(null);
    setShowHeroBannerModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleHeroBannerSave = async () => {
    if (!heroBannerForm.title) {
      toast.error("Please enter a banner title");
      return;
    }

    // If a new file is selected, upload it first
    let imageUrl = heroBannerForm.image;

    if (selectedFile) {
      try {
        setUploadingImage(true);
        toast.loading("Uploading image...", { id: "upload" });

        const uploadResult = await uploadImage(selectedFile);
        imageUrl = uploadResult.url;

        toast.dismiss("upload");
        toast.success("Image uploaded successfully!");
      } catch (error) {
        setUploadingImage(false);
        toast.dismiss("upload");
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image. Please try again.");
        return;
      } finally {
        setUploadingImage(false);
      }
    }

    if (!imageUrl) {
      toast.error("Please select an image");
      return;
    }

    // Save banner with image URL
    uploadHeroBannerMutation.mutate({
      city: selectedCity,
      data: { image: imageUrl, title: heroBannerForm.title },
    });
  };

  // Delete hero banner mutation
  const deleteHeroBannerMutation = useMutation({
    mutationFn: (city: string) => deleteHeroBannerApi(city),
    onSuccess: () => {
      console.log("✅ Frontend: Hero banner deleted successfully");
      setHeroBanner(null);
      // Don't refetch to avoid reloading data
      // heroBannerQuery.refetch(); // Update the query cache
      toast.success("Hero banner deleted successfully!");
    },
    onError: (error: any) => {
      console.error("❌ Frontend: Hero banner delete error:", error);
      console.error("❌ Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 404) {
        toast.error("Hero banner not found - it may have already been deleted");
        setHeroBanner(null); // Clear from UI anyway
      } else {
        toast.error(error.response?.data?.message || "Failed to delete hero banner");
      }
    }
  });

  const handleHeroBannerDelete = () => {
    console.log("🗑️ Frontend: Deleting hero banner for", selectedCity);
    console.log("🔍 Frontend: Current hero banner state:", heroBanner);

    // Mark that user has interacted to prevent backend reload
    setHasUserInteracted(true);

    if (!heroBanner) {
      toast.info("No hero banner to delete");
      return;
    }

    deleteHeroBannerMutation.mutate(selectedCity);
  };

  // City Selection Modal
  const CitySelectionModal = () => (
    <div className="relative h-full flex items-center justify-center z-50 p-4">
      {/* Background overlay that excludes sidebar area */}
      <div className="">
        <div className="absolute inset-0 bg-black/30 bg-opacity-50 backdrop-blur-sm"></div>
      </div>

      {/* Modal content positioned to not overlap with sidebar */}
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-10 my-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Select City
        </h2>
        <p className="text-gray-600 mb-6">
          Choose a city to customize its banner and properties.
        </p>

        <div className="space-y-4">
          {citiesQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
              <span className="ml-2 text-gray-600">Loading cities...</span>
            </div>
          ) : citiesQuery.isError ? (
            <div className="text-center py-8">
              <i className="fas fa-exclamation-triangle text-2xl text-red-400 mb-2"></i>
              <p className="text-red-600">Failed to load cities</p>
              <button
                onClick={() => citiesQuery.refetch()}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Try again
              </button>
            </div>
          ) : availableCities.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-home text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No Cities Available
              </h3>
              <p className="text-gray-500">
                No cities with properties found for banner customization.
              </p>
            </div>
          ) : (
            <div className="grid gap-2 max-h-60 overflow-y-auto">
              {availableCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <i className="fas fa-map-marker-alt text-gray-400"></i>
                    <span className="font-medium text-gray-800">{city}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Property Selection Modal
  const PropertySelectionModal = () => (
    <div className="fixed md:left-60 inset-0 flex items-center justify-center z-50 p-4">
      {/* Background overlay that excludes sidebar area */}
      <div className="fixed inset-0 md:left-60">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      </div>

      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto relative z-10 my-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Select Properties for {modalType} Section
          </h2>
          <button
            onClick={() => setShowPropertyModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Choose up to 10 properties from {selectedCity} for the {modalType}{" "}
            section.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">
                  Select All (Max 10)
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Selected: {selectedPropertyIds.length}/10
              </span>
            </div>
            {selectedPropertyIds.length > 0 && (
              <button
                onClick={handleAddSelectedProperties}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <i className="fas fa-plus"></i>
                Add Selected ({selectedPropertyIds.length})
              </button>
            )}
          </div>
        </div>

        {propertiesQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
            <span className="ml-2 text-gray-600">Loading properties...</span>
          </div>
        ) : cityProperties.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-home text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-500">
              No properties available in {selectedCity}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {cityProperties.map((property) => {
              // Get the first available image
              const imageUrl =
                property.images && property.images.length > 0
                  ? property.images[0]
                  : property.photos && property.photos.length > 0
                    ? property.photos[0]
                    : null;

              const propertyId = property.id || property._id;
              const isSelected = selectedPropertyIds.includes(propertyId);
              const isAlreadyAdded = (() => {
                const currentProps =
                  modalType === "featured"
                    ? featuredProperties
                    : modalType === "recommended"
                      ? recommendedProperties
                      : recentProperties;
                return currentProps.find(
                  (existing) => (existing.id || existing._id) === propertyId
                );
              })();

              return (
                <div
                  key={propertyId}
                  className={`border rounded-lg p-4 transition-colors relative ${isAlreadyAdded
                    ? "border-gray-300 bg-gray-50 opacity-50"
                    : isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-400 cursor-pointer"
                    }`}
                  onClick={() =>
                    !isAlreadyAdded && handlePropertyCheckbox(propertyId)
                  }
                >
                  {!isAlreadyAdded && (
                    <div className="absolute top-2 right-2 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handlePropertyCheckbox(propertyId);
                        }}
                        className="w-5 h-5 text-blue-600 border-2 border-white bg-white rounded shadow-lg"
                      />
                    </div>
                  )}
                  {isAlreadyAdded && (
                    <div className="absolute top-2 right-2 z-10 bg-gray-600 text-white px-2 py-1 rounded text-xs">
                      Already Added
                    </div>
                  )}
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={
                          property.projectName || property.title || "Property"
                        }
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://readdy.ai/api/search-image?query=modern%20apartment%20building&width=400&height=300&seq=1&orientation=landscape";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="fas fa-image text-2xl text-gray-400"></i>
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    {property.projectName ||
                      property.title ||
                      "Untitled Property"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {property.locality || property.location || property.city}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹ {property.price.toLocaleString()}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
                    {property.intent || property.type || property.buildingType}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Don't render the main content until a city is selected
  if (showCityModal) {
    return <CitySelectionModal />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with city selection */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Customize Banner - {selectedCity}
            </h1>
            <button
              onClick={handleChangeCityClick}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-200 transition-colors"
            >
              <i className="fas fa-exchange-alt mr-1"></i> Change City
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Total:{" "}
              {featuredProperties.length +
                recommendedProperties.length +
                recentProperties.length}{" "}
              properties
            </div>

            <button
              onClick={handleSaveBannerCustomization}
              disabled={saveBannerMutation.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveBannerMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Save Configuration
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Hero Banner for {selectedCity}
            </h2>
            <button
              onClick={handleHeroBannerEdit}
              className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <i className={`fas ${heroBanner ? "fa-pen" : "fa-plus"}`}></i>
              {heroBanner ? "Edit Banner" : "Add Hero Banner"}
            </button>
          </div>

          <div className="space-y-8">
            {heroBanner ? (
              <div className="relative rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                <div
                  className="relative group"
                  onMouseEnter={() => setHoveredBannerId(1)}
                  onMouseLeave={() => setHoveredBannerId(null)}
                >
                  <img
                    src={heroBanner.image}
                    alt={heroBanner.title}
                    className="w-full h-[460px] object-cover object-top group-hover:brightness-90 transition-all duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://readdy.ai/api/search-image?query=modern%20professional%20website%20banner%20with%20abstract%20gradient%20background%20in%20soft%20blue%20and%20gray%20tones%2C%20minimalist%20design%2C%20clean%20layout%2C%20suitable%20for%20corporate%20website%20hero%20section%2C%20high%20resolution%20digital%20art&width=2000&height=857&seq=12345&orientation=landscape";
                    }}
                  />

                  {hoveredBannerId === 1 && (
                    <div className="absolute inset-0 flex items-center justify-center gap-4">
                      <button
                        onClick={handleHeroBannerEdit}
                        className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <i className="fas fa-pen text-gray-700"></i>
                      </button>
                      <button
                        onClick={handleHeroBannerDelete}
                        className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <i className="fas fa-trash text-red-500"></i>
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-4 p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {heroBanner.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Recommended size: 2000x857 pixels
                  </p>
                  {heroBanner.updatedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Last updated:{" "}
                      {new Date(heroBanner.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <i className="fas fa-image text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500 mb-4">
                  No hero banner set for {selectedCity}
                </p>
                <button
                  onClick={handleHeroBannerEdit}
                  className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <i className="fas fa-plus"></i> Add Hero Banner
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Property Sections */}
        <PropertySection
          title="Featured Properties"
          properties={featuredProperties}
          selectedCity={selectedCity}
          onAddProperty={() => handleAddProperty("featured")}
          onRemoveProperty={(propertyId) =>
            handleRemoveProperty(propertyId, "featured")
          }
          onRemoveMultiple={(propertyIds) =>
            handleRemoveMultiple(propertyIds, "featured")
          }
        />
        <PropertySection
          title="Recommended Properties"
          properties={recommendedProperties}
          selectedCity={selectedCity}
          onAddProperty={() => handleAddProperty("recommended")}
          onRemoveProperty={(propertyId) =>
            handleRemoveProperty(propertyId, "recommended")
          }
          onRemoveMultiple={(propertyIds) =>
            handleRemoveMultiple(propertyIds, "recommended")
          }
        />
        <PropertySection
          title="Recently Added Properties"
          properties={recentProperties}
          selectedCity={selectedCity}
          onAddProperty={() => handleAddProperty("recent")}
          onRemoveProperty={(propertyId) =>
            handleRemoveProperty(propertyId, "recent")
          }
          onRemoveMultiple={(propertyIds) =>
            handleRemoveMultiple(propertyIds, "recent")
          }
        />
      </div>

      {/* Property Selection Modal */}
      {showPropertyModal && <PropertySelectionModal />}

      {/* Hero Banner Modal */}
      {showHeroBannerModal && (
        <div className="fixed md:left-60 inset-0 flex items-center justify-center z-50 p-4">
          {/* Background overlay that excludes sidebar area */}
          <div className="fixed inset-0 md:left-60">
            <div className="absolute inset-0 bg-black/30 bg-opacity-50 backdrop-blur-sm"></div>
          </div>

          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative z-10 my-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {heroBanner ? "Edit Hero Banner" : "Add Hero Banner"}
              </h2>
              <button
                onClick={() => {
                  setShowHeroBannerModal(false);
                  setSelectedFile(null);
                  if (previewUrl && previewUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  setPreviewUrl("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Title
                </label>
                <input
                  type="text"
                  value={heroBannerForm.title}
                  onChange={(e) =>
                    setHeroBannerForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter banner title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, JPEG (Max 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                    <i className="fas fa-check-circle"></i>
                    Selected: {selectedFile.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: 2000x857 pixels (16:9 aspect ratio)
                </p>
              </div>

              {/* Image Preview */}
              {previewUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    {selectedFile && (
                      <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        New Upload
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowHeroBannerModal(false);
                  setSelectedFile(null);
                  if (previewUrl && previewUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  setPreviewUrl("");
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleHeroBannerSave}
                disabled={uploadHeroBannerMutation.isPending || uploadingImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploadingImage ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Uploading Image...
                  </>
                ) : uploadHeroBannerMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Saving Banner...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Save Banner
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
