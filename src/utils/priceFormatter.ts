
export type Currency = 'INR' | 'USD';

// Price configurations are handled directly in formatPrice

const EXCHANGE_RATE = 0.012; // 1 INR = 0.012 USD (Mock rate)

export const formatPrice = (amount: number, currency: Currency = 'INR'): string => {
    let finalAmount = amount;

    if (currency === 'USD') {
        finalAmount = amount * EXCHANGE_RATE;
    }

    const formatter = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return formatter.format(finalAmount);
};

export const calculateDiscount = (price: number, mrp: number): number => {
    if (!mrp || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
};
