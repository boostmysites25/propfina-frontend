import React, { useState, useRef, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllPropertiesApi, updatePropertyApi } from "../../../utils/api";
import { toast } from "react-hot-toast";
import type { PropertyFormData, Property } from "../../../utils/types";
import { handleApiError } from "../../../utils/errorHandler";
import { uploadImage } from "../../../utils/uploadImage";
import { useParams, useNavigate } from "react-router-dom";

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bhkValue, setBhkValue] = useState<string>("");
  const [bathroomsValue, setBathroomsValue] = useState<string>("");
  const [balconiesValue, setBalconiesValue] = useState<string>("");
  const [ownershipValue, setOwnershipValue] = useState<string>("");
  const [leaseTypeValue, setLeaseTypeValue] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // React Hook Form setup
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PropertyFormData>({
    defaultValues: {
      intent: "Sell",
      buildingType: "Residential",
      ownership: "Owner",
      leaseType: "Non-Leased",
      parking: "Yes",
      possessionStatus: "Ready to Move",
      furnishedStatus: "Furnished",
      ageOfProperty: "0–1 year",
    },
  });

  // Fetch all properties and find the one we need
  const {
    data: propertiesData,
    isError,
    error,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: () => getAllPropertiesApi(),
    retry: 1,
  });

  // Find the specific property by ID
  const property = propertiesData?.data?.find(
    (prop: Property) => prop.id === id
  );

  // Watch form values
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const parkingAvailability =
   watch("parking");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const possessionStatus =
   watch("possessionStatus");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const furnishedStatus =
   watch("furnishedStatus");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const propertyAge =
   watch("ageOfProperty");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const description =
   watch("description");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const additionalNotes =
   watch("additionalNotes");

  // API mutation
  const mutation = useMutation({
    mutationFn: (data: PropertyFormData) => updatePropertyApi(id || "", data),
    onSuccess: () => {
      toast.success("Property updated successfully!");
      navigate("/properties");
    },
    onError: (error) => {
      toast.error("Failed to update property. Please try again.");
      console.error("Error updating property:", error);
    },
  });
  
  // Use mutation.isPending for form submission state
  const isSubmitting = mutation.isPending;

  // Set form values when property data is loaded
  useEffect(() => {
    if (property) {
      // Set form values
      reset({
        projectName: property.projectName || "",
        price: property.price || 0,
        intent: property.intentOriginal || property.intent || "Sell",
        buildingType:
          property.buildingTypeOriginal ||
          property.buildingType ||
          "Residential",
        propertyType: property.propertyType || "",
        unitNumber: property.unitNumber || "",
        flatName: property.flatName || "",
        locality: property.locality || "",
        city: property.cityOriginal || property.city || "",
        phoneNumber: property.phoneNumber || "",
        builtUpArea: property.builtUpArea ? Number(property.builtUpArea) : 0,
        superBuiltUpArea: property.superBuiltUpArea
          ? Number(property.superBuiltUpArea)
          : 0,
        carpetArea: property.carpetArea ? Number(property.carpetArea) : 0,
        ownership: property.ownershipOriginal || property.ownership || "Owner",
        leaseType:
          property.leaseTypeOriginal || property.leaseType || "Non-Leased",
        parking: property.parkingOriginal || property.parking || "Yes",
        possessionStatus:
          property.possessionStatusOriginal ||
          property.possessionStatus ||
          "Ready to Move",
        furnishedStatus:
          property.furnishedStatusOriginal ||
          property.furnishedStatus ||
          "Furnished",
        ageOfProperty:
          property.ageOfPropertyOriginal ||
          property.ageOfProperty ||
          "0–1 year",
        description: property.description || "",
        additionalNotes: property.additionalNotes || "",
      });

      // Set dropdown values
      setBhkValue(property.bhk || "");
      setBathroomsValue(property.bathrooms || property.washroom || "");
      setBalconiesValue(property.balconies || property.balcony || "");
      setOwnershipValue(
        property.ownershipOriginal || property.ownership || "Owner"
      );
      setLeaseTypeValue(
        property.leaseTypeOriginal || property.leaseType || "Non-Leased"
      );

      // Set existing images
      const images = property.images || property.photos || [];
      setExistingImages(images);

      setIsLoading(false);
    }
  }, [property, reset]);

  // Handle error or property not found
  useEffect(() => {
    if (isError && error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties. Please try again.");
      navigate("/properties");
    } else if (propertiesData && !property) {
      console.error("Property not found:", id);
      toast.error("Property not found. Please try again.");
      navigate("/properties");
    }
  }, [isError, error, navigate, propertiesData, property, id]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  // Remove selected file
  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Remove existing image
  const removeExistingImage = (url: string) => {
    setExistingImages((prevImages) =>
      prevImages.filter((image) => image !== url)
    );
    setImagesToDelete((prevImages) => [...prevImages, url]);
  };

  // Toggle dropdown
  const toggleDropdown = (dropdownId: string) => {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.classList.toggle("hidden");
    }
  };

  // Select option from dropdown
  const selectOption = (
    option: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    dropdownId: string,
    fieldName?: keyof PropertyFormData
  ) => {
    setter(option);
    if (fieldName) {
      setValue(fieldName, option as PropertyFormData[keyof PropertyFormData]);
    }
    toggleDropdown(dropdownId);
  };

  const onSubmit: SubmitHandler<PropertyFormData> = async (data) => {
    // Set form as submitted to show validation errors
    setFormSubmitted(true);

    // Check if required fields are filled
    if (!bhkValue || !bathroomsValue) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Set dropdown values that might not be in the form
      data.bhk = bhkValue;
      data.bathrooms = bathroomsValue;
      data.balconies = balconiesValue;
      data.ownership = ownershipValue || "Owner";
      data.leaseType = leaseTypeValue || "Non-Leased";

      // Convert string numbers to actual numbers
      data.price = Number(data.price);
      data.builtUpArea = Number(data.builtUpArea) || 0;
      data.superBuiltUpArea = Number(data.superBuiltUpArea) || 0;
      data.carpetArea = Number(data.carpetArea) || 0;

      // Keep existing images that weren't deleted
      const remainingImages = existingImages.filter(
        (url) => !imagesToDelete.includes(url)
      );

      // Upload new images if any
      let uploadedImageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        try {
          const uploadPromises = selectedFiles.map((file) => uploadImage(file));
          const uploadResults = await Promise.all(uploadPromises);
          uploadedImageUrls = uploadResults.map((result) => result.url);
        } catch (error) {
          console.error("Error uploading images:", error);
          toast.error("Failed to upload images. Please try again.");
          return;
        }
      }

      // Combine existing and new images
      data.images = [...remainingImages, ...uploadedImageUrls];

      // Submit the form
      mutation.mutate(data);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Dropdown options
  const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];
  const bathroomOptions = ["1", "2", "3", "4", "5+"];
  const balconyOptions = ["0", "1", "2", "3", "4+"];

  // Show loading state while fetching data or if property is not yet found
  if (isLoading || !property) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Edit Property</h1>

        <form
          onSubmit={hookFormSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Project Name*
                </label>
                <input
                  type="text"
                  {...register("projectName", {
                    required: "Project name is required",
                  })}
                  className={`w-full px-4 py-3 border ${
                    errors.projectName ? "border-red-300" : "border-gray-300"
                  } rounded-md outline-none`}
                  placeholder="Enter project name"
                  disabled={isSubmitting}
                />
                {errors.projectName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.projectName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input
                    type="number"
                    {...register("price", {
                      required: "Price is required",
                      min: { value: 1, message: "Price must be greater than 0" },
                    })}
                    className={`w-full pl-8 pr-3 py-3 border ${
                      errors.price ? "border-red-300" : "border-gray-300"
                    } rounded-md outline-none`}
                    placeholder="Enter price"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Property For*
                </label>
                <div className="relative">
                  <select
                    {...register("intent", { required: "Property intent is required" })}
                    className={`w-full px-4 py-3 border ${
                      errors.intent ? "border-red-300" : "border-gray-300"
                    } rounded-md outline-none bg-white appearance-none`}
                    disabled={isSubmitting}
                  >
                    <option value="Sell">Sell</option>
                    <option value="Rent">Rent</option>
                    <option value="PG">PG</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                  {errors.intent && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.intent.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Building Type*
                </label>
                <div className="relative">
                  <select
                    {...register("buildingType", { required: "Building type is required" })}
                    className={`w-full px-4 py-3 border ${
                      errors.buildingType ? "border-red-300" : "border-gray-300"
                    } rounded-md outline-none bg-white appearance-none`}
                    disabled={isSubmitting}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                  {errors.buildingType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.buildingType.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Property Type
                </label>
                <div className="relative">
                  <select
                    {...register("propertyType")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none bg-white appearance-none"
                    disabled={isSubmitting}
                  >
                    <option value="">Select type</option>
                    <option value="Independent House/Villa">Independent House/Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Flat">Flat</option>
                    <option value="Plot">Plot</option>
                    <option value="Land">Land</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Unit Number
                </label>
                <input
                  type="text"
                  {...register("unitNumber")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none"
                  placeholder="e.g., A-101"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Flat/Building Name
                </label>
                <input
                  type="text"
                  {...register("flatName")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none"
                  placeholder="e.g., Sunshine Apartments"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Locality/Area
                </label>
                <input
                  type="text"
                  {...register("locality")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none"
                  placeholder="e.g., Koramangala"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  City*
                </label>
                <input
                  type="text"
                  {...register("city", { 
                    required: "City is required" 
                  })}
                  className={`w-full px-4 py-3 border ${
                    errors.city ? "border-red-300" : "border-gray-300"
                  } rounded-md outline-none`}
                  placeholder="e.g., Bangalore"
                  disabled={isSubmitting}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Please enter a valid 10-digit phone number",
                    },
                  })}
                  className={`w-full px-4 py-3 border ${
                    errors.phoneNumber ? "border-red-300" : "border-gray-300"
                  } rounded-md outline-none`}
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Built-up Area*
                </label>
                <div className="flex">
                  <input
                    type="number"
                    {...register("builtUpArea", {
                      required: "Built-up area is required",
                      min: { value: 1, message: "Area must be greater than 0" },
                    })}
                    className={`flex-1 px-4 py-3 border ${
                      errors.builtUpArea ? "border-red-300" : "border-gray-300"
                    } rounded-l-md outline-none`}
                    placeholder="Enter area"
                    min="0"
                    disabled={isSubmitting}
                  />
                  <span className="bg-gray-100 px-4 py-3 border-t border-b border-r border-gray-300 rounded-r-md text-gray-600 whitespace-nowrap">
                    Sq. Ft.
                  </span>
                </div>
                {errors.builtUpArea && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.builtUpArea.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Super Built-up Area
                </label>
                <div className="flex">
                  <input
                    type="number"
                    {...register("superBuiltUpArea")}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md outline-none"
                    placeholder="Enter area"
                    min="0"
                    disabled={isSubmitting}
                  />
                  <span className="bg-gray-100 px-4 py-3 border-t border-b border-r border-gray-300 rounded-r-md text-gray-600 whitespace-nowrap">
                    Sq. Ft.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Carpet Area
                </label>
                <div className="flex">
                  <input
                    type="number"
                    {...register("carpetArea")}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md outline-none"
                    placeholder="Enter area"
                    min="0"
                    disabled={isSubmitting}
                  />
                  <span className="bg-gray-100 px-4 py-3 border-t border-b border-r border-gray-300 rounded-r-md text-gray-600 whitespace-nowrap">
                    Sq. Ft.
                  </span>
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">
                  BHK*
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left border ${
                      formSubmitted && !bhkValue
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md bg-white outline-none text-gray-700 cursor-pointer flex justify-between items-center`}
                    onClick={() => toggleDropdown("bhkDropdown")}
                    disabled={isSubmitting}
                  >
                    {bhkValue || "Select BHK"}
                    <i className="fas fa-chevron-down text-gray-500"></i>
                  </button>
                  <div
                    id="bhkDropdown"
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg hidden"
                  >
                    {bhkOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          selectOption(
                            option,
                            setBhkValue,
                            "bhkDropdown",
                            "bhk"
                          )
                        }
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
                {formSubmitted && !bhkValue && (
                  <p className="mt-1 text-sm text-red-600">BHK is required</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">
                  Bathrooms*
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left border ${
                      formSubmitted && !bathroomsValue
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md bg-white outline-none text-gray-700 cursor-pointer flex justify-between items-center`}
                    onClick={() => toggleDropdown("bathroomsDropdown")}
                    disabled={isSubmitting}
                  >
                    {bathroomsValue || "Select number of bathrooms"}
                    <i className="fas fa-chevron-down text-gray-500"></i>
                  </button>
                  <div
                    id="bathroomsDropdown"
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg hidden"
                  >
                    {bathroomOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          selectOption(
                            option,
                            setBathroomsValue,
                            "bathroomsDropdown",
                            "bathrooms"
                          )
                        }
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
                {formSubmitted && !bathroomsValue && (
                  <p className="mt-1 text-sm text-red-600">
                    Bathrooms count is required
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">
                  Balconies
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-left border border-gray-300 rounded-md bg-white outline-none text-gray-700 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleDropdown("balconiesDropdown")}
                    disabled={isSubmitting}
                  >
                    {balconiesValue || "Select number of balconies"}
                    <i className="fas fa-chevron-down text-gray-500"></i>
                  </button>
                  <div
                    id="balconiesDropdown"
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg hidden"
                  >
                    {balconyOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          selectOption(
                            option,
                            setBalconiesValue,
                            "balconiesDropdown",
                            "balconies"
                          )
                        }
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Ownership
                </label>
                <div className="relative">
                  <select
                    {...register("ownership")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none bg-white appearance-none"
                    disabled={isSubmitting}
                  >
                    <option value="Owner">Owner</option>
                    <option value="Rented">Rented</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Lease Type
                </label>
                <div className="relative">
                  <select
                    {...register("leaseType")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none bg-white appearance-none"
                    disabled={isSubmitting}
                  >
                    <option value="Non-Leased">Non-Leased</option>
                    <option value="Leased">Leased</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Parking Available
                </label>
                <div className="relative">
                  <select
                    {...register("parking")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none bg-white appearance-none"
                    disabled={isSubmitting}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Possession Status
                </label>
                <div className="relative">
                  <select
                    {...register("possessionStatus")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none bg-white appearance-none"
                    disabled={isSubmitting}
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Furnished Status
                </label>
                <div className="relative">
                  <select
                    {...register("furnishedStatus")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none bg-white appearance-none"
                    disabled={isSubmitting}
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Age of Property
                </label>
                <div className="relative">
                  <select
                    {...register("ageOfProperty")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none bg-white appearance-none"
                    disabled={isSubmitting}
                  >
                    <option value="0–1 year">0–1 year</option>
                    <option value="1–5 years">1–5 years</option>
                    <option value="5–10 years">5–10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
              Description
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Property Description
              </label>
              <textarea
                {...register("description")}
                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none"
                rows={4}
                placeholder="Describe the property..."
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Additional Notes
              </label>
              <textarea
                {...register("additionalNotes")}
                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none"
                rows={3}
                placeholder="Any additional information..."
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>

          {/* Images */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
              Property Images
            </h2>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Current Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {existingImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={mutation.isPending}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Upload New Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                  disabled={mutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  disabled={mutation.isPending}
                >
                  <i className="fas fa-upload mr-2"></i>
                  Select Images
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Upload high-quality images of the property
                </p>
              </div>

              {/* Selected files preview */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-3">New Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={mutation.isPending}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/properties")}
              className="px-6 py-3 mr-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Property"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
