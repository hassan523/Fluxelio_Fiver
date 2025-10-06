module.exports = {
    purge: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./src/views/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/layout/**/*.{js,ts,jsx,tsx,mdx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            'xs': '480px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
