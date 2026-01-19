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

    // Filter local data first for common cities
    return MAJOR_CITIES.filter(loc =>
        loc.city.toLowerCase().includes(q) ||
        (loc.pincode && loc.pincode.startsWith(q))
    ).slice(0, 5);
};

export const detectLocation = async (pincode: string): Promise<LocationSuggestion | null> => {
    const pin = pincode.trim();
    if (pin.length !== 6 || isNaN(Number(pin))) return null;

    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await response.json();

        if (data[0].Status === "Success") {
            const post = data[0].PostOffice[0];
            return {
                city: post.District,
                state: post.State,
                pincode: pin,
                deliveryDays: '3-5' // Standard for major distance
            };
        }
    } catch (error) {
        console.error("Pincode API Error:", error);
    }

    // Fallback to local data if API fails or no match
    return MAJOR_CITIES.find(loc => loc.pincode === pin) || null;
};
