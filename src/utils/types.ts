export interface login {
  email: string;
  password: string;
  client: string;
}

export interface PropertyFormData {
  price: number;
  projectName: string;
  intent: string;
  buildingType: string;
  propertyType: string;
  unitNumber: string;
  flatName: string;
  locality: string;
  city: string;
  phoneNumber: string;
  builtUpArea: number;
  superBuiltUpArea: number;
  carpetArea: number;
  bhk: string;
  bathrooms: string;
  balconies: string;
  ownership: string;
  leaseType: string;
  parking: string;
  possessionStatus: string;
  furnishedStatus: string;
  ageOfProperty: string;
  description: string;
  additionalNotes: string;
  images: string[];
}

export interface PropertyFilters {
  sort?: string;
  city?: string;
  buildingType?: string;
  intent?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  loginType: string;
}

export interface UserFilters {
  loginType?: string;
}

export interface Property {
  id: string;
  projectName: string;
  price: number;
  city: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  intent: string;
  intentOriginal?: string;
  buildingType: string;
  buildingTypeOriginal?: string;
  cityOriginal?: string;
  images?: string[];
  photos?: string[];
  // Additional fields
  propertyType?: string;
  locality?: string;
  furnishedStatus?: string;
  furnishedStatusOriginal?: string;
  possessionStatus?: string;
  possessionStatusOriginal?: string;
  bhk?: string;
  bathrooms?: string;
  washroom?: string;
  balconies?: string;
  balcony?: string;
  builtUpArea?: string | number;
  carpetArea?: string | number;
  superBuiltUpArea?: string | number;
  flatName?: string;
  unitNumber?: string;
  ageOfProperty?: string;
  ageOfPropertyOriginal?: string;
  ownership?: string;
  ownershipOriginal?: string;
  leaseType?: string;
  leaseTypeOriginal?: string;
  parking?: string;
  parkingOriginal?: string;
  reason?: string;
  deleted?: boolean;
}
