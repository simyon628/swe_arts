
export interface Category {
    id: number;
    name: string;
    color: string;
    images: string[];
}

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    mrp: number;
    rating: number;
    description: string;
    images: string[]; // Support for gallery
}

export const categories: Category[] = [
    {
        id: 1,
        name: 'Wall Art',
        color: '#D4AF37', // Gold
        images: [
            'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600',
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600',
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600'
        ]
    },
    {
        id: 2,
        name: 'Textured Art',
        color: '#6B4226', // Deep Bronze
        images: [
            'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600',
            'https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=600',
            'https://images.unsplash.com/photo-1515402246390-e136f6e55cb7?q=80&w=600'
        ]
    },
    {
        id: 3,
        name: 'Lippan Art',
        color: '#B91C1C', // Clay Red
        images: [
            'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?q=80&w=600',
            'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=600',
            'https://images.unsplash.com/photo-1550684848-86a5d8727436?q=80&w=600'
        ]
    },
    {
        id: 4,
        name: 'Handmade Decor',
        color: '#15803D', // Hunter Green
        images: [
            'https://images.unsplash.com/photo-1513364238444-23007137589c?q=80&w=600',
            'https://images.unsplash.com/photo-1506806732259-39c2d4a78ca7?q=80&w=600',
            'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=600'
        ]
    }
];

export const products: Product[] = [
    {
        id: 1,
        name: 'Golden Rhythms',
        category: 'Wall Art',
        price: 4999,
        mrp: 6499,
        rating: 4.8,
        description: 'A mesmerizing abstract expression of motion and light, Golden Rhythms brings a sophisticated warmth to any contemporary space. Hand-painted with premium acrylics and gold leaf accents.',
        images: [
            'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1200',
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600',
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600'
        ]
    },
    {
        id: 2,
        name: 'Textured Silence',
        category: 'Textured Art',
        price: 6499,
        mrp: 7999,
        rating: 4.9,
        description: 'Experience the tactile beauty of minimalism. Textured Silence uses heavy impasto techniques to create shadows and depth that change with the room lighting.',
        images: [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200',
            'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600',
            'https://images.unsplash.com/photo-1550684848-86a5d8727436?q=80&w=600'
        ]
    },
    {
        id: 3,
        name: 'Lippan Soul',
        category: 'Lippan Art',
        price: 3599,
        mrp: 4500,
        rating: 4.7,
        description: 'Traditional Kutch mud-mirror work reimagined for the modern home. Each mirror is hand-placed to catch and reflect light in ancient patterns of protection and beauty.',
        images: [
            'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1200',
            'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?q=80&w=600',
            'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600'
        ]
    },
    {
        id: 4,
        name: 'Minimalist Earth',
        category: 'Wall Art',
        price: 5299,
        mrp: 6999,
        rating: 4.6,
        description: 'Earth tones and organic shapes collide in this minimalist masterpiece. Perfect for creating a grounding atmosphere in your living area or office.',
        images: [
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200',
            'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600',
            'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=600'
        ]
    },
    {
        id: 5,
        name: 'Earthen Glow',
        category: 'Handmade Decor',
        price: 4200,
        mrp: 5500,
        rating: 4.8,
        description: 'A handcrafted decorative piece that captures the natural glow of sunset on clay. Each piece is unique, reflecting the hand of the artist.',
        images: [
            'https://images.unsplash.com/photo-1513364238444-23007137589c?q=80&w=1200',
            'https://images.unsplash.com/photo-1506806732259-39c2d4a78ca7?q=80&w=600',
            'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=600'
        ]
    },
    {
        id: 6,
        name: 'Azure Reflection',
        category: 'Wall Art',
        price: 3800,
        mrp: 4999,
        rating: 4.7,
        description: 'Cool tones and fluid motion define this stunning wall piece. Inspired by the calm reflections of water at dawn.',
        images: [
            'https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=1200',
            'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600'
        ]
    },
    {
        id: 7,
        name: 'Clay Echoes',
        category: 'Lippan Art',
        price: 2999,
        mrp: 3800,
        rating: 4.6,
        description: 'Intricate patterns and mirrored accents bring the desert soul to your walls. A timeless piece of traditional craftsmanship.',
        images: [
            'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200',
            'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=600'
        ]
    },
    {
        id: 8,
        name: 'Desert Bloom',
        category: 'Textured Art',
        price: 5500,
        mrp: 7000,
        rating: 4.9,
        description: 'Floral motifs rendered in heavy texture, creating a 3D effect that blooms from the canvas.',
        images: [
            'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1200',
            'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600'
        ]
    }
];
