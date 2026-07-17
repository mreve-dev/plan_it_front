import scrollbarHide from 'tailwind-scrollbar-hide'

export default {
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [
        scrollbarHide,
    ],
}