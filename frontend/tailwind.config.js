/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0073ea', // Wrike primary blue
                    hover: '#0060c0',   // Darker blue for hover states
                    light: '#e5f0ff',   // Light blue for backgrounds
                },
                secondary: {
                    DEFAULT: '#f7f8fa', // Light background color
                    hover: '#f5f6f8',
                    dark: '#eaecf0',    // Darker gray for active states
                },
                text: {
                    dark: '#323338',    // Primary text color
                    medium: '#676879',  // Secondary text color
                    light: '#858896',   // Tertiary text color
                },
                border: {
                    DEFAULT: '#c3c6d4', // Primary border color
                    light: '#e6e9ef',   // Light border color
                },
                error: '#d83a52',       // Error red
                success: '#0ab87b',     // Success green
                // Status colors
                status: {
                    pending: '#F57C00',
                    'in-progress': '#1976D2',
                    completed: '#388E3C'
                },
                // Extra colors needed for tailwind.css
                green: {
                    DEFAULT: '#0ab87b',
                    light: '#E8F5E9'
                },
                yellow: {
                    100: '#FFF8E1'
                },
                blue: {
                    100: '#E3F2FD'
                }
            },
            fontFamily: {
                sans: ['Poppins', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                card: '0 6px 20px rgba(0, 0, 0, 0.08)',
                dropdown: '0 4px 15px rgba(0, 0, 0, 0.15)',
                sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
                hover: '0 8px 24px rgba(0, 0, 0, 0.12)',
            },
            borderRadius: {
                DEFAULT: '4px',
                lg: '8px',
                xl: '12px',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
} 