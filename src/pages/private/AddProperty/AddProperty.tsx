import React, { useState, useRef } from "react";

const AddProperty: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bhkValue, setBhkValue] = useState<string>("");
  const [bathroomsValue, setBathroomsValue] = useState<string>("");
  const [balconiesValue, setBalconiesValue] = useState<string>("");
  const [ownershipValue, setOwnershipValue] = useState<string>("");
  const [leaseTypeValue, setLeaseTypeValue] = useState<string>("");
  const [parkingAvailability, setParkingAvailability] = useState<string>("");
  const [possessionStatus, setPossessionStatus] = useState<string>("");
  const [furnishedStatus, setFurnishedStatus] = useState<string>("");
  const [propertyAge, setPropertyAge] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");

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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];
  const bathroomOptions = ["1", "2", "3", "4", "5+"];
  const balconyOptions = ["0", "1", "2", "3", "4+"];
  const ownershipOptions = [
    "Freehold",
    "Leasehold",
    "Co-operative society",
    "Power of Attorney",
  ];
  const leaseTypeOptions = ["Company Lease", "Bachelor Lease", "Family Lease"];

  const toggleDropdown = (id: string) => {
    const dropdown = document.getElementById(id);
    if (dropdown) {
      dropdown.classList.toggle("hidden");
    }
  };

  const selectOption = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    dropdownId: string
  ) => {
    setter(value);
    toggleDropdown(dropdownId);
  };

  const parkingOptions = [
    "Available",
    "Not Available",
    "Covered Parking",
    "Open Parking",
  ];
  const possessionOptions = [
    "Ready to Move",
    "Under Construction",
    "Forthcoming",
  ];
  const furnishedOptions = ["Fully Furnished", "Semi-Furnished", "Unfurnished"];
  const propertyAgeOptions = [
    "Less than 1 year",
    "1-5 years",
    "5-10 years",
    "10+ years",
    "Under Construction",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      parkingAvailability,
      possessionStatus,
      furnishedStatus,
      propertyAge,
      description,
      additionalNotes,
    });
    console.log(selectedFiles);
  };

  return (
    <div className="bg-gray-50 w-full">
      <form
        onSubmit={handleSubmit}
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
            className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
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
            />
          </div>
        </div>

        {/* Property Details Section */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-6">
            Property Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter price"
                  className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Intent
              </label>
              <div className="relative">
                <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 appearance-none cursor-pointer">
                  <option>Buy</option>
                  <option>Sell</option>
                  <option>Rent</option>
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
                <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 appearance-none cursor-pointer">
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <div className="relative">
                <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 appearance-none cursor-pointer">
                  <option>Select type</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>House</option>
                  <option>Office</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flat Name
              </label>
              <input
                type="text"
                placeholder="Enter flat name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Locality
            </label>
            <input
              type="text"
              placeholder="Enter locality"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">City</label>
            <input
              type="text"
              placeholder="Enter city"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter phone number"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Area Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Built-up Area
              </label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter area"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="bg-gray-100 px-4 py-3 border-t border-b border-r border-gray-300 rounded-r-md text-gray-600 whitespace-nowrap">
                  Sq. Ft.
                </span>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Super Built-up Area
              </label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter area"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  type="text"
                  placeholder="Enter area"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                BHK
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleDropdown("bhkDropdown")}
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
                        selectOption(option, setBhkValue, "bhkDropdown")
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
                Bathrooms
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleDropdown("bathroomsDropdown")}
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
                          "bathroomsDropdown"
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
                Balconies
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleDropdown("balconiesDropdown")}
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
                          "balconiesDropdown"
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
                  className="w-full px-4 py-3 text-left border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleDropdown("ownershipDropdown")}
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
                          "ownershipDropdown"
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
                  className="w-full px-4 py-3 text-left border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleDropdown("leaseTypeDropdown")}
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
                          "leaseTypeDropdown"
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
                  value={parkingAvailability}
                  onChange={(e) => setParkingAvailability(e.target.value)}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Select parking availability</option>
                  {parkingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
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
                  value={possessionStatus}
                  onChange={(e) => setPossessionStatus(e.target.value)}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Select possession status</option>
                  {possessionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
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
                  value={furnishedStatus}
                  onChange={(e) => setFurnishedStatus(e.target.value)}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Select furnished status</option>
                  {furnishedOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
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
                  value={propertyAge}
                  onChange={(e) => setPropertyAge(e.target.value)}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Select property age</option>
                  {propertyAgeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the property..."
                  rows={5}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-medium text-sm">
                  Additional Notes
                </label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any additional notes..."
                  rows={5}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Property
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
