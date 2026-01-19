/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                charcoal: '#1F2933',
                ivory: '#F8F6F2',
                teal: '#0F766E',
                gold: '#C9A24D',
            }
        },
    },
    plugins: [],
}
