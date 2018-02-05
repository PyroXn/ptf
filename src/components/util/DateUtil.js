function pad(number) {
    if ( number < 10 ) {
        return '0' + number;
    }
    return number;
}

function inputDate(date = new Date()) {
    return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes());
}

export { inputDate };