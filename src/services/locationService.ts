export interface LocationSuggestion {
    city: string;
    state: string;
    pincode?: string;
    deliveryDays: string;
}

const MAJOR_CITIES: LocationSuggestion[] = [
    { city: 'Hyderabad', state: 'Telangana', pincode: '500001', deliveryDays: '2-3' },
    { city: 'Hyderabad', state: 'Telangana', pincode: '500081', deliveryDays: '2-3' },
    { city: 'Mumbai', state: 'Maharashtra', pincode: '400001', deliveryDays: '3-5' },
    { city: 'Delhi', state: 'Delhi', pincode: '110001', deliveryDays: '3-4' },
    { city: 'Bangalore', state: 'Karnataka', pincode: '560001', deliveryDays: '3-4' },
    { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', deliveryDays: '4-6' },
    { city: 'Kolkata', state: 'West Bengal', pincode: '700001', deliveryDays: '5-7' },
    { city: 'Pune', state: 'Maharashtra', pincode: '411001', deliveryDays: '4-5' },
    { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', deliveryDays: '4-6' },
    { city: 'Surat', state: 'Gujarat', pincode: '395001', deliveryDays: '4-6' },
    { city: 'Jaipur', state: 'Rajasthan', pincode: '302001', deliveryDays: '5-7' },
    { city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', deliveryDays: '5-8' }
];

export const getSuggestions = (query: string): LocationSuggestion[] => {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];

    // Filter by city name or pincode
    return MAJOR_CITIES.filter(loc =>
        loc.city.toLowerCase().includes(q) ||
        (loc.pincode && loc.pincode.startsWith(q))
    ).slice(0, 5); // Limit to top 5
};

export const detectLocation = (query: string): LocationSuggestion | null => {
    const q = query.toLowerCase().trim();

    // Exact pincode match or exact city match
    return MAJOR_CITIES.find(loc =>
        (loc.pincode === q) ||
        (loc.city.toLowerCase() === q)
    ) || null;
};
