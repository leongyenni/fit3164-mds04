export const currencyFormatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
}).format;

export const OHLCFormatter = (price: number) => {
    return price.toFixed(2);
};

export const volumeFormatter = (volume: number) => {
    if (volume >= 1e6) {
        return (volume / 1e6).toFixed(2) + 'M';
    } else if (volume >= 1e3) {
        return (volume / 1e3).toFixed(2) + 'K';
    } else {
        return volume.toFixed(2);
    }
};
