import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserPropertiesApi, getUserRecentActivityApi } from '../utils/api';
import type { User, UserProperty, UserRecentActivity } from '../utils/types';

interface UserModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'properties' | 'activity'>('properties');

    // Fetch user properties
    const { data: userProperties = [], isLoading: propertiesLoading } = useQuery<UserProperty[]>({
        queryKey: ['userProperties', user?.username],
        queryFn: async () => {
            if (!user?.username) return [];
            const response = await getUserPropertiesApi(user.username);
            return response.data;
        },
        enabled: !!user?.username && isOpen
    });

    // Fetch user recent activity
    const { data: userActivity = [], isLoading: activityLoading } = useQuery<UserRecentActivity[]>({
        queryKey: ['userActivity', user?.username],
        queryFn: async () => {
            if (!user?.username) return [];
            const response = await getUserRecentActivityApi(user.username);
            return response.data;
        },
        enabled: !!user?.username && isOpen && activeTab === 'activity'
    });

    if (!isOpen || !user) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date: any) => {
        if (!date) return 'N/A';
        try {
            const dateObj = date._seconds ? new Date(date._seconds * 1000) : new Date(date);
            return dateObj.toLocaleDateString('en-IN');
        } catch {
            return 'N/A';
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ')[0][0].toUpperCase();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                            {getInitials(user.username)}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('properties')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'properties'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <i className="fas fa-building mr-2"></i>
                        Properties ({userProperties.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'activity'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <i className="fas fa-history mr-2"></i>
                        Recent Activity ({userActivity.length})
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {activeTab === 'properties' && (
                        <div>
                            {propertiesLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                                    <span className="ml-2 text-gray-500">Loading properties...</span>
                                </div>
                            ) : userProperties.length === 0 ? (
                                <div className="text-center py-12">
                                    <i className="fas fa-building text-4xl text-gray-300 mb-4"></i>
                                    <p className="text-lg text-gray-500">No properties found</p>
                                    <p className="text-sm text-gray-400 mt-1">This user hasn't visited any properties yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {userProperties.map((property) => (
                                        <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                            {/* Property Image */}
                                            <div className="h-48 bg-gray-100 relative">
                                                {(() => {
                                                    // Get all available images from different sources
                                                    const availableImages: string[] = [];

                                                    // Add from images array
                                                    if (property.images && Array.isArray(property.images)) {
                                                        availableImages.push(...property.images.filter((img: string) => img && img.trim()));
                                                    }

                                                    // Add from photos array (if not already in images)
                                                    if (property.photos && Array.isArray(property.photos)) {
                                                        const photos = property.photos.filter((photo: string | { url: string }) => {
                                                            const photoUrl = typeof photo === 'string' ? photo : photo?.url;
                                                            return photoUrl && photoUrl.trim() && !availableImages.includes(photoUrl);
                                                        }).map((photo: string | { url: string }) => typeof photo === 'string' ? photo : photo.url);
                                                        availableImages.push(...photos);
                                                    }

                                                    // Add from allPhotos if available
                                                    if (property.allPhotos && Array.isArray(property.allPhotos)) {
                                                        const allPhotos = property.allPhotos.filter((photo: string) =>
                                                            photo && photo.trim() && !availableImages.includes(photo)
                                                        );
                                                        availableImages.push(...allPhotos);
                                                    }

                                                    // Add single image field if available
                                                    if (property.image && typeof property.image === 'string' &&
                                                        property.image.trim() && !availableImages.includes(property.image)) {
                                                        availableImages.push(property.image);
                                                    }

                                                    const firstImage = availableImages[0];

                                                    return firstImage ? (
                                                        <>
                                                            <img
                                                                src={firstImage}
                                                                alt={property.projectName || property.flatName || 'Property'}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    console.log('Primary image failed to load:', firstImage);

                                                                    // Try next image if available
                                                                    if (availableImages.length > 1) {
                                                                        const nextImage = availableImages[1];
                                                                        console.log('Trying next image:', nextImage);
                                                                        e.currentTarget.src = nextImage;
                                                                    } else {
                                                                        // Show placeholder if no more images
                                                                        e.currentTarget.style.display = 'none';
                                                                        const placeholder = e.currentTarget.parentElement?.querySelector('.image-placeholder') as HTMLElement;
                                                                        if (placeholder) {
                                                                            placeholder.style.display = 'flex';
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <div className="image-placeholder w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                                                                <div className="text-center">
                                                                    <i className="fas fa-building text-4xl text-gray-300 mb-2"></i>
                                                                    <p className="text-xs text-gray-400">Image not available</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <div className="text-center">
                                                                <i className="fas fa-building text-4xl text-gray-300 mb-2"></i>
                                                                <p className="text-xs text-gray-400">No images available</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}


                                            </div>

                                            {/* Property Details */}
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    {property.projectName || property.flatName || property.pgName || property.name || property.title || `Property in ${property.city || 'Unknown Location'}`}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    {property.locality}, {property.city}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold text-green-600">
                                                        {formatPrice(property.price)}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        Listed: {formatDate(property.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div>
                            {activityLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                                    <span className="ml-2 text-gray-500">Loading activity...</span>
                                </div>
                            ) : userActivity.length === 0 ? (
                                <div className="text-center py-12">
                                    <i className="fas fa-history text-4xl text-gray-300 mb-4"></i>
                                    <p className="text-lg text-gray-500">No recent activity</p>
                                    <p className="text-sm text-gray-400 mt-1">This user hasn't had any recent interactions</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {userActivity.map((activity, index) => (
                                        <div key={activity.uid} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <i className="fas fa-phone text-blue-600"></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {activity.type === 'contacted' ? 'Contacted Property' : activity.type}
                                                    </p>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(activity.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {activity.propertyName}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {activity.propertyAddress}
                                                </p>
                                                <div className="flex items-center mt-2 text-xs text-gray-400">
                                                    <span>Course ID: {activity.courseId}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>UID: {activity.uid}</span>
                                                    {activity.date && activity.time && (
                                                        <>
                                                            <span className="mx-2">•</span>
                                                            <span>Visit: {activity.date} at {activity.time}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserModal; 