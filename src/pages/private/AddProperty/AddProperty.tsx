import React, { useState, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPropertyApi } from "../../../utils/api";
import { toast } from "react-hot-toast";
import type { PropertyFormData } from "../../../utils/types";
import { handleApiError } from "../../../utils/errorHandler";
import { uploadImage } from "../../../utils/uploadImage";

const AddProperty: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bhkValue, setBhkValue] = useState<string>("");
  const [bathroomsValue, setBathroomsValue] = useState<string>("");
  const [balconiesValue, setBalconiesValue] = useState<string>("");
  const [ownershipValue, setOwnershipValue] = useState<string>("Owner");
  const [leaseTypeValue, setLeaseTypeValue] = useState<string>("Non-Leased");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors, isSubmitting },
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
      images: [],
    },
  });

  // Watch form values
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const parkingAvailability = watch("parking");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const possessionStatus = watch("possessionStatus");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const furnishedStatus = watch("furnishedStatus");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const propertyAge = watch("ageOfProperty");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const description = watch("description");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const additionalNotes = watch("additionalNotes");

  // API mutation
  const mutation = useMutation({
    mutationFn: (data: PropertyFormData) => addPropertyApi(data),
    onSuccess: () => {
      // Reset form values
      reset({
        intent: "Sell",
        buildingType: "Residential",
        ownership: "Owner",
        leaseType: "Non-Leased",
        parking: "Yes",
        possessionStatus: "Ready to Move",
        furnishedStatus: "Furnished",
        ageOfProperty: "0–1 year",
        images: [],
      });
      
      // Reset dropdown values
      setBhkValue("");
      setBathroomsValue("");
      setBalconiesValue("");
      setOwnershipValue("");
      setLeaseTypeValue("");
      
      // Clear selected files
      setSelectedFiles([]);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Reset form submitted state
      setFormSubmitted(false);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error) => {
      toast.error("Failed to add property. Please try again.");
      console.error("Error adding property:", error);
    },
  });

  // Upload all selected files to Firebase and return URLs
  const uploadAllImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    
    try {
      setIsUploadingImages(true);
      const uploadPromises = files.map(async (file) => {
        const result = await uploadImage(file);
        return result.url;
      });
      
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading images to Firebase:", error);
      throw new Error("Failed to upload images");
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((prevFiles) => 
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];
  const bathroomOptions = ["1", "2", "3", "4", "5+"];
  const balconyOptions = ["0", "1", "2", "3", "4+"];
  const ownershipOptions = [
    "Owner",
    "Broker",
    "Freehold",
    "Leasehold",
    "Co-operative Society",
    "Power of Attorney",
  ];
  const leaseTypeOptions = ["Non-Leased", "Leased"];

  const toggleDropdown = (id: string) => {
    const dropdown = document.getElementById(id);
    if (dropdown) {
      dropdown.classList.toggle("hidden");
    }
  };

  const selectOption = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    dropdownId: string,
    formField?: keyof PropertyFormData
  ) => {
    setter(value);
    if (formField) {
      setValue(formField, value);
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
      // First upload all images
      const uploadingToast = toast.loading("Uploading images...");
      let imageUrls: string[] = [];
      
      if (selectedFiles.length > 0) {
        try {
          imageUrls = await uploadAllImages(selectedFiles);
        } catch {
          toast.dismiss(uploadingToast);
          toast.error("Failed to upload images. Please try again.");
          return; // Stop form submission if image upload fails
        }
      }
      
      toast.dismiss(uploadingToast);
      
      // Set dropdown values that might not be in the form
      data.bhk = bhkValue;
      data.bathrooms = bathroomsValue;
      data.balconies = balconiesValue;
      data.ownership = ownershipValue || "Owner";
      data.leaseType = leaseTypeValue || "Non-Leased";

      // Convert string numbers to actual numbers
      data.price = Number(data.price);
      data.builtUpArea = Number(data.builtUpArea);
      data.superBuiltUpArea = Number(data.superBuiltUpArea);
      data.carpetArea = Number(data.carpetArea);
      
      // Set the image URLs from our upload
      data.images = imageUrls;

      // Submit to API
      const creatingToast = toast.loading("Creating property...");
      await mutation.mutateAsync(data);
      // Invalidate properties query to refresh the properties list
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.dismiss(creatingToast);
      toast.success("Property added successfully!");
    } catch (error) {
      toast.dismiss();
      console.log("Error submitting form:", error);
      handleApiError(error, "Failed to add property. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 w-full">
      <form
        onSubmit={hookFormSubmit(onSubmit)}
        className="rounded-lg shadow-sm p-4 md:p-8"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Add New Property
        </h1>

        {/* Property Media Section */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Property Media
          </h2>
          <div
            className={`border-2 border-dashed ${
              errors.images ? "border-red-300" : "border-gray-300"
            } rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <div className="text-gray-400 mb-3">
              <i className="fas fa-cloud-upload-alt text-4xl"></i>
            </div>
            <p className="text-gray-500 text-center mb-1">
              Drag & drop images here, or click to select files
            </p>
            <p className="text-xs text-gray-400">
              Up to 30 images (PNG, JPG) - Max 5MB each
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept=".jpg,.jpeg,.png"
              disabled={isSubmitting}
            />
          </div>
          {selectedFiles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 focus:outline-none"
                    aria-label="Remove image"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.images && (
            <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
          )}
        </div>

        {/* Property Details Section */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-6">
            Property Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="number"
                  placeholder="Enter price"
                  className={`w-full pl-8 pr-3 py-3 border ${
                    errors.price ? "border-red-300" : "border-gray-300"
                  } rounded-md outline-none text-gray-700`}
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 1, message: "Price must be greater than 0" },
                  })}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name*
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                className={`w-full px-4 py-3 border ${
                  errors.projectName ? "border-red-300" : "border-gray-300"
                } rounded-md outline-none text-gray-700`}
                {...register("projectName", {
                  required: "Project name is required",
                })}
                disabled={isSubmitting}
              />
              {errors.projectName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.projectName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Intent
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none text-gray-700 appearance-none cursor-pointer"
                  {...register("intent")}
                  disabled={isSubmitting}
                >
                  <option value="Sell">Sell</option>
                  <option value="Rent">Rent</option>
                  <option value="PG">PG</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Building Type
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none text-gray-700 appearance-none cursor-pointer"
                  {...register("buildingType")}
                  disabled={isSubmitting}
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type*
              </label>
              <div className="relative">
                <select
                  className={`w-full px-4 py-3 border ${
                    errors.propertyType ? "border-red-300" : "border-gray-300"
                  } rounded-md outline-none text-gray-700 appearance-none cursor-pointer`}
                  {...register("propertyType", {
                    required: "Property type is required",
                  })}
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
              {errors.propertyType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.propertyType.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Property Address Section */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-6">
            Property Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Number
              </label>
              <input
                type="text"
                placeholder="Enter unit number"
                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none text-gray-700"
                {...register("unitNumber")}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flat Name
              </label>
              <input
                type="text"
                placeholder="Enter flat name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none text-gray-700"
                {...register("flatName")}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Locality*
            </label>
            <input
              type="text"
              placeholder="Enter locality"
              className={`w-full px-4 py-3 border ${
                errors.locality ? "border-red-300" : "border-gray-300"
              } rounded-md outline-none`}
              {...register("locality", {
                required: "Locality is required",
              })}
              disabled={isSubmitting}
            />
            {errors.locality && (
              <p className="mt-1 text-sm text-red-600">
                {errors.locality.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              City*
            </label>
            <input
              type="text"
              placeholder="Enter city"
              className={`w-full px-4 py-3 border ${
                errors.city ? "border-red-300" : "border-gray-300"
              } rounded-md outline-none`}
              {...register("city", {
                required: "City is required",
              })}
              disabled={isSubmitting}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-2">
            Phone Number*
          </label>
          <input
            type="tel"
            placeholder="Enter phone number"
            className={`w-full px-4 py-3 border ${
              errors.phoneNumber ? "border-red-300" : "border-gray-300"
            } rounded-md outline-none`}
            {...register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number",
              },
            })}
            disabled={isSubmitting}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Area Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Built-up Area*
              </label>
              <div className="flex">
                <input
                  type="number"
                  placeholder="Enter area"
                  min="0"
                  className={`flex-1 px-4 py-3 border ${
                    errors.builtUpArea ? "border-red-300" : "border-gray-300"
                  } rounded-l-md outline-none`}
                  {...register("builtUpArea", {
                    required: "Built-up area is required",
                    min: { value: 1, message: "Area must be greater than 0" },
                  })}
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
                  min="0"
                  placeholder="Enter area"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md outline-none"
                  {...register("superBuiltUpArea")}
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
                  min="0"
                  placeholder="Enter area"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md outline-none"
                  {...register("carpetArea")}
                  disabled={isSubmitting}
                />
                <span className="bg-gray-100 px-4 py-3 border-t border-b border-r border-gray-300 rounded-r-md text-gray-600 whitespace-nowrap">
                  Sq. Ft.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Property Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2">
                BHK*
              </label>
              <div className="relative">
                <button
                  type="button"
                  className={`w-full px-4 py-3 text-left border ${
                    formSubmitted && !bhkValue ? "border-red-300" : "border-gray-300"
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
                        selectOption(option, setBhkValue, "bhkDropdown", "bhk")
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
                    formSubmitted && !bathroomsValue ? "border-red-300" : "border-gray-300"
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
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Property Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2">
                Ownership
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left border border-gray-300 rounded-md bg-white outline-none text-gray-700 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleDropdown("ownershipDropdown")}
                  disabled={isSubmitting}
                >
                  {ownershipValue || "Select ownership type"}
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </button>
                <div
                  id="ownershipDropdown"
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg hidden"
                >
                  {ownershipOptions.map((option) => (
                    <div
                      key={option}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        selectOption(
                          option,
                          setOwnershipValue,
                          "ownershipDropdown",
                          "ownership"
                        )
                      }
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2">
                Lease Type
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left border border-gray-300 rounded-md bg-white outline-none text-gray-700 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleDropdown("leaseTypeDropdown")}
                  disabled={isSubmitting}
                >
                  {leaseTypeValue || "Select lease type"}
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </button>
                <div
                  id="leaseTypeDropdown"
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg hidden"
                >
                  {leaseTypeOptions.map((option) => (
                    <div
                      key={option}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        selectOption(
                          option,
                          setLeaseTypeValue,
                          "leaseTypeDropdown",
                          "leaseType"
                        )
                      }
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium text-sm">
                Parking
              </label>
              <div className="relative">
                <select
                  {...register("parking")}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 appearance-none outline-none cursor-pointer"
                  disabled={isSubmitting}
                >
                  <option value="Yes">Available</option>
                  <option value="No">Not Available</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium text-sm">
                Possession Status
              </label>
              <div className="relative">
                <select
                  {...register("possessionStatus")}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 appearance-none outline-none cursor-pointer"
                  disabled={isSubmitting}
                >
                  <option value="Ready to Move">Ready to Move</option>
                  <option value="Under Construction">Under Construction</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium text-sm">
                Furnished Status
              </label>
              <div className="relative">
                <select
                  {...register("furnishedStatus")}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 appearance-none outline-none cursor-pointer"
                  disabled={isSubmitting}
                >
                  <option value="Furnished">Fully Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Non-Furnished">Non-Furnished</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium text-sm">
                Age of Property
              </label>
              <div className="relative">
                <select
                  {...register("ageOfProperty")}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 appearance-none outline-none cursor-pointer"
                  disabled={isSubmitting}
                >
                  <option value="0–1 year">Less than 1 year</option>
                  <option value="1–5 years">1-5 years</option>
                  <option value="5–10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Additional Details
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium text-sm">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Describe the property..."
                  rows={5}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 outline-none resize-none"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-medium text-sm">
                  Additional Notes
                </label>
                <textarea
                  {...register("additionalNotes")}
                  placeholder="Any additional notes..."
                  rows={5}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 outline-none resize-none"
                  disabled={isSubmitting}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || isUploadingImages || !bhkValue || !bathroomsValue}
            >
              {isSubmitting || isUploadingImages ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  {isUploadingImages ? "Uploading Images..." : "Adding Property..."}
                </>
              ) : (
                <>
                  <i className="fas fa-plus mr-2"></i>
                  Add Property
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
