
// Removed unused React import

const categories = [
    'Wall Art',
    'Textured Art',
    'Lippan Art',
    'Canvas Art',
    'Abstract Art'
];

export const SideNav = () => {
    return (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-8">
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-charcoal/20 rotate-180 [writing-mode:vertical-lr] mb-4">
                Categories
            </div>
            <div className="flex flex-col gap-6">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className="group flex items-center gap-4 text-left"
                    >
                        <span className="w-8 h-[1px] bg-charcoal/10 group-hover:w-12 group-hover:bg-gold transition-all" />
                        <span className="text-xs font-bold uppercase tracking-widest text-charcoal/40 group-hover:text-charcoal transition-colors">
                            {cat}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
