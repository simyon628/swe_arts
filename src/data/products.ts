export interface Product {
    id: string;
    title: string;
    price: string;
    category: string;
    image: string;
    description: string;
}

export const products: Product[] = [
    {
        id: '1',
        title: 'Every Mirror Have Memories',
        price: '₹2,500',
        category: 'Lippan Art',
        image: '/images/every-mirror-holds-a-memory.jpg',
        description: 'Handcrafted traditional mud and mirror work.',
    },
    {
        id: '2',
        title: 'Royal Mandala Wall Decor',
        price: '₹3,200',
        category: 'Wall Art',
        image: '/images/red ganesh.jpg',
        description: 'Intricate red and gold mandala design on a circular wooden base.',
    },
    {
        id: '3',
        title: 'Abstract Textured Canvas',
        price: '₹4,500',
        category: 'Textured Art',
        image: '/images/black gold ganesh.jpg',
        description: 'Modern luxurious textured art with gold leaf detailing.',
    }
];
