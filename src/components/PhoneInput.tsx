import React from 'react';
import PhoneInputWithCountry from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PhoneInputProps {
    value: string;
    onChange: (value: string, country?: any) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    label?: string;
    required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
    value,
    onChange,
    placeholder = "Enter phone number",
    disabled = false,
    error,
    label,
    required = false,
}) => {
    return (
        <div className="phone-input-container">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <PhoneInputWithCountry
                country={'us'}
                value={value}
                onChange={(phone, country) => onChange(phone, country)}
                placeholder={placeholder}
                disabled={disabled}
                inputStyle={{
                    width: '100%',
                    height: '48px',
                    fontSize: '14px',
                    border: error ? '1px solid #EF4444' : '1px solid #D1D5DB',
                    borderRadius: '8px',
                    paddingLeft: '48px',
                    outline: 'none',
                    backgroundColor: disabled ? '#F9FAFB' : 'white',
                    color: disabled ? '#9CA3AF' : '#111827',
                }}
                buttonStyle={{
                    border: error ? '1px solid #EF4444' : '1px solid #D1D5DB',
                    borderRight: 'none',
                    borderRadius: '8px 0 0 8px',
                    backgroundColor: disabled ? '#F9FAFB' : 'white',
                }}
                dropdownStyle={{
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                searchStyle={{
                    margin: '8px',
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                }}
                inputProps={{
                    name: 'phone',
                    autoComplete: 'tel',
                    disabled: disabled,
                }}
                containerStyle={{
                    width: '100%',
                }}
                specialLabel=""
                enableSearch
                searchPlaceholder="Search countries..."
                preferredCountries={['us', 'gb', 'ca', 'au', 'in', 'de', 'fr']}
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}

            <style>{`
        .phone-input-container .react-tel-input .flag-dropdown {
          background-color: ${disabled ? '#F9FAFB' : 'white'} !important;
        }
        
        .phone-input-container .react-tel-input .flag-dropdown:hover {
          background-color: ${disabled ? '#F9FAFB' : '#F3F4F6'} !important;
        }
        
        .phone-input-container .react-tel-input .selected-flag:hover,
        .phone-input-container .react-tel-input .selected-flag:focus {
          background-color: ${disabled ? '#F9FAFB' : '#F3F4F6'} !important;
        }
        
        .phone-input-container .react-tel-input input:focus {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        .phone-input-container .react-tel-input .flag-dropdown.open .selected-flag {
          background-color: #F3F4F6 !important;
        }
      `}</style>
        </div>
    );
};

export default PhoneInput; 