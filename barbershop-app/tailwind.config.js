/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#fbb62c',
                'primary-hover': '#e0a828',
                'bg-main': '#111111',
                'bg-card': '#1e1e1e',
                'bg-card-alt': '#2a2a2a',
                'bg-input': '#333333',
                'border-main': '#444444',
                'border-alt': '#555555',
            },
            fontFamily: {
                'montserrat': ['Montserrat', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-in-out',
                'fade-in-delay': 'fadeIn 1s ease-in-out 0.3s both',
                'slide-up': 'slideUpFadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
                'spin': 'spin 1s linear infinite',
                'zoom-in': 'zoomIn 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
                'tada': 'tada 1.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s both',
            },
            keyframes: {
                fadeIn: {
                    'from': { opacity: '0', transform: 'translateY(10px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUpFadeIn: {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { transform: 'translateY(0)' },
                },
                zoomIn: {
                    'from': { opacity: '0', transform: 'scale(0.95)' },
                    'to': { opacity: '1', transform: 'scale(1)' },
                },
                tada: {
                    '0%': { transform: 'scale(1)' },
                    '10%, 20%': { transform: 'scale(0.9) rotate(-5deg)' },
                    '30%, 50%, 70%, 90%': { transform: 'scale(1.1) rotate(5deg)' },
                    '40%, 60%, 80%': { transform: 'scale(1.1) rotate(-5deg)' },
                    '100%': { transform: 'scale(1) rotate(0)' },
                },
            },
        },
    },
    plugins: [],
}
