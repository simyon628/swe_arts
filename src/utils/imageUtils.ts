export const FALLBACK_IMAGES: Record<string, string> = {
    'Wall Art': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop', // Abstract Wall Art
    'Textured Art': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop', // Texture/Oil
    'Lippan Art': 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800&auto=format&fit=crop', // Traditional/Mirror
    'Handmade Decor': 'https://images.unsplash.com/photo-1513364238444-23007137589c?q=80&w=800&auto=format&fit=crop', // Ceramics/Decor
    'default': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop'
};

export const getFallbackImage = (category?: string): string => {
    if (!category) return FALLBACK_IMAGES['default'];
    return FALLBACK_IMAGES[category] || FALLBACK_IMAGES['default'];
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, category?: string) => {
    const target = e.target as HTMLImageElement;
    target.src = getFallbackImage(category);
};
