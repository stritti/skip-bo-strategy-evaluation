/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                skipbo: {
                    red: '#E4002B', // Main Brand Red
                    blue: '#004B8D', // Strong Blue (Numbers 1-4)
                    green: '#009F3D', // Vivid Green (Numbers 5-8)
                    yellow: '#FFD200', // Warning/Star Yellow
                    dark: '#0f172a'   // Deep Slate for UI
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
