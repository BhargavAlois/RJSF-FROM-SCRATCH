import React, { useState, useEffect } from "react";

const PhoneNumberWidget = (props) => {
    const { value = '', onChange } = props;
    console.log("Found value for phone : ", value);

    const countryOptions = [
        { code: "+91", label: "🇮🇳 (+91)" },
        { code: "+1", label: "🇺🇸 (+1)" },
        { code: "+506", label: "🇨🇷 (+506)" },
        { code: "+44", label: "🇬🇧 (+44)" },
        { code: "+31", label: "🇳🇱 (+31)" },
        { code: "+48", label: "🇵🇱 (+48)" },
        { code: "+971", label: "🇦🇪 (+971)" },
        { code: "+61", label: "🇦🇺 (+61)" },
    ];
    const countryCodes = countryOptions.map((option) => option.code);

    const defaultCountryCode = "+91"; // Default country code
    const valueParts = value.split(' ');

    const isCountryCodeValid = valueParts.length > 1 && countryCodes.includes(valueParts[0]);
    const countryCode = isCountryCodeValid ? valueParts[0] : defaultCountryCode;
    const phoneNumber = isCountryCodeValid ? valueParts.slice(1).join(' ') : value;

    const handleCountryChange = (e) => {
        const newCountryCode = e.target.value;
        onChange(`${newCountryCode} ${phoneNumber}`);
        // onChange(e, 'countryCode');
    };

    const handlePhoneNumberChange = (e) => {
        const newPhoneNumber = e.target.value;
        onChange(`${countryCode} ${newPhoneNumber}`);
        // onChange(e, 'phoneNumber');
    };

    return (
        <div className="mb-3">
            <div className="input-group">
                {/* Country Code Dropdown */}
                <select
                    className="form-select"
                    style={{ maxWidth: "4.4rem" }}
                    name="countryCode"
                    value={countryCode}
                    onChange={handleCountryChange}
                >
                    {countryOptions.map((option) => (
                        <option key={option.code} value={option.code}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {/* Phone Number Input */}
                <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    pattern="^[0-9]{6,14}$"
                    title="Enter a valid phone number"
                />
            </div>
        </div>
    );
};

export default PhoneNumberWidget;
