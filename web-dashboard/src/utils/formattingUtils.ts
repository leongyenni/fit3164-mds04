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

export const dateFormatter = (timestamp: number) => {
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const date = new Date(timestamp * 1000);
    const year = date.getUTCFullYear();
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const min = date.getUTCMinutes().toString().padStart(2, '0');

    const date_str = `${month} ${day}, ${year} `;
    const time_str = `${hour}:${min} `;

    return [date_str, time_str];
};
