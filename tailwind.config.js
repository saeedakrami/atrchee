module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    purge: [],
    theme: {
        
        extend: {
            colors: {
                'atrcheeViolet': '#861E3F',
                'atrcheeGray': '#62666D',
                'atrcheeLightGray': '#E0E0E2',
                'atrcheeBlack': '#000000',
                'atrcheeRed': '#FF0000',
                'atrcheeBlue': '#12B4CD',
            },
        },
        screens: {
            sm: '360px',
            // md: '360px',
            md: '768px',
            // lg: '360px',
            lg: '1024px',
            // xl: '360px',
            xl: '1280px',
        }
    },
    variants: {},
    plugins: [
        require('@tailwindcss/custom-forms'),
    ],
}
