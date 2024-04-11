/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        screens: {
            sm: "320px", // Small devices, now set to 320px
            md: "768px", // Tablets
            lg: "1024px", // Smaller laptops
            xl: "1280px", // Desktops
            "2xl": "1536px", // Large screens
        },
        extend: {
            fontFamily: {
                // Define your custom font names and their font-family values
                Bungee: ['"Bungee"'],
                Sofia: ['"Sofia"'],
                Comfortaa: ['"Comfortaa"'],
                Shadows: ['"Shadows Into"'], // Example custom font
                // Add more custom fonts as needed
            },
            textShadow: {
                // Define your custom text shadows here
                default: "0 2px 4px rgba(0, 0, 0, 0.5)",
            },
        },
    },
    plugins: [],
};
